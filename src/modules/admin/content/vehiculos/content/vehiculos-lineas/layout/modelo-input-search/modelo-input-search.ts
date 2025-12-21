import { Component, inject, signal, ElementRef, HostListener, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ModeloResultDto } from '@interface/admin/vehiculo.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-modelo-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modelo-input-search.html',
  styleUrl: './modelo-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ModeloInputSearch,
      multi: true,
    },
  ],
})
export class ModeloInputSearch implements ControlValueAccessor {
  private vehiculoService = inject(VehiculoService);
  private elementRef = inject(ElementRef);

  // Input: marcaId required to filter models
  marcaId = input<number | null>(null);

  // State
  isOpen = signal(false);
  loading = signal(false);
  modelos = signal<ModeloResultDto[]>([]);
  selectedModelo = signal<ModeloResultDto | null>(null);
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ModeloResultDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    // React to marcaId changes - clear selection and reload models when marca changes
    effect(() => {
      const currentMarcaId = this.marcaId();
      // Reset selection when marca changes
      if (currentMarcaId !== null && this.selectedModelo()?.marcaId !== currentMarcaId) {
        this.selectedModelo.set(null);
        this.onChange(null);
        this.modelos.set([]);
      }
      // Trigger a new search to load models for the new marca
      // Using { emitEvent: false } first to reset, then emit to trigger valueChanges
      if (currentMarcaId) {
        this.loadModelsForMarca(currentMarcaId);
      }
    });

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          const marca = this.marcaId();
          if (!marca) return of({ data: [], meta: { total: 0 } } as any);
          return this.vehiculoService
            .findAllModelos({ search: term || '', marcaId: marca, limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.modelos.set(response.data);
        },
        error: (err) => {
          console.error('Error searching modelos:', err);
          this.modelos.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialModelo(obj);
    } else {
      this.selectedModelo.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  isBlocked(): boolean {
    return !this.marcaId() || this.disabled();
  }

  // UI Actions
  toggleDropdown() {
    if (this.isBlocked()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.modelos().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectModelo(modelo: ModeloResultDto) {
    this.selectedModelo.set(modelo);
    this.onChange(modelo);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedModelo.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  loadInitialModelo(id: number) {
    this.vehiculoService.findOneModelo(id).subscribe({
      next: (modelo) => {
        this.selectedModelo.set(modelo);
      },
      error: () => {
        console.error('Could not load initial modelo');
      },
    });
  }

  loadModelsForMarca(marcaId: number) {
    this.loading.set(true);
    this.vehiculoService
      .findAllModelos({ search: '', marcaId, limit: 10 })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.modelos.set(response.data);
        },
        error: (err) => {
          console.error('Error loading modelos for marca:', err);
          this.modelos.set([]);
        },
      });
  }

  getDisplayText(): string {
    if (!this.marcaId()) return 'Bloqueado';
    const m = this.selectedModelo();
    if (!m) return 'Seleccionar modelo...';
    return m.nombre;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
