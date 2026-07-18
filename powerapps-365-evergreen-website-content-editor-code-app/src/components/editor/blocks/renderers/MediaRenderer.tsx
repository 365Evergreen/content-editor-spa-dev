import React from "react";

import ImageBlock from "../types/media/ImageBlock";
import GalleryBlock from "../types/media/GalleryBlock";
import VideoBlock from "../types/media/VideoBlock";
import AudioBlock from "../types/media/AudioBlock";
import FileBlock from "../types/media/FileBlock";
import CoverBlock from "../types/media/CoverBlock";

export interface MediaRendererProps {
  block: any;
  onUpdate: (id: string, updated: Partial<any>) => void;
  mediaLibrary: string[];
}

const MediaRenderer: React.FC<MediaRendererProps> = ({ block, onUpdate, mediaLibrary }) => {
  switch (block.type) {
    case "image":
      return (
        <ImageBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
        />
      );

    case "gallery":
      return (
        <GalleryBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
        />
      );

    case "video":
      return (
        <VideoBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
        />
      );

    case "audio":
      return (
        <AudioBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
        />
      );

    case "file":
      return (
        <FileBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
        />
      );

    case "cover":
      return (
        <CoverBlock
          block={block}
          onUpdate={onUpdate}
          mediaLibrary={mediaLibrary}
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
