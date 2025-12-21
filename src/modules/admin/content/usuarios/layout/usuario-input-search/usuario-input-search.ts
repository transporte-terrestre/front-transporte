import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '@service/admin/usuario.service';
import { UsuarioListDto } from '@interface/admin/usuario.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

  // State
  isOpen = signal(false);
  loading = signal(false);
  usuarios = signal<UsuarioListDto[]>([]);
  selectedUsuario = signal<UsuarioListDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: UsuarioListDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.usuarioService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
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

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialUsuario(obj);
    } else {
      this.selectedUsuario.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  // UI Actions
  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.usuarios().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectUsuario(usuario: UsuarioListDto) {
    this.selectedUsuario.set(usuario);
    this.onChange(usuario);
    this.isOpen.set(false);
  }

  loadInitialUsuario(id: number) {
    this.usuarioService.findOne(id).subscribe({
      next: (usuario) => {
        this.selectedUsuario.set(usuario as unknown as UsuarioListDto);
      },
      error: () => {
        console.error('Could not load initial usuario');
      },
    });
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
