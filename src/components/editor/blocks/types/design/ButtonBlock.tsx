import React from "react";

export interface ButtonsBlockProps {
  block: {
    id: string;
    type: "button";
    alignment?: "none" | "wide" | "full";
    justification?: "left" | "center" | "right" | "space-between";
    verticalAlignment?: "top" | "middle" | "bottom" | "stretch";
    orientation?: "horizontal" | "vertical";
    gap?: string;
    buttons: {
      label: string;
      url: string;
      openInNewTab?: boolean;
      rel?: string;
      widthPercent?: number;
      style?: "fill" | "outline";
      textAlign?: "left" | "center" | "right";
      bold?: boolean;
      italic?: boolean;
      textColor?: string;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number;
      paddingX?: number;
      paddingY?: number;
    }[];
  };
  onUpdate: (id: string, updated: Partial<ButtonsBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const ButtonsBlock: React.FC<ButtonsBlockProps> = ({ block, onUpdate, onFocus }) => {
  const updateButton = (
    index: number,
    field: keyof ButtonsBlockProps["block"]["buttons"][number],
    value: string | boolean | number
  ) => {
    const updated = block.buttons.map((btn, i) =>
      i === index ? { ...btn, [field]: value } : btn
    );
    onUpdate(block.id, { buttons: updated });
  };

  const updateBlockSetting = (
    field: "alignment" | "justification" | "verticalAlignment" | "orientation" | "gap",
    value: string
  ) => {
    onUpdate(block.id, { [field]: value });
  };

  const addButton = () => {
    const base = block.buttons[0] || {};
    onUpdate(block.id, {
      buttons: [
        ...block.buttons,
        {
          label: "",
          url: "",
          style: base.style || "fill",
          textColor: base.textColor || "#ffffff",
          backgroundColor: base.backgroundColor || "#2563eb",
          borderColor: base.borderColor || "#2563eb",
          borderWidth: base.borderWidth ?? 1,
          borderRadius: base.borderRadius ?? 6,
          paddingX: base.paddingX ?? 12,
          paddingY: base.paddingY ?? 8
        }
      ]
    });
  };

  const removeButton = (index: number) => {
    onUpdate(block.id, { buttons: block.buttons.filter((_, i) => i !== index) });
  };

  const moveButton = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= block.buttons.length) return;
    const updated = [...block.buttons];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onUpdate(block.id, { buttons: updated });
  };

  const containerJustificationClass =
    block.justification === "center"
      ? "justify-center"
      : block.justification === "right"
        ? "justify-end"
        : block.justification === "space-between"
          ? "justify-between"
          : "justify-start";

  const containerAlignmentClass =
    block.verticalAlignment === "middle"
      ? "items-center"
      : block.verticalAlignment === "bottom"
        ? "items-end"
        : block.verticalAlignment === "stretch"
          ? "items-stretch"
          : "items-start";

