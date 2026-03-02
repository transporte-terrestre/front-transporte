import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { ApiResponse, ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-vehiculo-comentarios-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-comentarios-form.html',
  styleUrl: './vehiculo-comentarios-form.css',
})
export class VehiculoComentariosForm {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  vehiculo = input.required<ApiResponse<'vehiculos', 'findOne'>>();
  isReadOnly = input<boolean>(false);
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
      await this.vehiculoService.createComentario({
        vehiculoId: this.vehiculo().id,
        usuarioId: usuarioId,
        comentario: this.addComentarioForm.value.comentario || '',
        tipo: (this.addComentarioForm.value.tipo || 'general') as ApiBody<
          'vehiculos',
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
