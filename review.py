#!/usr/bin/env python3
"""
Recursively review frontend code under a directory tree.

Usage:
  python3 review.py [PATH] [--out OUT.json] [--quiet]

PATH can be a single file or a directory. When a directory is given, the
script walks it (excluding common build/VCS dirs), applies heuristic
checks per file type, and writes a structured JSON report.

Defaults:
  PATH = ./src
  OUT  = ./review-findings.json

Includes (extensions):
  .ts .tsx .js .jsx .mjs .cjs
  .css .scss .sass
  .html .htm

Excludes (directories):
  node_modules .git .hg .svn dist build out target vendor
  .next .vite .turbo .cache .parcel-cache coverage __pycache__
  .venv venv .gradle
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable


SEVERITY_ORDER = ("error", "non-compliance", "improvement")
SEV_ERROR = "error"
SEV_NONCOMPLIANCE = "non-compliance"
SEV_IMPROVEMENT = "improvement"

EXCLUDE_DIRS = {
    "node_modules", ".git", ".hg", ".svn",
    "dist", "build", "out", "target", "vendor",
    ".next", ".vite", ".turbo", ".cache", ".parcel-cache",
    "coverage", "__pycache__", ".venv", "venv", ".gradle",
}

INCLUDE_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".css", ".scss", ".sass",
    ".html", ".htm",
}


def severity_rank(s: str) -> int:
    try:
        return SEVERITY_ORDER.index(s)
    except ValueError:
        return len(SEVERITY_ORDER)


def walk_source_files(root: Path):
    """Yield source files under `root`, pruning excluded directories."""
    for dirpath, dirnames, filenames in os.walk(root, followlinks=False):
        # prune in-place so os.walk skips these
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        for name in filenames:
            p = Path(dirpath) / name
            if p.suffix.lower() in INCLUDE_EXTS:
                yield p


# ---- JS / TS / TSX / JSX heuristics --------------------------------------

def check_js_or_tsx(file_label: str, lines: list[str], corpus: str | None = None) -> list[dict]:
    findings: list[dict] = []
    src = "\n".join(lines)

    # 1) Unused imports
    import_re = re.compile(
        r'^\s*import\s+(?:type\s+)?'
        r'(?:\*\s+as\s+([A-Za-z_$][\w$]*)|'
        r'\{([^}]+)\}|'
        r'([A-Za-z_$][\w$]*))'
        r'\s+from\s+[\'"][^\'"]+[\'"]',
        re.MULTILINE,
    )
    src_no_imports = re.sub(r'^\s*import\s.*$', '', src, flags=re.MULTILINE)
    for m in import_re.finditer(src):
        line_no = src[:m.start()].count("\n") + 1
        names: list[str] = []
        if m.group(1):
            names.append(m.group(1))
        if m.group(2):
            for raw in m.group(2).split(','):
                n = raw.strip().split(' as ')[-1].strip()
                if n:
                    names.append(n)
        if m.group(3):
            names.append(m.group(3))
        for name in names:
            if not re.search(rf'\b{re.escape(name)}\b', src_no_imports):
                findings.append({
                    "line": line_no, "severity": SEV_NONCOMPLIANCE,
                    "rule": "unused-import",
                    "message": f"Imported identifier '{name}' does not appear to be used.",
                })

    # 2) Loose equality
    for i, line in enumerate(lines, 1):
        stripped = re.sub(r'===|!==', '', line)
        if re.search(r'(?<![=!<>])==(?![=])', stripped):
            findings.append({
                "line": i, "severity": SEV_NONCOMPLIANCE,
                "rule": "loose-equality",
                "message": "Use === instead of == for strict equality.",
            })

    # 3) `var`
    for i, line in enumerate(lines, 1):
        if re.search(r'\bvar\s+[A-Za-z_$]', line):
            findings.append({
                "line": i, "severity": SEV_NONCOMPLIANCE,
                "rule": "no-var",
                "message": "Use const or let instead of var.",
            })

    # 4) Empty catch
    for i, line in enumerate(lines, 1):
        if re.search(r'catch\s*\([^)]*\)\s*\{\s*\}', line):
            findings.append({
                "line": i, "severity": SEV_NONCOMPLIANCE,
                "rule": "empty-catch",
                "message": "Empty catch block swallows errors.",
            })

    # 5) console.log
    for i, line in enumerate(lines, 1):
        if re.search(r'\bconsole\.(log|debug)\s*\(', line):
            findings.append({
                "line": i, "severity": SEV_IMPROVEMENT,
                "rule": "console-left-in",
                "message": "Remove debug console.log before shipping.",
            })

    # 6) TS `any`
    for i, line in enumerate(lines, 1):
        if (re.search(r':\s*any\b', line)
                or re.search(r'<any\b', line)
                or re.search(r'as\s+any\b', line)):
            findings.append({
                "line": i, "severity": SEV_NONCOMPLIANCE,
                "rule": "ts-any",
                "message": "Avoid `any` — use a precise type or `unknown`.",
            })

    # 7) React .map() without key
    for i, line in enumerate(lines, 1):
        if '.map(' in line:
            window_text = "\n".join(lines[max(0, i - 1):min(len(lines), i + 3)])
            if 'key=' not in window_text:
                findings.append({
                    "line": i, "severity": SEV_NONCOMPLIANCE,
                    "rule": "react-missing-key",
                    "message": ".map() callback appears to be missing a `key` prop on the root element.",
                })

    # 8) Hooks called conditionally (heuristic)
    hook_names = ('useState', 'useEffect', 'useMemo', 'useCallback', 'useRef',
                  'useReducer', 'useContext', 'useLayoutEffect')
    for i, line in enumerate(lines, 1):
        for hook in hook_names:
            if re.search(rf'\b{hook}\s*\(', line):
                prev_stripped = []
                for j in range(max(0, i - 3), i - 1):
                    if j < len(lines) and lines[j].strip():
                        prev_stripped.append(lines[j].strip())
                if any(prev.endswith(('if', 'else', 'for', 'while'))
                       or 'return' in prev for prev in prev_stripped):
                    findings.append({
                        "line": i, "severity": SEV_ERROR,
                        "rule": "react-hooks-rule",
                        "message": f"Hook '{hook}' may be called conditionally.",
                    })

    # 9) dangerouslySetInnerHTML
    for i, line in enumerate(lines, 1):
        if 'dangerouslySetInnerHTML' in line:
            findings.append({
                "line": i, "severity": SEV_ERROR,
                "rule": "react-dangerous-html",
                "message": "dangerouslySetInnerHTML detected — ensure content is sanitized.",
            })

    # 10) addEventListener passive flag
    for i, line in enumerate(lines, 1):
        m = re.search(r'addEventListener\(\s*[\'"](scroll|touchmove|wheel)[\'"]', line)
        if m:
            window_text = "\n".join(lines[max(0, i - 1):min(len(lines), i + 3)])
            if 'passive' not in window_text:
                findings.append({
                    "line": i, "severity": SEV_IMPROVEMENT,
                    "rule": "non-passive-scroll-listener",
                    "message": f"`{m.group(1)}` listener not declared passive — pass `{{ passive: true }}` for better scroll perf.",
                })

    # 11) Hardcoded secrets
    secret_re = re.compile(
        r'(?:AKIA|ASIA)[0-9A-Z]{16}'
        r'|sk-[A-Za-z0-9]{20,}'
        r'|ghp_[A-Za-z0-9]{20,}'
        r'|xox[abp]-[A-Za-z0-9-]{10,}'
        r'|AIza[0-9A-Za-z\-_]{35}',
    )
    for i, line in enumerate(lines, 1):
        if secret_re.search(line):
            findings.append({
                "line": i, "severity": SEV_ERROR,
                "rule": "hardcoded-secret",
                "message": "Possible hardcoded credential detected — move to env vars.",
            })

    # 12) TODO / FIXME / XXX
    for i, line in enumerate(lines, 1):
        m = re.search(r'\b(TODO|FIXME|XXX)\b', line)
        if m:
            findings.append({
                "line": i, "severity": SEV_IMPROVEMENT,
                "rule": "todo-marker",
                "message": f"`{m.group(1)}` marker left in code.",
            })

    # 13) Long lines
    for i, line in enumerate(lines, 1):
        if len(line) > 120:
            findings.append({
                "line": i, "severity": SEV_IMPROVEMENT,
                "rule": "long-line",
                "message": f"Line is {len(line)} chars (>120). Consider wrapping.",
            })

    # 14) Unused props on inline type blocks.
    # When a corpus is provided (directory mode), we check for usage across
    # all files; otherwise we fall back to within-file usage only.
    corpus_text = corpus if corpus is not None else src
    type_block_re = re.compile(r'type\s+(\w+)\s*=\s*\{([^}]*)\}', re.DOTALL)
    field_re = re.compile(r'^\s*([A-Za-z_$][\w$]*)\??\s*:', re.MULTILINE)
    for m in type_block_re.finditer(src):
        type_name = m.group(1)
        body = m.group(2)
        block_start_line = src[:m.start()].count('\n') + 1
        # Strip the current type block from the corpus so we only count
        # references outside the declaration.
        remainder = corpus_text.replace(m.group(0), '')
        for fm in field_re.finditer(body):
            field = fm.group(1)
            offset = body[:fm.start()].count('\n')
            if not re.search(rf'\b{re.escape(field)}\b', remainder):
                findings.append({
                    "line": block_start_line + offset,
                    "severity": SEV_NONCOMPLIANCE,
                    "rule": "unused-prop",
                    "message": f"Prop '{field}' on type '{type_name}' is declared but not used.",
                })

    # 15) a11y — <img>
    for i, line in enumerate(lines, 1):
        if re.search(r'<img\b', line):
            window_text = "\n".join(lines[max(0, i - 1):min(len(lines), i + 6)])
            if 'alt=' not in window_text:
                findings.append({
                    "line": i, "severity": SEV_ERROR,
                    "rule": "a11y-img-alt",
                    "message": "<img> is missing an `alt` attribute.",
                })
            elif 'alt=""' in window_text:
                findings.append({
                    "line": i, "severity": SEV_NONCOMPLIANCE,
                    "rule": "a11y-empty-alt",
                    "message": "<img> has empty alt — confirm this is decorative.",
                })

    # 16) a11y — <button>
    for i, line in enumerate(lines, 1):
        if re.search(r'<button\b', line):
            window_text = "\n".join(lines[max(0, i - 1):min(len(lines), i + 10)])
            if not (re.search(r'aria-label\s*=', window_text)
                    or re.search(r'aria-labelledby\s*=', window_text)
                    or re.search(r'>\s*\w', window_text)):
                findings.append({
                    "line": i, "severity": SEV_ERROR,
                    "rule": "a11y-button-name",
                    "message": "<button> has no accessible name (no aria-label, no text content).",
                })

    # 17) a11y — <a>
    for i, line in enumerate(lines, 1):
        if re.search(r'<a\b', line) and 'href=' not in line:
            findings.append({
                "line": i, "severity": SEV_NONCOMPLIANCE,
                "rule": "a11y-anchor-href",
                "message": "<a> missing href — use a <button> if not navigating.",
            })

    # 18) a11y — emoji as sole button content
    emoji_re = re.compile(r'[\u2600-\u27BF\u1F300-\u1FAFF]')
    for i, line in enumerate(lines, 1):
        if '<button' in line or '</button>' in line:
            content = line.strip()
            if emoji_re.search(content) and not re.search(r'[A-Za-z]{3,}', content):
                findings.append({
                    "line": i, "severity": SEV_NONCOMPLIANCE,
                    "rule": "a11y-emoji-button",
                    "message": "Button content is an emoji glyph — verify aria-label covers screen reader output.",
                })

    return findings


# ---- CSS / SCSS heuristics ------------------------------------------------

def check_css(file_label: str, lines: list[str], corpus: str | None = None) -> list[dict]:
    findings: list[dict] = []
    src = "\n".join(lines)

    # Unbalanced braces
    opens = src.count('{')
    closes = src.count('}')
    if opens != closes:
        findings.append({
            "line": 1, "severity": SEV_ERROR,
            "rule": "css-unbalanced-braces",
            "message": f"Unbalanced braces: {opens} '{{' vs {closes} '}}'.",
        })

    # Duplicate top-level selectors
    selector_re = re.compile(r'^([^{}/]+)\{', re.MULTILINE)
    seen: dict[str, int] = {}
    for m in selector_re.finditer(src):
        sel = m.group(1).strip().rstrip(',').split(',')[0].strip()
        if not sel or sel.startswith('@'):
            continue
        line_no = src[:m.start()].count('\n') + 1
        if sel in seen:
            findings.append({
                "line": line_no, "severity": SEV_NONCOMPLIANCE,
                "rule": "css-duplicate-selector",
                "message": f"Duplicate selector '{sel}' (also at line {seen[sel]}).",
            })
        else:
            seen[sel] = line_no

    # !important overuse
    important_count = sum(1 for line in lines if '!important' in line)
    if important_count >= 3:
        findings.append({
            "line": 1, "severity": SEV_IMPROVEMENT,
            "rule": "css-important-overuse",
            "message": f"`!important` used {important_count} times — review whether specificity is the right fix.",
        })

    return findings


# ---- HTML heuristics ------------------------------------------------------

def check_html(file_label: str, lines: list[str], corpus: str | None = None) -> list[dict]:
    findings: list[dict] = []
    src = "\n".join(lines)

    # <html> without lang
    if re.search(r'<html\b', src) and not re.search(r'<html\b[^>]*\blang\s*=', src):
        findings.append({
            "line": 1, "severity": SEV_NONCOMPLIANCE,
            "rule": "html-lang-missing",
            "message": "<html> is missing a `lang` attribute.",
        })

    # img without alt
    for i, line in enumerate(lines, 1):
        if re.search(r'<img\b', line):
            window_text = "\n".join(lines[max(0, i - 1):min(len(lines), i + 6)])
            if 'alt=' not in window_text:
                findings.append({
                    "line": i, "severity": SEV_ERROR,
                    "rule": "a11y-img-alt",
                    "message": "<img> is missing an `alt` attribute.",
                })

    # input without label
    for i, line in enumerate(lines, 1):
        if re.search(r'<input\b', line):
            id_m = re.search(r'\bid\s*=\s*["\']([^"\']+)["\']', line)
            id_value = id_m.group(1) if id_m else None
            labeled = (
                'aria-label=' in line
                or 'aria-labelledby=' in line
                or (id_value is not None
                    and re.search(rf'<label\b[^>]*\bfor\s*=\s*["\']{re.escape(id_value)}["\']', src))
            )
            if not labeled:
                findings.append({
                    "line": i, "severity": SEV_NONCOMPLIANCE,
                    "rule": "a11y-input-label",
                    "message": "<input> is missing an associated <label> or aria-label.",
                })

    return findings


CHECKERS: dict[str, Callable[[str, list[str]], list[dict]]] = {
    ".ts":   check_js_or_tsx,
    ".tsx":  check_js_or_tsx,
    ".js":   check_js_or_tsx,
    ".jsx":  check_js_or_tsx,
    ".mjs":  check_js_or_tsx,
    ".cjs":  check_js_or_tsx,
    ".css":  check_css,
    ".scss": check_css,
    ".sass": check_css,
    ".html": check_html,
    ".htm":  check_html,
}


def review_file(path: Path, root: Path, corpus: str | None = None) -> dict:
    relative = path.relative_to(root).as_posix()
    title = f"Code review: {relative}"
    record: dict = {
        "title": title,
        "relative_path": relative,
        "severity": "clean",
        "summary": {"error": 0, "non-compliance": 0, "improvement": 0},
        "findings": [],
    }

    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        record["severity"] = "skipped"
        record["note"] = "File is not valid UTF-8; skipped."
        return record
    except OSError as e:
        record["severity"] = "skipped"
        record["note"] = f"Read error: {e}"
        return record

    lines = text.splitlines()
    checker = CHECKERS.get(path.suffix.lower())
    if checker is None:
        return record

    findings = checker(relative, lines, corpus=corpus)
    record["findings"] = findings
    record["summary"] = {
        "error":         sum(1 for f in findings if f["severity"] == SEV_ERROR),
        "non-compliance": sum(1 for f in findings if f["severity"] == SEV_NONCOMPLIANCE),
        "improvement":   sum(1 for f in findings if f["severity"] == SEV_IMPROVEMENT),
    }
    if findings:
        record["severity"] = min((f["severity"] for f in findings), key=severity_rank)
    return record


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Recursively review frontend code.")
    parser.add_argument("path", nargs="?", default="./src",
                        help="File or directory to review (default: ./src)")
    parser.add_argument("--out", default="./review-findings.json",
                        help="Output JSON file (default: ./review-findings.json)")
    parser.add_argument("--quiet", action="store_true",
                        help="Suppress progress output on stderr.")
    return parser.parse_args(argv)


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    target = Path(args.path).resolve()
    out_path = Path(args.out).resolve()

    if not target.exists():
        print(f"Path not found: {target}", file=sys.stderr)
        return 2

    corpus: str | None = None
    if target.is_file():
        root = target.parent
        try:
            corpus = target.read_text(encoding="utf-8", errors="replace")
        except OSError:
            corpus = None
        results = [review_file(target, root, corpus=corpus)]
    else:
        root = target
        files = list(walk_source_files(root))
        if not args.quiet:
            print(f"Scanning {root} — {len(files)} candidate files", file=sys.stderr)
        # Build a corpus of all source text so checks (e.g. unused-prop) can
        # see cross-file usage. Memory cost is the sum of all file sizes —
        # fine for typical frontend projects.
        corpus_parts: list[str] = []
        for f in files:
            try:
                corpus_parts.append(f.read_text(encoding="utf-8", errors="replace"))
            except OSError:
                continue
        corpus = "\n".join(corpus_parts)
        results = []
        for i, f in enumerate(files, 1):
            if not args.quiet:
                print(f"  [{i}/{len(files)}] {f.relative_to(root)}", file=sys.stderr)
            results.append(review_file(f, root, corpus=corpus))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "root": str(root),
        "tool": "review.py",
        "tool_version": "1.0",
        "totals": {
            "files_scanned":      len(results),
            "files_with_findings": sum(1 for r in results if r["findings"]),
            "files_clean":        sum(1 for r in results if not r["findings"] and r["severity"] != "skipped"),
            "files_skipped":      sum(1 for r in results if r["severity"] == "skipped"),
            "errors":             sum(r["summary"]["error"] for r in results),
            "non-compliance":     sum(r["summary"]["non-compliance"] for r in results),
            "improvements":       sum(r["summary"]["improvement"] for r in results),
        },
        "files": results,
    }
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")

    if not args.quiet:
        t = payload["totals"]
        print(f"\nWrote {out_path}", file=sys.stderr)
        print(f"  files scanned:   {t['files_scanned']}", file=sys.stderr)
        print(f"  with findings:   {t['files_with_findings']}", file=sys.stderr)
        print(f"  clean:           {t['files_clean']}", file=sys.stderr)
        print(f"  skipped:         {t['files_skipped']}", file=sys.stderr)
        print(f"  errors:          {t['errors']}", file=sys.stderr)
        print(f"  non-compliance:  {t['non-compliance']}", file=sys.stderr)
        print(f"  improvements:    {t['improvements']}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
