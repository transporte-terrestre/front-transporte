import { Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeProximoTramoResultDto } from 'api/backend.api';

@Component({
  selector: 'app-dialog-descanso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './dialog-descanso.html',
})
export class DialogDescansoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  viajeId = input.required<number>();
  sugerencia = input<ViajeProximoTramoResultDto | null>(null);

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  isSubmitting = false;
  horaInicio = '—';
  horaFin = '—';

  // Base date from suggestion
  private ultimaHoraDate: Date = new Date();
  private ultimoKilometraje = 0;

  // Form
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      minutosDescanso: [10, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    const sug = this.sugerencia();
    this.ultimaHoraDate = sug?.ultimaHora ? new Date(sug.ultimaHora) : new Date();
    this.ultimoKilometraje = sug?.ultimoKilometraje || 0;

    // Recalcular rango cada vez que cambie los minutos
    this.form.get('minutosDescanso')?.valueChanges.subscribe(() => {
      this.actualizarRango();
    });

    // Calcular rango inicial
    this.actualizarRango();
  }

  private formatHora(date: Date): string {
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  private actualizarRango() {
    const minutos = this.form.get('minutosDescanso')?.value || 0;
    const fechaFin = new Date(this.ultimaHoraDate.getTime() + minutos * 60 * 1000);

    this.horaInicio = this.formatHora(this.ultimaHoraDate);
    this.horaFin = this.formatHora(fechaFin);
  }

  async save() {
    if (this.form.invalid) {
      this.toastService.warning('Ingrese el tiempo de descanso');
      return;
    }

    this.isSubmitting = true;
    const minutos = this.form.get('minutosDescanso')?.value || 0;

    // Calcular la hora final: ultimaHora + minutos
    const fechaResultante = new Date(this.ultimaHoraDate.getTime() + minutos * 60 * 1000);
    const isoString = fechaResultante.toISOString();

    try {
      await this.viajeService.registrarDescanso(this.viajeId(), {
        nombreLugar: 'Descanso',
        horaActual: isoString,
      });
      this.toastService.success('Descanso registrado');
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al registrar descanso');
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.onClose.emit();
  }
}
