# **README.md**

# Headless CMS Authoring Platform  
A lightweight, block‑based content authoring environment built with **React + TypeScript**, **Tailwind.css**, **Azure Static Web Apps**, **SharePoint metadata**, and **Power Automate publishing workflows**.

This project provides a modern, decoupled alternative to traditional CMS platforms by separating **authoring**, **metadata**, **storage**, and **indexing** into clean, independent layers.

---

## **Features**
- Block‑based editor (paragraph, heading, image; extensible)
- Clean, platform‑agnostic UI using Tailwind.css
- React + TypeScript SPA hosted on Azure Static Web Apps
- SharePoint lists as metadata registry (title, slug, category, type, status)
- JSON‑based content storage in Azure Blob Storage
- Power Automate publishing pipeline (HTTP trigger → Blob → SharePoint → index regeneration)
- HTML + JSON preview modes
- Extensible architecture for new block types, AI‑assisted authoring, and custom workflows

---

## **Architecture Overview**

### **Authoring Layer (SPA)**
- React + TypeScript
- Tailwind.css
- Modular block components
- Metadata panel
- Preview pane
- Publish button (POST JSON → Power Automate)

### **Metadata Layer (SharePoint)**
- Posts list (GUID, Title, Slug, Category, Type, Status, JsonFilePath)
- Categories list
- PostTypes list
- Navigation list
- SharePoint acts as the authoritative metadata source

### **Publishing Layer (Power Automate)**
- HTTP trigger receives JSON payload
- Writes JSON file to Azure Blob Storage
- Updates SharePoint metadata
- Triggers index regeneration (Azure Function or Logic App)
- Returns success response to SPA

### **Storage Layer (Azure Blob Storage)**
```
posts/<category>/<slug>/<guid>.json
indexes/posts/all.json
indexes/posts/byCategory/<category>.json
indexes/posts/byType/<type>.json
indexes/recent/recent.json
```

### **Indexing Layer**
- Azure Function rebuilds indexes deterministically
- Outputs static JSON indexes consumed by frontend sites

---

## **Tech Stack**
- **React 18**
- **TypeScript**
- **Tailwind.css**
- **pnpm** (preferred package manager)
- **Azure Static Web Apps**
- **Azure Blob Storage**
- **Power Automate**
- **SharePoint Online (metadata only)**

---

## **Getting Started**

### **Prerequisites**
- Node.js 18+
- pnpm 9+
- Azure Static Web Apps CLI (optional)
- Access to SharePoint lists (Posts, Categories, PostTypes)

---

## **Installation**

```bash
pnpm install
```

---

## **Local Development**

```bash
pnpm dev
```

This runs the SPA locally using Vite.

---

## **Build**

```bash
pnpm build
```

Outputs production assets to `/dist`.

---

## **Deploying to Azure Static Web Apps**

1. Create a Static Web App in Azure  
2. Configure build output folder (`dist`)  
3. Deploy via GitHub Actions or Azure DevOps pipeline  
4. Configure environment variables (if required)  
5. Ensure Power Automate endpoint is accessible from SWA

---

## **SharePoint editor launch link**

If editors should open a specific post or page from SharePoint, use the app URL with the item `id` query string:

```text
https://kind-beach-0c3865800.7.azurestaticapps.net?postid=00027
```

- The app will load the matching item from `content/pages/index.json` or `content/posts/index.json`
- Use the same ID stored in SharePoint metadata for pages/posts

---

## **Project Structure**

```
src/
  components/
    editor/
      EditorCanvas/
      blocks/
    metadata/
    preview/
  hooks/
  services/
  utils/
  pages/
public/
dist/
```

---

## **Content Model**

### **Metadata**
```json
{
  "guid": "guid-123",
  "title": "My First Post",
  "slug": "my-first-post",
  "category": "tutorials",
  "featuredImage": "/assets/images/thumb.webp",
  "type": "article",
  "publishedAt": "2026-07-13T10:00:00Z",
  "updatedAt": "2026-07-13T10:00:00Z",
  "status": "published"
}
```

### **Blocks**
```json
[
  { "id": "1", "type": "heading", "level": 1, "text": "Welcome" },
  { "id": "2", "type": "paragraph", "text": "This is the introduction." },
  { "id": "3", "type": "image", "src": "/img/example.webp", "alt": "Example" }
]
```

---

## **Publishing Workflow**

1. SPA sends JSON payload to Power Automate  
2. Flow validates payload  
3. Flow writes JSON to Blob Storage  
4. Flow updates SharePoint metadata  
5. Flow triggers index regeneration  
6. SPA receives success response  

---

## **Index Regeneration**

Indexes are rebuilt by an Azure Function that:

- Reads all JSON files  
- Extracts metadata  
- Generates category, type, recent, and global indexes  
- Writes index files back to Blob Storage  

---

## **Contributing**

### **Branching Strategy**
- `main` — production  
- `dev` — active development  
- Feature branches: `feature/<name>`

### **Coding Standards**
- TypeScript everywhere  
- Tailwind for styling  
- One block type per file  
- No SharePoint UI dependencies  
- No MSAL or Graph calls from SPA

### **Commit Messages**
Use conventional commits:
```
feat: add image block
fix: correct slug generation
chore: update dependencies
```

---

## **Roadmap**
- Additional block types (quote, list, code, embed)
- AI‑assisted authoring
- Version history for JSON files
- Multi‑environment publishing (dev/stage/prod)
- Media upload workflow
- Full static site generator integration (Astro/Next.js)

---