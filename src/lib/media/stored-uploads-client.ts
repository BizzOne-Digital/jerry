/** Client-side helper to remove a MongoDB-stored upload by its public URL. */
export async function deleteStoredUploadByUrl(url: string): Promise<void> {
  if (!url.startsWith("/api/uploads/")) return;

  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}
