import React from "react";

// Media block types
import ImageBlock from "../types/media/ImageBlock";
import GalleryBlock from "../types/media/GalleryBlock";
import AudioBlock from "../types/media/AudioBlock";
import CoverBlock from "../types/media/CoverBlock";
import FileBlock from "../types/media/FileBlock";
import VideoBlock from "../types/media/VideoBlock";

export interface MediaRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  onFocus?: () => void;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ block, onUpdate, onFocus }) => {
  switch (block.type) {
    case "image":
      return (
        <ImageBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "gallery":
      return (
        <GalleryBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "audio":
      return (
        <AudioBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "cover":
      return (
        <CoverBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "file":
      return (
        <FileBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    case "video":
      return (
        <VideoBlock
          block={block}
          onUpdate={onUpdate}
          onFocus={onFocus}
        />
      );

    default:
      return (
        <div className="text-red-600">
          Unknown media block type: {block.type}
        </div>
      );
  }
};

export default MediaRenderer;
