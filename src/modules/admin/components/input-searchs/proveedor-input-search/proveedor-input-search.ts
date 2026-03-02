import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProveedorService } from '@service/admin/proveedor.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-proveedor-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedor-input-search.html',
  styleUrl: './proveedor-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ProveedorInputSearch,
      multi: true,
    },
  ],
})
export class ProveedorInputSearch implements ControlValueAccessor {
  private proveedorService = inject(ProveedorService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'proveedores', 'findAll'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  proveedores = signal<ApiResponse<'proveedores', 'findAll'>['data']>([]);
  selectedProveedor = signal<ApiResponse<'proveedores', 'findAll'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'proveedores', 'findAll'>['data'][number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') {
            this.loading.set(false);
            return of<ApiResponse<'proveedores', 'findAll'>>({
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
          }
          return from(this.proveedorService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.proveedores.set(response.data);
        },
        error: (err) => {
          console.error('Error searching proveedores:', err);
          this.proveedores.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'proveedores', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedProveedor.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedProveedor.set(initial);
        } else {
          this.loadInitialProveedor(obj);
        }
      }
    } else {
      this.selectedProveedor.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'proveedores', 'findAll'>['data'][number] | null) => void,
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
      if (this.proveedores().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectProveedor(proveedor: ApiResponse<'proveedores', 'findAll'>['data'][number]) {
    this.selectedProveedor.set(proveedor);
    this.onChange(proveedor);
    this.isOpen.set(false);
  }

  // Helper for single mode ID loading
  loadInitialProveedor(id: number) {
    this.proveedorService
      .findOne(id)
      .then((proveedor) => {
        this.selectedProveedor.set(proveedor);
      })
      .catch(() => {
        console.error('Could not load initial proveedor');
      });
  }
  clearSelection() {
    this.selectedProveedor.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const p = this.selectedProveedor();
    if (!p) return 'Seleccionar proveedor...';
    return p.nombreCompleto;
  }

  isSelected(proveedorId: number): boolean {
    return this.selectedProveedor()?.id === proveedorId;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
