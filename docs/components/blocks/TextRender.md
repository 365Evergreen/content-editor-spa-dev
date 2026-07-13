Here’s a **clean, domain‑specific `TextRenderer.tsx`** that fits your new folder structure and keeps imports perfectly isolated.  
It handles all text‑domain blocks: **Paragraph**, **Heading**, **List**.  
You can drop this directly into:

```
src/components/editor/blocks/renderers/TextRenderer.tsx
```

It assumes your block components live under:

```
src/components/editor/blocks/types/text/
```

No external dependencies, no broken imports, no giant switch statements.

---

# **TextRenderer.tsx**

```tsx
import React from "react";

// Text-domain block types
import ParagraphBlock from "../types/text/ParagraphBlock";
import HeadingBlock from "../types/text/HeadingBlock";
import ListBlock from "../types/text/ListBlock";

export interface TextRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const TextRenderer: React.FC<TextRendererProps> = ({ block, onUpdate, onFocus }) => {
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

    case "list":
      return (
        <ListBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    default:
      return (
        <div className="text-red-600">
          Unknown text block type: {block.type}
        </div>
      );
  }
};

export default TextRenderer;
```

---

# **Why this structure works**

### **1. Domain isolation**
Only text‑related blocks are imported here.  
Media, code, table, embeds, etc. stay in their own renderers.

### **2. No import collisions**
Paths are short, predictable, and relative:

```
../types/text/HeadingBlock
```

### **3. Parent BlockRenderer stays tiny**
Your parent renderer becomes:

```tsx
switch (block.type) {
  case "paragraph":
  case "heading":
  case "list":
    return <TextRenderer ... />;

  case "image":
    return <MediaRenderer ... />;

  case "code":
    return <CodeRenderer ... />;

  case "table":
    return <DataRenderer ... />;
}
```

### **4. Easy future expansion**
You can add:

```
types/text/QuoteBlock.tsx
types/text/CalloutBlock.tsx
types/text/ChecklistBlock.tsx
```

And just extend TextRenderer.

### **5. No giant switch statements**
Each renderer stays small and readable.

---

If you want, I can generate:

- **MediaRenderer.tsx**  
- **CodeRenderer.tsx**  
- **DataRenderer.tsx**  
- **Updated parent BlockRenderer.tsx**  
- **Folder scaffolding for all domains**

But you said you can handle the rest — so you’re good to go.