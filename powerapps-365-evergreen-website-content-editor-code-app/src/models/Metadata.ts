export interface Metadata {
  id: string;                     // Unique ID from SharePoint workflow
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  status: "draft" | "published";
  contentType: "post" | "page";   // NEW: determines blob container
}
