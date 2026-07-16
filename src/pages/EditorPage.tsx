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
    "https://cdn.365evergreen.com/content";

  const fetchIndex = async (path: string) => {
    const response = await fetch(path);
    if (!response.ok) return null;
    return response.json();
  };

  const findItemById = (items: any[] = [], id: string) =>
    items.find(
      (item) =>
        item?.id === id ||
        item?.pageId === id ||
        item?.slug === id ||
        item?.guid === id
    );

  const normalizeMetadata = (
    loadedMetadata: any,
    contentType: Metadata["contentType"]
  ): Metadata => {
    const featuredImage =
      typeof loadedMetadata.featuredImage === "string"
        ? loadedMetadata.featuredImage
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
      category: loadedMetadata.category ?? loadedMetadata.tags?.[0] ?? "",
      featuredImage,
      status: loadedMetadata.status ?? "draft",
      contentType
    };
  };

  const loadItemById = async (id: string) => {
    try {
      setErrorMessage("");
      const [pagesIndex, postsIndex] = await Promise.all([
        fetchIndex(`${contentRootUrl}/pages/index.json`),
        fetchIndex(`${contentRootUrl}/posts/index.json`)
      ]);

      let contentType: Metadata["contentType"] | undefined;
      let indexEntry: any;

      if (pagesIndex) {
        indexEntry = findItemById(pagesIndex, id);
        if (indexEntry) contentType = "page";
      }

      if (!contentType && postsIndex) {
        indexEntry = findItemById(postsIndex, id);
        if (indexEntry) contentType = "post";
      }

      const choosePath = (type: Metadata["contentType"]) =>
        `${contentRootUrl}/${type}s/${id}.json`;

      let response: Response | null = null;

      if (contentType) {
        response = await fetch(choosePath(contentType));
      } else {
        response = await fetch(`${contentRootUrl}/pages/${id}.json`);
        if (!response.ok) {
          response = await fetch(`${contentRootUrl}/posts/${id}.json`);
          if (response.ok) contentType = "post";
        } else {
          contentType = "page";
        }
      }

      if (!response || !response.ok) {
        setErrorMessage(
          "Unable to load the selected post/page. Please open the app from the SharePoint list again."
        );
        console.warn("Could not load content for id:", id);
        return;
      }

      const data = await response.json();
      const loadedMetadata = data.metadata ?? data;

      setMetadata(normalizeMetadata(loadedMetadata, contentType ?? "post"));
      setBlocks(data.blocks ?? []);
    } catch (error) {
      console.error("Error loading content by ID", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id =
      params.get("id") ||
      params.get("postid") ||
      params.get("pageid") ||
      params.get("guid");

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

