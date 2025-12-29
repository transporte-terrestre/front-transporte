import { Component, inject, signal, ElementRef, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ApiResponse } from 'api/backend.api';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Component({
  selector: 'app-tarea-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea-input-search.html',
  styleUrl: './tarea-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TareaInputSearch,
      multi: true,
    },
  ],
})
export class TareaInputSearch implements ControlValueAccessor {
  private mantenimientoService = inject(MantenimientoService);
  private elementRef = inject(ElementRef);

  // Inputs
  placeholder = input<string>('Seleccionar tarea...');
  initialData = input<ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null>(null);
  tareaSelected = output<ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null>();

  // State
  isOpen = signal(false);
  loading = signal(false);
  tareas = signal<ApiResponse<'mantenimientos', 'findAllTareas'>['data']>([]);
  selectedTarea = signal<ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null>(
    null
  );
  disabled = signal(false);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null) => void =
    () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '')
            return of<ApiResponse<'mantenimientos', 'findAllTareas'>>({
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
          return from(
            this.mantenimientoService.findAllTareas({ search: term || '', limit: 10 })
          ).pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.tareas.set(response.data);
        },
        error: (err) => {
          console.error('Error searching tareas:', err);
          this.tareas.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(
    obj: number | ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null
  ): void {
    if (obj) {
      if (typeof obj === 'object') {
        this.selectedTarea.set(obj);
      } else {
        const initial = this.initialData();
        if (initial && initial.id === obj) {
          this.selectedTarea.set(initial);
        } else {
          this.loadInitialTarea(obj);
        }
      }
    } else {
      this.selectedTarea.set(null);
    }
  }

  registerOnChange(
    fn: (value: ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null) => void
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
      if (this.tareas().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectTarea(tarea: ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number]) {
    this.selectedTarea.set(tarea);
    this.onChange(tarea);
    this.tareaSelected.emit(tarea);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedTarea.set(null);
    this.onChange(null);
    this.tareaSelected.emit(null);
    this.isOpen.set(false);
  }

  setTarea(tarea: ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null) {
    this.selectedTarea.set(tarea);
    this.onChange(tarea);
    this.tareaSelected.emit(tarea);
  }

  loadInitialTarea(id: number) {
    this.mantenimientoService
      .findOneTarea(id)
      .then((tarea) => {
        this.selectedTarea.set(tarea);
      })
      .catch(() => {
        console.error('Could not load initial tarea');
      });
  }

  getDisplayText(): string {
    const t = this.selectedTarea();
    if (!t) return this.placeholder();
    return t.descripcion || t.codigo;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
