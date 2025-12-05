import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '@route/api.route';
import { LoginDto, LoginResultDto } from '@interface/auth/auth.interface';
import { Rol, UsuarioResultDto } from '@interface/admin/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private userSignal = signal<Partial<UsuarioResultDto> | null>(null);
  private tokenSignal = signal<string | null>(null);

  user = this.userSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isAuthenticated = computed(() => this.userSignal() !== null && this.tokenSignal() !== null);

  constructor() {
    this.restoreSession();
  }

  login(credentials: LoginDto): Observable<LoginResultDto> {
    return this.http.post<LoginResultDto>(API_URL.auth.login, credentials).pipe(
      tap((response) => {
        this.userSignal.set(response.user);
        this.tokenSignal.set(response.accessToken);
        this.saveToStorage(response);
      })
    );
  }

  logout(): void {
    this.clearSession();
  }

  private saveToStorage(response: LoginResultDto): void {
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

  hasRol(role: Rol): boolean {
    const user = this.userSignal();
    return user?.roles?.includes(role) ?? false;
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
