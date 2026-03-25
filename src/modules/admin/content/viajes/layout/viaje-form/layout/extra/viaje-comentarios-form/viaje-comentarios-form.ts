import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse, ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-viaje-comentarios-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-comentarios-form.html',
  styleUrl: './viaje-comentarios-form.css',
})
export class ViajeComentariosForm {
  private fb = inject(FormBuilder);
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viaje = input.required<ApiResponse<'viajes', 'findOne'>>();
  onDataChange = output<void>();

  showComentarioModal = signal(false);
  editingComentarioId = signal<number | null>(null);

  addComentarioForm = this.fb.group({
    comentario: ['', Validators.required],
    tipo: ['general', Validators.required],
  });

  openAddComentario(comentario?: any) {
    if (comentario) {
      this.editingComentarioId.set(comentario.id);
      this.addComentarioForm.patchValue({
        comentario: comentario.comentario,
        tipo: comentario.tipo,
      });
    } else {
      this.editingComentarioId.set(null);
      this.addComentarioForm.reset({ tipo: 'general' });
    }
    this.showComentarioModal.set(true);
  }

  closeAddComentario() {
    this.showComentarioModal.set(false);
  }

  async saveComentario() {
    if (this.addComentarioForm.invalid) {
      return;
    }
    // TODO: Obtener ID de usuario real
    const usuarioId = 1;
    const isEdit = this.editingComentarioId();

    try {
      if (isEdit) {
        await this.viajeService.updateComentario(isEdit, {
          comentario: this.addComentarioForm.value.comentario || '',
          tipo: (this.addComentarioForm.value.tipo || 'general') as ApiBody<'viajes', 'updateComentario'>['tipo'],
        });
        this.toastService.success('Comentario actualizado');
      } else {
        await this.viajeService.createComentario({
          viajeId: this.viaje().id,
          usuarioId: usuarioId,
          comentario: this.addComentarioForm.value.comentario || '',
          tipo: (this.addComentarioForm.value.tipo || 'general') as ApiBody<'viajes', 'createComentario'>['tipo'],
        });
        this.toastService.success('Comentario agregado');
      }
      this.closeAddComentario();
      this.onDataChange.emit();
    } catch (e) {
      this.toastService.error(isEdit ? 'Error al actualizar comentario' : 'Error al agregar comentario');
    }
  }

  deleteComentario(id: number) {
    this.alertService.delete(
      'Eliminar Comentario',
      '¿Estás seguro de que deseas eliminar este comentario?',
      () => {
        this.viajeService.deleteComentario(id).then(
          () => {
            this.toastService.success('Comentario eliminado');
            this.onDataChange.emit();
          },
          () => this.toastService.error('Error al eliminar comentario'),
        );
      },
    );
  }
}
