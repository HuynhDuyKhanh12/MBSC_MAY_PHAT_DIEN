export type AddressItem = {
  id: number;
  fullName: string;
  phone: string;
  city: string;
  addressLine: string;
  realId: number;
  status: boolean;
  deleted: boolean;
};

const STORAGE_KEY = "admin_addresses";

const defaultAddresses: AddressItem[] = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    phone: "0909000001",
    city: "HCM",
    addressLine: "12 Nguyễn Trãi",
    realId: 1,
    status: true,
    deleted: false,
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    phone: "0909000002",
    city: "Hà Nội",
    addressLine: "99 Cầu Giấy",
    realId: 2,
    status: true,
    deleted: false,
  },
];

function normalizeAddresses(data: any): AddressItem[] {
  if (!Array.isArray(data)) return defaultAddresses;

  return data.map((item, index) => ({
    id: Number(item.id ?? index + 1),
    fullName: item.fullName ?? "",
    phone: item.phone ?? "",
    city: item.city ?? "",
    addressLine: item.addressLine ?? "",
    realId: Number(item.realId ?? item.id ?? index + 1),
    status: item.status ?? true,
    deleted: item.deleted ?? false,
  }));
}

export function getAddresses(): AddressItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAddresses));
      return defaultAddresses;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeAddresses(parsed);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAddresses));
    return defaultAddresses;
  }
}

export function saveAddresses(addresses: AddressItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function getAddressById(id: number) {
  const addresses = getAddresses();
  return addresses.find((item) => item.id === id || item.realId === id);
}

export function addAddress(address: Omit<AddressItem, "id" | "realId">) {
  const addresses = getAddresses();

  const nextId = addresses.length
    ? Math.max(...addresses.map((item) => item.id)) + 1
    : 1;

  const nextRealId = addresses.length
    ? Math.max(...addresses.map((item) => item.realId)) + 1
    : 1;

  const newAddress: AddressItem = {
    ...address,
    id: nextId,
    realId: nextRealId,
  };

  saveAddresses([newAddress, ...addresses]);
}

export function updateAddress(id: number, data: Partial<AddressItem>) {
  const addresses = getAddresses().map((item) =>
    item.id === id || item.realId === id ? { ...item, ...data } : item
  );

  saveAddresses(addresses);
}

export function toggleAddressStatus(id: number) {
  const addresses = getAddresses().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, status: !item.status }
      : item
  );

  saveAddresses(addresses);
}

export function softDeleteAddress(id: number) {
  const addresses = getAddresses().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: true }
      : item
  );

  saveAddresses(addresses);
}

export function restoreAddress(id: number) {
  const addresses = getAddresses().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: false }
      : item
  );

  saveAddresses(addresses);
}