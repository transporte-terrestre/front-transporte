import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { PropietarioService } from '@service/admin/propietario.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-propietario-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './propietario-input-search.html',
  styleUrl: './propietario-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PropietarioInputSearch,
      multi: true,
    },
  ],
})
export class PropietarioInputSearch implements ControlValueAccessor {
  private propietarioService = inject(PropietarioService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'propietarios', 'findAll'>['data'][number] | null>(null);

  // State
  isOpen = signal(false);
  loading = signal(false);
  propietarios = signal<ApiResponse<'propietarios', 'findAll'>['data']>([]);
  selectedPropietario = signal<ApiResponse<'propietarios', 'findAll'>['data'][number] | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'propietarios', 'findAll'>['data'][number] | null) => void =
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
            return of<ApiResponse<'propietarios', 'findAll'>>({
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
          return from(this.propietarioService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false))
          );
        })
      )
      .subscribe({
        next: (response) => {
          this.propietarios.set(response.data);
        },
        error: (err) => {
          console.error('Error searching propietarios:', err);
          this.propietarios.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'propietarios', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedPropietario.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedPropietario.set(initial);
        } else {
          this.loadInitialPropietario(obj);
        }
      }
    } else {
      this.selectedPropietario.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'propietarios', 'findAll'>['data'][number] | null) => void
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
      if (this.propietarios().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectPropietario(propietario: ApiResponse<'propietarios', 'findAll'>['data'][number]) {
    this.selectedPropietario.set(propietario);
    this.onChange(propietario);
    this.isOpen.set(false);
  }

  // Helper for single mode ID loading
  loadInitialPropietario(id: number) {
    this.propietarioService
      .findOne(id)
      .then((propietario) => {
        this.selectedPropietario.set(propietario);
      })
      .catch(() => {
        console.error('Could not load initial propietario');
      });
  }

  getDisplayText(): string {
    const p = this.selectedPropietario();
    if (!p) return 'Seleccionar propietario...';
    return p.nombreCompleto;
  }

  isSelected(propietarioId: number): boolean {
    return this.selectedPropietario()?.id === propietarioId;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
