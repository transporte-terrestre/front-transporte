import {
  Component,
  inject,
  signal,
  ElementRef,
  HostListener,
  input,
  SimpleChanges,
  OnChanges,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TallerService } from '@service/admin/taller.service';
import { SucursalService } from '@service/admin/sucursal.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-taller-sucursal-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './taller-sucursal-input-search.html',
  styleUrl: './taller-sucursal-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TallerSucursalInputSearch,
      multi: true,
    },
  ],
})
export class TallerSucursalInputSearch implements ControlValueAccessor, OnChanges {
  private tallerService = inject(TallerService);
  private sucursalService = inject(SucursalService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'talleres', 'findSucursalesByTaller'>[number] | null>(null);
  showClear = input(false);
  tallerId = input<number | undefined | null>(undefined);

  // State
  isOpen = signal(false);
  loading = signal(false);
  sucursales = signal<ApiResponse<'talleres', 'findSucursalesByTaller'>>([]);
  filteredSucursales = signal<ApiResponse<'talleres', 'findSucursalesByTaller'>>([]);
  selectedSucursal = signal<ApiResponse<'talleres', 'findSucursalesByTaller'>[number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'talleres', 'findSucursalesByTaller'>[number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe((term) => {
        // Local filter
        const t = term?.toLowerCase().trim();
        if (!t) {
          this.filteredSucursales.set(this.sucursales());
        } else {
          this.filteredSucursales.set(
            this.sucursales().filter(
              (s) =>
                s.distrito.toLowerCase().includes(t) ||
                s.ubicacionExacta.toLowerCase().includes(t),
            ),
          );
        }
      });

    effect(() => {
      const tId = this.tallerId();
      // Reset selection and options when target dependencies change
      if (tId !== undefined && tId !== null) {
        this.fetchSucursales(tId);
        if (this.isOpen()) {
          this.searchControl.setValue('');
        }
      } else if (!tId) {
        this.sucursales.set([]);
        this.filteredSucursales.set([]);
      }
    });
  }

  fetchSucursales(tallerId: number) {
    this.loading.set(true);
    this.tallerService
      .findSucursalesByTaller(tallerId)
      .then((res) => {
        this.sucursales.set((res as any) || []);
        this.filteredSucursales.set((res as any) || []);
      })
      .catch((err) => {
        console.error('Error fetching sucursales for taller', err);
        this.sucursales.set([]);
        this.filteredSucursales.set([]);
      })
      .finally(() => {
        this.loading.set(false);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tallerId'] && !changes['tallerId'].firstChange) {
      if (this.selectedSucursal()) {
        this.clearSelection();
      }
    }
  }

  writeValue(obj: number | ApiResponse<'talleres', 'findSucursalesByTaller'>[number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedSucursal.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedSucursal.set(initial);
        } else {
          this.loadInitialSucursal(obj);
        }
      }
    } else {
      this.selectedSucursal.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'talleres', 'findSucursalesByTaller'>[number] | null) => void,
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
      if (this.sucursales().length === 0 && this.tallerId()) {
        this.fetchSucursales(this.tallerId()!);
      }
      this.searchControl.setValue('');
    } else {
      this.onTouched();
    }
  }

  selectSucursal(sucursal: ApiResponse<'talleres', 'findSucursalesByTaller'>[number]) {
    this.selectedSucursal.set(sucursal);
    this.onChange(sucursal);
    this.isOpen.set(false);
  }

  loadInitialSucursal(id: number) {
    this.sucursalService
      .findOne(id)
      .then((sucursal) => {
        this.selectedSucursal.set(sucursal);
      })
      .catch(() => {
        console.error('Could not load initial sucursal');
      });
  }

  clearSelection() {
    this.selectedSucursal.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const s = this.selectedSucursal();
    if (!s) return 'Seleccionar sucursal...';
    return `${s.distrito} - ${s.ubicacionExacta}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
