import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionVehiculo } from './layout/section-vehiculo/section-vehiculo';
import { SectionConductor } from './layout/section-conductor/section-conductor';
import { SectionCliente } from './layout/section-cliente/section-cliente';

export type ViajeReportMode = 'vehiculo' | 'conductor' | 'cliente';

@Component({
  selector: 'app-reportes-viaje',
  standalone: true,
  imports: [
    CommonModule,
    SectionVehiculo,
    SectionConductor,
    SectionCliente,
  ],
  templateUrl: './reportes-viaje.html',
  styleUrl: './reportes-viaje.css',
})
export class ReportesViaje {
  activeMode = input.required<ViajeReportMode>();
}
