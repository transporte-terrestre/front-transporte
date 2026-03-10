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
import { ClienteService } from '@service/admin/cliente.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-entidad-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './entidad-input-search.html',
  styleUrl: './entidad-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EntidadInputSearch,
      multi: true,
    },
  ],
})
export class EntidadInputSearch implements ControlValueAccessor, OnChanges {
  private clienteService = inject(ClienteService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'clientes', 'findAllEntidades'>['data'][number] | null>(null);
  showClear = input(false);
  clienteId = input<number | undefined | null>(undefined);

  // State
  isOpen = signal(false);
  loading = signal(false);
  entidades = signal<ApiResponse<'clientes', 'findAllEntidades'>['data']>([]);
  selectedEntidad = signal<ApiResponse<'clientes', 'findAllEntidades'>['data'][number] | null>(
    null,
  );
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'clientes', 'findAllEntidades'>['data'][number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          const currentClienteId = this.clienteId();
          if (
            (!term && term !== '') ||
            currentClienteId === undefined ||
            currentClienteId === null
          ) {
            return of<ApiResponse<'clientes', 'findAllEntidades'>>({
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
          return from(
            this.clienteService.findAllEntidades({
              search: term || '',
              limit: 10,
              clienteId: currentClienteId,
            }),
          ).pipe(finalize(() => this.loading.set(false)));
        }),
      )
      .subscribe({
        next: (response) => {
          this.entidades.set(response.data);
        },
        error: (err) => {
          console.error('Error searching entidades:', err);
          this.entidades.set([]);
          this.loading.set(false);
        },
      });

    effect(() => {
      const cId = this.clienteId();
      // Reset selection and options when target dependencies change
      if (cId !== undefined && cId !== null && this.isOpen()) {
        this.searchControl.setValue('');
      } else if (!cId) {
        this.entidades.set([]);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clienteId'] && !changes['clienteId'].firstChange) {
      if (this.selectedEntidad()) {
        this.clearSelection();
      }
    }
  }

  writeValue(
    obj: number | ApiResponse<'clientes', 'findAllEntidades'>['data'][number] | null,
  ): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedEntidad.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedEntidad.set(initial);
        } else {
          this.loadInitialEntidad(obj);
        }
      }
    } else {
      this.selectedEntidad.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'clientes', 'findAllEntidades'>['data'][number] | null) => void,
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
      if (this.entidades().length === 0 && this.clienteId()) {
        this.searchControl.setValue('');
      } else if (!this.clienteId()) {
        this.entidades.set([]);
      }
    } else {
      this.onTouched();
    }
  }

  selectEntidad(entidad: ApiResponse<'clientes', 'findAllEntidades'>['data'][number]) {
    this.selectedEntidad.set(entidad);
    this.onChange(entidad);
    this.isOpen.set(false);
  }

  loadInitialEntidad(id: number) {
    this.clienteService
      .findEntidad(id)
      .then((entidad) => {
        this.selectedEntidad.set(entidad);
      })
      .catch(() => {
        console.error('Could not load initial entidad');
      });
  }

  clearSelection() {
    this.selectedEntidad.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const e = this.selectedEntidad();
    if (!e) return 'Seleccionar entidad...';
    return e.nombreServicio;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
