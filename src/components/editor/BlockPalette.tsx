import React from "react";
import {
  TextIcon,
  Heading1,
  List,
  Image,
  Images,
  Music,
  Video,
  FileImage,
  File,
  Code,
  Table,
  PanelBottom,
  SquarePlus,
  Columns,
  Group,
  Rows,
  LayoutList,
  MoreHorizontal
} from "lucide-react";

export interface BlockPaletteProps {
  onAddBlock: (type: string) => void;
}

const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  const categories = [
    {
      title: "Text",
      items: [
        { type: "paragraph", label: "Paragraph", icon: TextIcon },
        { type: "heading", label: "Heading", icon: Heading1 },
        { type: "list", label: "List", icon: List },
        { type: "code", label: "Code", icon: Code },
        { type: "table", label: "Table", icon: Table }
      ]
    },
    {
      title: "Media",
      items: [
        { type: "image", label: "Image", icon: Image },
        { type: "gallery", label: "Gallery", icon: Images },
        { type: "audio", label: "Audio", icon: Music },
        { type: "video", label: "Video", icon: Video },
        { type: "cover", label: "Cover", icon: FileImage },
        { type: "file", label: "File", icon: File }
      ]
    },
    {
      title: "Design",
      items: [
        { type: "accordion", label: "Accordion", icon: PanelBottom },
        { type: "button", label: "Button", icon: SquarePlus },
        { type: "columns", label: "Columns", icon: Columns },
        { type: "group", label: "Group", icon: Group },
        { type: "row", label: "Row", icon: Rows },
        { type: "stack", label: "Stack", icon: LayoutList },
        { type: "more", label: "More", icon: MoreHorizontal }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.title}>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 text-left">
            {cat.title.toUpperCase()}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {cat.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  className="flex flex-col items-center justify-center 
                             bg-gray-50 hover:bg-gray-200 
                             border rounded-lg p-2 text-xs text-center height-20 width-25"
                  onClick={() => onAddBlock(item.type)}
                >
                  <Icon className="w-6 h-6 text-gray-600 mb-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockPalette;
