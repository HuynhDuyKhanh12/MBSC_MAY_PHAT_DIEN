export type WishlistItem = {
  id: number;
  userId: number;
  productId: number;
  realId: number;
  status: boolean;
  deleted: boolean;
};

const STORAGE_KEY = "admin_wishlists";

const defaultWishlists: WishlistItem[] = [
  {
    id: 1,
    userId: 1,
    productId: 2,
    realId: 1,
    status: true,
    deleted: false,
  },
  {
    id: 2,
    userId: 2,
    productId: 5,
    realId: 2,
    status: true,
    deleted: false,
  },
];

function normalizeWishlists(data: any): WishlistItem[] {
  if (!Array.isArray(data)) return defaultWishlists;

  return data.map((item, index) => ({
    id: Number(item.id ?? index + 1),
    userId: Number(item.userId ?? 0),
    productId: Number(item.productId ?? 0),
    realId: Number(item.realId ?? item.id ?? index + 1),
    status: item.status ?? true,
    deleted: item.deleted ?? false,
  }));
}

export function getWishlists(): WishlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishlists));
      return defaultWishlists;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeWishlists(parsed);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultWishlists));
    return defaultWishlists;
  }
}

export function saveWishlists(wishlists: WishlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
}

export function getWishlistById(id: number) {
  const wishlists = getWishlists();
  return wishlists.find((item) => item.id === id || item.realId === id);
}

export function addWishlist(
  wishlist: Omit<WishlistItem, "id" | "realId">
) {
  const wishlists = getWishlists();

  const nextId = wishlists.length
    ? Math.max(...wishlists.map((item) => item.id)) + 1
    : 1;

  const nextRealId = wishlists.length
    ? Math.max(...wishlists.map((item) => item.realId)) + 1
    : 1;

  const newWishlist: WishlistItem = {
    ...wishlist,
    id: nextId,
    realId: nextRealId,
  };

  saveWishlists([newWishlist, ...wishlists]);
}

export function updateWishlist(id: number, data: Partial<WishlistItem>) {
  const wishlists = getWishlists().map((item) =>
    item.id === id || item.realId === id ? { ...item, ...data } : item
  );

  saveWishlists(wishlists);
}

export function toggleWishlistStatus(id: number) {
  const wishlists = getWishlists().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, status: !item.status }
      : item
  );

  saveWishlists(wishlists);
}

export function softDeleteWishlist(id: number) {
  const wishlists = getWishlists().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: true }
      : item
  );

  saveWishlists(wishlists);
}

export function restoreWishlist(id: number) {
  const wishlists = getWishlists().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: false }
      : item
  );

  saveWishlists(wishlists);
}

export function deleteWishlistForever(id: number) {
  const list = getWishlists().filter((item) => item.id !== id);
  saveWishlists(list);
}

export function clearWishlistTrash() {
  const list = getWishlists().filter((item) => !item.deleted);
  saveWishlists(list);
}