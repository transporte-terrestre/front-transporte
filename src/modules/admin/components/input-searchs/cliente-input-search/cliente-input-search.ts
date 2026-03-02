import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
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
  selector: 'app-cliente-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-input-search.html',
  styleUrl: './cliente-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ClienteInputSearch,
      multi: true,
    },
  ],
})
export class ClienteInputSearch implements ControlValueAccessor {
  private clienteService = inject(ClienteService);
  private elementRef = inject(ElementRef);

  // Inputs
  initialData = input<ApiResponse<'clientes', 'findAll'>['data'][number] | null>(null);
  showClear = input(false);

  // State
  isOpen = signal(false);
  loading = signal(false);
  clientes = signal<ApiResponse<'clientes', 'findAll'>['data']>([]);
  selectedCliente = signal<ApiResponse<'clientes', 'findAll'>['data'][number] | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'clientes', 'findAll'>['data'][number] | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'clientes', 'findAll'>>({
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
          return from(this.clienteService.findAll({ search: term || '', limit: 10 })).pipe(
            finalize(() => this.loading.set(false)),
          );
        }),
      )
      .subscribe({
        next: (response) => {
          this.clientes.set(response.data);
        },
        error: (err) => {
          console.error('Error searching clientes:', err);
          this.clientes.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: number | ApiResponse<'clientes', 'findAll'>['data'][number] | null): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedCliente.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedCliente.set(initial);
        } else {
          this.loadInitialCliente(obj);
        }
      }
    } else {
      this.selectedCliente.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'clientes', 'findAll'>['data'][number] | null) => void,
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
      if (this.clientes().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectCliente(cliente: ApiResponse<'clientes', 'findAll'>['data'][number]) {
    this.selectedCliente.set(cliente);
    this.onChange(cliente);
    this.isOpen.set(false);
  }

  loadInitialCliente(id: number) {
    this.clienteService
      .findOne(id)
      .then((cliente) => {
        this.selectedCliente.set(cliente);
      })
      .catch(() => {
        console.error('Could not load initial cliente');
      });
  }
  clearSelection() {
    this.selectedCliente.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  getDisplayText(): string {
    const c = this.selectedCliente();
    if (!c) return 'Seleccionar cliente...';
    return c.razonSocial || `${c.nombres} ${c.apellidos}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
