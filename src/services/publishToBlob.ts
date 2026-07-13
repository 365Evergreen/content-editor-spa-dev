export const publishToBlob = async (
  post: any,
  slug: string
): Promise<string> => {
  const containerUrl =
    import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL ||
    "https://sa365evergreenwebsite.blob.core.windows.net/content/posts";
  const sasToken = import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN;

  if (!sasToken) {
    throw new Error("Missing VITE_AZURE_BLOB_SAS_TOKEN environment variable.");
  }

  const blobPath = `${slug}/post.json`;
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
