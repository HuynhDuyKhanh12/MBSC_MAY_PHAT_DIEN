export type CouponItem = {
  id: number;
  realId: number;
  image: string;
  code: string;
  discount: number;
  couponStatus: "active" | "inactive";
  status: boolean; // true = hiển thị, false = ẩn
  deleted: boolean;
};

const STORAGE_KEY = "admin_coupons_v2";

const defaultCoupons: CouponItem[] = [
  {
    id: 1,
    realId: 1,
    image:
      "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?q=80&w=300&auto=format&fit=crop",
    code: "SALE10",
    discount: 10,
    couponStatus: "active",
    status: true,
    deleted: false,
  },
  {
    id: 2,
    realId: 2,
    image:
      "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=300&auto=format&fit=crop",
    code: "NEW20",
    discount: 20,
    couponStatus: "inactive",
    status: true,
    deleted: false,
  },
];

function normalizeCoupons(data: any): CouponItem[] {
  if (!Array.isArray(data)) return defaultCoupons;

  return data.map((item, index) => ({
    id: Number(item.id ?? index + 1),
    realId: Number(item.realId ?? item.id ?? index + 1),
    image: item.image ?? "",
    code: item.code ?? "",
    discount: Number(item.discount ?? 0),
    couponStatus: item.couponStatus === "inactive" ? "inactive" : "active",
    status: Boolean(item.status ?? true),
    deleted: Boolean(item.deleted ?? false),
  }));
}

export function getCoupons(): CouponItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCoupons));
      return defaultCoupons;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeCoupons(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCoupons));
    return defaultCoupons;
  }
}

export function saveCoupons(coupons: CouponItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coupons));
}

export function getCouponById(id: number) {
  return getCoupons().find((item) => item.id === id || item.realId === id);
}

export function addCoupon(coupon: Omit<CouponItem, "id" | "realId">) {
  const coupons = getCoupons();

  const nextId = coupons.length
    ? Math.max(...coupons.map((item) => item.id)) + 1
    : 1;

  const nextRealId = coupons.length
    ? Math.max(...coupons.map((item) => item.realId)) + 1
    : 1;

  const newCoupon: CouponItem = {
    ...coupon,
    id: nextId,
    realId: nextRealId,
  };

  saveCoupons([newCoupon, ...coupons]);
}

export function updateCoupon(id: number, data: Partial<CouponItem>) {
  const coupons = getCoupons().map((item) =>
    item.id === id || item.realId === id ? { ...item, ...data } : item
  );
  saveCoupons(coupons);
}

export function toggleCouponStatus(id: number) {
  const coupons = getCoupons().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, status: !item.status }
      : item
  );
  saveCoupons(coupons);
}

export function softDeleteCoupon(id: number) {
  const coupons = getCoupons().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: true }
      : item
  );
  saveCoupons(coupons);
}

export function restoreCoupon(id: number) {
  const coupons = getCoupons().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: false }
      : item
  );
  saveCoupons(coupons);
}