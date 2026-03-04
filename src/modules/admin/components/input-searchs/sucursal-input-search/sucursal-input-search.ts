import { Component, inject, signal, ElementRef, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SucursalService } from '@service/admin/sucursal.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-sucursal-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal-input-search.html',
  styleUrl: './sucursal-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SucursalInputSearch,
      multi: true,
    },
  ],
})
export class SucursalInputSearch implements ControlValueAccessor {
  private sucursalService = inject(SucursalService);
  private elementRef = inject(ElementRef);

  // Inputs
  placeholder = input<string>('Seleccionar sucursales...');
  initialData = input<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data']>([]);
  showClear = input(false);
  disabled = signal(false);

  // Outputs
  onSelectionChange = output<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data']>();

  // State
  isOpen = signal(false);
  loading = signal(false);
  sucursales = signal<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data']>([]);
  selectedSucursales = signal<ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data']>([]);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: number[]) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'talleres', 'findAllSucursalesPaginated'>>({
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
            this.sucursalService.findAllPaginated({ search: term || '', limit: 10 }),
          ).pipe(finalize(() => this.loading.set(false)));
        }),
      )
      .subscribe({
        next: (response) => {
          this.sucursales.set(response.data);
        },
        error: (err) => {
          console.error('Error searching sucursales:', err);
          this.sucursales.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(
    obj: number[] | ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data'] | null,
  ): void {
    if (obj && Array.isArray(obj)) {
      if (obj.length > 0 && typeof obj[0] === 'object') {
        this.selectedSucursales.set(
          obj as ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data'],
        );
      } else if (obj.length > 0 && typeof obj[0] === 'number') {
        const initial = this.initialData();
        const initialMap = new Map(initial.map((s) => [s.id, s]));
        const selected: any[] = [];

        let needToLoad = false;
        (obj as number[]).forEach((id) => {
          if (initialMap.has(id)) {
            selected.push(initialMap.get(id));
          } else {
            needToLoad = true;
          }
        });

        if (needToLoad) {
          // Si faltan datos intentamos cargar todas (ya que es un array), pero típicamente con initialData bastará.
          this.loadInitialSucursales(obj as number[]);
        } else {
          this.selectedSucursales.set(selected);
        }
      } else {
        this.selectedSucursales.set([]);
      }
    } else {
      this.selectedSucursales.set([]);
    }
  }

  registerOnChange(fn: (value: number[]) => void): void {
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
      if (this.sucursales().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  toggleSucursal(
    sucursal: ApiResponse<'talleres', 'findAllSucursalesPaginated'>['data'][number],
    event: MouseEvent,
  ) {
    event.stopPropagation();
    const current = this.selectedSucursales();
    const isSelected = current.some((s) => s.id === sucursal.id);

    let nextValue;
    if (isSelected) {
      nextValue = current.filter((s) => s.id !== sucursal.id);
    } else {
      nextValue = [...current, sucursal];
    }

    this.selectedSucursales.set(nextValue);
    this.onChange(nextValue.map((s) => s.id));
    this.onSelectionChange.emit(nextValue);
  }

  removeSucursal(id: number, event: MouseEvent) {
    event.stopPropagation();
    const current = this.selectedSucursales();
    const nextValue = current.filter((s) => s.id !== id);
    this.selectedSucursales.set(nextValue);
    this.onChange(nextValue.map((s) => s.id));
    this.onSelectionChange.emit(nextValue);
  }

  clearSelection() {
    this.selectedSucursales.set([]);
    this.onChange([]);
    this.onSelectionChange.emit([]);
    this.isOpen.set(false);
  }

  isSelected(id: number): boolean {
    return this.selectedSucursales().some((s) => s.id === id);
  }

  async loadInitialSucursales(ids: number[]) {
    try {
      // Como no tenemos un findMultiple explícito en sucursalService, podemos hacer promesas concurrentes
      const promises = ids.map((id) => this.sucursalService.findOne(id));
      const results = await Promise.all(promises);
      this.selectedSucursales.set(results.filter(Boolean) as any);
    } catch (e) {
      console.error('Could not load initial sucursales', e);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
