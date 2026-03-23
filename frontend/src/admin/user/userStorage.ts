export type UserItem = {
  id: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  realId: number;
  status: boolean;
  deleted: boolean;
};

const STORAGE_KEY = "admin_users";

const defaultUsers: UserItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    name: "Khanh",
    email: "khanh@gmail.com",
    phone: "0911111111",
    role: "admin",
    realId: 1,
    status: true,
    deleted: false,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    name: "Lan",
    email: "lan@gmail.com",
    phone: "0988888888",
    role: "user",
    realId: 2,
    status: true,
    deleted: false,
  },
];

function normalizeUsers(data: any): UserItem[] {
  if (!Array.isArray(data)) return defaultUsers;

  return data.map((item, index) => ({
    id: Number(item.id ?? index + 1),
    image: item.image ?? "",
    name: item.name ?? "",
    email: item.email ?? "",
    phone: item.phone ?? "",
    role: item.role ?? "user",
    realId: Number(item.realId ?? item.id ?? index + 1),
    status: item.status ?? true,
    deleted: item.deleted ?? false,
  }));
}

export function getUsers(): UserItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }

    const parsed = JSON.parse(raw);
    const normalized = normalizeUsers(parsed);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
}

export function saveUsers(users: UserItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function getUserById(id: number) {
  const users = getUsers();
  return users.find((item) => item.id === id || item.realId === id);
}

export function addUser(user: Omit<UserItem, "id" | "realId">) {
  const users = getUsers();

  const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const nextRealId = users.length
    ? Math.max(...users.map((u) => u.realId)) + 1
    : 1;

  const newUser: UserItem = {
    ...user,
    id: nextId,
    realId: nextRealId,
  };

  saveUsers([newUser, ...users]);
}

export function updateUser(id: number, data: Partial<UserItem>) {
  const users = getUsers().map((item) =>
    item.id === id || item.realId === id ? { ...item, ...data } : item
  );

  saveUsers(users);
}

export function toggleUserStatus(id: number) {
  const users = getUsers().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, status: !item.status }
      : item
  );

  saveUsers(users);
}

export function softDeleteUser(id: number) {
  const users = getUsers().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: true }
      : item
  );

  saveUsers(users);
}

export function restoreUser(id: number) {
  const users = getUsers().map((item) =>
    item.id === id || item.realId === id
      ? { ...item, deleted: false }
      : item
  );

  saveUsers(users);
}