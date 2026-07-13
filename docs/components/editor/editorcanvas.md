Here’s a **clean, production‑ready starter for `EditorCanvas.tsx`**, aligned with the component architecture we’ve already built (BlockRenderer, BlockToolbar, useBlocks).  
It’s intentionally minimal, Tailwind‑ready, and structured so you can drop it straight into:

```
src/components/editor/EditorCanvas/EditorCanvas.tsx
```

No external dependencies beyond React + Tailwind + your existing block components.

---

# **EditorCanvas.tsx (Starter Component)**

```tsx
import React from "react";
import BlockRenderer from "../blocks/BlockRenderer";
import BlockToolbar from "../blocks/BlockToolbar";

export interface EditorCanvasProps {
  blocks: any[];
  onUpdateBlock: (id: string, updated: Partial<any>) => void;
  onMoveBlock: (id: string, direction: "up" | "down") => void;
  onDeleteBlock: (id: string) => void;
  onAddBlock: (type: string) => void;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  blocks,
  onUpdateBlock,
  onMoveBlock,
  onDeleteBlock,
  onAddBlock
}) => {
  return (
    <div className="w-full p-6 bg-gray-50 border rounded-lg">
      {/* Canvas Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Content</h2>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("paragraph")}
          >
            + Paragraph
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("heading")}
          >
            + Heading
          </button>

          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => onAddBlock("image")}
          >
            + Image
          </button>
        </div>
      </div>

      {/* Blocks */}
      {blocks.length === 0 && (
        <div className="text-gray-500 italic">No content yet. Add a block to begin.</div>
      )}

      {blocks.map((block) => (
        <div key={block.id} className="mb-8">
          <BlockToolbar
            onMoveUp={() => onMoveBlock(block.id, "up")}
            onMoveDown={() => onMoveBlock(block.id, "down")}
            onDelete={() => onDeleteBlock(block.id)}
          />

          <BlockRenderer
            block={block}
            onUpdate={onUpdateBlock}
          />
        </div>
      ))}
    </div>
  );
};

export default EditorCanvas;
```

---

# **Why this starter works**

### **1. Clean separation of concerns**
- Canvas handles layout + block orchestration  
- BlockRenderer handles block type switching  
- BlockToolbar handles block actions  
- Blocks remain isolated and reusable  

### **2. Tailwind-first**
- Neutral, modern styling  
- Easy to theme later  
- No Fluent UI baggage  

### **3. Extensible**
You can add more block types simply by adding more buttons:

```tsx
onAddBlock("quote")
onAddBlock("list")
onAddBlock("code")
```

And registering them in `BlockRenderer`.

### **4. Works perfectly with `useBlocks`**
The props match the hook’s API exactly:

- `addBlock`  
- `updateBlock`  
- `moveBlock`  
- `deleteBlock`  

---

If you want, I can generate:

- `EditorCanvasContainer.tsx` (scrollable wrapper)  
- `CanvasToolbar.tsx` (global canvas actions)  
- A richer version with drag‑and‑drop (DndKit)  
- A version with slash‑commands (`/heading`, `/image`, etc.)  

Just tell me what you want next.