import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ApiResponse,
  DocumentosAgrupadosMantenimientoDto,
  MantenimientoDocumentoResultDto,
} from 'api/backend.api';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { PATH, buildPath } from '@route/path.route';

type MantenimientoDocumentType = keyof DocumentosAgrupadosMantenimientoDto;

@Component({
  selector: 'app-mantenimiento-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mantenimiento-detail.html',
  styleUrl: './mantenimiento-detail.css',
})
export class MantenimientoDetail {
  mantenimientoId = input<number>();
  private mantenimientoService = inject(MantenimientoService);
  private router = inject(Router);

  mantenimiento = signal<ApiResponse<'mantenimientos', 'findOne'> | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.mantenimientoId();
      if (id) {
        this.loadMantenimiento(id);
      }
    });
  }

  async loadMantenimiento(id: number) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const data = await this.mantenimientoService.findOne(id);
      this.mantenimiento.set(data);
    } catch (err) {
      console.error('Error loading mantenimiento:', err);
      this.error.set('Error al cargar el mantenimiento');
    } finally {
      this.loading.set(false);
    }
  }

  documentTypes: { value: MantenimientoDocumentType; label: string; icon: string }[] = [
    { value: 'factura', label: 'Factura', icon: 'fa-file-invoice' },
    { value: 'guia_remision', label: 'Guía de Remisión', icon: 'fa-file-alt' },
    { value: 'informe_tecnico', label: 'Informe Técnico', icon: 'fa-file-contract' },
    { value: 'cotizacion', label: 'Cotización', icon: 'fa-file-signature' },
    { value: 'fotos', label: 'Fotos', icon: 'fa-images' },
    { value: 'cartilla', label: 'Cartilla', icon: 'fa-clipboard-list' },
    { value: 'otros', label: 'Otros', icon: 'fa-file' },
  ];

  getDocumentosByType(type: MantenimientoDocumentType): MantenimientoDocumentoResultDto[] {
    const documentos = this.mantenimiento()?.documentos?.[type] || [];

    return [...documentos].sort((a, b) => {
      const dateDifference =
        new Date(b.creadoEn ?? 0).getTime() - new Date(a.creadoEn ?? 0).getTime();
      return dateDifference || b.id - a.id;
    });
  }

  getDocumentosCount(): number {
    const documentos = this.mantenimiento()?.documentos;
    if (!documentos) return 0;

    return Object.values(documentos).reduce((total, current) => total + current.length, 0);
  }

  editMantenimiento() {
    const id = this.mantenimiento()?.id;
    if (!id) return;

    const path = buildPath(PATH.admin.mantenimientos.edit).replace(':id', id.toString());
    this.router.navigate([path]);
  }

  getTipoLabel(tipo: ApiResponse<'mantenimientos', 'findOne'>['tipo']): string {
    return tipo === 'preventivo' ? 'Preventivo' : 'Correctivo';
  }

  getTipoIcon(tipo: ApiResponse<'mantenimientos', 'findOne'>['tipo']): string {
    return tipo === 'preventivo' ? 'fa-shield-alt' : 'fa-wrench';
  }

  getEstadoLabel(estado: ApiResponse<'mantenimientos', 'findOne'>['estado']): string {
    switch (estado) {
      case 'pendiente':
        return 'Pendiente';
      case 'en_proceso':
        return 'En Proceso';
      case 'finalizado':
        return 'Finalizado';
    }
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  formatDateTime(dateString: string | null | undefined): string {
    if (!dateString) return '-';

    return new Date(dateString).toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatCurrency(value: string | number | null | undefined, moneda: 'PEN' | 'USD' = 'PEN'): string {
    if (value === null || value === undefined || value === '') return '-';

    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: moneda,
    }).format(Number(value));
  }

  formatKilometraje(value: number | null | undefined): string {
    if (value === null || value === undefined) return '-';
    return `${new Intl.NumberFormat('es-PE').format(value)} km`;
  }
}
