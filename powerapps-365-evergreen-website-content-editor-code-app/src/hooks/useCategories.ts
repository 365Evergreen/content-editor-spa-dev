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

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryNode[]>([]);

  useEffect(() => {
    fetch(
      "https://cdn.365evergreen.com/contentdrafts/categories/categories.json"
    )
      .then((res) => res.json())
      .then((data) => setCategories(buildTree(data)))
      .catch(() => setCategories([]));
  }, []);

  return categories;
};
