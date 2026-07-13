import React from "react";
import EditorLayout from "../components/layout/EditorLayout";
import EditorCanvas from "../components/editor/EditorCanvas/EditorCanvas";
import BlockPalette from "../components/editor/BlockPalette";
import useBlocks from "../hooks/useBlocks";
import MetadataPanel from "../components/metadata/MetadataPAnel";

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
  const [metadata, setMetadata] = React.useState({
    title: "",
    slug: "",
    category: "",
    featuredImage: "",
    type: "",
    status: "draft"
  });

  //
  // PUBLISH HANDLER (placeholder)
  //
  const handlePublish = () => {
    console.log("Publishing…");
    console.log("Metadata:", metadata);
    console.log("Blocks:", blocks);
  };

return (
<EditorLayout
  headerContent={<div className="text-xl font-semibold">Editor</div>}
  leftSidebar={<BlockPalette onAddBlock={addBlock} />}
  rightSidebar={
    <MetadataPanel
      metadata={metadata}
      setMetadata={setMetadata}
      onPublish={handlePublish}
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
