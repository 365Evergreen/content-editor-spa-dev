import { useEffect, useState } from "react";

export interface Category {
  id: string;
  name: string;
  parentId?: string;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}

const buildTree = (flat: Category[]): CategoryNode[] => {
  const map = new Map<string, CategoryNode>();

  flat.forEach((cat) =>
    map.set(cat.id, { ...cat, children: [] })
  );

  const roots: CategoryNode[] = [];

  flat.forEach((cat) => {
    const node = map.get(cat.id)!;

    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      if (parent) parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

const getContainerRootUrl = (): string => {
  const configuredContainerUrl = import.meta.env.VITE_AZURE_BLOB_CONTAINER_URL || "https://sa365evergreenwebsite.blob.core.windows.net/contentdrafts";

  return configuredContainerUrl
    .replace(/\/$/, "")
    .replace(/\/(pages|posts)$/i, "");
};

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);

  useEffect(() => {
    const containerRootUrl = getContainerRootUrl();
    const categoriesUrl = `${containerRootUrl}/categories/categories.json`;

    fetch(categoriesUrl)
      .then((res) => res.json())
      .then((data) => setCategories(buildTree(data)))
      .catch(() => setCategories([]));
  }, []);

  return categories;
};
