const normalizeSasToken = (rawSasToken?: string): string => {
  if (!rawSasToken) return "";
  return rawSasToken
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^(VITE_AZURE_BLOB_SAS_TOKEN|VITE_SAS)\s*=\s*/i, "")
    .replace(/^\?/, "");
};

const resolveEditorContext = (): { id: string; contentType: "pages" | "posts" } => {
  const params = new URLSearchParams(window.location.search);
  const pageId = params.get("pageid");
  const postId = params.get("postid");
  const genericId = params.get("id") || params.get("guid");
  const id = pageId || postId || genericId;

  if (!id) {
    throw new Error("Missing page/post ID in URL. Open the editor from SharePoint.");
  }

  return {
    id,
    contentType: pageId ? "pages" : "posts"
  };
};

export const uploadToBlob = async (file: File): Promise<string> => {
  const configuredContainer = (
    import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL ||
    "https://sa365evergreenwebsite.blob.core.windows.net/contentdrafts"
  ).replace(/\/$/, "");
  const rootContainerUrl = configuredContainer.replace(/\/(pages|posts)$/i, "");
  const { id, contentType } = resolveEditorContext();

  const sasToken = normalizeSasToken(
    import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN || import.meta.env.VITE_SAS
  );

  if (!sasToken || !sasToken.includes("sig=")) {
    throw new Error("Missing or invalid SAS token. Check VITE_AZURE_BLOB_SAS_TOKEN.");
  }

  const blobName = `${Date.now()}-${file.name}`;
  const encodedBlobName = encodeURIComponent(blobName);
  const blobUrl = `${rootContainerUrl}/${contentType}/${encodeURIComponent(id)}/${encodedBlobName}`;

  const response = await fetch(`${blobUrl}?${sasToken}`, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-version": "2023-11-03",
      "Content-Type": file.type || "application/octet-stream"
    },
    body: file
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Upload failed (${response.status}): ${details}`);
  }

  return blobUrl;
};
