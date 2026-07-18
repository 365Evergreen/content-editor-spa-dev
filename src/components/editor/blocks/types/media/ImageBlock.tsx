import React, { useState } from "react";
import { Captions, ExternalLink, Image as ImageIcon, Link2, X } from "lucide-react";
import MediaPicker from "./MediaPicker";

type ImageAlignment = "none" | "left" | "center" | "right" | "wide" | "full";
type ImageStyle = "default" | "rounded";
type ImageAspectRatio = "auto" | "square" | "portrait" | "landscape";
type ImageScale = "cover" | "contain";

export interface ImageBlockProps {
  block: {
    id: string;
    type: "image";
    url?: string;
    src?: string;
    alt?: string;
    caption?: string;
    showCaption?: boolean;
    alignment?: ImageAlignment;
    style?: ImageStyle;
    width?: string;
    height?: string;
    aspectRatio?: ImageAspectRatio;
    scale?: ImageScale;
    linkUrl?: string;
    openInNewTab?: boolean;
    linkToImageFile?: boolean;
    enlargeOnClick?: boolean;
  };
  onUpdate: (id: string, updated: Partial<ImageBlockProps["block"]>) => void;
  mediaLibrary: string[];
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  onUpdate,
  mediaLibrary
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [insertUrlValue, setInsertUrlValue] = useState("");
  const imageUrl = block.url || block.src || "";

  const update = (updated: Partial<ImageBlockProps["block"]>) => {
    onUpdate(block.id, updated);
  };

