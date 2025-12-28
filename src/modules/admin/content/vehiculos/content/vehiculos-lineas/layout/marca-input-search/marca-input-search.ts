import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
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
  selector: 'app-marca-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marca-input-search.html',
  styleUrl: './marca-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MarcaInputSearch,
      multi: true,
    },
  ],
})
export class MarcaInputSearch implements ControlValueAccessor {
  private vehiculoService = inject(VehiculoService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'vehiculos', 'findAllMarcas'>['data'][number] | null>(null);

  // State
  isOpen = signal(false);
  loading = signal(false);
  marcas = signal<ApiResponse<'vehiculos', 'findAllMarcas'>['data']>([]);
  selectedMarca = signal<ApiResponse<'vehiculos', 'findOneMarca'> | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'vehiculos', 'findOneMarca'> | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'vehiculos', 'findAllMarcas'>>({
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
          return from(this.vehiculoService.findAllMarcas({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.marcas.set(response.data);
        },
        error: (err) => {
          console.error('Error searching marcas:', err);
          this.marcas.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedMarca.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedMarca.set(initial as any);
        } else {
          this.loadInitialMarca(obj);
        }
      }
    } else {
      this.selectedMarca.set(null);
    }
  }

  registerOnChange(fn: (value: ApiResponse<'vehiculos', 'findOneMarca'> | null) => void): void {
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
      if (this.marcas().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectMarca(marca: ApiResponse<'vehiculos', 'findOneMarca'>) {
    this.selectedMarca.set(marca);
    this.onChange(marca);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedMarca.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  loadInitialMarca(id: number) {
    this.vehiculoService
      .findOneMarca(id)
      .then((marca) => {
        this.selectedMarca.set(marca);
      })
      .catch(() => {
        console.error('Could not load initial marca');
      });
  }

  getDisplayText(): string {
    const m = this.selectedMarca();
    if (!m) return 'Seleccionar marca...';
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
