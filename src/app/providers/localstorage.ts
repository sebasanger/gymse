import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

class LocalStorageWrapper implements Storage {
  private isBrowser: boolean;

  constructor(private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get length(): number {
    if (!this.isBrowser) return 0;
    try {
      return localStorage.length;
    } catch {
      console.error('ERR length');
      return 0;
    }
  }

  clear(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.clear();
    } catch {
      console.error('ERR clear');
    }
  }

  getItem(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      console.error('ERR getItem');
      return null;
    }
  }

  key(index: number): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.key(index);
    } catch {
      console.error('ERR key');
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('ERR removeItem');
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      console.error('ERR setItem');
    }
  }
}

const getStorage = (platformId: object): Storage | null =>
  isPlatformBrowser(platformId) ? new LocalStorageWrapper(platformId) : null;

export const LOCAL_STORAGE = new InjectionToken<Storage | null>('LOCAL_STORAGE', {
  providedIn: 'root',
  factory: () => getStorage(inject(PLATFORM_ID)),
});
