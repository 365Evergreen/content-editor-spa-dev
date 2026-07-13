Perfect — here are **clean, minimal starter versions** of both components, written to avoid import errors and match the exact folder structure you’re using:

```
src/
  components/
    editor/
      blocks/
        BlockRenderer.tsx
        BlockToolbar.tsx
        types/
          ParagraphBlock.tsx
          HeadingBlock.tsx
          ImageBlock.tsx
```

Everything below assumes **this exact structure**, so you won’t hit path‑resolution issues.

---

# **BlockRenderer.tsx (Starter)**

This file lives at:

```
src/components/editor/blocks/BlockRenderer.tsx
```

It imports block types from the `types/` folder **relative to itself**.

```tsx
import React from "react";
import ParagraphBlock from "./types/ParagraphBlock";
import HeadingBlock from "./types/HeadingBlock";
import ImageBlock from "./types/ImageBlock";

export interface BlockRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onUpdate, onFocus }) => {
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "heading":
      return (
        <HeadingBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "image":
      return (
        <ImageBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    default:
      return (
        <div className="text-red-600">
          Unknown block type: {block.type}
        </div>
      );
  }
};

export default BlockRenderer;
```

### Why this avoids import errors
- Uses **relative imports** (`./types/...`)  
- No index files required  
- No circular imports  
- No absolute path assumptions  

---

# **BlockToolbar.tsx (Starter)**

This file lives at:

```
src/components/editor/blocks/BlockToolbar.tsx
```

It has **no external dependencies**, so it’s safe and error‑free.

```tsx
import React from "react";

export interface BlockToolbarProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

const BlockToolbar: React.FC<BlockToolbarProps> = ({
  onMoveUp,
  onMoveDown,
  onDelete
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={onMoveUp}
      >
        ↑
      </button>

      <button
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        onClick={onMoveDown}
      >
        ↓
      </button>

      <button
        className="px-2 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default BlockToolbar;
```

### Why this avoids import errors
- No imports except React  
- No external libraries  
- No icons (you can add react‑icons later if you want)  

---

# **Next Step (Recommended)**

To continue eliminating import errors, the next files you should generate are:

- `ParagraphBlock.tsx`  
- `HeadingBlock.tsx`  
- `ImageBlock.tsx`  

You already have starters, but if you want **clean, final versions** aligned with this folder structure, I can regenerate them.

Or we can move on to:

- `CanvasToolbar.tsx`  
- `EditorCanvasContainer.tsx`  
- `useBlocks.ts` (final version with types)  

Just tell me what you want next.