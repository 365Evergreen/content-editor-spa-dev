import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import EditorLayout from "../components/layout/EditorLayout";
import EditorCanvas from "../components/editor/EditorCanvas/EditorCanvas";
import BlockPalette from "../components/editor/BlockPalette";
import useBlocks from "../hooks/useBlocks";
import { publishToBlob } from "../services/publishToBlob";
import type { Metadata } from "./../models/Metadata";
import MetadataPanel from "../components/metadata/MetadataPanel";

const EditorPage: React.FC = () => {
  //
  // BLOCK STATE
  //
  const {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    moveBlock,
    deleteBlock
  } = useBlocks();

  const location = useLocation();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  //
  // METADATA STATE (placeholder)
  //
  const [metadata, setMetadata] = React.useState<Metadata>({
    id: "",
    title: "",
    slug: "",
    category: "",
    featuredImage: "",
    status: "draft",
    contentType: "post"
  });

  const updateMetadata = (updated: Partial<Metadata>) => {
    setMetadata((prev) => ({ ...prev, ...updated }));
  };

  const contentRootUrl =
    import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL ||
    "https://sa365evergreenwebsite.blob.core.windows.net/content";

  const normalizeMetadata = (
    loadedMetadata: any,
    contentType: Metadata["contentType"]
  ): Metadata => {
    const featuredImage =
      typeof loadedMetadata.featuredImage === "string"
        ? loadedMetadata.featuredImage
        : typeof loadedMetadata.thumbnail === "string"
        ? loadedMetadata.thumbnail
        : loadedMetadata.featuredImage?.url || "";

    return {
      id:
        loadedMetadata.id ||
        loadedMetadata.pageId ||
        loadedMetadata.guid ||
        loadedMetadata.page_id ||
        loadedMetadata.postId ||
        "",
      title: loadedMetadata.title ?? "",
      slug: loadedMetadata.slug ?? loadedMetadata.path ?? "",
      category:
        loadedMetadata.category ||
        loadedMetadata.tags?.[0] ||
        loadedMetadata.categories?.[0] ||
        "",
      featuredImage,
      status: loadedMetadata.status ?? loadedMetadata.state ?? "draft",
      contentType
    };
  };

  const loadItemById = async (id: string) => {
    try {
      setErrorMessage("");
      console.debug("loadItemById", { id, contentRootUrl });

      const tryFetch = async (path: string) => {
        console.debug("trying content fetch", path);
        const res = await fetch(path);
        return res.ok ? res : null;
      };

      const pagePath = `${contentRootUrl}/pages/${id}/post.json`;
      const postPath = `${contentRootUrl}/posts/${id}/post.json`;

      let response = await tryFetch(postPath);
      let contentType: Metadata["contentType"] = "post";
      let attemptedPaths = [postPath];

      if (!response) {
        response = await tryFetch(pagePath);
        attemptedPaths.push(pagePath);
        if (response) contentType = "page";
      }

      if (!response) {
        setErrorMessage(
          "Unable to load the selected post/page. Please open the app from the SharePoint list again."
        );
        console.warn("Could not load content for id:", id, { attemptedPaths });
        return;
      }

      const data = await response.json();
      const loadedMetadata = data.metadata ?? data;

      setMetadata(normalizeMetadata(loadedMetadata, contentType));
      setBlocks(data.blocks ?? []);
      console.debug("loaded content", { id, contentType, loadedMetadata });
    } catch (error) {
      console.error("Error loading content by ID", error);
      setErrorMessage("Error loading content by ID. Check the console for details.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id =
      params.get("id") ||
      params.get("postid") ||
      params.get("pageid") ||
      params.get("guid");

    console.debug("EditorPage mounted", { search: location.search, id });

    if (id) {
      loadItemById(id);
    } else {
      setErrorMessage(
        "No post or page ID was provided. Open the app from the selected item in SharePoint."
      );
    }
  }, [location.search]);

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

      const blobName =
        metadata.id || metadata.slug || `post-${Date.now()}`;
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
      {errorMessage ? (
        <div className="p-8 bg-white rounded shadow mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to open editor</h2>
          <p className="text-sm text-gray-700 mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500">
            Please open the app from the selected post or page in the SharePoint list.
          </p>
        </div>
      ) : (
        <EditorCanvas
          blocks={blocks}
          onAddBlock={addBlock}
          onUpdateBlock={updateBlock}
          onMoveBlock={moveBlock}
          onDeleteBlock={deleteBlock}
        />
      )}
    </EditorLayout>


  );

};

export default EditorPage;

