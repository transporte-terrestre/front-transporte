import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
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

  viaje = input.required<ApiResponse<'viajes', 'findOne'>>();
  onDataChange = output<void>();

  showComentarioModal = signal(false);

  addComentarioForm = this.fb.group({
    comentario: ['', Validators.required],
    tipo: ['general', Validators.required],
  });

  openAddComentario() {
    this.addComentarioForm.reset({ tipo: 'general' });
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

    try {
      await this.viajeService.createComentario({
        viajeId: this.viaje().id,
        usuarioId: usuarioId,
        comentario: this.addComentarioForm.value.comentario || '',
        tipo: (this.addComentarioForm.value.tipo || 'general') as ApiBody<
          'viajes',
          'createComentario'
        >['tipo'],
      });
      this.toastService.success('Comentario agregado');
      this.closeAddComentario();
      this.onDataChange.emit();
    } catch (e) {
      this.toastService.error('Error al agregar comentario');
    }
  }
}
