import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaService } from '@service/admin/auditoria.service';

@Component({
  selector: 'app-historial-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-detail.html',
  styleUrl: './historial-detail.css',
})
export class HistorialDetail {
  auditoriaId = input<number>();
  private auditoriaService = inject(AuditoriaService);

  auditoria = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.auditoriaId();
      if (id) {
        this.loadAuditoriaData(id);
      }
    });
  }

  async loadAuditoriaData(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.auditoriaService.findOne(id);
      this.auditoria.set(data);
    } catch (err) {
      console.error('Error loading auditoria:', err);
      this.error.set('Error al cargar el registro de auditoría');
    } finally {
      this.loading.set(false);
    }
  }

  formatJson(json: any): string {
    return JSON.stringify(json, null, 2);
  }
  
  isObject(val: any): boolean {
    return val !== null && typeof val === 'object';
  }
  
  getEntries(obj: any): [string, any][] {
    return Object.entries(obj);
  }
}
