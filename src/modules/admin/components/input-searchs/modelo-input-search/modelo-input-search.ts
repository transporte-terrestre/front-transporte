import { Component, inject, signal, ElementRef, HostListener, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-modelo-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modelo-input-search.html',
  styleUrl: './modelo-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ModeloInputSearch,
      multi: true,
    },
  ],
})
export class ModeloInputSearch implements ControlValueAccessor {
  private vehiculoService = inject(VehiculoService);
  private elementRef = inject(ElementRef);

  // Input: marcaId required to filter models
  marcaId = input<number | null>(null);
  initialData = input<ApiResponse<'vehiculos', 'findAllModelos'>['data'][number] | null>(null);

  // State
  showClear = input(false);
  isOpen = signal(false);
  loading = signal(false);
  modelos = signal<ApiResponse<'vehiculos', 'findAllModelos'>['data']>([]);
  selectedModelo = signal<ApiResponse<'vehiculos', 'findOneModelo'> | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'vehiculos', 'findOneModelo'> | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // React to marcaId changes - clear selection and reload models when marca changes
    effect(() => {
      const currentMarcaId = this.marcaId();
      const currentModelo = this.selectedModelo();
      // Solo limpiar si hay un modelo seleccionado Y no pertenece a la marca actual
      if (currentModelo && currentMarcaId !== null && currentModelo.marcaId !== currentMarcaId) {
        this.selectedModelo.set(null);
        this.onChange(null);
        this.modelos.set([]);
      }

      // Cargar modelos para la marca actual
      if (currentMarcaId) {
        this.loadModelsForMarca(currentMarcaId);
      }
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          const marca = this.marcaId();
          if (!marca)
            return of<ApiResponse<'vehiculos', 'findAllModelos'>>({
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
          return from(
            this.vehiculoService.findAllModelos({ search: term || '', marcaId: marca, limit: 10 })
          ).pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.modelos.set(response.data);
        },
        error: (err) => {
          console.error('Error searching modelos:', err);
          this.modelos.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'vehiculos', 'findOneModelo'> | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedModelo.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedModelo.set(initial);
        } else {
          this.loadInitialModelo(obj);
        }
      }
    } else {
      this.selectedModelo.set(null);
    }
  }

  registerOnChange(fn: (value: ApiResponse<'vehiculos', 'findOneModelo'> | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  isBlocked(): boolean {
    return !this.marcaId() || this.disabled();
  }

  // UI Actions
  toggleDropdown() {
    if (this.isBlocked()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.modelos().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectModelo(modelo: ApiResponse<'vehiculos', 'findOneModelo'>) {
    this.selectedModelo.set(modelo);
    this.onChange(modelo);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedModelo.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  loadInitialModelo(id: number) {
    this.vehiculoService
      .findOneModelo(id)
      .then((modelo) => {
        this.selectedModelo.set(modelo);
      })
      .catch(() => {
        console.error('Could not load initial modelo');
      });
  }

  async loadModelsForMarca(marcaId: number) {
    this.loading.set(true);
    try {
      const response = await this.vehiculoService.findAllModelos({
        search: '',
        marcaId,
        limit: 10,
      });
      this.modelos.set(response.data);
    } catch (err) {
      console.error('Error loading modelos for marca:', err);
      this.modelos.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  getDisplayText(): string {
    if (!this.marcaId()) return 'Bloqueado';
    const m = this.selectedModelo();
    if (!m) return 'Seleccionar modelo...';
    return m.nombre;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
