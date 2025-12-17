import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ClienteService } from '@service/admin/cliente.service';
import { ClienteListDto } from '@interface/admin/cliente.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

  // State
  isOpen = signal(false);
  loading = signal(false);
  clientes = signal<ClienteListDto[]>([]);
  selectedCliente = signal<ClienteListDto | null>(null);

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
          return this.clienteService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
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

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialCliente(obj);
    } else {
      this.selectedCliente.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  // UI Actions
  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.clientes().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectCliente(cliente: ClienteListDto) {
    this.selectedCliente.set(cliente);
    this.onChange(cliente.id);
    this.isOpen.set(false);
  }

  loadInitialCliente(id: number) {
    this.clienteService.findOne(id).subscribe({
      next: (cliente) => {
        this.selectedCliente.set(cliente as unknown as ClienteListDto);
      },
      error: () => {
        console.error('Could not load initial cliente');
      },
    });
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
