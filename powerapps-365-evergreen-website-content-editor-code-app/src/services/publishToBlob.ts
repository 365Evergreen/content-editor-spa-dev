import type { Metadata } from "../models/Metadata";

const normalizeSasToken = (rawSasToken?: string): string => {
  if (!rawSasToken) return "";
  return rawSasToken
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^(VITE_AZURE_BLOB_SAS_TOKEN|VITE_SAS)\s*=\s*/i, "")
    .replace(/^\?/, "");
};

export const publishToBlob = async (
  post: { metadata: Metadata; blocks: any[] },
  id: string
): Promise<string> => {
  const { contentType } = post.metadata;

  const envContainerUrl = import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL;
  const sasToken = normalizeSasToken(
    import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN || import.meta.env.VITE_SAS
  );

  if (!sasToken || !sasToken.includes("sig=")) {
    throw new Error("Missing or invalid VITE_AZURE_BLOB_SAS_TOKEN environment variable.");
  }

  const defaultUrl =
    contentType === "page"
      ? "https://sa365evergreenwebsite.blob.core.windows.net/contentdrafts/pages"
      : "https://sa365evergreenwebsite.blob.core.windows.net/contentdrafts/posts";

  const normalizedContainerUrl = envContainerUrl
    ? envContainerUrl.replace(/\/$/, "")
    : defaultUrl;

  const containerUrl = envContainerUrl
    ? /(\/pages|\/posts)$/.test(normalizedContainerUrl)
      ? normalizedContainerUrl
      : `${normalizedContainerUrl}/${contentType === "page" ? "pages" : "posts"}`
    : defaultUrl;

  const blobPath = `${encodeURIComponent(id)}/post.json`;
  const blobUrl = `${containerUrl}/${blobPath}`;

  const response = await fetch(`${blobUrl}?${sasToken}`, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob",
      "x-ms-version": "2023-11-03",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(post, null, 2)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Publish failed (${response.status}): ${details}`);
  }

  return blobUrl;
};
