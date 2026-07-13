import React from "react";

export interface Metadata {
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  type: string;
  status: string;
}

export interface MetadataPanelProps {
  metadata: Metadata;
  setMetadata: (meta: Metadata) => void;
  onPublish: () => void;
}

const MetadataPanel: React.FC<MetadataPanelProps> = ({
  metadata,
  setMetadata,
  onPublish
}) => {
  const update = (field: keyof Metadata, value: string) => {
    setMetadata({ ...metadata, [field]: value });
  };

  return (
    <div className="space-y-6">

      {/* Metadata Fields */}
      <div className="p-4 bg-white border rounded-lg">
        <h2 className="text-lg text-black font-semibold mb-4">Metadata</h2>

        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Title"
          value={metadata.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Slug"
          value={metadata.slug}
          onChange={(e) => update("slug", e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Category"
          value={metadata.category}
          onChange={(e) => update("category", e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Featured Image URL"
          value={metadata.featuredImage}
          onChange={(e) => update("featuredImage", e.target.value)}
        />

        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          placeholder="Type"
          value={metadata.type}
          onChange={(e) => update("type", e.target.value)}
        />

        <select
          className="w-full border rounded px-2 py-1"
          value={metadata.status}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Publish Button */}
      <div className="p-4 bg-white border rounded-lg">
        <button
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={onPublish}
        >
          Publish
        </button>
      </div>

    </div>
  );
};

export default MetadataPanel;
