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

  // Mode: abordar or desabordar
  modo = signal<'abordar' | 'desabordar'>('abordar');

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
  idsDesabordar = signal<Set<number>>(new Set());

  // Computed for abordar selection
  isAllSelected = computed(() => {
    const editables = this.pasajeros().filter((p) => !this.tieneAsistenciaOtroTramo(p));
    if (editables.length === 0) return false;
    return editables.every((p) => this.idsSeleccionados().has(p.id));
  });

  // Computed: pasajeros abordados (que pueden bajar) — incluye los que ya bajaron en ESTE tramo
  pasajerosAbordados = computed(() => {
    return this.pasajeros().filter(
      (p: ViajePasajeroResultDto) => (p.estaArriba || p.esSalidaTramoActual) && !p.esAsistenciaTramoActual,
    );
  });

  isAllDesabordarSelected = computed(() => {
    const editables = this.pasajerosAbordados().filter((p) => !this.tieneSalidaOtroTramo(p));
    if (editables.length === 0) return false;
    return editables.every((p) => this.idsDesabordar().has(p.id));
  });

  constructor() {}

  ngOnInit() {
    this.loadPasajeros();
  }

  async loadPasajeros() {
    this.loading.set(true);
    try {
      const data = await this.viajeService.findPasajeros(this.viajeId(), this.tramo().id);

      // Ordenar: Verde (Este tramo) > Azul (Otro tramo) > Gris (Pendiente)
      const sortedData = [...data].sort((a, b) => {
        const getWeight = (p: ViajePasajeroResultDto) => {
          if (p.esAsistenciaTramoActual && p.asistencia) return 3; // Verde
          if (this.tieneAsistenciaOtroTramo(p)) return 2; // Azul
          return 1; // Gris
        };

        const weightA = getWeight(a);
        const weightB = getWeight(b);

        if (weightA !== weightB) return weightB - weightA; // Descendente por peso

        return this.getDisplayName(a).localeCompare(this.getDisplayName(b));
      });

      this.pasajeros.set(sortedData);

      // Inicializar selección abordar: los que tienen asistencia en este tramo (los verdes)
      const iniciales = data.filter((p) => p.asistencia && p.esAsistenciaTramoActual).map((p) => p.id);
      this.idsSeleccionados.set(new Set(iniciales));

      // Inicializar selección desabordar: los que tienen salida en este tramo
      const inicialesDesabordar = data.filter((p) => p.esSalidaTramoActual).map((p) => p.id);
      this.idsDesabordar.set(new Set(inicialesDesabordar));
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al cargar pasajeros');
    } finally {
      this.loading.set(false);
    }
  }

  cambiarModo(modo: 'abordar' | 'desabordar') {
    this.modo.set(modo);
  }

  toggleSeleccion(id: number) {
    const p = this.pasajeros().find((p) => p.id === id);
    if (p && this.tieneAsistenciaOtroTramo(p)) return;

    const set = new Set(this.idsSeleccionados());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.idsSeleccionados.set(set);
  }

  toggleSeleccionTodos() {
    // Solo afectar pasajeros editables (sin asistencia en otro tramo)
    const editables = this.pasajeros().filter((p) => !this.tieneAsistenciaOtroTramo(p));
    const newSet = new Set(this.idsSeleccionados());

    if (this.isAllSelected()) {
      editables.forEach((p) => newSet.delete(p.id));
    } else {
      editables.forEach((p) => newSet.add(p.id));
    }
    this.idsSeleccionados.set(newSet);
  }

  toggleDesabordar(id: number) {
    const p = this.pasajeros().find((p) => p.id === id);
    if (p && this.tieneSalidaOtroTramo(p)) return;

    const set = new Set(this.idsDesabordar());
    if (set.has(id)) set.delete(id);
    else set.add(id);
    this.idsDesabordar.set(set);
  }

  toggleDesabordarTodos() {
    const editables = this.pasajerosAbordados().filter((p) => !this.tieneSalidaOtroTramo(p));
    const newSet = new Set(this.idsDesabordar());

    if (this.isAllDesabordarSelected()) {
      editables.forEach((p) => newSet.delete(p.id));
    } else {
      editables.forEach((p) => newSet.add(p.id));
    }
    this.idsDesabordar.set(newSet);
  }

  async guardarCambios() {
    const idsAbordar = Array.from(this.idsSeleccionados()).filter((id) => {
      const p = this.pasajeros().find((pas) => pas.id === id);
      return p ? !this.tieneAsistenciaOtroTramo(p) : false;
    });

    const idsDesabordarArr = Array.from(this.idsDesabordar()).filter((id) => {
      const p = this.pasajeros().find((pas) => pas.id === id);
      return p ? !this.tieneSalidaOtroTramo(p) : false;
    });

    this.isSubmitting.set(true);
    try {
      await Promise.all([
        this.viajeService.abordarPasajeros(
          this.viajeId(),
          { viajePasajeroIds: idsAbordar },
          this.tramo().id,
        ),
        this.viajeService.desabordarPasajeros(
          this.viajeId(),
          { viajePasajeroIds: idsDesabordarArr },
          this.tramo().id,
        ),
      ]);
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
    const nombres = p.nombres || 'Sin nombre';
    const apellidos = p.apellidos || '';
    return `${nombres} ${apellidos}`.trim();
  }

  getDisplayDni(p: ViajePasajeroResultDto) {
    return p.dni || '---';
  }

  /** Retorna true si el pasajero tiene asistencia registrada en otro tramo y aún está arriba */
  tieneAsistenciaOtroTramo(p: ViajePasajeroResultDto) {
    return p.estaArriba && !p.esAsistenciaTramoActual;
  }

  /** Retorna true si el pasajero tiene salida registrada en otro tramo */
  tieneSalidaOtroTramo(p: ViajePasajeroResultDto) {
    // Si ya bajó en un tramo anterior y NO ha vuelto a subir, bloqueamos la salida
    return !p.estaArriba && p.paradaSalidaId != null && !p.esSalidaTramoActual;
  }
}
