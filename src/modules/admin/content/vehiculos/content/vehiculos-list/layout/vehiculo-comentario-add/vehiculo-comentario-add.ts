import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { ApiBody } from 'api/backend.api';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-vehiculo-comentario-add',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-comentario-add.html',
  styleUrl: './vehiculo-comentario-add.css',
})
export class VehiculoComentarioAdd {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  vehiculoId = input.required<number>();
  onClose = output<void>();
  onSave = output<void>();

  loading = signal(false);

  addComentarioForm = this.fb.group({
    comentario: ['', Validators.required],
    tipo: ['general', Validators.required],
  });

  closeAddComentario() {
    this.onClose.emit();
  }

  async saveComentario(event?: Event) {
    if (event) event.preventDefault();
    if (this.addComentarioForm.invalid) return;

    this.loading.set(true);
    const usuarioId = 1; // TODO: Obtener ID de usuario real usando AuthService
    try {
      await this.vehiculoService.createComentario({
        vehiculoId: this.vehiculoId(),
        usuarioId: usuarioId,
        comentario: this.addComentarioForm.value.comentario || '',
        tipo: (this.addComentarioForm.value.tipo || 'general') as ApiBody<
          'vehiculos',
          'createComentario'
        >['tipo'],
      });
      this.toastService.success('Comentario agregado exitosamente');
      this.onSave.emit();
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      this.toastService.error(getErrorMessage(error, 'Error al agregar comentario'));
    } finally {
      this.loading.set(false);
    }
  }
}
