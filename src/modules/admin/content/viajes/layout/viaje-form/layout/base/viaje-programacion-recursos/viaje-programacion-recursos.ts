import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ViajeFormService } from '../../../viaje-form.service';

@Component({
  selector: 'app-viaje-programacion-recursos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-programacion-recursos.html',
})
export class ViajeProgramacionRecursos {
  viajeContext = inject(ViajeFormService);

  tipo = input<'ida' | 'vuelta'>('ida');

  get form() {
    return this.viajeContext.viajeForm;
  }

  get editMode() {
    return this.viajeContext.editMode;
  }

  get vehiculoValidacionMsg() {
    return this.viajeContext.vehiculoValidacionMsg;
  }

  get conductorValidacionMsg() {
    return this.viajeContext.conductorValidacionMsg;
  }
}
