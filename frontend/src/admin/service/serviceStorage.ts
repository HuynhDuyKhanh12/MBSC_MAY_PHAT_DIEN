export type ServiceType = "Bảo quản" | "Sửa chữa" | "Bảo hành";

export type ServiceStatus =
  | "Chờ tiếp nhận"
  | "Đang kiểm tra"
  | "Đang xử lý"
  | "Chờ bàn giao"
  | "Hoàn thành"
  | "Đã hủy";

export type ServiceItem = {
  id: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  productName: string;
  machineModel: string;
  serialNumber: string;
  serviceType: ServiceType;
  issue: string;
  note: string;
  receiveDate: string;
  expectedDate: string;
  technician: string;
  cost: number;
  status: ServiceStatus;
  deleted: boolean;
};

const STORAGE_KEY = "admin_service_items";

const demoData: ServiceItem[] = [
  {
    id: 1001,
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "vana@gmail.com",
    address: "Thủ Dầu Một, Bình Dương",
    productName: "Máy phát điện Honda 5KW",
    machineModel: "Honda HK-5000",
    serialNumber: "HD5000-001",
    serviceType: "Sửa chữa",
    issue: "Máy khó nổ, điện ra chập chờn",
    note: "Ưu tiên xử lý sớm",
    receiveDate: "2026-03-25",
    expectedDate: "2026-03-28",
    technician: "KTV Minh",
    cost: 1200000,
    status: "Đang xử lý",
    deleted: false,
  },
  {
    id: 1002,
    customerName: "Trần Thị B",
    phone: "0988888888",
    email: "thib@gmail.com",
    address: "Dĩ An, Bình Dương",
    productName: "Máy phát điện Elemax 3KW",
    machineModel: "Elemax EM-3000",
    serialNumber: "EL3000-112",
    serviceType: "Bảo hành",
    issue: "Máy không đề được",
    note: "Còn phiếu bảo hành",
    receiveDate: "2026-03-24",
    expectedDate: "2026-03-27",
    technician: "KTV Long",
    cost: 0,
    status: "Đang kiểm tra",
    deleted: false,
  },
  {
    id: 1003,
    customerName: "Lê Văn C",
    phone: "0911222333",
    email: "levanc@gmail.com",
    address: "Biên Hòa, Đồng Nai",
    productName: "Máy phát điện Yamaha 2KW",
    machineModel: "Yamaha YA-2000",
    serialNumber: "YA2000-878",
    serviceType: "Bảo quản",
    issue: "Vệ sinh, kiểm tra định kỳ, thay nhớt",
    note: "Bảo dưỡng định kỳ tháng 3",
    receiveDate: "2026-03-23",
    expectedDate: "2026-03-26",
    technician: "KTV Huy",
    cost: 450000,
    status: "Chờ tiếp nhận",
    deleted: false,
  },
];

function init(): ServiceItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  }

  try {
    const parsed = JSON.parse(raw) as ServiceItem[];

    return parsed.map((item) => ({
      ...item,
      deleted: item.deleted ?? false,
    }));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
    return demoData;
  }
}

export function saveServices(data: ServiceItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRawServices(): ServiceItem[] {
  return init();
}

export function getAllServices(): ServiceItem[] {
  return init().filter((item) => !item.deleted);
}

export function getDeletedServices(): ServiceItem[] {
  return init().filter((item) => item.deleted);
}

export function getServicesByType(type: ServiceType): ServiceItem[] {
  return getAllServices().filter((item) => item.serviceType === type);
}

export function getServiceById(id: number): ServiceItem | undefined {
  return init().find((item) => item.id === id);
}

export function createService(payload: Omit<ServiceItem, "id" | "deleted">) {
  const current = init();

  const newItem: ServiceItem = {
    id: Date.now(),
    ...payload,
    deleted: false,
  };

  const updated = [newItem, ...current];
  saveServices(updated);
  return newItem;
}

export function updateService(
  id: number,
  payload: Omit<ServiceItem, "id" | "deleted">
) {
  const current = init();

  const updated = current.map((item) =>
    item.id === id ? { ...item, ...payload, id, deleted: item.deleted } : item
  );

  saveServices(updated);
}

export function softDeleteService(id: number) {
  const current = init();

  const updated = current.map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );

  saveServices(updated);
}

export function restoreService(id: number) {
  const current = init();

  const updated = current.map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );

  saveServices(updated);
}

export function permanentlyDeleteService(id: number) {
  const current = init();
  const updated = current.filter((item) => item.id !== id);
  saveServices(updated);
}

export function clearDeletedServices() {
  const current = init();
  const updated = current.filter((item) => !item.deleted);
  saveServices(updated);
}

export function updateServiceStatus(id: number, status: ServiceStatus) {
  const current = init();

  const updated = current.map((item) =>
    item.id === id ? { ...item, status } : item
  );

  saveServices(updated);
}

export function formatMoney(value: number) {
  return value.toLocaleString("vi-VN") + " VND";
}