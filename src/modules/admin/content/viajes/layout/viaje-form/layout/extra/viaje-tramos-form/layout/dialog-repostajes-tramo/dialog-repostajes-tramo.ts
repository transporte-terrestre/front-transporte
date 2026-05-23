import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  untracked,
  HostListener,
} from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AbastecimientoService } from '@service/admin/abastecimiento.service';
import { ToastService } from '@service/toast.service';
import { ViajeTramoResultDto, AbastecimientoResultDto, ApiBody } from 'api/backend.api';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';

@Component({
  selector: 'app-dialog-repostajes-tramo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  providers: [DecimalPipe, DatePipe],
  templateUrl: './dialog-repostajes-tramo.html',
  styleUrl: './dialog-repostajes-tramo.css',
})
export class DialogRepostajesTramoComponent {
  private fb = inject(FormBuilder);
  private abastecimientoService = inject(AbastecimientoService);
  private toastService = inject(ToastService);

  tramo = input.required<ViajeTramoResultDto>();
  viajeId = input.required<number>();
  vehiculoId = input.required<number>();

  onClose = output<void>();
  onSaved = output<boolean>();

  loading = signal(false);
  isSubmitting = signal(false);
  deletingId = signal<number | null>(null);
  repostajes = signal<AbastecimientoResultDto[]>([]);
  changesMade = false;

  form = this.fb.group({
    combustible: ['', [Validators.required]],
    galonesEstablecidos: ['', [Validators.required, Validators.min(0.01)]],
  });

  constructor() {
    effect(() => {
      const t = this.tramo();
      if (t?.id) {
        untracked(() => this.loadRepostajes());
      }
    });
  }

  @HostListener('document:keydown.escape')
  handleEscape() {
    this.closeDialog();
  }

  async loadRepostajes() {
    if (this.loading()) return;
    this.loading.set(true);
    try {
      const data = await this.abastecimientoService.findByTramo(this.tramo().id);
      this.repostajes.set(data || []);
    } catch (error) {
      console.error('Error cargando repostajes:', error);
      this.toastService.error('Error al cargar abastecimientos');
      this.repostajes.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async guardarRepostaje() {
    if (this.form.invalid) return;

    const values = this.form.value;
    this.isSubmitting.set(true);

    try {
      const payload: ApiBody<'abastecimientos', 'create'> = {
        vehiculoId: this.vehiculoId(),
        viajeTramoId: this.tramo().id,
        combustible: values.combustible as ApiBody<'abastecimientos', 'create'>['combustible'],
        galonesEstablecidos: Number(values.galonesEstablecidos),
      };

      await this.abastecimientoService.create(payload);

      this.toastService.success('Abastecimiento agregado correctamente');
      this.form.reset({ combustible: '' });
      this.changesMade = true;
      await this.loadRepostajes();
    } catch (error) {
      console.error('Error registrando repostaje:', error);
      const err = error as { response?: { data?: { message?: string } } };
      this.toastService.error(err?.response?.data?.message || 'Error al agregar abastecimiento');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  confirmarEliminacion(id: number) {
    this.deletingId.set(id);
  }

  cancelarEliminacion() {
    this.deletingId.set(null);
  }

  async eliminarRepostaje(id: number) {
    this.isSubmitting.set(true);
    try {
      await this.abastecimientoService.delete(id);
      this.toastService.success('Abastecimiento eliminado correctamente');
      this.cancelarEliminacion();
      this.changesMade = true;
      await this.loadRepostajes();
    } catch (error) {
      console.error('Error eliminando repostaje:', error);
      this.toastService.error('Error al eliminar abastecimiento');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  closeDialog() {
    if (this.changesMade) {
      this.onSaved.emit(false);
    } else {
      this.onClose.emit();
    }
  }
}
