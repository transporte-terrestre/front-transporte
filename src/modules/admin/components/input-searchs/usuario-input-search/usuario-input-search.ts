import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '@service/admin/usuario.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-usuario-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: UsuarioInputSearch,
      multi: true,
    },
  ],
})
export class UsuarioInputSearch implements ControlValueAccessor {
  private usuarioService = inject(UsuarioService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'usuarios', 'findAll'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  usuarios = signal<ApiResponse<'usuarios', 'findAll'>['data']>([]);
  selectedUsuario = signal<ApiResponse<'usuarios', 'findAll'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'usuarios', 'findAll'>['data'][number] | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'usuarios', 'findAll'>>({
              data: [],
              meta: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
                hasPreviousPage: false,
                hasNextPage: false,
              },
            });
          return from(this.usuarioService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.usuarios.set(response.data);
        },
        error: (err) => {
          console.error('Error searching usuarios:', err);
          this.usuarios.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'usuarios', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedUsuario.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedUsuario.set(initial);
        } else {
          this.loadInitialUsuario(obj);
        }
      }
    } else {
      this.selectedUsuario.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'usuarios', 'findAll'>['data'][number] | null) => void,
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // UI Actions
  toggleDropdown() {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.usuarios().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectUsuario(usuario: ApiResponse<'usuarios', 'findAll'>['data'][number]) {
    this.selectedUsuario.set(usuario);
    this.onChange(usuario);
    this.isOpen.set(false);
  }

  loadInitialUsuario(id: number) {
    this.usuarioService
      .findOne(id)
      .then((usuario) => {
        this.selectedUsuario.set(usuario);
      })
      .catch(() => {
        console.error('Could not load initial usuario');
      });
  }
  clearSelection() {
    this.selectedUsuario.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const u = this.selectedUsuario();
    if (!u) return 'Seleccionar usuario...';
    return `${u.nombres} ${u.apellidos}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
