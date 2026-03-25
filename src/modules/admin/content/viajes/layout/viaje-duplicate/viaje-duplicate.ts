import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api, ApiQuery, ApiBody, ApiParam, ApiResponse } from 'api/backend.api';
import { ViajeService } from '@service/admin/viaje.service';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '../../../../components/modal-form/modal-form';

interface DuplicateDay {
  date: Date;
  dateStr: string;
  label: string;
  selected: boolean;
  status?: 'loading' | 'valid' | 'invalid';
  message?: string;
}

@Component({
  selector: 'app-viaje-duplicate',
  standalone: true,
  imports: [CommonModule, ModalForm],
  templateUrl: './viaje-duplicate.html',
})
export class ViajeDuplicate implements OnInit {
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);

  // Inputs
  viajeId = input.required<number>();

  // Outputs
  onSuccess = output<void>();
  onClose = output<void>();

  // State
  viaje = signal<ApiResponse<'viajes', 'findOne'> | null>(null);
  days = signal<DuplicateDay[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadViaje();
  }

  async loadViaje() {
    this.loading.set(true);
    try {
      const v = await this.viajeService.findOne(this.viajeId());
      this.viaje.set(v);
      this.generateNextDays();
    } catch (error) {
      this.toastService.error('Error al cargar datos del viaje');
      this.onClose.emit();
    } finally {
      this.loading.set(false);
    }
  }

  generateNextDays() {
    const v = this.viaje();
    if (!v) return;

    const nextDays: DuplicateDay[] = [];
    const today = new Date();
    // Start from tomorrow or from the voyage date + 1
    const startDate = new Date(v.fechaSalidaProgramada || today);
    startDate.setHours(0, 0, 0, 0);
    
    // If voyage date is in the past, start from tomorrow
    if (startDate < today) {
      startDate.setTime(today.getTime());
      startDate.setHours(0, 0, 0, 0);
    }
    
    // Advance 1 day to not duplicate on the same day by default
    startDate.setDate(startDate.getDate() + 1);

    for (let i = 0; i < 20; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      
      nextDays.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        label: this.formatDateLabel(d),
        selected: false,
      });
    }
    this.days.set(nextDays);
  }

  async toggleDay(index: number) {
    const currentDays = [...this.days()];
    const day = currentDays[index];
    day.selected = !day.selected;

    if (day.selected) {
      this.validateDay(index);
    } else {
      day.status = undefined;
      day.message = undefined;
    }

    this.days.set(currentDays);
  }

  async validateDay(index: number) {
    const v = this.viaje();
    if (!v) return;

    const currentDays = [...this.days()];
    const day = currentDays[index];
    day.status = 'loading';
    this.days.set(currentDays);

    const vehiculoId = v.vehiculos?.find((v) => v.esPrincipal)?.id;
    const conductorId = v.conductores?.find((c) => c.esPrincipal)?.id;

    if (!vehiculoId || !conductorId) {
      day.status = 'invalid';
      day.message = 'No hay vehículo o conductor principal asignado';
      this.days.set([...currentDays]);
      return;
    }

    const replaceDate = (isoStr: string | Date | undefined | null, newDateStr: string) => {
      const timePart = this.extractTime(isoStr);
      return `${newDateStr}T${timePart}:00.000Z`;
    };

    const fechaSalida = replaceDate(v.fechaSalidaProgramada, day.dateStr);
    const fechaLlegada = replaceDate(v.fechaLlegadaProgramada, day.dateStr);

    try {
      const [resVeh, resCond] = await Promise.all([
        this.viajeService.validarVehiculo({
          vehiculoId,
          fechaSalida,
          fechaLlegada,
        }),
        this.viajeService.validarConductor({
          conductorId,
          fechaSalida,
          fechaLlegada,
        }),
      ]);

      if (!resVeh.status) {
        day.status = 'invalid';
        day.message = `Vehículo: ${resVeh.message}`;
      } else if (!resCond.status) {
        day.status = 'invalid';
        day.message = `Conductor: ${resCond.message}`;
      } else {
        day.status = 'valid';
      }
    } catch (error) {
      day.status = 'invalid';
      day.message = 'Error al validar disponibilidad';
    } finally {
      this.days.set([...currentDays]);
    }
  }

  formatDateLabel(date: Date): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  }

  private extractTime(dateTime: string | Date | undefined | null): string {
    if (!dateTime) return '10:00';
    const d = new Date(dateTime);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatTimeOnly(date: string | Date | undefined | null): string {
    if (!date) return '--:--';
    return this.extractTime(date);
  }

  async duplicate() {
    const selectedDays = this.days().filter((d) => d.selected);
    if (selectedDays.length === 0) {
      this.toastService.warning('Selecciona al menos un día para duplicar');
      return;
    }

    const originalViaje = this.viaje();
    if (!originalViaje) return;

    this.loading.set(true);
    try {
      // Re-map full details to create payload
      for (const day of selectedDays) {
        const payload = this.preparePayload(originalViaje, day.dateStr);
        await this.viajeService.create(payload);
      }

      this.toastService.success(`Viaje duplicado correctamente para ${selectedDays.length} días`);
      this.onSuccess.emit();
    } catch (error) {
      console.error('Error duplicando viaje:', error);
      this.toastService.error('Error al duplicar el viaje');
    } finally {
      this.loading.set(false);
    }
  }

  private preparePayload(v: ApiResponse<'viajes', 'findOne'>, newDate: string): ApiBody<'viajes', 'create'> {
    const replaceDate = (isoStr: string | Date | undefined | null, newDateStr: string) => {
      const timePart = this.extractTime(isoStr);
      return `${newDateStr}T${timePart}:00.000Z`;
    };

    const detalle: NonNullable<ApiBody<'viajes', 'create'>['ida']> = {
      clienteId: v.clienteId,
      entidadId: v.entidadId || undefined,
      encargadoId: v.encargadoId || undefined,
      tipoRuta: v.tipoRuta as any,
      nombreRuta: v.nombreRuta || '',
      rutaId: v.rutaId || undefined,
      rutaOcasional: v.rutaOcasional || undefined,
      distanciaEstimada: v.distanciaEstimada || undefined,
      modalidadServicio: v.modalidadServicio as any,
      fechaSalidaProgramada: replaceDate(v.fechaSalidaProgramada, newDate),
      fechaLlegadaProgramada: replaceDate(v.fechaLlegadaProgramada, newDate),
      estado: 'programado',
      turno: v.turno as any,
      sentido: v.sentido as any,
      vehiculoId: v.vehiculos?.find(veh => veh.esPrincipal)?.id,
      conductorId: v.conductores?.find(cond => cond.esPrincipal)?.id,
      metadata: v.metadata as any,
    };

    return v.sentido === 'vuelta' ? { vuelta: detalle } : { ida: detalle };
  }
}
