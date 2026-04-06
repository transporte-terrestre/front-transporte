import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportesViaje, ViajeReportMode } from './layout/reportes-viaje/reportes-viaje';
import {
  ReportesMantenimiento,
  MantenimientoReportMode,
} from './layout/reportes-mantenimiento/reportes-mantenimiento';
import { ReportesConductores } from './layout/reportes-conductores/reportes-conductores';
import { ReportesClientes } from './layout/reportes-clientes/reportes-clientes';
import { ReportesResumen } from './layout/reportes-resumen/reportes-resumen';

type ReportCategory = 'viajes' | 'mantenimientos' | 'conductores' | 'clientes' | 'resumen';

type ReportMode = ViajeReportMode | MantenimientoReportMode;

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReportesViaje, ReportesMantenimiento, ReportesConductores, ReportesClientes, ReportesResumen],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {
  // Report category (viajes vs mantenimientos)
  reportCategory = signal<ReportCategory>('viajes');

  // Report mode
  activeMode = signal<ReportMode>('vehiculo');

  onCategoryChange(category: ReportCategory) {
    this.reportCategory.set(category);
    // Auto-select first mode of the category
    if (category === 'viajes') {
      this.activeMode.set('vehiculo');
    } else if (category === 'mantenimientos') {
      this.activeMode.set('mantenimientos-vehiculo');
    } else if (category === 'resumen') {
      this.activeMode.set('vehiculo');
    }
  }

  onModeChange(mode: ReportMode) {
    this.activeMode.set(mode);
  }

  // Helper to get the viaje mode (for child component)
  getViajeMode(): ViajeReportMode {
    return this.activeMode() as ViajeReportMode;
  }

  // Helper to get the mantenimiento mode (for child component)
  getMantenimientoMode(): MantenimientoReportMode {
    return this.activeMode() as MantenimientoReportMode;
  }
}
