import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

/** Interface para el ítem de búsqueda con las propiedades seleccionadas */
type AlquilerSearchItem = any;

@Component({
  selector: 'app-alquiler-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alquiler-input-search.html',
  styleUrl: './alquiler-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AlquilerInputSearch,
      multi: true,
    },
  ],
})
export class AlquilerInputSearch implements ControlValueAccessor {
  private alquilerService = inject(AlquilerService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<any | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  alquileres = signal<AlquilerSearchItem[]>([]);
  selectedAlquiler = signal<AlquilerSearchItem | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: any | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'alquileres', 'findAll'>>({
              data: [] as any,
              meta: {
                total: 0,
                page: 1,
                limit: 10,
                totalPages: 1,
                hasPreviousPage: false,
                hasNextPage: false,
              },
            });
          return from(this.alquilerService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.alquileres.set(response.data as AlquilerSearchItem[]);
        },
        error: (err) => {
          console.error('Error searching alquileres:', err);
          this.alquileres.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | AlquilerSearchItem | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedAlquiler.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedAlquiler.set(initial);
        } else {
          this.loadInitialAlquiler(obj);
        }
      }
    } else {
      this.selectedAlquiler.set(null);
    }
  }

  registerOnChange(fn: (value: any | null) => void): void {
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
      if (this.alquileres().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectAlquiler(alquiler: AlquilerSearchItem) {
    this.selectedAlquiler.set(alquiler);
    this.onChange(alquiler);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedAlquiler.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  loadInitialAlquiler(id: number) {
    this.alquilerService
      .findOne(id)
      .then((alquiler) => {
        this.selectedAlquiler.set(alquiler as any);
      })
      .catch(() => {
        console.error('Could not load initial alquiler');
      });
  }

  getDisplayText(): string {
    const a = this.selectedAlquiler();
    if (!a) return 'Seleccionar alquiler...';
    // Usamos casting seguro ya que sabemos que la API retorna estos campos aunque el tipo generado diga 'object'
    const vehiculo = (a as any).vehiculo;
    const proveedor = (a as any).proveedor;
    const placa = vehiculo?.placa || 'Sin placa';
    const nombreProveedor = proveedor?.nombreCompleto || 'Sin proveedor';
    return `${placa} - ${nombreProveedor}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
