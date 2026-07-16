import type { Metadata } from "../models/Metadata";

export const publishToBlob = async (
  post: { metadata: Metadata; blocks: any[] },
  id: string
): Promise<string> => {
  const { contentType } = post.metadata;

  const envContainerUrl = import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL;
  const rawSasToken =
    import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN || import.meta.env.VITE_SAS;

  if (!rawSasToken) {
    throw new Error("Missing VITE_AZURE_BLOB_SAS_TOKEN environment variable.");
  }

  const sasToken = rawSasToken.replace(/^\?/, "");
  const defaultUrl =
    contentType === "page"
      ? "https://sa365evergreenwebsite.blob.core.windows.net/content/pages"
      : "https://sa365evergreenwebsite.blob.core.windows.net/content/posts";

  const normalizedContainerUrl = envContainerUrl
    ? envContainerUrl.replace(/\/$/, "")
    : defaultUrl;

  const containerUrl = envContainerUrl
    ? /(\/pages|\/posts)$/.test(normalizedContainerUrl)
      ? normalizedContainerUrl
      : `${normalizedContainerUrl}/${contentType === "page" ? "pages" : "posts"}`
    : defaultUrl;

  const blobPath = `${id}.json`;
  const url = `${containerUrl}/${blobPath}?${sasToken}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post, null, 2)
  });

  if (!response.ok) {
    throw new Error(`Publish failed with status ${response.status}`);
  }

  return `${containerUrl}/${blobPath}`;
};
