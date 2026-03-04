import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConductorService } from '@service/admin/conductor.service';
import { ApiResponse } from 'api/backend.api';
import { of, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-conductor-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conductor-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ConductorInputSearch,
      multi: true,
    },
  ],
})
export class ConductorInputSearch implements ControlValueAccessor {
  private conductorService = inject(ConductorService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'conductores', 'findAll'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  conductores = signal<ApiResponse<'conductores', 'findAll'>['data']>([]);
  selectedConductor = signal<ApiResponse<'conductores', 'findAll'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'conductores', 'findAll'>['data'][number] | null) => void =
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
            return of<ApiResponse<'conductores', 'findAll'>>({
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
          return from(this.conductorService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.conductores.set(response.data);
        },
        error: (err) => {
          console.error('Error searching conductores:', err);
          this.conductores.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'conductores', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedConductor.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedConductor.set(initial);
        } else {
          this.loadInitialConductor(obj);
        }
      }
    } else {
      this.selectedConductor.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'conductores', 'findAll'>['data'][number] | null) => void,
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
      if (this.conductores().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectConductor(conductor: ApiResponse<'conductores', 'findAll'>['data'][number]) {
    this.selectedConductor.set(conductor);
    this.onChange(conductor);
    this.isOpen.set(false);
  }

  loadInitialConductor(id: number) {
    this.conductorService
      .findOne(id)
      .then((conductor) => {
        this.selectedConductor.set(conductor);
      })
      .catch(() => {
        console.error('Could not load initial conductor');
      });
  }
  clearSelection() {
    this.selectedConductor.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const c = this.selectedConductor();
    if (!c) return 'Seleccionar conductor...';
    return `${c.nombres} ${c.apellidos}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
