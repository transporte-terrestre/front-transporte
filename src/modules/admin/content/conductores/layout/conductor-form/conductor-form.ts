import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField, ConductorDocumentoResultDto, DocumentosAgrupadosConductorDto } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ConductorService } from '@service/admin/conductor.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';

export interface PendingConductorDocument {
  tipo: keyof DocumentosAgrupadosConductorDto;
  data: DocumentWithDate;
  tempId: number;
}

export type ConductorFormSubmitData =
  | (ApiBody<'conductores', 'create'> & { documentos?: PendingConductorDocument[] })
  | ApiBody<'conductores', 'update'>;

@Component({
  selector: 'app-conductor-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './conductor-form.html',
  styleUrl: './conductor-form.css',
})
export class ConductorForm implements OnInit {
  private fb = inject(FormBuilder);
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);
  private apisPeruService = inject(ApisPeruService);

  // Inputs
  conductor = input<ApiResponse<'conductores', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ConductorFormSubmitData>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosConductorDto | null>({} as DocumentosAgrupadosConductorDto);
  pendingDocuments = signal<PendingConductorDocument[]>([]);
  private tempIdCounter = 0;

  searchingDni = signal(false);

  conductorForm: FormGroup = this.fb.group({
    tipoDocumento: ['DNI', [Validators.required]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // Se actualiza dinámicamente
    nacionalidad: ['Peruana'], // Opcional o default
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    contrasenia: [''],
    celular: [''],
    estado: ['activo', [Validators.required]],
    numeroLicencia: ['', [Validators.required, Validators.minLength(5)]],
    claseLicencia: ['', [Validators.required]],
    categoriaLicencia: ['', [Validators.required]],
    documentosNoAplicables: [[]],
  });

  tiposDocumento = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carnet de Extranjería' },
    { value: 'PTP', label: 'PTP' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'OTRO', label: 'Otro' },
  ];

  nacionalidades = [
    'Peruana',
    'Venezolana',
    'Colombiana',
    'Ecuatoriana',
    'Argentina',
    'Chilena',
    'Boliviana',
    'Brasileña',
    'Otra',
  ];
  
  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'eventual', label: 'Eventual' },
  ];

  clases: ApiField<'conductores', 'findOne', 'claseLicencia'>[] = ['A', 'B'];
  // Categorias se llenan dinámicamente según la clase seleccionada
  categorias = signal<ApiField<'conductores', 'findOne', 'categoriaLicencia'>[]>([]);

  // Mapeo de Clase -> Categorías posibles
  categoriasPorClase: Record<string, ApiField<'conductores', 'findOne', 'categoriaLicencia'>[]> = {
    A: ['I', 'II-a', 'II-b', 'III-a', 'III-b', 'III-c'],
    B: ['I', 'II-a', 'II-b', 'II-c'],
  };

  documentTypes: {
    value: keyof DocumentosAgrupadosConductorDto;
    label: string;
  }[] = [
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

  constructor() {
    // Effect para actualizar formulario cuando cambia el conductor
    effect(() => {
      const conductorData = this.conductor();
      const isEditMode = this.editMode();

      if (isEditMode && conductorData) {
        this.conductorForm.patchValue({
          tipoDocumento: conductorData.tipoDocumento || 'DNI',
          dni: conductorData.dni,
          nacionalidad: conductorData.nacionalidad || 'Peruana',
          nombres: conductorData.nombres,
          apellidos: conductorData.apellidos,
          email: conductorData.email,
          contrasenia: '', // No mostrar contraseña en edit unless updating
          celular: conductorData.celular,
          numeroLicencia: conductorData.numeroLicencia,
          claseLicencia: conductorData.claseLicencia,
          categoriaLicencia: conductorData.categoriaLicencia,
          estado: conductorData.estado || 'activo',
          documentosNoAplicables: conductorData.documentosNoAplicables || [],
        });

        // Contraseña no es obligatoria al editar (solo si quiere cambiarla)
        this.conductorForm.get('contrasenia')?.clearValidators();
        this.conductorForm.get('contrasenia')?.setValidators([Validators.minLength(6)]);
        this.conductorForm.get('contrasenia')?.updateValueAndValidity();

        this.updateCategorias(conductorData.claseLicencia);
        this.imagenes.set(conductorData.fotocheck || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(conductorData.documentos)));

        // Trigger validator update
        this.updateDniValidators(conductorData.tipoDocumento || 'DNI');
      } else {
        // Inicializar con valores por defecto
        this.updateCategorias('A');
        this.conductorForm.reset({
          tipoDocumento: 'DNI',
          nacionalidad: 'Peruana',
          claseLicencia: 'A',
          categoriaLicencia: 'III-c', // Default recomendado para transporte profesional
          estado: 'activo',
        });

        // Contraseña es OBLIGATORIA al crear
        this.conductorForm
          .get('contrasenia')
          ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.conductorForm.get('contrasenia')?.updateValueAndValidity();

        this.imagenes.set([]);
        this.localDocuments.set({} as DocumentosAgrupadosConductorDto);
        this.pendingDocuments.set([]);
        this.updateDniValidators('DNI');
      }
    });
  }

  ngOnInit() {
    this.conductorForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      this.updateDniValidators(tipo);
      this.conductorForm.get('dni')?.updateValueAndValidity();
    });

    this.conductorForm.get('claseLicencia')?.valueChanges.subscribe((clase) => {
      this.updateCategorias(clase);
    });

    // Autocompletado DNI
    this.conductorForm
      .get('dni')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value && value.length === 8 && this.conductorForm.get('tipoDocumento')?.value === 'DNI',
        ),
      )
      .subscribe(async (dni) => {
        try {
          this.searchingDni.set(true);
          const data = await this.apisPeruService.getDni(dni);
          if (data.success) {
            this.conductorForm.patchValue({
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
  }

  updateCategorias(clase: string) {
    if (this.categoriasPorClase[clase]) {
      this.categorias.set(this.categoriasPorClase[clase]);
    } else {
      this.categorias.set([]);
    }
  }

  updateDniValidators(tipo: string) {
    const dniControl = this.conductorForm.get('dni');
    dniControl?.clearValidators();
    dniControl?.setValidators([Validators.required]);

    if (tipo === 'DNI') {
      dniControl?.addValidators(Validators.pattern(/^\d{8}$/));
    } else if (tipo === 'CE') {
      // CE usually 9 digits or alphanumeric, let's allow alphanumeric but required length maybe?
      // Keeping it flexible for foreigners as requested "no deja ingresar un CI"
      // We can just set required for others.
      dniControl?.addValidators(Validators.pattern(/^[a-zA-Z0-9]{4,15}$/));
    } else {
      // Pasaporte, PTP, etc. Just required and decent length
      dniControl?.addValidators(Validators.minLength(4));
    }
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.conductorForm.invalid) {
      this.conductorForm.markAllAsTouched();
      return;
    }

    const formValue = this.conductorForm.value;
    const formData = {
      ...formValue,
      fotocheck: this.imagenes(),
      documentosNoAplicables: formValue.documentosNoAplicables || [],
      // Documents for creation mode
      documentos: !this.editMode() ? this.pendingDocuments() : undefined,
    } as ConductorFormSubmitData;

    // Remove empty password if edit
    if (this.editMode() && !(formData as ApiBody<'conductores', 'update'>).contrasenia) {
      delete (formData as ApiBody<'conductores', 'update'>).contrasenia;
    }

    this.onSubmitForm.emit(formData);
  }

  // Document Management
  async handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof DocumentosAgrupadosConductorDto,
  ) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc: ConductorDocumentoResultDto = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as ConductorDocumentoResultDto;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.conductor()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: ApiBody<'conductores', 'createDocumento'> = {
      conductorId: this.conductor()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    this.conductorService
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

  async handleDocumentUpdate(event: { id: number; fechaEmision?: string; fechaExpiracion?: string }) {
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
          const t = tipo as keyof DocumentosAgrupadosConductorDto;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as Array<ConductorDocumentoResultDto>).map((d) =>
              d.id === event.id
                ? ({
                    ...d,
                    ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
                    ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
                  } as ConductorDocumentoResultDto)
                : d,
            );
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    try {
      const payload: ApiBody<'conductores', 'updateDocumento'> = {
        ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
        ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
      };
      const doc = await this.conductorService.updateDocumento(event.id, payload);
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
    }
  }

  downloadAllDocuments() {
    const conductorId = this.conductor()?.id;
    if (conductorId) {
      this.conductorService.downloadDocumentos(conductorId);
    }
  }

  deleteDocument(id: number, tipo: keyof DocumentosAgrupadosConductorDto) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

    this.conductorService
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

  private addDocumentToLocalList(doc: ConductorDocumentoResultDto) {
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

  private updateDocumentInLocalList(doc: ConductorDocumentoResultDto) {
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

  private removeDocumentFromLocalList(id: number, tipo: keyof DocumentosAgrupadosConductorDto) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof DocumentosAgrupadosConductorDto): ConductorDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] as ConductorDocumentoResultDto[]) || [];
  }

  isNoAplica(docType: string): boolean {
    const arrayControl = this.conductorForm.get('documentosNoAplicables');
    return arrayControl?.value?.includes(docType) || false;
  }

  toggleNoAplicaDocumento(event: Event, docType: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const arrayControl = this.conductorForm.get('documentosNoAplicables');
    if (!arrayControl) return;
    let values = [...(arrayControl.value || [])];
    if (isChecked) {
        if (!values.includes(docType)) values.push(docType);
    } else {
        values = values.filter(v => v !== docType);
    }
    arrayControl.setValue(values);
    this.conductorForm.markAsDirty();
  }
}
