export type AuthItem = {
  id: number;
  email: string;
  password: string;
  role: string;
  status: boolean;
  deleted?: boolean;
};

const STORAGE_KEY = "admin_auths";

const defaultAuths: AuthItem[] = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "123456",
    role: "admin",
    status: true,
    deleted: false,
  },
  {
    id: 2,
    email: "user@gmail.com",
    password: "123456",
    role: "user",
    status: true,
    deleted: false,
  },
];

export function getAuths(): AuthItem[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultAuths));
    return defaultAuths;
  }
  return JSON.parse(raw);
}

export function saveAuths(auths: AuthItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auths));
}

export function getAuthById(id: number) {
  return getAuths().find((item) => item.id === id);
}

export function addAuth(auth: Omit<AuthItem, "id">) {
  const auths = getAuths();
  const nextId = auths.length ? Math.max(...auths.map((item) => item.id)) + 1 : 1;

  const newAuth: AuthItem = {
    ...auth,
    id: nextId,
  };

  saveAuths([newAuth, ...auths]);
}

export function updateAuth(id: number, data: Partial<AuthItem>) {
  const auths = getAuths().map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveAuths(auths);
}

export function toggleAuthStatus(id: number) {
  const auths = getAuths().map((item) =>
    item.id === id ? { ...item, status: !item.status } : item
  );
  saveAuths(auths);
}

export function softDeleteAuth(id: number) {
  const auths = getAuths().map((item) =>
    item.id === id ? { ...item, deleted: true } : item
  );
  saveAuths(auths);
}

export function restoreAuth(id: number) {
  const auths = getAuths().map((item) =>
    item.id === id ? { ...item, deleted: false } : item
  );
  saveAuths(auths);
}

export function deleteAuthForever(id: number) {
  const auths = getAuths().filter((item) => item.id !== id);
  saveAuths(auths);
}

export function clearAuthTrash() {
  const auths = getAuths().filter((item) => !item.deleted);
  saveAuths(auths);
}