export type ProductItem = {
  id: number;
  image: string;
  name: string;
  category: string;
  brand: string;
  price: string;
  salePrice: string;
  stock: number;
  type: string;
  realId: number;
  status: boolean;
  deleted?: boolean;
  description?: string;
};

const STORAGE_KEY = "admin_products";

const defaultProducts: ProductItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop",
    name: "Test sửa sản phẩm",
    category: "Khai vị",
    brand: "Món Việt",
    price: "78.000 VND",
    salePrice: "46.000 VND",
    stock: 40,
    type: "",
    realId: 51,
    status: true,
    deleted: false,
    description: "Mô tả sản phẩm 1",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
    name: "Salad rau mùa sốt cam",
    category: "Khai vị",
    brand: "Món Việt",
    price: "82.390 VND",
    salePrice: "68.000 VND",
    stock: 76,
    type: "Sản phẩm mới",
    realId: 1,
    status: true,
    deleted: false,
    description: "Mô tả sản phẩm 2",
  },
];

function normalizeProducts(data: any): ProductItem[] {
  if (!Array.isArray(data)) return defaultProducts;

  return data.map((item, index) => ({
    id: Number(item.id ?? index + 1),
    image: item.image ?? "",
    name: item.name ?? "",
    category: item.category ?? "",
    brand: item.brand ?? "",
    price: item.price ?? "0 VND",
    salePrice: item.salePrice ?? "0 VND",
    stock: Number(item.stock ?? 0),
    type: item.type ?? "",
    realId: Number(item.realId ?? index + 1),
    status: item.status ?? true,
    deleted: item.deleted ?? false,
    description: item.description ?? "",
  }));
}

export function getProducts(): ProductItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
      return defaultProducts;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeProducts(parsed);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
}

export function saveProducts(products: ProductItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProductById(realId: number) {
  return getProducts().find((item) => item.realId === realId);
}

export function addProduct(product: Omit<ProductItem, "id" | "realId">) {
  const products = getProducts();

  const nextId = products.length
    ? Math.max(...products.map((p) => p.id)) + 1
    : 1;

  const nextRealId = products.length
    ? Math.max(...products.map((p) => p.realId)) + 1
    : 1;

  const newProduct: ProductItem = {
    ...product,
    id: nextId,
    realId: nextRealId,
  };

  saveProducts([newProduct, ...products]);
}

export function updateProduct(realId: number, data: Partial<ProductItem>) {
  const products = getProducts().map((item) =>
    item.realId === realId ? { ...item, ...data } : item
  );
  saveProducts(products);
}

export function toggleProductStatus(realId: number) {
  const products = getProducts().map((item) =>
    item.realId === realId ? { ...item, status: !item.status } : item
  );
  saveProducts(products);
}

export function softDeleteProduct(realId: number) {
  const products = getProducts().map((item) =>
    item.realId === realId ? { ...item, deleted: true } : item
  );
  saveProducts(products);
}

export function restoreProduct(realId: number) {
  const products = getProducts().map((item) =>
    item.realId === realId ? { ...item, deleted: false } : item
  );
  saveProducts(products);
}

export function deleteProductForever(realId: number) {
  const products = getProducts().filter((item) => item.realId !== realId);
  saveProducts(products);
}

export function clearProductTrash() {
  const products = getProducts().filter((item) => !item.deleted);
  saveProducts(products);
}