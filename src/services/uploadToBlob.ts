// uploadBlob.ts
export const uploadToBlob = async (file: File): Promise<string> => {
  const containerUrl = "https://sa365evergreenwebsite.blob.core.windows.net/posts";
  const sasToken = "?sv=2025-07-05&spr=https&st=2026-07-13T19%3A51%3A54Z&se=2026-07-28T19%3A51%3A00Z&sr=c&sp=racwl&sig=lv7dutoY5Ok4lr718SPz7f61KPqRQ5V5m8StjTHh1tM%3D";
  const blobName = `${Date.now()}-${file.name}`;

  const url = `${containerUrl}/${blobName}?${sasToken}`;

  await fetch(url, {
    method: "PUT",
    headers: {
      "x-ms-blob-type": "BlockBlob"
    },
    body: file
  });

  return `${containerUrl}/${blobName}`;
};
