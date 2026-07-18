import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EditorProvider } from "../context/EditorContext";
import { SidebarWrapper } from "../components/editor/sidebar/SidebarWrapper";
import EditorLayout from "../components/layout/EditorLayout";
import EditorCanvas from "../components/editor/EditorCanvas/EditorCanvas";
import BlockPalette from "../components/editor/BlockPalette";
import useBlocks from "../hooks/useBlocks";
import { publishToBlob } from "../services/publishToBlob";
import type { Metadata } from "./../models/Metadata";
import MetadataPanel from "../components/metadata/MetadataPanel";

const parseJsonContent = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { metadata: {}, blocks: [] };
  }

  try {
    const parsed = JSON.parse(trimmed);

    if (parsed && typeof parsed === "object") {
      return {
        metadata: parsed.metadata ?? parsed,
        blocks: Array.isArray(parsed.blocks) ? parsed.blocks : []
      };
    }
  } catch (error) {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    const candidate = trimmed.slice(start >= 0 ? start : 0, end >= 0 ? end : trimmed.length).trim();

    if (!candidate) {
      return { metadata: {}, blocks: [] };
    }

    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === "object") {
        return {
          metadata: parsed.metadata ?? parsed,
          blocks: Array.isArray(parsed.blocks) ? parsed.blocks : []
        };
      }
    } catch {
      // Fall back to a best-effort metadata object for malformed content.
    }
  }

  return { metadata: {}, blocks: [] };
};

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
  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const approvalFlowUrl = import.meta.env.VITE_APPROVAL_FLOW_URL || "";

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

  const buildSerializableMetadata = (value: Metadata) => {
    if (value.contentType === "page") {
      const { category: _category, ...rest } = value;
      return rest;
    }
    return value;
  };

  const contentRootUrl =
    import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL ||
    "https://cdn.365evergreen.com/contentdrafts/contentdrafts";
  const normalizedContentRootUrl = contentRootUrl
    .replace(/\/$/, "")
    .replace(/\/(pages|posts)$/i, "");

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
        contentType === "post"
          ? loadedMetadata.category ||
          loadedMetadata.tags?.[0] ||
          loadedMetadata.categories?.[0] ||
          ""
          : "",
      featuredImage,
      status: loadedMetadata.status ?? loadedMetadata.state ?? "draft",
      contentType
    };
  };

  const loadItemById = async (id: string, requestedType?: Metadata["contentType"]) => {
    try {
      setErrorMessage("");
      console.debug("loadItemById", { id, contentRootUrl: normalizedContentRootUrl, requestedType });

      const tryFetch = async (path: string) => {
        console.debug("trying content fetch", path);
        const res = await fetch(path);
        return res.ok ? res : null;
      };

      const postPostPath = `${normalizedContentRootUrl}/posts/${id}/post.json`;
      const pagePagePath = `${normalizedContentRootUrl}/pages/${id}/page.json`;
      const pagePostPath = `${normalizedContentRootUrl}/pages/${id}/post.json`;

      const candidates =
        requestedType === "page"
          ? [
            { path: pagePagePath, contentType: "page" as const },
            { path: pagePostPath, contentType: "page" as const },
            { path: postPostPath, contentType: "post" as const }
          ]
          : requestedType === "post"
            ? [
              { path: postPostPath, contentType: "post" as const },
              { path: pagePagePath, contentType: "page" as const },
              { path: pagePostPath, contentType: "page" as const }
            ]
            : [
              { path: postPostPath, contentType: "post" as const },
              { path: pagePagePath, contentType: "page" as const },
              { path: pagePostPath, contentType: "page" as const }
            ];

      let response: Response | null = null;
      let contentType: Metadata["contentType"] = requestedType ?? "post";
      const attemptedPaths: string[] = [];

      for (const candidate of candidates) {
        attemptedPaths.push(candidate.path);
        response = await tryFetch(candidate.path);
        if (response) {
          contentType = candidate.contentType;
          break;
        }
      }

      if (!response) {
        setErrorMessage(
          "Unable to load the selected post/page. Please open the app from the SharePoint list again."
        );
        console.warn("Could not load content for id:", id, { attemptedPaths });
        return;
      }

      const text = await response.text();
      const parsedContent = parseJsonContent(text);
      const loadedMetadata = parsedContent.metadata ?? {};

      if (!Object.keys(loadedMetadata).length && !parsedContent.blocks.length) {
        console.warn("Loaded content was empty or malformed", { path: response.url, text });
        setErrorMessage("The stored content could not be parsed. Please review the JSON in the blob container.");
        return;
      }

      setMetadata(normalizeMetadata(loadedMetadata, contentType));
      setBlocks(parsedContent.blocks);
      console.debug("loaded content", { id, contentType, loadedMetadata });
    } catch (error) {
      console.error("Error loading content by ID", error);
      setErrorMessage("Error loading content by ID. Check the console for details.");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageId = params.get("pageid");
    const postId = params.get("postid");
    const id =
      params.get("id") ||
      postId ||
      pageId ||
      params.get("guid");
    const requestedType: Metadata["contentType"] | undefined = pageId
      ? "page"
      : postId
        ? "post"
        : undefined;

    console.debug("EditorPage mounted", { search: location.search, id, requestedType });

    if (id) {
      loadItemById(id, requestedType);
    } else {
      setErrorMessage(
        "No post or page ID was provided. Open the app from the selected item in SharePoint."
      );
    }
  }, [location.search]);

  // DOWNLOAD JSON  

  const downloadJSON = () => {
    const payload = { metadata: buildSerializableMetadata(metadata), blocks };
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

  const getFlowUrl = (): string => {
    const trimmed = approvalFlowUrl.trim();
    const httpsIndex = trimmed.indexOf("https://");
    const normalized = httpsIndex >= 0 ? trimmed.slice(httpsIndex) : trimmed;
    return normalized;
  };

  const triggerApprovalFlow = async (
    action: "save_draft" | "submit_for_approval",
    blobUrl: string
  ) => {
    const flowUrl = getFlowUrl();
    if (!flowUrl) {
      throw new Error("Missing VITE_APPROVAL_FLOW_URL environment variable.");
    }

    const serializableMetadata = buildSerializableMetadata(metadata);
    const flowPayload = {
      // Keep these top-level fields for Power Automate trigger schema compatibility.
      content: {
        metadata: serializableMetadata,
        blocks
      }, 
      title: metadata.title,
      slug: metadata.slug,
      blocks,
      action,
      itemId: metadata.id || metadata.slug,
      contentType: metadata.contentType,
      //category: metadata.contentType === "post" ? metadata.category : undefined,
      featuredImage: metadata.featuredImage,
      status: metadata.status,
      blobUrl,
      metadata: serializableMetadata,
      submittedAt: new Date().toISOString()
    };

    const response = await fetch(flowUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(flowPayload)
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Flow trigger failed (${response.status}): ${details}`);
    }
  };

  const validateSubmitForApproval = (): string[] => {
    const issues: string[] = [];
    if (!metadata.id?.trim()) issues.push("ID");
    if (!metadata.title?.trim()) issues.push("Title");
    if (!metadata.slug?.trim()) issues.push("Slug");
    if (metadata.contentType === "post" && !metadata.category?.trim()) issues.push("Category");
    if (!metadata.featuredImage?.trim()) issues.push("Featured Image");
    if (!blocks.length) issues.push("At least one content block");
    return issues;
  };

  const persistDraftAndTriggerFlow = async (
    action: "save_draft" | "submit_for_approval"
  ) => {
    const post = {
      metadata: buildSerializableMetadata(metadata),
      blocks
    };

    try {
      if (action === "save_draft") {
        setIsSaving(true);
      } else {
        const issues = validateSubmitForApproval();
        if (issues.length) {
          alert(`Submit for approval blocked. Missing:\n- ${issues.join("\n- ")}`);
          return;
        }
        setIsPublishing(true);
      }

      const blobName =
        metadata.id || metadata.slug || `post-${Date.now()}`;
      const blobUrl = await publishToBlob(post, blobName);
      await triggerApprovalFlow(action, blobUrl);

      const successMessage =
        action === "save_draft"
          ? `Draft saved and workflow notified:\n${blobUrl}`
          : `Submitted for approval. Workflow notified:\n${blobUrl}`;
      alert(successMessage);
    } catch (err) {
      console.error(err);
      alert("Failed to save and notify workflow. Check console for details.");
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  // SAVE DRAFT TO BLOB STORAGE + FLOW TRIGGER
  const handleSaveDraft = async () => {
    await persistDraftAndTriggerFlow("save_draft");
  };

  // SUBMIT FOR APPROVAL TO FLOW
  const handlePublish = async () => {
    await persistDraftAndTriggerFlow("submit_for_approval");
  };

  return (
    <EditorProvider>
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
            onClick={handleSaveDraft}
            disabled={isSaving || isPublishing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isSaving ? "Saving..." : "Save draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isPublishing ? "Sending..." : "Send for approval"}
          </button>
        </div>
      }

      leftSidebar={<BlockPalette onAddBlock={addBlock} />}
      rightSidebar={
        <SidebarWrapper blocks={blocks} onUpdateBlock={updateBlock}>
          <MetadataPanel
            metadata={metadata}
            onUpdateMetadata={updateMetadata}
            mediaLibrary={[]}
          />
        </SidebarWrapper>
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
  </EditorProvider>


  );

};

export default EditorPage;
