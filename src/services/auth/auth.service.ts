import { Injectable, signal, computed, inject } from '@angular/core';
import { Api, ApiBody, ApiResponse, ApiField } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(Api);
  private userSignal = signal<ApiResponse<'auth', 'login'>["user"] | null>(null);
  private tokenSignal = signal<string | null>(null);
  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null && this.tokenSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  async login(credentials: ApiBody<'auth', 'login'>) {
    const response = await this.api.auth.login(credentials).then((r) => r.data);
    this.userSignal.set(response.user);
    this.tokenSignal.set(response.accessToken);
    this.saveToStorage(response);
    return response;
  }
  logout(): void {
    this.clearSession();
  }
  private saveToStorage(response: ApiResponse<'auth', 'login'>): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  }

  restoreSession(): void {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      this.tokenSignal.set(token);
      this.userSignal.set(JSON.parse(userStr));
    }
  }

  hasRol(role: ApiField<'usuarios', 'findOne', 'roles'>[number]): boolean {
    const user = this.userSignal();
    return user?.roles?.includes(role) ?? false;
  }
  getToken(): string | null {
    return this.tokenSignal();
  }
}
