import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '@service/admin/cliente.service';
import { AlquilerService } from '@service/admin/alquiler.service';
import { ToastService } from '@service/toast.service';
import { ClienteListDto, AlquilerItemDto } from '@api/backend.api';
import * as XLSX from 'xlsx';

export interface ReportClienteItem {
  Cliente: string;
  RUC: string;
  Placa: string;
  'Marca/Modelo': string;
  Conductor: string;
  'Fecha Inicio': string;
  'Tiempo Transcurrido': string;
  HasUnits: boolean;
}

@Component({
  selector: 'app-reportes-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes-clientes.html',
  styleUrl: './reportes-clientes.css',
})
export class ReportesClientes implements OnInit {
  private clienteService = inject(ClienteService);
  private alquilerService = inject(AlquilerService);
  private toastService = inject(ToastService);

  loading = signal(false);
  reportData = signal<ReportClienteItem[]>([]);

  ngOnInit(): void {
    this.loadReportData();
  }

  async loadReportData() {
    this.loading.set(true);
    try {
      const clientsResponse = await this.clienteService.findAll({ limit: 100 });
      const clients: ClienteListDto[] = clientsResponse.data;

      const rentalsResponse = await this.alquilerService.findAll({ 
        estado: 'activo', 
        limit: 100 
      });
      const rentals: AlquilerItemDto[] = rentalsResponse.data;

      const results: ReportClienteItem[] = [];
      clients.forEach(client => {
        const clientRentals = rentals.filter(r => r.clienteId === client.id);
        if (clientRentals.length === 0) {
          results.push({
            'Cliente': client.razonSocial || client.nombreCompleto || '—',
            'RUC': client.ruc || client.dni || '—',
            'Placa': 'Sin unidades',
            'Marca/Modelo': '—',
            'Conductor': '—',
            'Fecha Inicio': '—',
            'Tiempo Transcurrido': '—',
            'HasUnits': false
          });
        } else {
          clientRentals.forEach(rental => {
            const fechaInicio = new Date(rental.fechaInicio);
            const hoy = new Date();
            const diffTime = Math.abs(hoy.getTime() - fechaInicio.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const vehiculo = rental.vehiculo;
            const conductor = rental.conductor;

            results.push({
              'Cliente': client.razonSocial || client.nombreCompleto || '—',
              'RUC': client.ruc || client.dni || '—',
              'Placa': vehiculo?.placa || '—',
              'Marca/Modelo': `${vehiculo?.marca || ''} ${vehiculo?.modelo || ''}`.trim() || '—',
              'Conductor': conductor?.nombreCompleto || '—',
              'Fecha Inicio': fechaInicio.toLocaleDateString(),
              'Tiempo Transcurrido': `${diffDays} días`,
              'HasUnits': true
            });
          });
        }
      });
      this.reportData.set(results);
    } catch (error) {
      console.error('Error loading report data:', error);
      this.toastService.error('Error al cargar datos del reporte');
    } finally {
      this.loading.set(false);
    }
  }

  downloadExcel() {
    if (this.reportData().length === 0) {
      this.toastService.warning('No hay datos para exportar');
      return;
    }
    
    // Remove internal flag for Excel
    const excelData = this.reportData().map(({ HasUnits, ...rest }) => rest);
    
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Clientes');
    XLSX.writeFile(wb, `Reporte_Clientes_Unidades_${new Date().toISOString().split('T')[0]}.xlsx`);
    this.toastService.success('Excel descargado exitosamente');
  }
}
