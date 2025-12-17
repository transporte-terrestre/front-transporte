import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { VehiculoResultDto } from '@interface/admin/vehiculo.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

  // State
  isOpen = signal(false);
  loading = signal(false);
  vehiculos = signal<VehiculoResultDto[]>([]);
  selectedVehiculo = signal<VehiculoResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.vehiculoService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
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

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialVehiculo(obj);
    } else {
      this.selectedVehiculo.set(null);
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
      if (this.vehiculos().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectVehiculo(vehiculo: VehiculoResultDto) {
    this.selectedVehiculo.set(vehiculo);
    this.onChange(vehiculo.id);
    this.isOpen.set(false);
  }

  loadInitialVehiculo(id: number) {
    this.vehiculoService.findOne(id).subscribe({
      next: (vehiculo) => {
        this.selectedVehiculo.set(vehiculo);
      },
      error: () => {
        console.error('Could not load initial vehiculo');
      },
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