  const widthClass =
    block.alignment === "full" ? "w-full" : block.alignment === "wide" ? "max-w-5xl" : "w-auto";

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Buttons container settings</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <label className="block">
            <span className="text-gray-700">Align</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.alignment || "none"}
              onChange={(e) => updateBlockSetting("alignment", e.target.value)}
            >
              <option value="none">None</option>
              <option value="wide">Wide width</option>
              <option value="full">Full width</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Items justification</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.justification || "left"}
              onChange={(e) => updateBlockSetting("justification", e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="space-between">Space between</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Vertical alignment</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.verticalAlignment || "top"}
              onChange={(e) => updateBlockSetting("verticalAlignment", e.target.value)}
            >
              <option value="top">Align top</option>
              <option value="middle">Align middle</option>
              <option value="bottom">Align bottom</option>
              <option value="stretch">Stretch to fill</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Orientation</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.orientation || "horizontal"}
              onChange={(e) => updateBlockSetting("orientation", e.target.value)}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="text-gray-700">Gap</span>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              placeholder="12px"
              value={block.gap || "12px"}
              onChange={(e) => updateBlockSetting("gap", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div
        className={`mb-4 p-3 border rounded bg-white ${widthClass} ${
          block.alignment === "none" ? "" : "mx-auto"
        }`}
      >
        <div
          className={`flex ${
            block.orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
          } ${containerJustificationClass} ${containerAlignmentClass}`}
          style={{ gap: block.gap || "12px" }}
        >
          {block.buttons.map((btn, index) => (
            <a
              key={`preview-${index}`}
              href={btn.url || "#"}
              target={btn.openInNewTab ? "_blank" : undefined}
              rel={btn.openInNewTab ? btn.rel || "noopener noreferrer" : btn.rel || undefined}
              className={`inline-flex ${
                btn.textAlign === "left"
                  ? "justify-start"
                  : btn.textAlign === "right"
                    ? "justify-end"
                    : "justify-center"
              }`}
              style={{
                width: btn.widthPercent ? `${btn.widthPercent}%` : undefined,
                color: btn.textColor || (btn.style === "outline" ? "#2563eb" : "#ffffff"),
                backgroundColor: btn.style === "outline" ? "transparent" : btn.backgroundColor || "#2563eb",
                borderColor: btn.borderColor || "#2563eb",
                borderStyle: "solid",
                borderWidth: btn.borderWidth ?? 1,
                borderRadius: btn.borderRadius ?? 6,
                padding: `${btn.paddingY ?? 8}px ${btn.paddingX ?? 12}px`,
                fontWeight: btn.bold ? 700 : 400,
                fontStyle: btn.italic ? "italic" : "normal"
              }}
            >
              {btn.label || `Button ${index + 1}`}
            </a>
          ))}
        </div>
      </div>

      {block.buttons.map((btn, index) => (
        <div key={index} className="border rounded p-3 mb-3 bg-white">
          <div className="font-medium mb-2">Button {index + 1}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              className="border rounded px-2 py-1"
              placeholder="Button label"
              value={btn.label}
              onChange={(e) => updateButton(index, "label", e.target.value)}
            />

            <input
              type="url"
              className="border rounded px-2 py-1"
              placeholder="Button URL"
              value={btn.url}
              onChange={(e) => updateButton(index, "url", e.target.value)}
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(btn.openInNewTab)}
                onChange={(e) => updateButton(index, "openInNewTab", e.target.checked)}
              />
              Open in new tab
            </label>

            <input
              type="text"
              className="border rounded px-2 py-1 text-sm"
              placeholder="rel (e.g. nofollow noopener)"
              value={btn.rel || ""}
              onChange={(e) => updateButton(index, "rel", e.target.value)}
            />

            <label className="block text-sm">
              <span className="text-gray-700">Style</span>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.style || "fill"}
                onChange={(e) => updateButton(index, "style", e.target.value)}
              >
                <option value="fill">Fill</option>
                <option value="outline">Outline</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Width (%)</span>
              <input
                type="number"
                min={1}
                max={100}
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.widthPercent ?? ""}
                onChange={(e) => updateButton(index, "widthPercent", Number(e.target.value || 0))}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Text alignment</span>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.textAlign || "center"}
                onChange={(e) => updateButton(index, "textAlign", e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>

            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(btn.bold)}
                  onChange={(e) => updateButton(index, "bold", e.target.checked)}
                />
                Bold
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(btn.italic)}
                  onChange={(e) => updateButton(index, "italic", e.target.checked)}
                />
                Italic
              </label>
            </div>

            <label className="block text-sm">
              <span className="text-gray-700">Text color</span>
              <input
                type="color"
                className="mt-1 w-full h-9 border rounded px-1 py-1"
                value={btn.textColor || "#ffffff"}
                onChange={(e) => updateButton(index, "textColor", e.target.value)}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Background color</span>
              <input
                type="color"
                className="mt-1 w-full h-9 border rounded px-1 py-1"
                value={btn.backgroundColor || "#2563eb"}
                onChange={(e) => updateButton(index, "backgroundColor", e.target.value)}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Border color</span>
              <input
                type="color"
                className="mt-1 w-full h-9 border rounded px-1 py-1"
                value={btn.borderColor || "#2563eb"}
                onChange={(e) => updateButton(index, "borderColor", e.target.value)}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Border width</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.borderWidth ?? 1}
                onChange={(e) => updateButton(index, "borderWidth", Number(e.target.value))}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Border radius</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.borderRadius ?? 6}
                onChange={(e) => updateButton(index, "borderRadius", Number(e.target.value))}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Padding X</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.paddingX ?? 12}
                onChange={(e) => updateButton(index, "paddingX", Number(e.target.value))}
              />
            </label>

            <label className="block text-sm">
              <span className="text-gray-700">Padding Y</span>
              <input
                type="number"
                min={0}
                className="mt-1 w-full border rounded px-2 py-1"
                value={btn.paddingY ?? 8}
                onChange={(e) => updateButton(index, "paddingY", Number(e.target.value))}
              />
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50"
              onClick={() => moveButton(index, "up")}
              disabled={index === 0}
            >
              ↑ Move up
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50"
              onClick={() => moveButton(index, "down")}
              disabled={index === block.buttons.length - 1}
            >
              ↓ Move down
            </button>
            <button
              type="button"
              className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
              onClick={() => removeButton(index)}
            >
              ✕ Remove
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addButton}
      >
        + Add Button
      </button>
    </div>
  );
};

export default ButtonsBlock;
