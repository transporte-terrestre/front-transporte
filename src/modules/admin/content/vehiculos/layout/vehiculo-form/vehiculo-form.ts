import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField, VehiculoDocumentoResultDto } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
  DocumentItem,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { MarcaInputSearch } from '../../content/vehiculos-lineas/layout/marca-input-search/marca-input-search';
import { ModeloInputSearch } from '../../content/vehiculos-lineas/layout/modelo-input-search/modelo-input-search';
import { PropietarioInputSearch } from '../../../propietarios/layout/propietario-input-search/propietario-input-search';

@Component({
  selector: 'app-vehiculo-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImagesUpload,
    DocumentsDateUpload,
    MarcaInputSearch,
    ModeloInputSearch,
    PropietarioInputSearch,
  ],
  templateUrl: './vehiculo-form.html',
  styleUrl: './vehiculo-form.css',
})
export class VehiculoForm implements OnInit {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);

  // Inputs
  vehiculo = input<ApiResponse<'vehiculos', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'vehiculos', 'create'> | ApiBody<'vehiculos', 'update'>>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<ApiResponse<'vehiculos', 'findOne'>['documentos'] | null>(null);
  selectedMarcaId = signal<number | null>(null);

  vehiculoForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,8}$/)]],
    placaAnterior: ['', [Validators.maxLength(20)]],
    codigoInterno: [{ value: '', disabled: true }],
    marca: [null, []],
    modelo: [null, [Validators.required]],
    anio: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
    vin: ['', [Validators.maxLength(50)]],
    numeroMotor: ['', [Validators.maxLength(50)]],
    numeroSerie: ['', [Validators.maxLength(50)]],
    color: ['', [Validators.maxLength(50)]],
    combustible: ['diesel', []],
    carroceria: ['', [Validators.maxLength(100)]],
    categoria: ['', [Validators.maxLength(50)]],
    cargaUtil: ['', []],
    pesoBruto: ['', []],
    pesoNeto: ['', []],
    asientos: ['', [Validators.min(0)]],
    ejes: ['', [Validators.min(0)]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    estado: ['activo', [Validators.required]],
    propietarioId: [null, []],
  });

  estados: Array<{ value: 'activo' | 'taller' | 'retirado'; label: string; icon: string }> = [
    { value: 'activo', label: 'Activo', icon: 'fa-check-circle' },
    { value: 'taller', label: 'En Taller', icon: 'fa-wrench' },
    { value: 'retirado', label: 'Retirado', icon: 'fa-times-circle' },
  ];

  documentTypes: {
    value: keyof ApiField<'vehiculos', 'findOne', 'documentos'>;
    label: string;
  }[] = [
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

  ngOnInit() {}

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }
  constructor() {
    effect(
      async () => {
        const vehiculoData = this.vehiculo();
        const isEditMode = this.editMode();

        if (isEditMode && vehiculoData) {
          this.vehiculoForm.patchValue({
            placa: vehiculoData.placa,
            placaAnterior: vehiculoData.placaAnterior,
            codigoInterno: vehiculoData.codigoInterno,
            anio: vehiculoData.anio,
            vin: vehiculoData.vin,
            numeroMotor: vehiculoData.numeroMotor,
            numeroSerie: vehiculoData.numeroSerie,
            color: vehiculoData.color,
            combustible: vehiculoData.combustible || 'diesel',
            carroceria: vehiculoData.carroceria,
            categoria: vehiculoData.categoria,
            cargaUtil: vehiculoData.cargaUtil,
            pesoBruto: vehiculoData.pesoBruto,
            pesoNeto: vehiculoData.pesoNeto,
            asientos: vehiculoData.asientos,
            ejes: vehiculoData.ejes,
            kilometraje: vehiculoData.kilometraje,
            estado: vehiculoData.estado,
            propietarioId: vehiculoData.propietarioId,
          });
          this.imagenes.set(vehiculoData.imagenes || []);
          this.localDocuments.set(JSON.parse(JSON.stringify(vehiculoData.documentos)));

          // Cargar marca y modelo desde el modeloId
          if (vehiculoData.modeloId) {
            try {
              const modelo = await this.vehiculoService.findOneModelo(vehiculoData.modeloId);
              // Setear marca primero
              this.selectedMarcaId.set(modelo.marcaId);
              this.vehiculoForm.patchValue({
                marca: { id: modelo.marcaId, nombre: vehiculoData.marca },
                modelo: { id: modelo.id, nombre: modelo.nombre, marcaId: modelo.marcaId },
              });
            } catch (e) {
              // ignore
            }
          }
        } else {
          this.vehiculoForm.reset({ estado: 'activo', combustible: 'diesel' });
          this.imagenes.set([]);
          this.localDocuments.set(null);
          this.selectedMarcaId.set(null);
        }
      },
      { allowSignalWrites: true }
    );
  }

  submitForm() {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehiculoForm.value;
    const formData: ApiBody<'vehiculos', 'create'> = {
      placa: formValue.placa,
      placaAnterior: formValue.placaAnterior || undefined,
      modeloId: formValue.modelo?.id ? Number(formValue.modelo.id) : Number(formValue.modelo),
      anio: formValue.anio,
      vin: formValue.vin || undefined,
      numeroMotor: formValue.numeroMotor || undefined,
      numeroSerie: formValue.numeroSerie || undefined,
      color: formValue.color || undefined,
      combustible: formValue.combustible || undefined,
      carroceria: formValue.carroceria || undefined,
      categoria: formValue.categoria || undefined,
      cargaUtil: formValue.cargaUtil ? String(formValue.cargaUtil) : undefined,
      pesoBruto: formValue.pesoBruto ? String(formValue.pesoBruto) : undefined,
      pesoNeto: formValue.pesoNeto ? String(formValue.pesoNeto) : undefined,
      asientos: formValue.asientos ? Number(formValue.asientos) : undefined,
      ejes: formValue.ejes ? Number(formValue.ejes) : undefined,
      kilometraje: formValue.kilometraje,
      estado: formValue.estado,
      propietarioId: formValue.propietarioId ? Number(formValue.propietarioId) : undefined,
      imagenes: this.imagenes(),
    };
    this.onSubmitForm.emit(formData);
  }

  // Document Management
  async handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>
  ) {
    if (!this.vehiculo()) return;

    const documento: ApiBody<'vehiculos', 'createDocumento'> = {
      vehiculoId: this.vehiculo()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    try {
      const doc = await this.vehiculoService.createDocumento(documento);
      this.toastService.success('Documento guardado exitosamente');
      this.addDocumentToLocalList(doc);
    } catch (err) {
      console.error('Error al guardar documento:', err);
      this.toastService.error('Error al guardar documento');
    }
  }

  async handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    try {
      const doc = await this.vehiculoService.updateDocumento(event.id, {
        fechaEmision: event.fechaEmision,
        fechaExpiracion: event.fechaExpiracion,
      });
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error('Error al actualizar documento');
    }
  }

  async deleteDocument(id: number, tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>) {
    try {
      await this.vehiculoService.deleteDocumento(id);
      this.toastService.success('Documento eliminado exitosamente');
      this.removeDocumentFromLocalList(id, tipo);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      this.toastService.error('Error al eliminar documento');
    }
  }

  private addDocumentToLocalList(doc: VehiculoDocumentoResultDto) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo;
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
      const tipo = doc.tipo;
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].map((d) => (d.id === doc.id ? doc : d));
        this.localDocuments.set(newDocs);
      }
    }
  }

  private removeDocumentFromLocalList(
    id: number,
    tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>
  ) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>): DocumentItem[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] || []) as DocumentItem[];
  }
}
