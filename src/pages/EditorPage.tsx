import React from "react";
import EditorLayout from "../components/layout/EditorLayout";
import EditorCanvas from "../components/editor/EditorCanvas/EditorCanvas";
import BlockPalette from "../components/editor/BlockPalette";
import useBlocks from "../hooks/useBlocks";
import MetadataPanel, { type Metadata } from "../components/metadata/MetadataPanel";
import { publishToBlob } from "../services/publishToBlob";

const EditorPage: React.FC = () => {
  //
  // BLOCK STATE
  //
  const {
    blocks,
    addBlock,
    updateBlock,
    moveBlock,
    deleteBlock
  } = useBlocks();

  //
  // METADATA STATE (placeholder)
  //
  const [metadata, setMetadata] = React.useState<Metadata>({
    title: "",
    slug: "",
    category: "",
    featuredImage: "",
    status: "draft"
  });
  const [isPublishing, setIsPublishing] = React.useState(false);

  const updateMetadata = (updated: Partial<Metadata>) => {
    setMetadata((prev) => ({ ...prev, ...updated }));
  };

// DOWNLOAD JSON  

  const downloadJSON = () => {
    const payload = { metadata, blocks };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metadata.slug || "content"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

// PUBLISH TO BLOB STORAGE  

  const handlePublish = async () => {
    const post = {
      metadata,
      blocks
    };

    try {
      setIsPublishing(true);

      const blobName = metadata.slug || `post-${Date.now()}`;
      const url = await publishToBlob(post, blobName);

      console.log("Published to:", url);
      alert(`Published successfully:\n${url}`);
    } catch (err) {
      console.error(err);
      alert("Failed to publish. Check console for details.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <EditorLayout
      headerContent={
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">Editor</div>
          <button
            onClick={downloadJSON}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Export JSON
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isPublishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      }

      leftSidebar={<BlockPalette onAddBlock={addBlock} />}
      rightSidebar={
        <MetadataPanel
          metadata={metadata}
          onUpdateMetadata={updateMetadata}
          mediaLibrary={[]}
        />
      }
    >
      <EditorCanvas
        blocks={blocks}
        onAddBlock={addBlock}
        onUpdateBlock={updateBlock}
        onMoveBlock={moveBlock}
        onDeleteBlock={deleteBlock}
      />
    </EditorLayout>


  );

};

export default EditorPage;

