import { Component, inject, input, output, OnInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ApiResponse,
  ApiBody,
  ApiField,
  ClienteDocumentoResultDto,
  DocumentosAgrupadosClienteDto,
} from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ClienteService } from '@service/admin/cliente.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { AlertService } from '@service/alert.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';

export interface PendingClienteDocument {
  tipo: keyof DocumentosAgrupadosClienteDto;
  data: DocumentWithDate;
  tempId: number;
}

export type ClienteFormSubmitData =
  | (ApiBody<'clientes', 'create'> & { documentos?: PendingClienteDocument[] })
  | ApiBody<'clientes', 'update'>;

import { PasajeroForm, PasajeroData } from './layout/pasajero-form/pasajero-form';
import { EncargadoForm, EncargadoData } from './layout/encargado-form/encargado-form';
import { EntidadForm, EntidadData } from './layout/entidad-form/entidad-form';

@Component({
  selector: 'app-cliente-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImagesUpload,
    DocumentsDateUpload,
    PasajeroForm,
    EncargadoForm,
    EntidadForm,
  ],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private apisPeruService = inject(ApisPeruService);

  // Inputs
  cliente = input<ApiResponse<'clientes', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ClienteFormSubmitData>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosClienteDto | null>(
    {} as DocumentosAgrupadosClienteDto,
  );
  pendingDocuments = signal<PendingClienteDocument[]>([]);
  private tempIdCounter = 0;
  pasajeros = signal<PasajeroData[]>([]);
  showPasajeroModal = signal(false);
  selectedPasajero = signal<PasajeroData | null>(null);

  encargados = signal<EncargadoData[]>([]);
  showEncargadoModal = signal(false);
  selectedEncargado = signal<EncargadoData | null>(null);

  entidades = signal<EntidadData[]>([]);
  showEntidadModal = signal(false);
  selectedEntidad = signal<EntidadData | null>(null);

  searchingDni = signal(false);
  searchingRuc = signal(false);
  validateDocuments = signal(false);
  tipoDocSelected = signal<'DNI' | 'RUC'>('DNI');

  requiredDocumentTypes = computed(() => {
    if (this.editMode()) return [];
    const tipo = this.tipoDocSelected();
    return ['ficha_ruc', tipo === 'DNI' ? 'dni' : 'ruc'] as (keyof DocumentosAgrupadosClienteDto)[];
  });

  visibleDocumentTypes = computed(() => {
    const tipo = this.tipoDocSelected();
    return this.documentTypes.filter((dt) => {
      // Ocultar el tipo de documento opuesto al seleccionado
      if (tipo === 'DNI' && dt.value === 'ruc') return false;
      if (tipo === 'RUC' && dt.value === 'dni') return false;
      return true;
    });
  });

  clienteForm: FormGroup = this.fb.group({
    tipoDocumento: ['DNI', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    ruc: ['', [Validators.maxLength(20)]],
    nombres: ['', [Validators.maxLength(100)]],
    apellidos: ['', [Validators.maxLength(100)]],
    razonSocial: ['', [Validators.maxLength(200)]],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(20)]],
    direccion: ['', [Validators.maxLength(255)]],
    horasContrato: ['', []],
    tipo: ['personal', [Validators.required]],
  });

  documentTypes: {
    value: keyof DocumentosAgrupadosClienteDto;
    label: string;
  }[] = [
    { value: 'dni', label: 'DNI' },
    { value: 'ruc', label: 'RUC' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'carta_compromiso', label: 'Carta de Compromiso' },
    { value: 'ficha_ruc', label: 'Ficha RUC' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    // Effect para actualizar formulario cuando cambia el cliente
    effect(() => {
      const clienteData = this.cliente();
      const isEditMode = this.editMode();

      if (isEditMode && clienteData) {
        this.clienteForm.patchValue({
          tipoDocumento: clienteData.tipoDocumento,
          dni: clienteData.dni || '',
          ruc: clienteData.ruc || '',
          nombres: clienteData.nombres || '',
          apellidos: clienteData.apellidos || '',
          razonSocial: clienteData.razonSocial || '',
          email: clienteData.email || '',
          telefono: clienteData.telefono || '',
          direccion: clienteData.direccion || '',
          horasContrato: clienteData.horasContrato || '',
          tipo: clienteData.tipo || 'personal',
        });
        this.tipoDocSelected.set(clienteData.tipoDocumento as 'DNI' | 'RUC');
        this.imagenes.set(clienteData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(clienteData.documentos)));
        this.loadPasajeros(clienteData.id);
        this.loadEncargados(clienteData.id);
        this.loadEntidades(clienteData.id);
      } else {
        this.clienteForm.reset({ tipoDocumento: 'DNI', tipo: 'personal' });
        this.imagenes.set([]);
        this.localDocuments.set({} as DocumentosAgrupadosClienteDto);
        this.pendingDocuments.set([]);
      }
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en tipoDocumento para validaciones
    this.clienteForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      this.tipoDocSelected.set(tipo);
      const dniControl = this.clienteForm.get('dni');
      const rucControl = this.clienteForm.get('ruc');
      const nombresControl = this.clienteForm.get('nombres');
      const apellidosControl = this.clienteForm.get('apellidos');
      const razonSocialControl = this.clienteForm.get('razonSocial');

      if (tipo === 'DNI') {
        dniControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        nombresControl?.setValidators([Validators.required, Validators.maxLength(100)]);
        apellidosControl?.setValidators([Validators.required, Validators.maxLength(100)]);

        rucControl?.clearValidators();
        razonSocialControl?.clearValidators();
      } else {
        rucControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        razonSocialControl?.setValidators([Validators.required, Validators.maxLength(200)]);

        dniControl?.clearValidators();
        nombresControl?.clearValidators();
        apellidosControl?.clearValidators();
      }

      dniControl?.updateValueAndValidity();
      rucControl?.updateValueAndValidity();
      nombresControl?.updateValueAndValidity();
      apellidosControl?.updateValueAndValidity();
      razonSocialControl?.updateValueAndValidity();
    });

    // Autocompletado DNI
    this.clienteForm
      .get('dni')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value && value.length === 8 && this.clienteForm.get('tipoDocumento')?.value === 'DNI',
        ),
      )
      .subscribe(async (dni) => {
        try {
          this.searchingDni.set(true);
          const data = await this.apisPeruService.getDni(dni);
          if (data.success) {
            this.clienteForm.patchValue({
              nombres: data.nombres,
              apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
            });
            this.toastService.success('DNI encontrado');
          }
        } catch (error) {
          console.error('Error al consultar DNI:', error);
          this.toastService.error('Error al consultar DNI');
        } finally {
          this.searchingDni.set(false);
        }
      });

    // Autocompletado RUC
    this.clienteForm
      .get('ruc')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value && value.length === 11 && this.clienteForm.get('tipoDocumento')?.value === 'RUC',
        ),
      )
      .subscribe(async (ruc) => {
        try {
          this.searchingRuc.set(true);
          const data = await this.apisPeruService.getRuc(ruc);
          if (data && data.razonSocial) {
            this.clienteForm.patchValue({
              razonSocial: data.razonSocial,
              direccion: data.direccion || this.clienteForm.get('direccion')?.value,
            });
            this.toastService.success('RUC encontrado');
          }
        } catch (error) {
          console.error('Error al consultar RUC:', error);
          this.toastService.error('Error al consultar RUC');
        } finally {
          this.searchingRuc.set(false);
        }
      });
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    if (!this.editMode()) {
      const docs = this.pendingDocuments();
      const required = this.requiredDocumentTypes();
      const missing = required.filter((r) => !docs.some((d) => d.tipo === r));

      if (missing.length > 0) {
        this.validateDocuments.set(true);
        const missingLabels = missing
          .map((m) => this.documentTypes.find((dt) => dt.value === m)?.label)
          .join(' y ');

        this.alertService.showSimple(
          'warning',
          'Documentos requeridos',
          `Para registrar un cliente debe adjuntar obligatoriamente: ${missingLabels}.`,
          'Entendido',
        );
        return;
      }
    }

    const formDataValue = this.clienteForm.value;

    const baseData = {
      tipoDocumento: formDataValue.tipoDocumento,
      tipo: formDataValue.tipo,
      imagenes: this.imagenes(),
      email: formDataValue.email || undefined,
      telefono: formDataValue.telefono || undefined,
      direccion: formDataValue.direccion || undefined,
      horasContrato: formDataValue.horasContrato || undefined,
    };

    let cleanData: Record<string, unknown> = { ...baseData };

    if (formDataValue.tipoDocumento === 'DNI') {
      cleanData['dni'] = formDataValue.dni;
      cleanData['nombres'] = formDataValue.nombres;
      cleanData['apellidos'] = formDataValue.apellidos;
    } else {
      cleanData['ruc'] = formDataValue.ruc;
      cleanData['razonSocial'] = formDataValue.razonSocial;
    }

    // Documents for creation mode
    if (!this.editMode()) {
      cleanData['documentos'] = this.pendingDocuments();
    }

    this.onSubmitForm.emit(cleanData as unknown as ClienteFormSubmitData);
  }

  // Document Management
  async handleDocumentUpload(event: DocumentWithDate, tipo: keyof DocumentosAgrupadosClienteDto) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc: ClienteDocumentoResultDto = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as ClienteDocumentoResultDto;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.cliente()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: ApiBody<'clientes', 'createDocumento'> = {
      clienteId: this.cliente()!.id,
      tipo: tipo as 'dni' | 'ruc' | 'contrato' | 'carta_compromiso' | 'ficha_ruc' | 'otros',
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    this.clienteService
      .createDocumento(documento)
      .then((doc) => {
        this.toastService.success('Documento guardado exitosamente');
        this.addDocumentToLocalList(doc);
      })
      .catch((err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error('Error al guardar documento');
      });
  }

  async handleDocumentUpdate(event: {
    id: number;
    fechaEmision?: string;
    fechaExpiracion?: string;
  }) {
    if (event.id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) =>
        prev.map((d) =>
          d.tempId === event.id
            ? {
                ...d,
                data: {
                  ...d.data,
                  ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
                  ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
                },
              }
            : d,
        ),
      );
      // Also update local list for UI
      const docs = this.localDocuments();
      if (docs) {
        const newDocs = { ...docs };
        for (const tipo in newDocs) {
          const t = tipo as keyof DocumentosAgrupadosClienteDto;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as Array<ClienteDocumentoResultDto>).map((d) =>
              d.id === event.id
                ? ({
                    ...d,
                    ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
                    ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
                  } as ClienteDocumentoResultDto)
                : d,
            );
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    try {
      const payload: ApiBody<'clientes', 'updateDocumento'> = {
        ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
        ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
      };
      const doc = await this.clienteService.updateDocumento(event.id, payload);
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
    }
  }

  deleteDocument(id: number, tipo: keyof DocumentosAgrupadosClienteDto) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

    this.clienteService
      .deleteDocumento(id)
      .then(() => {
        this.toastService.success('Documento eliminado exitosamente');
        this.removeDocumentFromLocalList(id, tipo);
      })
      .catch((err) => {
        console.error('Error al eliminar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al eliminar documento'));
      });
  }

  private addDocumentToLocalList(doc: ClienteDocumentoResultDto) {
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

  private updateDocumentInLocalList(doc: ClienteDocumentoResultDto) {
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

  private removeDocumentFromLocalList(id: number, tipo: keyof DocumentosAgrupadosClienteDto) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof DocumentosAgrupadosClienteDto): ClienteDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] as ClienteDocumentoResultDto[]) || [];
  }

  // Pasajeros Management
  loadPasajeros(clienteId: number) {
    this.clienteService
      .findAllPasajeros({ clienteId, limit: 100, page: 1 })
      .then((res) => {
        this.pasajeros.set(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar pasajeros:', err);
      });
  }

  openPasajeroModal(pasajero: PasajeroData | null = null) {
    this.selectedPasajero.set(pasajero);
    this.showPasajeroModal.set(true);
  }

  closePasajeroModal() {
    this.showPasajeroModal.set(false);
    this.selectedPasajero.set(null);
  }

  handleSavePasajero(data: PasajeroData) {
    const promise = data.id
      ? this.clienteService.updatePasajero(data.id, data)
      : this.clienteService.createPasajero(data);

    promise
      .then(() => {
        this.toastService.success(
          data.id ? 'Pasajero actualizado exitosamente' : 'Pasajero creado exitosamente',
        );
        this.loadPasajeros(this.cliente()!.id);
        this.closePasajeroModal();
      })
      .catch((err) => {
        console.error('Error al guardar pasajero:', err);
        this.toastService.error('Error al guardar pasajero');
      });
  }

  deletePasajero(id: number | undefined) {
    if (!id) return;

    this.alertService.delete(
      'Eliminar pasajero',
      '¿Estás seguro de eliminar este pasajero?',
      () => {
        this.clienteService
          .deletePasajero(id)
          .then(() => {
            this.toastService.success('Pasajero eliminado exitosamente');
            this.loadPasajeros(this.cliente()!.id);
          })
          .catch((err) => {
            console.error('Error al eliminar pasajero:', err);
            this.toastService.error('Error al eliminar pasajero');
          });
      },
    );
  }

  // Encargados Management
  loadEncargados(clienteId: number) {
    this.clienteService
      .findAllEncargados({ clienteId, limit: 100, page: 1 })
      .then((res) => {
        this.encargados.set(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar encargados:', err);
      });
  }

  openEncargadoModal(encargado: EncargadoData | null = null) {
    this.selectedEncargado.set(encargado);
    this.showEncargadoModal.set(true);
  }

  closeEncargadoModal() {
    this.showEncargadoModal.set(false);
    this.selectedEncargado.set(null);
  }

  handleSaveEncargado(data: EncargadoData) {
    const promise = data.id
      ? this.clienteService.updateEncargado(data.id, data)
      : this.clienteService.createEncargado(data);

    promise
      .then(() => {
        this.toastService.success(
          data.id ? 'Encargado actualizado exitosamente' : 'Encargado creado exitosamente',
        );
        this.loadEncargados(this.cliente()!.id);
        this.closeEncargadoModal();
      })
      .catch((err) => {
        console.error('Error al guardar encargado:', err);
        this.toastService.error('Error al guardar encargado');
      });
  }

  deleteEncargado(id: number | undefined) {
    if (!id) return;

    this.alertService.delete(
      'Eliminar encargado',
      '¿Estás seguro de eliminar este encargado?',
      () => {
        this.clienteService
          .deleteEncargado(id)
          .then(() => {
            this.toastService.success('Encargado eliminado exitosamente');
            this.loadEncargados(this.cliente()!.id);
          })
          .catch((err) => {
            console.error('Error al eliminar encargado:', err);
            this.toastService.error('Error al eliminar encargado');
          });
      },
    );
  }

  // Entidades Management
  loadEntidades(clienteId: number) {
    this.clienteService
      .findAllEntidades({ clienteId, limit: 100, page: 1 })
      .then((res) => {
        this.entidades.set(res.data);
      })
      .catch((err) => {
        console.error('Error al cargar entidades:', err);
      });
  }

  openEntidadModal(entidad: EntidadData | null = null) {
    this.selectedEntidad.set(entidad);
    this.showEntidadModal.set(true);
  }

  closeEntidadModal() {
    this.showEntidadModal.set(false);
    this.selectedEntidad.set(null);
  }

  handleSaveEntidad(data: EntidadData) {
    const promise = data.id
      ? this.clienteService.updateEntidad(data.id, data)
      : this.clienteService.createEntidad(data);

    promise
      .then(() => {
        this.toastService.success(
          data.id ? 'Entidad actualizada exitosamente' : 'Entidad creada exitosamente',
        );
        this.loadEntidades(this.cliente()!.id);
        this.closeEntidadModal();
      })
      .catch((err) => {
        console.error('Error al guardar entidad:', err);
        this.toastService.error('Error al guardar entidad');
      });
  }

  deleteEntidad(id: number | undefined) {
    if (!id) return;

    this.alertService.delete('Eliminar entidad', '¿Estás seguro de eliminar esta entidad?', () => {
      this.clienteService
        .deleteEntidad(id)
        .then(() => {
          this.toastService.success('Entidad eliminada exitosamente');
          this.loadEntidades(this.cliente()!.id);
        })
        .catch((err) => {
          console.error('Error al eliminar entidad:', err);
          this.toastService.error('Error al eliminar entidad');
        });
    });
  }
}
