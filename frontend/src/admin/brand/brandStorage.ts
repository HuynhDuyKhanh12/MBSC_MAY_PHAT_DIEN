export type BrandItem = {
  id: number;
  image: string;
  name: string;
  slug: string;
  description: string;
  realId: number;
  status: boolean;
  deleted?: boolean;
};

const STORAGE_KEY = "admin_brands";

const defaultBrands: BrandItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=300&auto=format&fit=crop",
    name: "Món Ý",
    slug: "mon-y",
    description: "Brand món Ý",
    realId: 1,
    status: true,
    deleted: false,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop",
    name: "Món Việt",
    slug: "mon-viet",
    description: "Brand món Việt",
    realId: 2,
    status: true,
    deleted: false,
  },
];

export function getBrands(): BrandItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBrands));
    return defaultBrands;
  }
  return JSON.parse(raw);
}

export function saveBrands(brands: BrandItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
}

export function getBrandById(id: number) {
  return getBrands().find((item) => item.id === id);
}

export function addBrand(brand: Omit<BrandItem, "id" | "realId">) {
  const brands = getBrands();

  const nextId = brands.length ? Math.max(...brands.map((item) => item.id)) + 1 : 1;
  const nextRealId = brands.length
    ? Math.max(...brands.map((item) => item.realId)) + 1
    : 1;

  const newBrand: BrandItem = {
    ...brand,
    id: nextId,
    realId: nextRealId,
  };

  saveBrands([newBrand, ...brands]);
}

export function updateBrand(id: number, data: Partial<BrandItem>) {
  const brands = getBrands().map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveBrands(brands);
}

export function toggleBrandStatus(id: number) {
  const brands = getBrands().map((item) =>
    item.id === id ? { ...item, status: !item.status } : item
  );
  saveBrands(brands);
}

export function softDeleteBrand(id: number) {
  const brands = getBrands().map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );
  saveBrands(brands);
}

export function restoreBrand(id: number) {
  const brands = getBrands().map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );
  saveBrands(brands);
}

export function deleteBrandForever(id: number) {
  const brands = getBrands().filter((item) => item.id !== id);
  saveBrands(brands);
}

export function clearBrandTrash() {
  const brands = getBrands().filter((item) => !item.deleted);
  saveBrands(brands);
}