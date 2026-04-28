import { Component, signal, inject, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { StorageService } from '@service/admin/storage.service';
import { ApiResponse } from 'api/backend.api';
import { VehiculoInputSearch } from '@module/admin/components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';

@Component({
  selector: 'app-vehiculo-upload-many',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalForm, VehiculoInputSearch],
  templateUrl: './vehiculo-upload-many.html',
  styleUrl: './vehiculo-upload-many.css',
})
export class VehiculoUploadMany implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);

  onUploaded = output<void>();

  showModal = signal(false);
  loading = signal(false);

  excludedVehiculos = signal<ApiResponse<'vehiculos', 'findAll'>['data']>([]);

  pendingFile: File | null = null;
  fileName = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    tipo: ['', Validators.required],
    nombre: ['', Validators.required],
    fechaEmision: [''],
    fechaExpiracion: [''],
  });

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
    { value: 'certificado_extintores_hidrostatica', label: 'Certificado P. Hidrostática (Extintores)' },
    { value: 'certificado_extintores_operatividad', label: 'Certificado Operatividad (Extintores)' },
    { value: 'certificado_rops', label: 'Certificado ROPS' },
    { value: 'certificado_radio_frecuencia', label: 'Certificado Radio Frecuencia' },
    { value: 'certificacion_frenos', label: 'Certificación de Frenos' },
    { value: 'certificado_laminados_lunas', label: 'Certificado Laminados Lunas' },
    { value: 'certificado_carroceria', label: 'Certificado de Carrocería' },
    { value: 'certificado_caracteristicas_tecnicas', label: 'Certificado Características Técnicas' },
    { value: 'certificado_adas', label: 'Certificado ADAS' },
  ];

  ngOnInit() {
  }

  async openModal() {
    this.form.reset({ tipo: '', nombre: '', fechaEmision: '', fechaExpiracion: '' });
    this.pendingFile = null;
    this.fileName.set(null);
    this.excludedVehiculos.set([]);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.pendingFile = file;
    this.fileName.set(file.name);
  }

  onVehiculoSelected(vehiculo: ApiResponse<'vehiculos', 'findAll'>['data'][number] | null) {
    if (!vehiculo) return;
    const current = this.excludedVehiculos();
    if (!current.find(v => v.id === vehiculo.id)) {
      this.excludedVehiculos.set([...current, vehiculo]);
    }
  }

  removeExclusion(id: number) {
    this.excludedVehiculos.update(list => list.filter(v => v.id !== id));
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Completa los campos obligatorios');
      return;
    }
    if (!this.pendingFile) {
      this.toastService.error('Debes seleccionar un archivo');
      return;
    }

    this.loading.set(true);
    try {
      const uploadRes = await this.storageService.upload(this.pendingFile, 'documentos_masivos');
      if (!uploadRes) throw new Error('No se pudo subir el archivo');

      const values = this.form.value;

      const payload: any = {
        documento: {
          tipo: values.tipo,
          nombre: values.nombre,
          url: uploadRes.secureUrl,
          ...(values.fechaEmision ? { fechaEmision: new Date(values.fechaEmision).toISOString() } : {}),
          ...(values.fechaExpiracion ? { fechaExpiracion: new Date(values.fechaExpiracion).toISOString() } : {})
        }
      };

      const exclusions = this.excludedVehiculos().map(v => v.id);
      if (exclusions.length > 0) {
        payload.excepto = exclusions;
      }

      const response = await this.vehiculoService.createDocumentoMasivo(payload);

      this.toastService.success(response?.message || 'Documento subido masivamente con éxito');
      this.showModal.set(false);
      this.onUploaded.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al realizar la carga masiva');
    } finally {
      this.loading.set(false);
    }
  }
}
