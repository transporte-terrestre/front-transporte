import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesService } from '@service/admin/reportes.service';

@Component({
  selector: 'app-reportes-conductores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-conductores.html',
})
export class ReportesConductores {
  private reportesService = inject(ReportesService);

  downloadExcel() {
    this.reportesService.downloadReporteConductoresExcel();
  }
}
