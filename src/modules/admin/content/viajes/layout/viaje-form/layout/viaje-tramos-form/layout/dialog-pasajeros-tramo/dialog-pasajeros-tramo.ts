import { Component, inject, input, output, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-dialog-pasajeros-tramo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm, FormsModule],
  templateUrl: './dialog-pasajeros-tramo.html',
  styleUrl: './dialog-pasajeros-tramo.css',
})
export class DialogPasajerosTramoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  viajeId = input.required<number>();
  tramo = input.required<any>();

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  loading = signal(false);
  isSubmitting = signal(false);
  pasajeros = signal<any[]>([]);
  filtroDni = signal('');

  constructor() {}

  ngOnInit() {
    this.loadPasajeros();
  }

  async loadPasajeros() {
    this.loading.set(true);
    try {
      const data = await this.viajeService.findPasajeros(this.viajeId());
      this.pasajeros.set(data);
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al cargar pasajeros');
    } finally {
      this.loading.set(false);
    }
  }

  async registrarAbordaje(pasajeroId: number, asistencia: boolean) {
    try {
      await this.viajeService.registrarAbordaje(
        this.viajeId(),
        {
          viajePasajeroId: pasajeroId,
          asistencia: asistencia,
        },
        this.tramo().id,
      );

      this.toastService.success(asistencia ? 'Abordaje registrado' : 'Abordaje cancelado');
      await this.loadPasajeros();
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al registrar abordaje');
    }
  }

  async registrarPorDni() {
    const dni = this.filtroDni().trim();
    if (!dni) return;

    // Buscar pasajero en la lista local primero por DNI
    const pasajero = this.pasajeros().find((p) => (p.dni || p.pasajero?.dni) === dni);

    if (pasajero) {
      if (pasajero.asistencia) {
        this.toastService.info('El pasajero ya registró abordaje');
        this.filtroDni.set('');
        return;
      }
      await this.registrarAbordaje(pasajero.id, true);
      this.filtroDni.set('');
    } else {
      this.toastService.warning(
        'Pasajero no encontrado en este viaje. Regístrelo primero en la lista general de pasajeros.',
      );
    }
  }

  close() {
    this.onClose.emit();
  }

  getDisplayName(p: any) {
    const nombres = p.nombres || p.pasajero?.nombres || 'Sin nombre';
    const apellidos = p.apellidos || p.pasajero?.apellidos || '';
    return `${nombres} ${apellidos}`.trim();
  }

  getDisplayDni(p: any) {
    return p.dni || p.pasajero?.dni || '---';
  }
}
