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
  selector: 'app-vehiculo-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: VehiculoInputSearch,
      multi: true,
    },
  ],
})
export class VehiculoInputSearch implements ControlValueAccessor {
  private vehiculoService = inject(VehiculoService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);

  // State
  isOpen = signal(false);
  loading = signal(false);
  vehiculos = signal<ApiResponse<'vehiculos', 'findAll'>['data']>([]);
  selectedVehiculo = signal<ApiResponse<'vehiculos', 'findAll'>['data'][number] | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'vehiculos', 'findAll'>['data'][number] | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'vehiculos', 'findAll'>>({
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
          return from(this.vehiculoService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.vehiculos.set(response.data);
        },
        error: (err) => {
          console.error('Error searching vehiculos:', err);
          this.vehiculos.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | null): void {
    if (obj) {
      const initial = this.initialData();
      if (initial && initial.id === obj) {
        this.selectedVehiculo.set(initial as any);
      } else {
        this.loadInitialVehiculo(obj);
      }
    } else {
      this.selectedVehiculo.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'vehiculos', 'findAll'>['data'][number] | null) => void
  ): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  // UI Actions
  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.vehiculos().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectVehiculo(vehiculo: ApiResponse<'vehiculos', 'findAll'>['data'][number]) {
    this.selectedVehiculo.set(vehiculo);
    this.onChange(vehiculo);
    this.isOpen.set(false);
  }

  loadInitialVehiculo(id: number) {
    this.vehiculoService
      .findOne(id)
      .then((vehiculo) => {
        this.selectedVehiculo.set(vehiculo);
      })
      .catch(() => {
        console.error('Could not load initial vehiculo');
      });
  }

  getDisplayText(): string {
    const v = this.selectedVehiculo();
    if (!v) return 'Seleccionar vehículo...';
    return `${v.placa} - ${v.modelo}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
