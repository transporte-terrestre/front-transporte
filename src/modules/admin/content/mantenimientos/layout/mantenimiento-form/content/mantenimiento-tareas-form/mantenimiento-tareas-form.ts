import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MantenimientoResultDto,
  MantenimientoTareaCreateDto,
  MantenimientoTareaUpdateDto,
  MantenimientoTareaResultDto,
} from '@interface/admin/mantenimiento.interface';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-mantenimiento-tareas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-tareas-form.html',
  styleUrl: './mantenimiento-tareas-form.css',
})
export class MantenimientoTareasForm {
  private fb = inject(FormBuilder);
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  mantenimiento = input.required<MantenimientoResultDto>();
  onDataChange = output<void>();

  showTareaModal = signal(false);
  editingTareaId = signal<number | null>(null);

  addTareaForm = this.fb.group({
    descripcion: ['', Validators.required],
    costoEstimado: [''],
    costoReal: [''],
    responsable: [''],
    completada: [false],
  });

  openAddTarea() {
    this.editingTareaId.set(null);
    this.addTareaForm.reset({ completada: false });
    this.showTareaModal.set(true);
  }

  editTarea(tarea: MantenimientoTareaResultDto) {
    this.editingTareaId.set(tarea.id);
    this.addTareaForm.patchValue({
      descripcion: tarea.descripcion,
      costoEstimado: tarea.costoEstimado,
      costoReal: tarea.costoReal,
      responsable: tarea.responsable,
      completada: tarea.completada,
    });
    this.showTareaModal.set(true);
  }

  closeAddTarea() {
    this.showTareaModal.set(false);
    this.editingTareaId.set(null);
    this.addTareaForm.reset();
  }

  saveTarea() {
    if (this.addTareaForm.invalid) {
      this.addTareaForm.markAllAsTouched();
      return;
    }
    const val = this.addTareaForm.value;

    if (this.editingTareaId()) {
      // Update
      const updateDto: MantenimientoTareaUpdateDto = {
        descripcion: val.descripcion!,
        costoEstimado: val.costoEstimado ? String(val.costoEstimado) : undefined,
        costoReal: val.costoReal ? String(val.costoReal) : undefined,
        responsable: val.responsable || undefined,
        completada: val.completada || false,
      };

      this.mantenimientoService
        .updateTarea(this.mantenimiento().id, this.editingTareaId()!, updateDto)
        .subscribe({
          next: () => {
            this.toastService.success('Tarea actualizada');
            this.closeAddTarea();
            this.onDataChange.emit();
          },
          error: () => this.toastService.error('Error al actualizar tarea'),
        });
    } else {
      // Create
      const tareaDto: MantenimientoTareaCreateDto = {
        mantenimientoId: this.mantenimiento().id,
        descripcion: val.descripcion!,
        costoEstimado: val.costoEstimado ? String(val.costoEstimado) : undefined,
        costoReal: val.costoReal ? String(val.costoReal) : undefined,
        responsable: val.responsable || undefined,
        completada: val.completada || false,
      };

      this.mantenimientoService.createTarea(tareaDto).subscribe({
        next: () => {
          this.toastService.success('Tarea agregada');
          this.closeAddTarea();
          this.onDataChange.emit();
        },
        error: () => this.toastService.error('Error al agregar tarea'),
      });
    }
  }

  removeTarea(tareaId: number) {
    this.alertService.delete('Eliminar Tarea', '¿Estás seguro de eliminar esta tarea?', () => {
      this.mantenimientoService.deleteTarea(this.mantenimiento().id, tareaId).subscribe({
        next: () => {
          this.toastService.success('Tarea eliminada');
          this.onDataChange.emit();
        },
        error: () => this.toastService.error('Error al eliminar tarea'),
      });
    });
  }
}
