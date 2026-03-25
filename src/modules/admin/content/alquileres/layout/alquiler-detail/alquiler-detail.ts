import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { AlquilerService } from '@service/admin/alquiler.service';

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

  alquiler = signal<ApiResponse<'alquileres', 'findOne'> | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

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
}
