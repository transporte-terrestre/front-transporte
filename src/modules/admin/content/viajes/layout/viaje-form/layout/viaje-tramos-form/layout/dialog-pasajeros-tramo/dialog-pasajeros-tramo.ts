import { Component, inject, input, output, OnInit, signal, effect, computed } from '@angular/core';
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
import { ViajePasajeroResultDto, ViajeTramoResultDto } from 'api/backend.api';

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
  tramo = input.required<ViajeTramoResultDto>();
  capacidad = input<number>(0);

  // Computed
  porcentajeOcupacion = computed(() => {
    const num = this.tramo().numeroPasajeros || 0;
    const cap = this.capacidad();
    if (cap === 0) return 0;
    return Math.min(100, Math.round((num / cap) * 100));
  });

  // Outputs
  onSaved = output<boolean>();
  onClose = output<void>();

  // State
  loading = signal(false);
  isSubmitting = signal(false);
  pasajeros = signal<ViajePasajeroResultDto[]>([]);
  idsSeleccionados = signal<Set<number>>(new Set());

  // Computed for selection
  isAllSelected = computed(() => {
    const list = this.pasajeros();
    if (list.length === 0) return false;
    return list.every((p) => this.idsSeleccionados().has(p.id));
  });

  constructor() {}

  ngOnInit() {
    this.loadPasajeros();
  }

  async loadPasajeros() {
    this.loading.set(true);
    try {
      const data = await this.viajeService.findPasajeros(this.viajeId(), this.tramo().id);
      this.pasajeros.set(data);

      // Inicializar selección con los que ya tienen asistencia
      const iniciales = data.filter((p) => p.asistencia).map((p) => p.id);
      this.idsSeleccionados.set(new Set(iniciales));
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al cargar pasajeros');
    } finally {
      this.loading.set(false);
    }
  }

  toggleSeleccion(id: number) {
    const set = new Set(this.idsSeleccionados());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.idsSeleccionados.set(set);
  }

  toggleSeleccionTodos() {
    const list = this.pasajeros();
    const newSet = new Set(this.idsSeleccionados());

    if (this.isAllSelected()) {
      list.forEach((p) => newSet.delete(p.id));
    } else {
      list.forEach((p) => newSet.add(p.id));
    }
    this.idsSeleccionados.set(newSet);
  }

  async guardarCambios() {
    const ids = Array.from(this.idsSeleccionados());
    this.isSubmitting.set(true);
    try {
      await this.viajeService.abordarPasajeros(
        this.viajeId(),
        { viajePasajeroIds: ids },
        this.tramo().id,
      );
      this.toastService.success('Cambios guardados correctamente');
      await this.loadPasajeros();
      this.onSaved.emit(false);
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al guardar cambios');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  close() {
    this.onClose.emit();
  }

  getDisplayName(p: ViajePasajeroResultDto) {
    const nombres = p.nombres || p.pasajero?.nombres || 'Sin nombre';
    const apellidos = p.apellidos || p.pasajero?.apellidos || '';
    return `${nombres} ${apellidos}`.trim();
  }

  getDisplayDni(p: ViajePasajeroResultDto) {
    return p.dni || p.pasajero?.dni || '---';
  }
}
