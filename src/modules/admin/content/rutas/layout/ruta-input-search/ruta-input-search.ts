import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { RutaService } from '@service/admin/ruta.service';
import { RutaResultDto } from '@interface/admin/ruta.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-ruta-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RutaInputSearch,
      multi: true,
    },
  ],
})
export class RutaInputSearch implements ControlValueAccessor {
  private rutaService = inject(RutaService);
  private elementRef = inject(ElementRef);

  // State
  isOpen = signal(false);
  loading = signal(false);
  rutas = signal<RutaResultDto[]>([]);
  selectedRuta = signal<RutaResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: RutaResultDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.rutaService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.rutas.set(response.data);
        },
        error: (err) => {
          console.error('Error searching rutas:', err);
          this.rutas.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialRuta(obj);
    } else {
      this.selectedRuta.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  // UI Actions
  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.rutas().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectRuta(ruta: RutaResultDto) {
    this.selectedRuta.set(ruta);
    this.onChange(ruta);
    this.isOpen.set(false);
  }

  loadInitialRuta(id: number) {
    this.rutaService.findOne(id).subscribe({
      next: (ruta) => {
        this.selectedRuta.set(ruta);
        this.onChange(ruta);
      },
      error: () => {
        console.error('Could not load initial ruta');
      },
    });
  }

  getDisplayText(): string {
    const r = this.selectedRuta();
    if (!r) return 'Seleccionar ruta...';
    return `${r.origen} - ${r.destino}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
