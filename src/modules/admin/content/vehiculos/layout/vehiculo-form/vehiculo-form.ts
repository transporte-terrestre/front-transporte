import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  VehiculoResultDto,
  VehiculoCreateDto,
  VehiculoUpdateDto,
  VehiculoDocumentoCreateDto,
  VehiculoDocumentoResultDto,
  DocumentosAgrupadosVehiculoDto,
} from '@interface/admin/vehiculo.interface';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-vehiculo-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './vehiculo-form.html',
  styleUrl: './vehiculo-form.css',
})
export class VehiculoForm implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  // Inputs
  vehiculo = input<VehiculoResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<VehiculoCreateDto | VehiculoUpdateDto>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosVehiculoDto | null>(null);

  vehiculoForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,7}$/)]],
    codigoInterno: ['', [Validators.required, Validators.maxLength(20)]],
    marca: ['', [Validators.required, Validators.minLength(2)]],
    modelo: ['', [Validators.required, Validators.minLength(2)]],
    anio: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    estado: ['activo', [Validators.required]],
  });

  estados: Array<{ value: 'activo' | 'taller' | 'retirado'; label: string; icon: string }> = [
    { value: 'activo', label: 'Activo', icon: 'fa-check-circle' },
    { value: 'taller', label: 'En Taller', icon: 'fa-wrench' },
    { value: 'retirado', label: 'Retirado', icon: 'fa-times-circle' },
  ];

  documentTypes = [
    { value: 'tarjeta_propiedad', label: 'Tarjeta de Propiedad' },
    { value: 'tarjeta_unica_circulacion', label: 'Tarjeta Única de Circulación' },
    { value: 'citv', label: 'CITV' },
    { value: 'soat', label: 'SOAT' },
    { value: 'poliza', label: 'Póliza' },
    { value: 'certificado_operatividad_factura', label: 'Cert. Operatividad / Factura' },
    { value: 'plan_mantenimiento_historico', label: 'Plan de Mantenimiento Histórico' },
    { value: 'certificado_instalacion_gps', label: 'Cert. Instalación GPS' },
    { value: 'certificado_valor_anadido', label: 'Cert. Valor Añadido' },
    { value: 'constancia_gps', label: 'Constancia GPS' },
    { value: 'certificado_tacos', label: 'Cert. Tacos' },
    { value: 'certificado_extintores_hidrostatica', label: 'Cert. Extintores / Hidrostática' },
    { value: 'certificado_norma_r66', label: 'Cert. Norma R66' },
    { value: 'certificado_laminados_lunas', label: 'Cert. Laminados Lunas' },
    { value: 'certificado_carroceria', label: 'Cert. Carrocería' },
    { value: 'certificado_caracteristicas_tecnicas', label: 'Cert. Características Técnicas' },
    { value: 'certificado_adas', label: 'Cert. ADAS' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    // Effect para actualizar formulario cuando cambia el vehículo
    effect(() => {
      const vehiculoData = this.vehiculo();
      const isEditMode = this.editMode();

      if (isEditMode && vehiculoData) {
        this.vehiculoForm.patchValue({
          placa: vehiculoData.placa,
          codigoInterno: vehiculoData.codigoInterno,
          marca: vehiculoData.marca,
          modelo: vehiculoData.modelo,
          anio: vehiculoData.anio,
          kilometraje: vehiculoData.kilometraje,
          estado: vehiculoData.estado,
        });
        this.imagenes.set(vehiculoData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(vehiculoData.documentos)));
      } else {
        this.vehiculoForm.reset({ estado: 'activo' });
        this.imagenes.set([]);
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {}

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.vehiculoForm.value,
      imagenes: this.imagenes(),
    };
    this.onSubmitForm.emit(formData);
  }

  // Document Management
  handleDocumentUpload(event: DocumentWithDate, tipo: string) {
    if (!this.vehiculo()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: VehiculoDocumentoCreateDto = {
      vehiculoId: this.vehiculo()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.vehiculoService.createDocumento(documento).subscribe({
      next: (doc) => {
        this.toastService.success('Documento guardado exitosamente');
        this.addDocumentToLocalList(doc);
      },
      error: (err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error('Error al guardar documento');
      },
    });
  }

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.vehiculoService
      .updateDocumento(event.id, {
        fechaEmision: event.fechaEmision,
        fechaExpiracion: event.fechaExpiracion,
      })
      .subscribe({
        next: (doc) => {
          this.toastService.success('Documento actualizado exitosamente');
          this.updateDocumentInLocalList(doc);
        },
        error: (err) => {
          console.error('Error al actualizar documento:', err);
          this.toastService.error('Error al actualizar documento');
        },
      });
  }

  deleteDocument(id: number, tipo: string) {
    this.vehiculoService.deleteDocumento(id).subscribe({
      next: () => {
        this.toastService.success('Documento eliminado exitosamente');
        this.removeDocumentFromLocalList(id, tipo);
      },
      error: (err) => {
        console.error('Error al eliminar documento:', err);
        this.toastService.error('Error al eliminar documento');
      },
    });
  }

  private addDocumentToLocalList(doc: VehiculoDocumentoResultDto) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof DocumentosAgrupadosVehiculoDto;
      const newDocs = { ...docs };
      if (!newDocs[tipo]) {
        newDocs[tipo] = [];
      }
      newDocs[tipo] = [...newDocs[tipo], doc];
      this.localDocuments.set(newDocs);
    }
  }

  private updateDocumentInLocalList(doc: VehiculoDocumentoResultDto) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof DocumentosAgrupadosVehiculoDto;
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].map((d) => (d.id === doc.id ? doc : d));
        this.localDocuments.set(newDocs);
      }
    }
  }

  private removeDocumentFromLocalList(id: number, tipo: string) {
    const docs = this.localDocuments();
    if (docs) {
      const tipoKey = tipo as keyof DocumentosAgrupadosVehiculoDto;
      if (docs[tipoKey]) {
        const newDocs = { ...docs };
        newDocs[tipoKey] = newDocs[tipoKey].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: string): VehiculoDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    const tipoKey = tipo as keyof DocumentosAgrupadosVehiculoDto;
    return docs[tipoKey] || [];
  }
}
