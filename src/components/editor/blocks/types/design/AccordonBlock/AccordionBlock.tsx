import React from "react";
import styles from "./AccordionBlock.module.css";

type AccordionHeadingLevel = 2 | 3 | 4 | 5 | 6;

type AccordionItem = {
  title: string;
  content: string;
  initiallyOpen?: boolean;
  headingLevel?: AccordionHeadingLevel;
};

export interface AccordionBlockProps {
  block: {
    id: string;
    type: "accordion";
    items: AccordionItem[];
    openByDefault?: boolean;
    autoClose?: boolean;
    showIcon?: boolean;
    iconPosition?: "left" | "right";
  };
  onUpdate: (id: string, updated: Partial<AccordionBlockProps["block"]>) => void;
  onFocus?: () => void;
}

const AccordionBlock: React.FC<AccordionBlockProps> = ({ block, onUpdate, onFocus }) => {
  const itemCount = block.items?.length ?? 0;
  const [openIndexes, setOpenIndexes] = React.useState<number[]>(() =>
    (block.items ?? [])
      .map((item, index) => ({
        index,
        shouldOpen: Boolean(block.openByDefault || item.initiallyOpen)
      }))
      .filter((entry) => entry.shouldOpen)
      .map((entry) => entry.index)
  );

  React.useEffect(() => {
    setOpenIndexes((previous) => {
      if (block.openByDefault) {
        return Array.from({ length: itemCount }, (_, index) => index);
      }
      return previous.filter((index) => index < itemCount);
    });
  }, [itemCount, block.openByDefault]);

  const isOpen = (index: number) => openIndexes.includes(index);

  const toggleOpen = (index: number) => {
    setOpenIndexes((previous) => {
      const currentlyOpen = previous.includes(index);
      if (currentlyOpen) return previous.filter((value) => value !== index);
      if (block.autoClose) return [index];
      return [...previous, index];
    });
  };

  const updateItem = (
    index: number,
    field: keyof AccordionItem,
    value: string | boolean | AccordionHeadingLevel
  ) => {
    const updated = block.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate(block.id, { items: updated });
  };

  const updateSetting = (
    field: "openByDefault" | "autoClose" | "showIcon" | "iconPosition",
    value: boolean | "left" | "right"
  ) => {
    onUpdate(block.id, { [field]: value });
  };

  const addItem = () => {
    onUpdate(block.id, {
      items: [...block.items, { title: "", content: "", initiallyOpen: false, headingLevel: 3 }]
    });
  };

  const removeItem = (index: number) => {
    onUpdate(block.id, { items: block.items.filter((_, i) => i !== index) });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= block.items.length) return;

    const updated = [...block.items];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onUpdate(block.id, { items: updated });
  };

  return (
    <div className="py-3" onClick={onFocus}>
      <div className="mb-4 border rounded p-3 bg-slate-50">
        <div className="font-medium mb-2">Accordion settings</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(block.openByDefault)}
              onChange={(e) => updateSetting("openByDefault", e.target.checked)}
            />
            Open by default
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(block.autoClose)}
              onChange={(e) => updateSetting("autoClose", e.target.checked)}
            />
            Auto-close
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={block.showIcon !== false}
              onChange={(e) => updateSetting("showIcon", e.target.checked)}
            />
            Show icon
          </label>
          <label className="flex items-center gap-2">
            Icon position
            <select
              className="border rounded px-2 py-1"
              value={block.iconPosition || "right"}
              onChange={(e) => updateSetting("iconPosition", e.target.value as "left" | "right")}
              disabled={block.showIcon === false}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
        </div>
      </div>

      {block.items.map((item, index) => (
        <div key={index} className="border rounded mb-3 bg-white">
          <h3 className="m-0">
            <button
              type="button"
              className={`${styles.itemHeading} ${
                (block.iconPosition || "right") === "left" ? styles.iconLeft : styles.iconRight
              }`}
              onClick={() => toggleOpen(index)}
              aria-expanded={isOpen(index)}
              aria-controls={`${block.id}-accordion-panel-${index}`}
            >
              {block.showIcon !== false && (
                <span className={styles.chevron} aria-hidden="true">
                  {isOpen(index) ? "▾" : "▸"}
                </span>
              )}
              <span className="truncate">
                {item.title?.trim() || `Accordion item ${index + 1}`}
              </span>
            </button>
          </h3>

          {isOpen(index) && (
            <div id={`${block.id}-accordion-panel-${index}`} className="p-3 border-t">
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="Accordion heading"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
              />

              <textarea
                className="w-full border rounded px-2 py-1 mb-2"
                placeholder="Accordion panel content"
                rows={3}
                value={item.content}
                onChange={(e) => updateItem(index, "content", e.target.value)}
              />

              <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
                <label className="flex items-center gap-2">
                  Heading level
                  <select
                    className="border rounded px-2 py-1"
                    value={item.headingLevel || 3}
                    onChange={(e) =>
                      updateItem(index, "headingLevel", Number(e.target.value) as AccordionHeadingLevel)
                    }
                  >
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                    <option value={5}>H5</option>
                    <option value={6}>H6</option>
                  </select>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(item.initiallyOpen)}
                    onChange={(e) => updateItem(index, "initiallyOpen", e.target.checked)}
                  />
                  Initially open
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50"
                  onClick={() => moveItem(index, "up")}
                  disabled={index === 0}
                >
                  ↑ Move up
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-50"
                  onClick={() => moveItem(index, "down")}
                  disabled={index === block.items.length - 1}
                >
                  ↓ Move down
                </button>
                <button
                  type="button"
                  className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
                  onClick={() => removeItem(index)}
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={addItem}
      >
        + Add Accordion Item
      </button>
    </div>
  );
};

export default AccordionBlock;
