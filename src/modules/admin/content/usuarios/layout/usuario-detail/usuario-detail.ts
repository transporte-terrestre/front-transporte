import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { UsuarioService } from '@service/admin/usuario.service';

type Usuario = ApiResponse<'usuarios', 'findOne'>;

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuario-detail.html',
  styleUrl: './usuario-detail.css',
})
export class UsuarioDetail {
  usuarioId = input<number>();
  private usuarioService = inject(UsuarioService);

  usuario = signal<Usuario | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.usuarioId();
      if (id) {
        this.loadUsuarioData(id);
      }
    });
  }

  async loadUsuarioData(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.usuarioService.findOne(id);
      this.usuario.set(data);
    } catch (err) {
      console.error('Error loading usuario:', err);
      this.error.set('Error al cargar la información del usuario');
    } finally {
      this.loading.set(false);
    }
  }

  getDocumentosByType(type: string) {
    const u = this.usuario();
    if (!u || !u.documentos) return [];

    // Si es array (flat), filtramos
    if (Array.isArray(u.documentos)) {
      return u.documentos.filter((d: any) => d.tipo === type);
    }

    // Si es objeto (agrupado por tipo), accedemos por key
    return (u.documentos as any)[type] || [];
  }

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'seguro_vida_ley', label: 'Seguro Vida Ley' },
    { value: 'sctr', label: 'SCTR' },
    { value: 'examen_medico', label: 'Examen Médico' },
    { value: 'induccion_general', label: 'Inducción General' },
    { value: 'firma', label: 'Firma / Rúbrica' },
  ];
}
