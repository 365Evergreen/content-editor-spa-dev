import React, { useState } from "react";
import type { Metadata } from "../../models/Metadata";
import { useCategories } from "../../hooks/useCategories";
import { slugify } from "../../utils/slugify";
import MediaPicker from "../editor/blocks/types/media/MediaPicker";

export interface MetadataPanelProps {
  metadata: Metadata;
  onUpdateMetadata: (updated: Partial<Metadata>) => void;
  mediaLibrary: string[];
}

const CategoryOption = ({
  node,
  level = 0
}: {
  node: any;
  level?: number;
}) => (
  <>
    <option value={node.id}>
      {"—".repeat(level)} {node.name}
    </option>

    {node.children.map((child: any) => (
      <CategoryOption key={child.id} node={child} level={level + 1} />
    ))}
  </>
);

const MetadataPanel: React.FC<MetadataPanelProps> = ({
  metadata,
  onUpdateMetadata,
  mediaLibrary
}) => {
  const categories = useCategories();
  const [slugLocked, setSlugLocked] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const updateTitle = (title: string) => {
    onUpdateMetadata({
      title,
      slug: slugLocked ? metadata.slug : slugify(title)
    });
  };

  const updateSlug = (slug: string) => {
    setSlugLocked(true);
    onUpdateMetadata({ slug });
  };

  return (
    <div className="space-y-6 p-2 border rounded-sm bg-white">

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={metadata.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={metadata.slug}
          onChange={(e) => updateSlug(e.target.value)}
        />
      </div>

      {metadata.contentType === "post" && (
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            className="w-full border rounded p-2"
            value={metadata.category}
            onChange={(e) =>
              onUpdateMetadata({ category: e.target.value })
            }
          >
            <option value="">Select category</option>
            {metadata.category && !categories.some((c) => c.id === metadata.category) && (
              <option value={metadata.category}>{metadata.category}</option>
            )}
            {categories.map((root) => (
              <CategoryOption key={root.id} node={root} />
            ))}
          </select>
        </div>
      )}

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Featured Image
        </label>

        {metadata.featuredImage ? (
          <div className="relative">
            <img
              src={metadata.featuredImage}
              className="w-full h-40 object-cover rounded"
            />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded shadow"
              onClick={() =>
                onUpdateMetadata({ featuredImage: "" })
              }
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowPicker(true)}
          >
            Select Image
          </button>
        )}

        {showPicker && (
          <MediaPicker
            mediaLibrary={mediaLibrary}
            onSelect={(url) => {
              onUpdateMetadata({ featuredImage: url });
              setShowPicker(false);
            }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>

      {/* Content Type */}
      <div>
        <label className="block text-sm font-medium mb-1">Content Type</label>
        <select
          className="w-full border rounded p-2"
          value={metadata.contentType}
          onChange={(e) =>
            onUpdateMetadata({
              contentType: e.target.value as Metadata["contentType"],
              category: e.target.value === "page" ? "" : metadata.category
            })
          }
        >
          <option value="post">Post</option>
          <option value="page">Page</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          className="w-full border rounded p-2"
          value={metadata.status}
          onChange={(e) =>
            onUpdateMetadata({ status: e.target.value as any })
          }
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
    </div>
  );
};

export default MetadataPanel;
