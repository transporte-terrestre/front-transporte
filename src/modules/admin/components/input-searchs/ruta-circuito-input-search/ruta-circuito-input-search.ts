import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RutaService } from '@service/admin/ruta.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-ruta-circuito-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-circuito-input-search.html',
  styleUrl: './ruta-circuito-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RutaCircuitoInputSearch,
      multi: true,
    },
  ],
})
export class RutaCircuitoInputSearch implements ControlValueAccessor {
  private rutaService = inject(RutaService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'rutas', 'findAllCircuitos'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  rutas = signal<ApiResponse<'rutas', 'findAllCircuitos'>['data']>([]);
  selectedRuta = signal<ApiResponse<'rutas', 'findAllCircuitos'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'rutas', 'findAllCircuitos'>['data'][number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'rutas', 'findAllCircuitos'>>({
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
          return from(this.rutaService.findAllCircuitos({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.rutas.set(response.data);
        },
        error: (err) => {
          console.error('Error searching circuitos:', err);
          this.rutas.set([]);
          this.loading.set(false);
        },
      });
  }

  // Value Accessor Implementation
  writeValue(obj: number | ApiResponse<'rutas', 'findAllCircuitos'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedRuta.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedRuta.set(initial);
        } else {
          this.loadInitialRuta(obj);
        }
      }
    } else {
      this.selectedRuta.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'rutas', 'findAllCircuitos'>['data'][number] | null) => void,
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
      if (this.rutas().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectRuta(ruta: ApiResponse<'rutas', 'findAllCircuitos'>['data'][number]) {
    this.selectedRuta.set(ruta);
    this.onChange(ruta);
    this.isOpen.set(false);
  }

  loadInitialRuta(id: number) {
    this.rutaService
      .findOneCircuito(id)
      .then((ruta) => {
        this.selectedRuta.set(ruta);
        this.onChange(ruta);
      })
      .catch(() => {
        console.error('Could not load initial circuito');
      });
  }
  clearSelection() {
    this.selectedRuta.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const r = this.selectedRuta();
    if (!r) return 'Seleccionar circuito...';
    return r.nombre;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
