export interface Block {
  id: string;
  type: string;
  [key: string]: any;
}

const uuid = () => crypto.randomUUID();

const createParagraphBlock = (text = ""): Block => ({
  id: uuid(),
  type: "paragraph",
  text
});

const createColumn = (): { id: string; width: string; blocks: Block[] } => ({
  id: uuid(),
  width: "",
  blocks: [createParagraphBlock("")]
});

export const getDefaultBlockData = (type: string): Record<string, any> => {
  switch (type) {
    case "paragraph":
      return { text: "", align: "left" };
    case "heading":
      return { level: 2, text: "" };
    case "list":
      return { items: [""] };
    case "image":
      return {
        url: "",
        src: "",
        alt: "",
        caption: "",
        showCaption: false,
        alignment: "none",
        style: "default",
        width: "",
        height: "",
        aspectRatio: "auto",
        scale: "cover",
        linkUrl: "",
        openInNewTab: false,
        linkToImageFile: false,
        enlargeOnClick: false
      };
    case "gallery":
      return { urls: [""] };
    case "audio":
      return { url: "" };
    case "video":
      return { url: "" };
    case "cover":
      return { url: "", text: "" };
    case "file":
      return { name: "", url: "" };
    case "code":
      return { language: "text", code: "" };
    case "table":
      return { rows: [[""]] };
    case "columns":
      return {
        alignment: "none",
        verticalAlignment: "top",
        stackOnMobile: true,
        columns: [createColumn(), createColumn()]
      };
    case "group":
      return {
        alignment: "none",
        orientation: "vertical",
        justification: "left",
        verticalAlignment: "top",
        wrap: false,
        gap: "12px",
        children: [createParagraphBlock("")]
      };
    case "row":
      return {
        alignment: "none",
        justification: "left",
        verticalAlignment: "top",
        wrap: true,
        gap: "12px",
        children: [createParagraphBlock("")]
      };
    case "stack":
      return {
        alignment: "none",
        justification: "top",
        horizontalAlignment: "left",
        gap: "12px",
        children: [createParagraphBlock("")]
      };
    case "grid":
      return {
        alignment: "none",
        maxColumns: 3,
        minColumnWidth: "12rem",
        items: [createParagraphBlock("")]
      };
    case "accordion":
      return {
        openByDefault: false,
        autoClose: false,
        showIcon: true,
        iconPosition: "right",
        items: [
          {
            title: "",
            initiallyOpen: false,
            headingLevel: 3,
            panelBlocks: [createParagraphBlock("")]
          }
        ]
      };
    case "button":
      return {
        alignment: "none",
        justification: "left",
        verticalAlignment: "top",
        orientation: "horizontal",
        gap: "12px",
        buttons: [
          {
            label: "",
            url: "",
            openInNewTab: false,
            rel: "",
            widthPercent: 0,
            style: "fill",
            textAlign: "center",
            bold: false,
            italic: false,
            textColor: "#ffffff",
            backgroundColor: "#2563eb",
            borderColor: "#2563eb",
            borderWidth: 1,
            borderRadius: 6,
            paddingX: 12,
            paddingY: 8
          }
        ]
      };
    default:
      return {};
  }
};

export const createBlock = (type: string): Block => ({
  id: uuid(),
  type,
  ...getDefaultBlockData(type)
});

const toParagraphFromUnknown = (value: unknown): Block => {
  if (typeof value === "string") return createParagraphBlock(value);
  if (value && typeof value === "object" && "type" in value) return migrateBlock(value as Block);
  return createParagraphBlock("");
};

const migrateChildrenArray = (source: unknown): Block[] => {
  if (!Array.isArray(source)) return [];
  return source.map((entry) => toParagraphFromUnknown(entry));
};

const migrateColumns = (source: unknown): Array<{ id: string; width: string; blocks: Block[] }> => {
  if (!Array.isArray(source)) return [createColumn(), createColumn()];

  if (source.every((entry) => typeof entry === "string")) {
    return source.map((text) => ({
      id: uuid(),
      width: "",
      blocks: [createParagraphBlock(String(text))]
    }));
  }

  return source.map((entry) => {
    const value = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    return {
      id: typeof value.id === "string" ? value.id : uuid(),
      width: typeof value.width === "string" ? value.width : "",
      blocks: migrateChildrenArray(value.blocks)
    };
  });
};

const migrateAccordionItems = (source: unknown) => {
  if (!Array.isArray(source) || source.length === 0) {
    return [
      {
        title: "",
        initiallyOpen: false,
        headingLevel: 3,
        panelBlocks: [createParagraphBlock("")]
      }
    ];
  }

  return source.map((entry) => {
    const value = entry && typeof entry === "object" ? (entry as Record<string, unknown>) : {};
    const level = Number(value.headingLevel);
    return {
      title: typeof value.title === "string" ? value.title : "",
      initiallyOpen: Boolean(value.initiallyOpen),
      headingLevel: level >= 2 && level <= 6 ? level : 3,
      panelBlocks: Array.isArray(value.panelBlocks)
        ? migrateChildrenArray(value.panelBlocks)
        : [toParagraphFromUnknown(value.content ?? "")]
    };
  });
};

const migrateGridItems = (block: Block): Block[] => {
  if (Array.isArray(block.items)) return migrateChildrenArray(block.items);
  if (Array.isArray(block.cells)) {
    return block.cells
      .flat()
      .filter((cell: unknown) => typeof cell === "string")
      .map((cell: unknown) => createParagraphBlock(String(cell)));
  }
  return [createParagraphBlock("")];
};

export const migrateBlock = (rawBlock: Block): Block => {
  const block: Block = { ...rawBlock, id: rawBlock.id || uuid() };

  switch (block.type) {
    case "group":
      return { ...block, children: migrateChildrenArray(block.children ?? block.items) };
    case "row":
      return { ...block, children: migrateChildrenArray(block.children ?? block.items) };
    case "stack":
      return { ...block, children: migrateChildrenArray(block.children ?? block.items) };
    case "columns":
      return { ...block, columns: migrateColumns(block.columns) };
    case "grid":
      return {
        ...block,
        maxColumns: Number(block.maxColumns || block.cols || 3),
        minColumnWidth: typeof block.minColumnWidth === "string" ? block.minColumnWidth : "12rem",
        items: migrateGridItems(block)
      };
    case "accordion":
      return { ...block, items: migrateAccordionItems(block.items) };
    default:
      return block;
  }
};

export const migrateBlocks = (blocks: Block[]): Block[] => blocks.map((block) => migrateBlock(block));
