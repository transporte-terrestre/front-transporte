import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { MarcaResultDto } from '@interface/admin/vehiculo.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-marca-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './marca-input-search.html',
  styleUrl: './marca-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MarcaInputSearch,
      multi: true,
    },
  ],
})
export class MarcaInputSearch implements ControlValueAccessor {
  private vehiculoService = inject(VehiculoService);
  private elementRef = inject(ElementRef);

  // State
  isOpen = signal(false);
  loading = signal(false);
  marcas = signal<MarcaResultDto[]>([]);
  selectedMarca = signal<MarcaResultDto | null>(null);
  disabled = signal(false);

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
          return this.vehiculoService
            .findAllMarcas({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.marcas.set(response.data);
        },
        error: (err) => {
          console.error('Error searching marcas:', err);
          this.marcas.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialMarca(obj);
    } else {
      this.selectedMarca.set(null);
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

  // UI Actions
  toggleDropdown() {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.marcas().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectMarca(marca: MarcaResultDto) {
    this.selectedMarca.set(marca);
    this.onChange(marca.id);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedMarca.set(null);
    this.onChange(null);
    this.isOpen.set(false);
  }

  loadInitialMarca(id: number) {
    this.vehiculoService.findOneMarca(id).subscribe({
      next: (marca) => {
        this.selectedMarca.set(marca);
      },
      error: () => {
        console.error('Could not load initial marca');
      },
    });
  }

  getDisplayText(): string {
    const m = this.selectedMarca();
    if (!m) return 'Seleccionar marca...';
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
