// uploadBlob.ts
export const uploadToBlob = async (file: File): Promise<string> => {
  const containerUrl =
    import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL ||
    "https://cdn.365evergreen.com/content/posts";
  const rawSasToken =
    import.meta.env.VITE_AZURE_BLOB_SAS_TOKEN ||
    "VITE_AZURE_BLOB_SAS_TOKEN=?sv=2025-07-05&spr=https&st=2026-07-16T06%3A42%3A59Z&se=2027-07-16T06%3A42%3A00Z&sr=c&sp=racwltf&sig=UvSanJ9FTP5KJF1XvKA50suaHNvZcKn9dy8oBMC46Ak%3D";
  const sasToken = rawSasToken.replace(/^\?/, "");
  const blobName = `${Date.now()}-${file.name}`;

  const url = `${containerUrl}/${blobName}?${sasToken}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob"
    },
    body: file
  });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }

  return `${containerUrl}/${blobName}`;
};
