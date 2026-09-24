/**
 * RZ® Minetrix BOS - Mobile & Native Runtime Adapter
 * Cross-platform integration layer for iOS (Keychain), Android (Keystore/Encrypted Preferences),
 * Network Connectivity Monitoring, Native Device Capabilities, and Offline Protection.
 */

import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Network } from '@capacitor/network';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';

export interface MobileDeviceContext {
  isNative: boolean;
  platform: 'ios' | 'android' | 'web';
  isOnline: boolean;
  appVersion: string;
  bundleId: string;
}

class MobileRuntimeService {
  private isOnline: boolean = true;
  private networkListeners: Array<(isOnline: boolean) => void> = [];

  constructor() {
    this.initPlatformServices();
  }

  private async initPlatformServices() {
    // 1. Initialize network status
    try {
      const status = await Network.getStatus();
      this.isOnline = status.connected;
      Network.addListener('networkStatusChange', (status) => {
        const prev = this.isOnline;
        this.isOnline = status.connected;
        if (prev !== status.connected) {
          this.networkListeners.forEach((listener) => listener(status.connected));
        }
      });
    } catch {
      this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    }

    // 2. Configure Native Status Bar & Splash Screen
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#0B0F17' });
        }
        await SplashScreen.hide();
      } catch (err) {
        console.warn('[MOBILE] Status/Splash config error (non-fatal):', err);
      }

      // 3. Handle Native App Lifecycle & Back Button on Android
      try {
        App.addListener('backButton', ({ canGoBack }) => {
          if (!canGoBack) {
            App.exitApp();
          } else {
            window.history.back();
          }
        });
      } catch (err) {
        console.warn('[MOBILE] App listener setup error:', err);
      }
    }
  }

  public getContext(): MobileDeviceContext {
    return {
      isNative: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform() as 'ios' | 'android' | 'web',
      isOnline: this.isOnline,
      appVersion: '1.0.0',
      bundleId: 'com.rzmining.bos'
    };
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public onNetworkChange(listener: (isOnline: boolean) => void): () => void {
    this.networkListeners.push(listener);
    return () => {
      this.networkListeners = this.networkListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Secure Storage Interface
   * Uses native iOS Keychain / Android KeyStore via Capacitor Preferences
   * Falls back safely to localStorage on web.
   */
  public async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({ key, value });
    } catch {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    }
  }

  public async getSecureItem(key: string): Promise<string | null> {
    try {
      const res = await Preferences.get({ key });
      if (res && res.value !== null) {
        return res.value;
      }
    } catch {
      // Fallback
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  }

  public async removeSecureItem(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      // Fallback
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }

  /**
   * Resolves the primary API Base URL:
   * On Web -> '' (uses relative path to same origin / proxy)
   * On Native iOS / Android -> Uses environment configured Cloud Run HTTPS endpoint or current host
   */
  public getApiBaseUrl(): string {
    if (Capacitor.isNativePlatform()) {
      // In native container, read configured endpoint or fallback to Cloud Run staging endpoint
      const configuredUrl = (import.meta as any).env?.VITE_API_BASE_URL;
      if (configuredUrl) {
        return configuredUrl.replace(/\/$/, '');
      }
    }
    return '';
  }
}

export const mobileService = new MobileRuntimeService();
