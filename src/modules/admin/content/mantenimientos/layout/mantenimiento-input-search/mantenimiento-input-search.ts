import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { MantenimientoResultDto } from '@interface/admin/mantenimiento.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-mantenimiento-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MantenimientoInputSearch,
      multi: true,
    },
  ],
})
export class MantenimientoInputSearch implements ControlValueAccessor {
  private mantenimientoService = inject(MantenimientoService);
  private elementRef = inject(ElementRef);

  // State
  isOpen = signal(false);
  loading = signal(false);
  mantenimientos = signal<MantenimientoResultDto[]>([]);
  selectedMantenimiento = signal<MantenimientoResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: MantenimientoResultDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.mantenimientoService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.mantenimientos.set(response.data);
        },
        error: (err) => {
          console.error('Error searching mantenimientos:', err);
          this.mantenimientos.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialMantenimiento(obj);
    } else {
      this.selectedMantenimiento.set(null);
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
      if (this.mantenimientos().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectMantenimiento(mantenimiento: MantenimientoResultDto) {
    this.selectedMantenimiento.set(mantenimiento);
    this.onChange(mantenimiento);
    this.isOpen.set(false);
  }

  loadInitialMantenimiento(id: number) {
    this.mantenimientoService.findOne(id).subscribe({
      next: (mantenimiento) => {
        this.selectedMantenimiento.set(mantenimiento);
      },
      error: () => {
        console.error('Could not load initial mantenimiento');
      },
    });
  }

  getDisplayText(): string {
    const m = this.selectedMantenimiento();
    if (!m) return 'Seleccionar mantenimiento...';
    return `Mantenimiento #${m.id} - ${m.tipo}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
