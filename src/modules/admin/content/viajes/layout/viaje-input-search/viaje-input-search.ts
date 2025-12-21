import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeResultDto } from '@interface/admin/viaje.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-viaje-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ViajeInputSearch,
      multi: true,
    },
  ],
})
export class ViajeInputSearch implements ControlValueAccessor {
  private viajeService = inject(ViajeService);
  private elementRef = inject(ElementRef);

  // State
  isOpen = signal(false);
  loading = signal(false);
  viajes = signal<ViajeResultDto[]>([]);
  selectedViaje = signal<ViajeResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ViajeResultDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.viajeService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.viajes.set(response.data);
        },
        error: (err) => {
          console.error('Error searching viajes:', err);
          this.viajes.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialViaje(obj);
    } else {
      this.selectedViaje.set(null);
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
      if (this.viajes().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectViaje(viaje: ViajeResultDto) {
    this.selectedViaje.set(viaje);
    this.onChange(viaje);
    this.isOpen.set(false);
  }

  loadInitialViaje(id: number) {
    this.viajeService.findOne(id).subscribe({
      next: (viaje) => {
        this.selectedViaje.set(viaje);
      },
      error: () => {
        console.error('Could not load initial viaje');
      },
    });
  }

  getDisplayText(): string {
    const v = this.selectedViaje();
    if (!v) return 'Seleccionar viaje...';
    return `Viaje #${v.id} - ${v.ruta?.origen} a ${v.ruta?.destino}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
