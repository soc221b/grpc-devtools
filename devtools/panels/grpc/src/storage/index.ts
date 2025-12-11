export type Storage = {
  get(key: string): Promise<null | string>;
  set(key: string, value: string): Promise<void>;
};

const chromeLocalStorage: Storage = {
  async get(key) {
    try {
      return chrome.storage.local.get(key).then((result) => (result[key] ?? null) as string | null);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      return chrome.storage.local.set({ [key]: value });
    } catch {}
  },
};

const localStorage: Storage = {
  async get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      return window.localStorage.setItem(key, value);
    } catch {}
  },
};

export const storage = window.chrome && window.chrome.storage ? chromeLocalStorage : localStorage;
