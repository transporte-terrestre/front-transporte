import { Component, inject, signal, ElementRef, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { TareaResultDto } from '@interface/admin/mantenimiento.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tarea-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea-input-search.html',
  styleUrl: './tarea-input-search.css',
})
export class TareaInputSearch {
  private mantenimientoService = inject(MantenimientoService);
  private elementRef = inject(ElementRef);

  // Inputs
  placeholder = input<string>('Seleccionar tarea...');
  disabled = input<boolean>(false);

  // Outputs
  tareaSelected = output<TareaResultDto | null>();

  // State
  isOpen = signal(false);
  loading = signal(false);
  tareas = signal<TareaResultDto[]>([]);
  selectedTarea = signal<TareaResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          return this.mantenimientoService
            .findAllTareas({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
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

  // Set value programmatically
  setTarea(tarea: TareaResultDto | null) {
    this.selectedTarea.set(tarea);
  }

  // UI Actions
  toggleDropdown() {
    if (this.disabled()) return;
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.tareas().length === 0) {
        this.searchControl.setValue('');
      }
    }
  }

  selectTarea(tarea: TareaResultDto) {
    this.selectedTarea.set(tarea);
    this.tareaSelected.emit(tarea);
    this.isOpen.set(false);
  }

  clearSelection() {
    this.selectedTarea.set(null);
    this.tareaSelected.emit(null);
    this.isOpen.set(false);
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
    }
  }
}
