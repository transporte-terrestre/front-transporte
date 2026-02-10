import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { ConductorService } from '@service/admin/conductor.service';

type Conductor = ApiResponse<'conductores', 'findOne'> & { documentos: any[] };

@Component({
  selector: 'app-conductor-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conductor-detail.html',
  styleUrl: './conductor-detail.css',
})
export class ConductorDetail {
  conductorId = input<number>();
  private conductorService = inject(ConductorService);

  conductor = signal<Conductor | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.conductorId();
      if (id) {
        this.loadConductor(id);
      }
    });
  }

  async loadConductor(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.conductorService.findOne(id);
      this.conductor.set(data as any);
    } catch (err) {
      console.error('Error loading conductor:', err);
      this.error.set('Error al cargar conductor');
    } finally {
      this.loading.set(false);
    }
  }

  getDocumentosByType(type: string) {
    const c = this.conductor();
    if (!c || !c.documentos) return [];

    // Si es array (flat), filtramos
    if (Array.isArray(c.documentos)) {
      return c.documentos.filter((d: any) => d.tipo === type);
    }

    // Si es objeto (agrupado), accedemos por key
    return (c.documentos as any)[type] || [];
  }

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'licencia_mtc', label: 'Licencia MTC' },
    { value: 'seguro_vida_ley', label: 'Seguro Vida Ley' },
    { value: 'sctr', label: 'SCTR' },
    { value: 'examen_medico', label: 'Examen Médico' },
    { value: 'examen_medico_temporal', label: 'Examen Médico Temporal' },
    { value: 'psicosensometrico', label: 'Psicosensométrico' },
    { value: 'induccion_general', label: 'Inducción General - Anexo 4' },
    { value: 'induccion_visita', label: 'Inducción Visita' },
    { value: 'manejo_defensivo', label: 'Manejo Defensivo AAQ' },
    { value: 'licencia_interna', label: 'Licencia Interna' },
    { value: 'autoriza_ssgg', label: 'Autoriza SSGG' },
    { value: 'curso_seguridad_portuaria', label: 'Curso Seguridad Portuaria' },
    { value: 'curso_mercancias_peligrosas', label: 'Curso Mercancías Peligrosas' },
    { value: 'curso_basico_pbip', label: 'Curso Básico PBIP' },
    { value: 'em_visita', label: 'EM Visita' },
    { value: 'pase_conduc', label: 'Pase Conduc' },
    { value: 'foto_funcionario', label: 'Foto Funcionario' },
  ];
}