  const applyUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    update({ url: trimmed, src: trimmed });
  };

  const imageClasses = [
    block.alignment === "left" ? "mr-auto" : "",
    block.alignment === "center" ? "mx-auto" : "",
    block.alignment === "right" ? "ml-auto" : "",
    block.alignment === "full" ? "w-full" : "",
    block.style === "rounded" ? "rounded-2xl" : "rounded"
  ]
    .filter(Boolean)
    .join(" ");

  const aspectRatioClass =
    block.aspectRatio === "square"
      ? "aspect-square"
      : block.aspectRatio === "portrait"
        ? "aspect-[3/4]"
        : block.aspectRatio === "landscape"
          ? "aspect-[16/9]"
          : "";

  return (
    <div
      className="relative border rounded-lg p-4 bg-white"
      onClick={() => setShowToolbar(true)}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="absolute -top-12 left-0 bg-white border shadow-md rounded-lg 
                        flex items-center gap-2 px-3 py-2 z-20">
          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => {
              setShowPicker(true);
              setShowToolbar(false);
            }}
            title="Replace image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => update({ url: undefined, src: undefined })}
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Picker */}
      {showPicker && (
        <MediaPicker
          mediaLibrary={mediaLibrary}
          onSelect={(url) => {
            applyUrl(url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="border rounded p-3">
          <div className="font-medium text-sm mb-2">Content</div>
          <div className="space-y-2 text-sm">
            <label className="block">
              <span className="text-gray-700">Insert from URL</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="url"
                  className="w-full border rounded px-2 py-1"
                  placeholder="https://example.com/image.webp"
                  value={insertUrlValue}
                  onChange={(e) => setInsertUrlValue(e.target.value)}
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => {
                    applyUrl(insertUrlValue);
                    setInsertUrlValue("");
                  }}
                >
                  Apply
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-gray-700">Alternative text</span>
              <input
                type="text"
                className="mt-1 w-full border rounded px-2 py-1"
                placeholder="Describe the image for accessibility"
                value={block.alt || ""}
                onChange={(e) => update({ alt: e.target.value })}
              />
            </label>
          </div>
        </div>

        <div className="border rounded p-3">
          <div className="font-medium text-sm mb-2">Settings</div>
          <div className="space-y-2 text-sm">
            <label className="block">
              <span className="text-gray-700">Alignment</span>
              <select
                className="mt-1 w-full border rounded px-2 py-1"
                value={block.alignment || "none"}
                onChange={(e) => update({ alignment: e.target.value as ImageAlignment })}
              >
                <option value="none">None</option>
                <option value="left">Align left</option>
                <option value="center">Align center</option>
                <option value="right">Align right</option>
                <option value="wide">Wide width</option>
                <option value="full">Full width</option>
              </select>
            </label>

            <label className="block">
              <span className="text-gray-700">Link URL</span>
              <div className="mt-1 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-gray-500" />
                <input
                  type="url"
                  className="w-full border rounded px-2 py-1"
                  placeholder="https://..."
                  value={block.linkUrl || ""}
                  onChange={(e) => update({ linkUrl: e.target.value })}
                />
              </div>
            </label>

            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(block.openInNewTab)}
                  onChange={(e) => update({ openInNewTab: e.target.checked })}
                />
                <span>Open in new tab</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(block.linkToImageFile)}
                  onChange={(e) => update({ linkToImageFile: e.target.checked })}
                />
                <span>Link to image file</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={Boolean(block.enlargeOnClick)}
                  onChange={(e) => update({ enlargeOnClick: e.target.checked })}
                />
                <span>Enlarge on click</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded p-3 mb-3">
        <div className="font-medium text-sm mb-2">Styles</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <label className="block">
            <span className="text-gray-700">Style</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.style || "default"}
              onChange={(e) => update({ style: e.target.value as ImageStyle })}
            >
              <option value="default">Default</option>
              <option value="rounded">Rounded</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Aspect ratio</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.aspectRatio || "auto"}
              onChange={(e) => update({ aspectRatio: e.target.value as ImageAspectRatio })}
            >
              <option value="auto">Auto</option>
              <option value="square">Square</option>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Width</span>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              placeholder="auto, 100%, 640px"
              value={block.width || ""}
              onChange={(e) => update({ width: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Height</span>
            <input
              type="text"
              className="mt-1 w-full border rounded px-2 py-1"
              placeholder="auto, 320px"
              value={block.height || ""}
              onChange={(e) => update({ height: e.target.value })}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="text-gray-700">Scale</span>
            <select
              className="mt-1 w-full border rounded px-2 py-1"
              value={block.scale || "cover"}
              onChange={(e) => update({ scale: e.target.value as ImageScale })}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </label>
        </div>
      </div>

      {/* Preview */}
      {imageUrl ? (
        <div>
          <div className={`${aspectRatioClass} ${block.alignment === "wide" ? "max-w-5xl mx-auto" : ""}`}>
            <img
              src={imageUrl}
              alt={block.alt || ""}
              className={`w-full ${imageClasses}`}
              style={{
                width: block.width || undefined,
                height: block.height || undefined,
                objectFit: block.scale || undefined,
                cursor: block.enlargeOnClick ? "zoom-in" : undefined
              }}
            />
          </div>
          {block.showCaption && (
            <figcaption className="text-sm text-gray-600 mt-2">
              {block.caption || "Add caption..."}
            </figcaption>
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10 border border-dashed rounded">
          Drag & drop, upload, or insert an image
        </div>
      )}

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded border hover:bg-gray-50"
          onClick={() => update({ showCaption: !block.showCaption })}
        >
          <Captions className="w-4 h-4" />
          {block.showCaption ? "Hide caption" : "Add caption"}
        </button>
        {block.showCaption && (
          <input
            type="text"
            className="flex-1 border rounded px-2 py-1 text-sm"
            placeholder="Write caption..."
            value={block.caption || ""}
            onChange={(e) => update({ caption: e.target.value })}
          />
        )}
      </div>

      {Boolean(block.linkUrl || block.linkToImageFile) && (
        <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
          <ExternalLink className="w-3 h-3" />
          <span>
            Linked to{" "}
            {block.linkToImageFile && imageUrl ? imageUrl : block.linkUrl || ""}
            {block.openInNewTab ? " (new tab)" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
