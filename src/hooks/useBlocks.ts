import { useState } from "react";

export interface Block {
  id: string;
  type: string;
  [key: string]: any;
}

const uuid = () => crypto.randomUUID();

const useBlocks = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);

  //
  // ADD BLOCK
  //
  const addBlock = (type: string) => {
    const newBlock: Block = {
      id: uuid(),
      type,
      ...getDefaultBlockData(type)
    };

    setBlocks((prev) => [...prev, newBlock]);
  };

  //
  // UPDATE BLOCK
  //
  const updateBlock = (id: string, updated: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id ? { ...block, ...updated } : block
      )
    );
  };

  //
  // MOVE BLOCK (UP/DOWN)
  //
  const moveBlock = (id: string, direction: "up" | "down") => {
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;

      return updated;
    });
  };

  //
  // DELETE BLOCK
  //
  const deleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    moveBlock,
    deleteBlock
  };
};

//
// DEFAULT BLOCK PAYLOADS
//
const getDefaultBlockData = (type: string) => {
  switch (type) {
    //
    // TEXT DOMAIN
    //
    case "paragraph":
      return { text: "" };

    case "heading":
      return { level: 2, text: "" };

    case "list":
      return { items: [""] };

    //
    // MEDIA DOMAIN
    //
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

    //
    // CODE DOMAIN
    //
    case "code":
      return { language: "text", code: "" };

    //
    // DATA / LAYOUT DOMAIN
    //
    case "table":
      return { rows: [[""]] };

    case "columns":
      return { columns: [""] };

    case "group":
      return { items: [""] };

    case "row":
      return { items: [""] };

    case "stack":
      return { items: [""] };

    case "grid":
      return {
        rows: 1,
        cols: 1,
        cells: [[""]]
      };

    case "accordion":
      return {
        openByDefault: false,
        autoClose: false,
        showIcon: true,
        iconPosition: "right",
        items: [{ title: "", content: "", initiallyOpen: false, headingLevel: 3 }]
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

    case "more":
      return { content: "" };

    //
    // FALLBACK
    //
    default:
      return {};
  }
};

export default useBlocks;
