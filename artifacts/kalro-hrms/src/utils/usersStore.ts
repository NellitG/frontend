import { users as seedUsers } from "./mockData";

const LS_KEY = "kalro_users_v1";

type Listener = () => void;
const listeners = new Set<Listener>();

export type RoleKey =
  | "system_admin"
  | "national_me"
  | "high_level"
  | "business_logic"
  | "project_manager"
  | "department_head"
  | "staff_user";

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: RoleKey;
  status: string;
  dept: string;
}

function load(): UserRecord[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as UserRecord[];
  } catch {}
  return seedUsers.map((u, i) => ({
    id: i + 1,
    name: u.name,
    email: u.email,
    role: (u.role?.toLowerCase().replace(/[\s&]+/g, "_") as RoleKey) || "staff_user",
    status: u.status,
    dept: "General",
  }));
}

function save(data: UserRecord[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

let store: UserRecord[] = load();

export function getUsers(): UserRecord[] {
  return store;
}

export function addUser(user: Omit<UserRecord, "id">): UserRecord {
  const next: UserRecord = {
    ...user,
    id: store.length > 0 ? Math.max(...store.map((u) => u.id)) + 1 : 1,
  };
  store = [...store, next];
  save(store);
  listeners.forEach((l) => l());
  return next;
}

export function updateUser(id: number, patch: Partial<Omit<UserRecord, "id">>): void {
  store = store.map((u) => (u.id === id ? { ...u, ...patch } : u));
  save(store);
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
