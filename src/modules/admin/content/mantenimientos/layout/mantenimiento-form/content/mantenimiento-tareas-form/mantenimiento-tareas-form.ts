import { Component, inject, input, output, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { TareaInputSearch } from '@module/admin/content/mantenimientos/content/mantenimientos-tareas/layout/tarea-input-search/tarea-input-search';

@Component({
  selector: 'app-mantenimiento-tareas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TareaInputSearch],
  templateUrl: './mantenimiento-tareas-form.html',
  styleUrl: './mantenimiento-tareas-form.css',
})
export class MantenimientoTareasForm {
  private fb = inject(FormBuilder);
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  mantenimiento = input.required<ApiResponse<'mantenimientos', 'findOne'>>();
  onDataChange = output<void>();

  showTareaModal = signal(false);
  editingTareaId = signal<number | null>(null);

  // Tarea seleccionada del catálogo
  selectedTarea = signal<ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null>(
    null
  );

  // ViewChild para el input-search
  tareaInputSearch = viewChild<TareaInputSearch>(TareaInputSearch);

  addTareaForm = this.fb.group({
    responsable: [''],
    horaInicio: [''],
    horaFin: [''],
    completada: [false],
    observaciones: [''],
  });

  openAddTarea() {
    this.editingTareaId.set(null);
    this.selectedTarea.set(null);
    this.addTareaForm.reset({ completada: false });
    this.showTareaModal.set(true);
  }

  editTarea(tarea: ApiField<'mantenimientos', 'findOne', 'tareas'>[number]) {
    this.editingTareaId.set(tarea.id);
    this.selectedTarea.set(tarea.tarea);

    // Setear la tarea en el input-search cuando el modal se abra
    setTimeout(() => {
      this.tareaInputSearch()?.setTarea(tarea.tarea);
    });

    this.addTareaForm.patchValue({
      responsable: tarea.responsable || '',
      horaInicio: tarea.horaInicio || '',
      horaFin: tarea.horaFin || '',
      completada: tarea.completada,
      observaciones: tarea.observaciones || '',
    });
    this.showTareaModal.set(true);
  }

  closeAddTarea() {
    this.showTareaModal.set(false);
    this.editingTareaId.set(null);
    this.selectedTarea.set(null);
    this.addTareaForm.reset();
  }

  onTareaSelected(tarea: ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null) {
    this.selectedTarea.set(tarea);
  }

  saveTarea() {
    if (!this.selectedTarea()) {
      this.toastService.warning('Debes seleccionar una tarea del catálogo');
      return;
    }

    const val = this.addTareaForm.value;

    if (this.editingTareaId()) {
      // Update
      const updateDto: ApiBody<'mantenimientos', 'updateMantenimientoTarea'> = {
        tareaId: this.selectedTarea()!.id,
        responsable: val.responsable || undefined,
        horaInicio: val.horaInicio || undefined,
        horaFin: val.horaFin || undefined,
        completada: val.completada || false,
        observaciones: val.observaciones || undefined,
      };

      this.mantenimientoService
        .updateMantenimientoTarea(this.editingTareaId()!, updateDto)
        .then(() => {
          this.toastService.success('Tarea actualizada');
          this.closeAddTarea();
          this.onDataChange.emit();
        })
        .catch(() => this.toastService.error('Error al actualizar tarea'));
    } else {
      // Create
      const tareaDto: ApiBody<'mantenimientos', 'createMantenimientoTarea'> = {
        mantenimientoId: this.mantenimiento().id,
        tareaId: this.selectedTarea()!.id,
        responsable: val.responsable || undefined,
        horaInicio: val.horaInicio || undefined,
        horaFin: val.horaFin || undefined,
        completada: val.completada || false,
        observaciones: val.observaciones || undefined,
      };

      this.mantenimientoService
        .createMantenimientoTarea(tareaDto)
        .then(() => {
          this.toastService.success('Tarea agregada');
          this.closeAddTarea();
          this.onDataChange.emit();
        })
        .catch(() => this.toastService.error('Error al agregar tarea'));
    }
  }

  removeTarea(tareaId: number) {
    this.alertService.delete('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', () => {
      this.mantenimientoService
        .deleteMantenimientoTarea(tareaId)
        .then(() => {
          this.toastService.success('Tarea eliminada');
          this.onDataChange.emit();
        })
        .catch(() => this.toastService.error('Error al eliminar tarea'));
    });
  }
}
