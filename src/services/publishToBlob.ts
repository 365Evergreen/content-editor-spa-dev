import type { Metadata } from "../models/Metadata";

type PublishMetadata = Omit<Metadata, "category"> & {
  category?: string;
};

const normalizeSasToken = (rawSasToken?: string): string => {
  if (!rawSasToken) return "";
  return rawSasToken
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/^(VITE_AZURE_BLOB_SAS_TOKEN|VITE_SAS)\s*=\s*/i, "")
    .replace(/^\?/, "");
};

const formatBlobError = (status: number, details: string, targetUrl: string): string => {
  if (status === 403 && /AuthenticationFailed|Signature did not match/i.test(details)) {
    return [
      "Publish failed (403): SAS token signature mismatch.",
      `Target URL: ${targetUrl}`,
      "Generate a new SAS token for the contentdrafts container and update VITE_AZURE_BLOB_SAS_TOKEN."
    ].join(" ");
  }

  return `Publish failed (${status}): ${details}`;
};

export const publishToBlob = async (
  post: { metadata: PublishMetadata; blocks: any[] },
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

  const fileName = contentType === "page" ? "page.json" : "post.json";
  const blobPath = `${encodeURIComponent(id)}/${fileName}`;
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
    throw new Error(formatBlobError(response.status, details, blobUrl));
  }

  return blobUrl;
};
