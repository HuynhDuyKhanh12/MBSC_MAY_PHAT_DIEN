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

export function getProducts(): ProductItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(raw);
}

export function saveProducts(products: ProductItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function getProductById(id: number) {
  return getProducts().find((item) => item.id === id);
}

export function addProduct(product: Omit<ProductItem, "id" | "realId">) {
  const products = getProducts();
  const nextId = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
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

export function updateProduct(id: number, data: Partial<ProductItem>) {
  const products = getProducts().map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveProducts(products);
}

export function toggleProductStatus(id: number) {
  const products = getProducts().map((item) =>
    item.id === id ? { ...item, status: !item.status } : item
  );
  saveProducts(products);
}

export function softDeleteProduct(id: number) {
  const products = getProducts().map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );
  saveProducts(products);
}

export function restoreProduct(id: number) {
  const products = getProducts().map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );
  saveProducts(products);
}


export function deleteProductForever(id: number) {
  const products = getProducts().filter((item) => item.id !== id);
  saveProducts(products);
}

export function clearProductTrash() {
  const products = getProducts().filter((item) => !item.deleted);
  saveProducts(products);
}