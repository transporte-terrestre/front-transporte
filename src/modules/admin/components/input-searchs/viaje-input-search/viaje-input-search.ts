import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-viaje-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViajeInputSearch,
      multi: true,
    },
  ],
})
export class ViajeInputSearch implements ControlValueAccessor {
  private viajeService = inject(ViajeService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'viajes', 'findAll'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  viajes = signal<ApiResponse<'viajes', 'findAll'>['data']>([]);
  selectedViaje = signal<ApiResponse<'viajes', 'findAll'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'viajes', 'findAll'>['data'][number] | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'viajes', 'findAll'>>({
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
          return from(this.viajeService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.viajes.set(response.data);
        },
        error: (err) => {
          console.error('Error searching viajes:', err);
          this.viajes.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'viajes', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedViaje.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedViaje.set(initial);
        } else {
          this.loadInitialViaje(obj);
        }
      }
    } else {
      this.selectedViaje.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'viajes', 'findAll'>['data'][number] | null) => void,
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
      if (this.viajes().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectViaje(viaje: ApiResponse<'viajes', 'findAll'>['data'][number]) {
    this.selectedViaje.set(viaje);
    this.onChange(viaje);
    this.isOpen.set(false);
  }

  async loadInitialViaje(id: number) {
    this.viajeService
      .findOne(id)
      .then((viaje) => {
        this.selectedViaje.set(viaje);
      })
      .catch(() => {
        console.error('Could not load initial viaje');
      });
  }
  clearSelection() {
    this.selectedViaje.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const v = this.selectedViaje();
    if (!v) return 'Seleccionar viaje...';

    const trip = v.ida || v.vuelta;
    if (!trip) return `Circuito #${v.id}`;

    return `Circuito #${v.id} - ${trip.ruta?.origen || '...'} a ${trip.ruta?.destino || '...'}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
