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
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  finalize,
  startWith,
} from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-encargado-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encargado-input-search.html',
  styleUrl: './encargado-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: EncargadoInputSearch,
      multi: true,
    },
  ],
})
export class EncargadoInputSearch implements ControlValueAccessor, OnChanges {
  private clienteService = inject(ClienteService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'clientes', 'findAllEncargados'>['data'][number] | null>(null);
  showClear = input(false);
  clienteId = input<number | undefined | null>(undefined);

  // State
  isOpen = signal(false);
  loading = signal(false);
  encargados = signal<ApiResponse<'clientes', 'findAllEncargados'>['data']>([]);
  selectedEncargado = signal<ApiResponse<'clientes', 'findAllEncargados'>['data'][number] | null>(
    null,
  );
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'clientes', 'findAllEncargados'>['data'][number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    // React to clienteId changes - clear selection and reload encargados when cliente changes
    effect(() => {
      const currentClienteId = this.clienteId();
      const currentEncargado = this.selectedEncargado();

      // Clear selection if client changes and current encargado doesn't belong to it
      if (currentEncargado && currentClienteId !== null && currentEncargado.clienteId !== currentClienteId) {
        this.selectedEncargado.set(null);
        this.onChange(null);
        this.encargados.set([]);
      } else if (!currentClienteId) {
        this.encargados.set([]);
        this.selectedEncargado.set(null);
        this.onChange(null);
      }

      // Pre-load encargados for the current client and reset search control silently
      if (currentClienteId) {
        this.searchControl.setValue('', { emitEvent: false });
        this.loadEncargadosForCliente(currentClienteId);
      }
    });

    this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value || ''),
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          const currentClienteId = this.clienteId();
          if (currentClienteId === undefined || currentClienteId === null) {
            return of<ApiResponse<'clientes', 'findAllEncargados'>>({
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
            this.clienteService.findAllEncargados({
              search: term || '',
              limit: 10,
              clienteId: currentClienteId,
            }),
          ).pipe(finalize(() => this.loading.set(false)));
        }),
      )
      .subscribe({
        next: (response) => {
          this.encargados.set(response.data);
        },
        error: (err) => {
          console.error('Error searching encargados:', err);
          this.encargados.set([]);
          this.loading.set(false);
        },
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // We handle changes in the effect above
  }

  isBlocked(): boolean {
    return !this.clienteId() || this.disabled();
  }

  async loadEncargadosForCliente(clienteId: number) {
    this.loading.set(true);
    try {
      const response = await this.clienteService.findAllEncargados({
        search: '',
        clienteId,
        limit: 10,
      });
      this.encargados.set(response.data);
    } catch (err) {
      console.error('Error loading encargados for cliente:', err);
      this.encargados.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  writeValue(
    obj: number | ApiResponse<'clientes', 'findAllEncargados'>['data'][number] | null,
  ): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedEncargado.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedEncargado.set(initial);
        } else {
          this.loadInitialEncargado(obj);
        }
      }
    } else {
      this.selectedEncargado.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'clientes', 'findAllEncargados'>['data'][number] | null) => void,
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
    if (this.isBlocked()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      // Only trigger initial search if we have no data and are not already loading
      if (this.encargados().length === 0 && !this.loading() && this.clienteId()) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectEncargado(encargado: ApiResponse<'clientes', 'findAllEncargados'>['data'][number]) {
    this.selectedEncargado.set(encargado);
    this.onChange(encargado);
    this.isOpen.set(false);
  }

  loadInitialEncargado(id: number) {
    this.clienteService
      .findEncargado(id)
      .then((encargado) => {
        this.selectedEncargado.set(encargado);
      })
      .catch(() => {
        console.error('Could not load initial encargado');
      });
  }

  clearSelection() {
    this.selectedEncargado.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    if (!this.clienteId()) return 'Bloqueado';
    const e = this.selectedEncargado();
    if (!e) return 'Seleccionar encargado...';
    return `${e.nombres} ${e.apellidos}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
