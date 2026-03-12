import { Component, input, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { VehiculoComentariosForm } from '../vehiculo-form/layout/vehiculo-comentarios-form/vehiculo-comentarios-form';

type Vehiculo = ApiResponse<'vehiculos', 'findOne'> & { documentos: any[] };

@Component({
  selector: 'app-vehiculo-detail',
  standalone: true,
  imports: [CommonModule, VehiculoComentariosForm],
  templateUrl: './vehiculo-detail.html',
  styleUrl: './vehiculo-detail.css',
})
export class VehiculoDetail {
  vehiculoId = input<number>();
  private vehiculoService = inject(VehiculoService);

  vehiculo = signal<Vehiculo | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.vehiculoId();
      if (id) {
        this.loadVehiculo(id);
      }
    });
  }

  async loadVehiculo(id: number) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.vehiculoService.findOne(id);
      this.vehiculo.set(data as any);
    } catch (err) {
      console.error('Error loading vehiculo:', err);
      this.error.set('Error al cargar el vehículo');
    } finally {
      this.loading.set(false);
    }
  }

  handleDataChange() {
    const id = this.vehiculoId();
    if (id) {
      this.loadVehiculo(id);
    }
  }

  getDocumentosByType(type: string) {
    const v = this.vehiculo();
    if (!v || !v.documentos) return [];

    // Si es array (flat), filtramos
    if (Array.isArray(v.documentos)) {
      return v.documentos.filter((d: any) => d.tipo === type);
    }

    // Si es objeto (agrupado por tipo), accedemos por key
    return (v.documentos as any)[type] || [];
  }

  documentTypes = [
    { value: 'tarjeta_propiedad', label: 'Tarjeta de Propiedad' },
    { value: 'tarjeta_unica_circulacion', label: 'Tarjeta Única de Circulación' },
    { value: 'citv', label: 'Revisión Técnica (CITV)' },
    { value: 'soat', label: 'SOAT' },
    { value: 'poliza', label: 'Póliza de Seguro' },
    { value: 'certificado_operatividad_factura', label: 'Certificado de Operatividad / Factura' },
    { value: 'plan_mantenimiento_historico', label: 'Plan de Mantenimiento Histórico' },
    { value: 'certificado_instalacion_gps', label: 'Certificado de Instalación GPS' },
    { value: 'certificado_valor_anadido', label: 'Certificado de Valor Añadido' },
    { value: 'constancia_gps', label: 'Constancia GPS' },
    { value: 'certificado_tacos', label: 'Certificado de Tacos' },
    {
      value: 'certificado_extintores_hidrostatica',
      label: 'Cert. Prueba Hidrostática (Extintores)',
    },
    {
      value: 'certificado_extintores_operatividad',
      label: 'Cert. Operatividad (Extintores)',
    },
    { value: 'certificado_rops', label: 'Certificado ROPS' },
    { value: 'certificado_radio_frecuencia', label: 'Cert. Radio Frecuencia' },
    { value: 'certificacion_frenos', label: 'Certificación de Frenos' },
    { value: 'certificado_laminados_lunas', label: 'Certificado Laminados Lunas' },
    { value: 'certificado_carroceria', label: 'Certificado de Carrocería' },
    {
      value: 'certificado_caracteristicas_tecnicas',
      label: 'Certificado Características Técnicas',
    },
    { value: 'certificado_adas', label: 'Certificado ADAS' },
    { value: 'otros', label: 'Otros Documentos' },
  ];
}
