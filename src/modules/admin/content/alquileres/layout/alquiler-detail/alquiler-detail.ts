import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AlquilerDocumentoResultDto,
  ApiResponse,
  DocumentosAgrupadosAlquilerDto,
} from 'api/backend.api';
import { AlquilerService } from '@service/admin/alquiler.service';
import { DescargasService } from '@service/admin/descargas.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';

@Component({
  selector: 'app-alquiler-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alquiler-detail.html',
  styleUrl: './alquiler-detail.css',
})
export class AlquilerDetail {
  alquilerId = input<number>();
  private alquilerService = inject(AlquilerService);
  private descargasService = inject(DescargasService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  alquiler = signal<ApiResponse<'alquileres', 'findOne'> | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  isDownloadingDocs = signal(false);

  documentTypes: {
    value: keyof DocumentosAgrupadosAlquilerDto;
    label: string;
  }[] = [
    { value: 'contrato', label: 'Contrato' },
    { value: 'documentacion', label: 'Documentación' },
    { value: 'guia_remision', label: 'Guía de Remisión' },
    { value: 'acta_entrega', label: 'Acta de Entrega' },
    { value: 'acta_devolucion', label: 'Acta de Devolución' },
    { value: 'comprobante_pago', label: 'Comprobante de Pago' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    effect(() => {
      const id = this.alquilerId();
      if (id) {
        this.loadAlquiler(id);
      }
    });
  }

  async loadAlquiler(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.alquilerService.findOne(id);
      this.alquiler.set(data);
    } catch (err) {
      console.error('Error loading alquiler:', err);
      this.error.set('Error al cargar la información del alquiler');
    } finally {
      this.loading.set(false);
    }
  }

  getStatusClass(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'activo': return 'text-success bg-success/10 px-2 py-0.5 rounded-md';
      case 'finalizado': return 'text-info bg-info/10 px-2 py-0.5 rounded-md';
      case 'cancelado': return 'text-danger bg-danger/10 px-2 py-0.5 rounded-md';
      default: return 'text-text/60 bg-text/5 px-2 py-0.5 rounded-md';
    }
  }

  formatDate(date: string | null): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(
    value: string | number | null | undefined,
    moneda: 'PEN' | 'USD' = 'PEN',
  ): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  }

  getDocumentSections(): {
    tipo: keyof DocumentosAgrupadosAlquilerDto;
    label: string;
    documentos: AlquilerDocumentoResultDto[];
  }[] {
    const documentos = this.alquiler()?.documentos;
    if (!documentos) return [];

    return this.documentTypes
      .map((docType) => ({
        tipo: docType.value,
        label: docType.label,
        documentos: documentos[docType.value] || [],
      }))
      .filter((section) => section.documentos.length > 0);
  }

  getCleanClientName(): string {
    const cliente = this.alquiler()?.cliente as any;
    if (!cliente) return '—';
    
    // Si tenemos razonSocial, es un centro o empresa
    if (cliente.razonSocial && cliente.razonSocial.trim()) {
      return cliente.razonSocial;
    }

    // Si tenemos nombreCompleto y NO es el string literal "UNDEFINED UNDEFINED"
    if (cliente.nombreCompleto && 
        cliente.nombreCompleto.toUpperCase() !== 'UNDEFINED UNDEFINED' && 
        cliente.nombreCompleto.trim().length > 0) {
      return cliente.nombreCompleto;
    }

    // Fallback al concatenado manual si existen campos
    if (cliente.nombres || cliente.apellidos) {
      const n = cliente.nombres || '';
      const a = cliente.apellidos || '';
      const full = `${n} ${a}`.trim();
      if (full && full.toUpperCase() !== 'UNDEFINED UNDEFINED') return full;
    }

    return '—';
  }

  async descargarDocumentos() {
    const alq = this.alquiler();
    if (!alq || !alq.detalles || alq.detalles.length === 0) return;

    const vehiculos: Record<number, string[]> = {};
    const conductores: Record<number, string[]> = {};

    alq.detalles.forEach((det: any) => {
      if (det.vehiculoId) {
        vehiculos[det.vehiculoId] = ['*'];
      }
      if (det.conductorId) {
        conductores[det.conductorId] = ['*'];
      }
    });

    const payload = { vehiculos, conductores };

    this.alertService.confirm(
      'Descargar Documentos',
      'Se comprimirán todos los documentos de los vehículos y conductores asignados. Este proceso puede tardar hasta 10 segundos dependiendo de la cantidad de archivos. ¿Deseas continuar?',
      async () => {
        try {
          this.isDownloadingDocs.set(true);
          const blob = await this.descargasService.descargarDocumentosZip(payload);
          
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Documentos_Alquiler_${alq.id}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          
          this.toastService.success('Documentos descargados correctamente');
        } catch (err: any) {
          console.error(err);
          this.toastService.error(err.message || 'Error al descargar documentos');
        } finally {
          this.isDownloadingDocs.set(false);
        }
      }
    );
  }
}
