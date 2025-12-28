import { Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';
import { ToastService } from '@service/toast.service';
import { PATH, buildPath } from '@route/path.route';
import { ApiBody } from '@api/backend.api';

@Component({
  selector: 'app-sing-in',
  imports: [CommonModule, FormsModule],
  templateUrl: './sing-in.html',
  styleUrl: './sing-in.css',
})
export class SingIn {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Formulario de login
  email = signal('');
  password = signal('');

  // Estados
  loading = signal(false);
  showPassword = signal(false);

  /**
   * Toggle visibility de la contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  /**
   * Maneja el submit del formulario de login
   */
  async onLogin(): Promise<void> {
    if (!this.email() || !this.password()) {
      this.toastService.error('Please enter email and password');
      return;
    }

    this.loading.set(true);

    const credentials: ApiBody<'auth', 'login'> = {
      email: this.email(),
      password: this.password(),
    };

    try {
      await this.authService.login(credentials);
      this.toastService.success('Welcome!');
      const returnUrl =
        this.route.snapshot.queryParams['returnUrl'] || buildPath(PATH.admin.dashboard);
      this.router.navigate([returnUrl]);
    } catch (err: any) {
      console.error('Login error:', err);
      this.toastService.error(err.error?.message || 'Invalid credentials');
    } finally {
      this.loading.set(false);
    }
  }
}
