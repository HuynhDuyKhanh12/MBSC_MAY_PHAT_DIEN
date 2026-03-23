export type CategoryItem = {
  id: number;
  image: string;
  name: string;
  slug: string;
  description: string;
  realId: number;
  status: boolean;
  deleted?: boolean;
};

const STORAGE_KEY = "admin_categories";

const defaultCategories: CategoryItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=300&auto=format&fit=crop",
    name: "Khai vị",
    slug: "khai-vi",
    description: "Món ăn của khai vị",
    realId: 1,
    status: true,
    deleted: false,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop",
    name: "Món chính",
    slug: "mon-chinh",
    description: "Các món chính trong thực đơn",
    realId: 2,
    status: true,
    deleted: false,
  },
];

export function getCategories(): CategoryItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  return JSON.parse(raw);
}

export function saveCategories(categories: CategoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
}

export function getCategoryById(id: number) {
  return getCategories().find((item) => item.id === id);
}

export function addCategory(
  category: Omit<CategoryItem, "id" | "realId">
) {
  const categories = getCategories();
  const nextId = categories.length
    ? Math.max(...categories.map((item) => item.id)) + 1
    : 1;

  const nextRealId = categories.length
    ? Math.max(...categories.map((item) => item.realId)) + 1
    : 1;

  const newCategory: CategoryItem = {
    ...category,
    id: nextId,
    realId: nextRealId,
  };

  saveCategories([newCategory, ...categories]);
}

export function updateCategory(id: number, data: Partial<CategoryItem>) {
  const categories = getCategories().map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveCategories(categories);
}

export function toggleCategoryStatus(id: number) {
  const categories = getCategories().map((item) =>
    item.id === id ? { ...item, status: !item.status } : item
  );
  saveCategories(categories);
}

export function softDeleteCategory(id: number) {
  const categories = getCategories().map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );
  saveCategories(categories);
}

export function restoreCategory(id: number) {
  const categories = getCategories().map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );
  saveCategories(categories);
}

export function deleteCategoryForever(id: number) {
  const categories = getCategories().filter((item) => item.id !== id);
  saveCategories(categories);
}

export function clearCategoryTrash() {
  const categories = getCategories().filter((item) => !item.deleted);
  saveCategories(categories);
}