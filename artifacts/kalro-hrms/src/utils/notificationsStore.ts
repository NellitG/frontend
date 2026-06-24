import type { NotificationWithRead } from "./types";
import { notifications as initialNotifications } from "./mockData";

const LS_KEY = "kalro_notifications_read_v1";

type Listener = () => void;
const listeners = new Set<Listener>();

function loadReadIds(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return new Set(JSON.parse(raw) as number[]);
  } catch {}
  return new Set();
}

function saveReadIds(ids: Set<number>): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
  } catch {}
}

const readIds = loadReadIds();

const notifications: NotificationWithRead[] = initialNotifications.map((item) => ({
  ...item,
  read: readIds.has(item.id),
}));

export function getNotifications(): NotificationWithRead[] {
  return notifications;
}

export function getUnreadCount(): number {
  return notifications.filter((item) => !item.read).length;
}

export function markAsRead(id: number): void {
  const notification = notifications.find((item) => item.id === id);
  if (notification && !notification.read) {
    notification.read = true;
    readIds.add(id);
    saveReadIds(readIds);
    listeners.forEach((listener) => listener());
  }
}

export function markAllAsRead(): void {
  let changed = false;
  for (const notification of notifications) {
    if (!notification.read) {
      notification.read = true;
      readIds.add(notification.id);
      changed = true;
    }
  }
  if (changed) {
    saveReadIds(readIds);
    listeners.forEach((listener) => listener());
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
