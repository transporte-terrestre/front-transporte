import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  ApiResponse,
  ApiBody,
  ApiField,
  VehiculoDocumentoResultDto,
  DocumentosAgrupadosVehiculoDto,
  PropietarioVehiculoDto,
  ProveedorVehiculoDto,
} from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
  DocumentItem,
} from '../../../../components/documents-date-upload/documents-date-upload';

export interface PendingDocument {
  tipo: keyof DocumentosAgrupadosVehiculoDto;
  data: DocumentWithDate;
  tempId: number;
}

export type VehiculoFormSubmitData =
  | (ApiBody<'vehiculos', 'create'> & { documentos?: PendingDocument[] })
  | ApiBody<'vehiculos', 'update'>;


import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';
import { MarcaInputSearch } from '../../../../components/input-searchs/marca-input-search/marca-input-search';
import { getErrorMessage } from '@helper/error.helper';
import { ModeloInputSearch } from '../../../../components/input-searchs/modelo-input-search/modelo-input-search';
import { PropietarioInputSearch } from '../../../../components/input-searchs/propietario-input-search/propietario-input-search';
import { ProveedorInputSearch } from '../../../../components/input-searchs/proveedor-input-search/proveedor-input-search';
import { VehiculoChecklistDocumentComponent } from './layout/vehiculo-checklist-document/vehiculo-checklist-document';
import { VehiculoComentariosForm } from './layout/vehiculo-comentarios-form/vehiculo-comentarios-form';

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
    ProveedorInputSearch,
    VehiculoChecklistDocumentComponent,
    VehiculoComentariosForm,
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
  onSubmitForm = output<VehiculoFormSubmitData>();
  onDataRefresh = output<void>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosVehiculoDto | null>({} as DocumentosAgrupadosVehiculoDto);
  pendingDocuments = signal<PendingDocument[]>([]);
  private tempIdCounter = 0;
  selectedMarcaId = signal<number | null>(null);

  vehiculoForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required]],
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
    kilometrajeMantenimiento: [0, [Validators.min(0)]],
    estado: ['disponible', [Validators.required]],
    propietarios: [[], []], // We keep this but manage ids manually on submit
    proveedores: [[], []], // We keep this but manage ids manually on submit
    // New fields
    pasajeros: ['', [Validators.min(0)]],
    ruedas: ['', [Validators.min(0)]],
    sede: ['', [Validators.maxLength(100)]],
    potencia: ['', [Validators.maxLength(50)]],
    formulaRodante: ['', [Validators.maxLength(50)]],
    version: ['', [Validators.maxLength(50)]],
    cilindros: ['', [Validators.min(0)]],
    cilindrada: ['', [Validators.maxLength(50)]],
    longitud: ['', []],
    altura: ['', []],
    ancho: ['', []],
    documentosNoAplicables: [[]],
  });

  // Temporary control for the search input
  tempOwnerControl = new FormControl<PropietarioVehiculoDto | null>(null);
  selectedOwners = signal<PropietarioVehiculoDto[]>([]);

  // Temporary control for providers search input
  tempProviderControl = new FormControl<ProveedorVehiculoDto | null>(null);
  selectedProviders = signal<ProveedorVehiculoDto[]>([]);

  estados: Array<{
    value: 'disponible' | 'circulacion' | 'taller' | 'retirado';
    label: string;
    icon: string;
  }> = [
    { value: 'disponible', label: 'Disponible', icon: 'fa-check-circle' },
    { value: 'circulacion', label: 'En Circulación', icon: 'fa-road' },
    { value: 'taller', label: 'En Taller', icon: 'fa-wrench' },
    { value: 'retirado', label: 'Retirado', icon: 'fa-times-circle' },
  ];

  documentTypes: {
    value: keyof ApiField<'vehiculos', 'findOne', 'documentos'>;
    label: string;
    requireIssue?: boolean;
    requireExpiration?: boolean;
  }[] = [
    {
      value: 'tarjeta_propiedad',
      label: 'TIVE (Tarjeta de Propiedad)',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'tarjeta_unica_circulacion',
      label: 'TUC (Tarjeta Única de Circulación)',
      requireIssue: true,
      requireExpiration: true,
    },
    { value: 'citv', label: 'CITV', requireIssue: true, requireExpiration: true },
    { value: 'soat', label: 'SOAT', requireIssue: true, requireExpiration: true },
    { value: 'poliza', label: 'Póliza', requireIssue: true, requireExpiration: true },
    {
      value: 'certificado_operatividad_factura',
      label: 'Cert. Operatividad / Factura',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'plan_mantenimiento_historico',
      label: 'Plan de Mantenimiento',
      requireIssue: false,
      requireExpiration: false,
    },
    {
      value: 'certificado_instalacion_gps',
      label: 'Cert. Instalación GPS',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'certificado_valor_anadido',
      label: 'Cert. Valor Añadido',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'constancia_gps',
      label: 'Constancia GPS',
      requireIssue: true,
      requireExpiration: true,
    },
    {
      value: 'revision_gps',
      label: 'Revisión GPS',
      requireIssue: true,
      requireExpiration: true,
    },
    { value: 'certificado_adas', label: 'Cert. ADAS', requireIssue: true, requireExpiration: true },
    {
      value: 'certificado_extintores_hidrostatica',
      label: 'Cert. Prueba Hidrostática (Extintores)',
      requireIssue: true,
      requireExpiration: true,
    },
    {
      value: 'certificado_extintores_operatividad',
      label: 'Cert. Operatividad (Extintores)',
      requireIssue: true,
      requireExpiration: true,
    },
    {
      value: 'certificado_rops',
      label: 'Cert. ROPS',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'certificado_radio_frecuencia',
      label: 'Cert. Radio Frecuencia',
      requireIssue: true,
      requireExpiration: true,
    },
    {
      value: 'certificacion_frenos',
      label: 'Certificación de Frenos',
      requireIssue: true,
      requireExpiration: true,
    },
    {
      value: 'certificado_laminados_lunas',
      label: 'Cert. Laminados Lunas',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'certificado_carroceria',
      label: 'Cert. Carrocería',
      requireIssue: true,
      requireExpiration: false,
    },
    {
      value: 'certificado_caracteristicas_tecnicas',
      label: 'Cert. Características Técnicas',
      requireIssue: true,
      requireExpiration: false,
    },
    { value: 'otros', label: 'Otros', requireIssue: true, requireExpiration: true },
  ];

  ngOnInit() {
    // Escuchar cambios en marca para filtrar modelos
    this.vehiculoForm
      .get('marca')
      ?.valueChanges.subscribe((marca: { id: number } | number | null) => {
        const brandId = marca && typeof marca === 'object' ? marca.id : (marca as number | null);
        this.selectedMarcaId.set(brandId);

        // Limpiar modelo al cambiar marca para evitar inconsistencias
        const currentModelo = this.vehiculoForm.get('modelo')?.value;
        if (
          currentModelo &&
          typeof currentModelo === 'object' &&
          currentModelo.marcaId !== brandId
        ) {
          this.vehiculoForm.get('modelo')?.setValue(null);
        } else if (typeof currentModelo === 'number' && currentModelo !== 0) {
          // Si es un ID, no sabemos a qué marca pertenece sin consultar, pero por seguridad reseteamos si cambia la marca manualmente
          this.vehiculoForm.get('modelo')?.setValue(null);
        }
      });
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  addOwner() {
    const owner = this.tempOwnerControl.value;
    if (owner && typeof owner === 'object') {
      const current = this.selectedOwners();
      if (!current.find((p) => p.id === owner.id)) {
        this.selectedOwners.update((prev) => [
          ...prev,
          {
            ...owner,
            nombre: owner.nombre,
          },
        ]);
      }
      this.tempOwnerControl.setValue(null);
    }
  }

  removeOwner(id: number) {
    this.selectedOwners.update((prev) => prev.filter((p) => p.id !== id));
  }

  addProvider() {
    const provider = this.tempProviderControl.value;
    if (provider && typeof provider === 'object') {
      const current = this.selectedProviders();
      if (!current.find((p) => p.id === provider.id)) {
        this.selectedProviders.update((prev) => [
          ...prev,
          {
            ...provider,
            nombre: provider.nombre,
          },
        ]);
      }
      this.tempProviderControl.setValue(null);
    }
  }

  removeProvider(id: number) {
    this.selectedProviders.update((prev) => prev.filter((p) => p.id !== id));
  }

  constructor() {
    effect(async () => {
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
          kilometrajeMantenimiento: vehiculoData.kilometrajeMantenimiento,
          estado: vehiculoData.estado,
          // New fields mapping
          pasajeros: vehiculoData.pasajeros,
          ruedas: vehiculoData.ruedas,
          sede: vehiculoData.sede,
          potencia: vehiculoData.potencia,
          formulaRodante: vehiculoData.formulaRodante,
          version: vehiculoData.version,
          cilindros: vehiculoData.cilindros,
          cilindrada: vehiculoData.cilindrada,
          longitud: vehiculoData.longitud,
          altura: vehiculoData.altura,
          ancho: vehiculoData.ancho,
          documentosNoAplicables: vehiculoData.documentosNoAplicables || [],
        });
        this.imagenes.set(vehiculoData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(vehiculoData.documentos)));
        // Load owners
        this.selectedOwners.set(vehiculoData.propietarios || []);
        // Load providers
        this.selectedProviders.set(vehiculoData.proveedores || []);

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
        this.vehiculoForm.reset({ estado: 'disponible', combustible: 'diesel' });
        this.selectedOwners.set([]);
        this.selectedProviders.set([]);
        this.imagenes.set([]);
        this.localDocuments.set({} as DocumentosAgrupadosVehiculoDto);
        this.pendingDocuments.set([]);
        this.selectedMarcaId.set(null);
      }
    });
  }

  submitForm() {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const formValue = this.vehiculoForm.value;
    const formData = {
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
      kilometrajeMantenimiento: formValue.kilometrajeMantenimiento ? Number(formValue.kilometrajeMantenimiento) : 0,
      estado: formValue.estado,
      propietarios: this.selectedOwners().map((p) => p.id),
      proveedores: this.selectedProviders().map((p) => p.id),
      imagenes: this.imagenes(),
      // New fields mapping
      pasajeros: formValue.pasajeros ? Number(formValue.pasajeros) : undefined,
      ruedas: formValue.ruedas ? Number(formValue.ruedas) : undefined,
      sede: formValue.sede || undefined,
      potencia: formValue.potencia || undefined,
      formulaRodante: formValue.formulaRodante || undefined,
      version: formValue.version || undefined,
      cilindros: formValue.cilindros ? Number(formValue.cilindros) : undefined,
      cilindrada: formValue.cilindrada || undefined,
      longitud: formValue.longitud ? String(formValue.longitud) : undefined,
      altura: formValue.altura ? String(formValue.altura) : undefined,
      ancho: formValue.ancho ? String(formValue.ancho) : undefined,
      documentosNoAplicables: formValue.documentosNoAplicables || [],
      // Documents for creation mode
      documentos: !this.editMode() ? this.pendingDocuments() : undefined,
    } as VehiculoFormSubmitData;
    this.onSubmitForm.emit(formData);
  }

  async handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof DocumentosAgrupadosVehiculoDto,
  ) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc: VehiculoDocumentoResultDto = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as VehiculoDocumentoResultDto;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.vehiculo()) return;

    const documento: ApiBody<'vehiculos', 'createDocumento'> = {
      vehiculoId: this.vehiculo()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    try {
      const doc = await this.vehiculoService.createDocumento(documento);
      this.toastService.success('Documento guardado exitosamente');
      this.addDocumentToLocalList(doc);
    } catch (err) {
      console.error('Error al guardar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al guardar documento'));
    }
  }

  async handleDocumentUpdate(event: { id: number; fechaEmision?: string; fechaExpiracion?: string }) {
    if (event.id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) =>
        prev.map((d) =>
          d.tempId === event.id
            ? { ...d, data: { ...d.data, fechaEmision: event.fechaEmision, fechaExpiracion: event.fechaExpiracion } }
            : d,
        ),
      );
      // Also update local list for UI
      const docs = this.localDocuments();
      if (docs) {
        const newDocs = { ...docs };
        for (const tipo in newDocs) {
          const t = tipo as keyof DocumentosAgrupadosVehiculoDto;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as Array<VehiculoDocumentoResultDto>).map((d) =>
              d.id === event.id
                ? ({ ...d, fechaEmision: event.fechaEmision, fechaExpiracion: event.fechaExpiracion } as VehiculoDocumentoResultDto)
                : d,
            );
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    const payload: ApiBody<'vehiculos', 'updateDocumento'> = {
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    try {
      const doc = await this.vehiculoService.updateDocumento(event.id, payload);
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
    }
  }

  downloadAllDocuments() {
    const vehiculoId = this.vehiculo()?.id;
    if (vehiculoId) {
      this.vehiculoService.downloadDocumentos(vehiculoId);
    }
  }

  async deleteDocument(id: number, tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

    try {
      await this.vehiculoService.deleteDocumento(id);
      this.toastService.success('Documento eliminado exitosamente');
      this.removeDocumentFromLocalList(id, tipo);
    } catch (err) {
      console.error('Error al eliminar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al eliminar documento'));
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
    tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>,
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

  isNoAplica(docType: string): boolean {
    const arrayControl = this.vehiculoForm.get('documentosNoAplicables');
    return arrayControl?.value?.includes(docType) || false;
  }

  toggleNoAplicaDocumento(event: Event, docType: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const arrayControl = this.vehiculoForm.get('documentosNoAplicables');
    if (!arrayControl) return;
    let values = [...(arrayControl.value || [])];
    if (isChecked) {
        if (!values.includes(docType)) values.push(docType);
    } else {
        values = values.filter(v => v !== docType);
    }
    arrayControl.setValue(values);
    this.vehiculoForm.markAsDirty();
  }

  getDocuments(tipo: keyof ApiField<'vehiculos', 'findOne', 'documentos'>): DocumentItem[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] || []) as DocumentItem[];
  }
}
