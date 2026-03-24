import { Component, inject, input, output, OnInit, effect, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ApiResponse,
  ApiBody,
  ApiField,
  PropietarioDocumentoResultDto,
  DocumentosAgrupadosPropietarioDto,
} from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { PropietarioService } from '@service/admin/propietario.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';

export interface PendingPropietarioDocument {
  tipo: keyof DocumentosAgrupadosPropietarioDto;
  data: DocumentWithDate;
  tempId: number;
}

export type PropietarioFormSubmitData =
  | (ApiBody<'propietarios', 'create'> & { documentos?: PendingPropietarioDocument[] })
  | ApiBody<'propietarios', 'update'>;

@Component({
  selector: 'app-propietario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './propietario-form.html',
  styleUrl: './propietario-form.css',
})
export class PropietarioForm implements OnInit {
  private fb = inject(FormBuilder);
  private propietarioService = inject(PropietarioService);
  private toastService = inject(ToastService);
  private apisPeruService = inject(ApisPeruService);

  // Inputs
  propietario = input<ApiResponse<'propietarios', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<PropietarioFormSubmitData>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosPropietarioDto | null>(
    {} as DocumentosAgrupadosPropietarioDto,
  );
  pendingDocuments = signal<PendingPropietarioDocument[]>([]);
  private tempIdCounter = 0;

  searchingDni = signal(false);
  searchingRuc = signal(false);
  tipoDocSelected = signal<'DNI' | 'RUC'>('DNI');

  requiredDocumentTypes = computed(() => {
    if (this.editMode()) return [];
    const tipo = this.tipoDocSelected();
    return [tipo === 'DNI' ? 'dni' : 'ruc'] as (keyof DocumentosAgrupadosPropietarioDto)[];
  });

  visibleDocumentTypes = computed(() => {
    const tipo = this.tipoDocSelected();
    return this.documentTypes.filter((dt) => {
      // Ocultar DNI si se elige RUC y viceversa
      if (tipo === 'DNI' && dt.value === 'ruc') return false;
      if (tipo === 'RUC' && dt.value === 'dni') return false;
      return true;
    });
  });

  propietarioForm: FormGroup = this.fb.group({
    tipoDocumento: ['DNI', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    ruc: ['', [Validators.maxLength(20)]],
    nombres: ['', [Validators.maxLength(100)]],
    apellidos: ['', [Validators.maxLength(100)]],
    razonSocial: ['', [Validators.maxLength(200)]],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(20)]],
    direccion: ['', [Validators.maxLength(255)]],
  });

  documentTypes: {
    value: keyof DocumentosAgrupadosPropietarioDto;
    label: string;
  }[] = [
    { value: 'dni', label: 'DNI' },
    { value: 'ruc', label: 'RUC' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    effect(() => {
      const propietarioData = this.propietario();
      const isEditMode = this.editMode();

      if (isEditMode && propietarioData) {
        this.propietarioForm.patchValue({
          tipoDocumento: propietarioData.tipoDocumento,
          dni: propietarioData.dni || '',
          ruc: propietarioData.ruc || '',
          nombres: propietarioData.nombres || '',
          apellidos: propietarioData.apellidos || '',
          razonSocial: propietarioData.razonSocial || '',
          email: propietarioData.email || '',
          telefono: propietarioData.telefono || '',
          direccion: propietarioData.direccion || '',
        });
        this.tipoDocSelected.set(propietarioData.tipoDocumento as 'DNI' | 'RUC');
        this.imagenes.set(propietarioData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(propietarioData.documentos)));
      } else {
        this.propietarioForm.reset({ tipoDocumento: 'DNI' });
        this.tipoDocSelected.set('DNI');
        this.imagenes.set([]);
        this.localDocuments.set({} as DocumentosAgrupadosPropietarioDto);
        this.pendingDocuments.set([]);
      }
    });
  }

  ngOnInit() {
    this.propietarioForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      this.tipoDocSelected.set(tipo);
      const dniControl = this.propietarioForm.get('dni');
      const rucControl = this.propietarioForm.get('ruc');
      const nombresControl = this.propietarioForm.get('nombres');
      const apellidosControl = this.propietarioForm.get('apellidos');
      const razonSocialControl = this.propietarioForm.get('razonSocial');

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
    this.propietarioForm
      .get('dni')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value &&
            value.length === 8 &&
            this.propietarioForm.get('tipoDocumento')?.value === 'DNI',
        ),
      )
      .subscribe(async (dni) => {
        try {
          this.searchingDni.set(true);
          const data = await this.apisPeruService.getDni(dni);
          if (data.success) {
            this.propietarioForm.patchValue({
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
    this.propietarioForm
      .get('ruc')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value &&
            value.length === 11 &&
            this.propietarioForm.get('tipoDocumento')?.value === 'RUC',
        ),
      )
      .subscribe(async (ruc) => {
        try {
          this.searchingRuc.set(true);
          const data = await this.apisPeruService.getRuc(ruc);
          if (data && data.razonSocial) {
            this.propietarioForm.patchValue({
              razonSocial: data.razonSocial,
              direccion: data.direccion || this.propietarioForm.get('direccion')?.value,
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
    if (this.propietarioForm.invalid) {
      this.propietarioForm.markAllAsTouched();
      return;
    }

    const formDataValue = this.propietarioForm.value;
    const cleanData: PropietarioFormSubmitData = {
      tipoDocumento: formDataValue.tipoDocumento,
      imagenes: this.imagenes(),
    } as PropietarioFormSubmitData;

    const creationData = cleanData as ApiBody<'propietarios', 'create'>;

    if (formDataValue.tipoDocumento === 'DNI') {
      cleanData.dni = formDataValue.dni;
      cleanData.nombres = formDataValue.nombres;
      cleanData.apellidos = formDataValue.apellidos;
    } else {
      cleanData.ruc = formDataValue.ruc;
      cleanData.razonSocial = formDataValue.razonSocial;
    }

    if (formDataValue.email) (cleanData as any).email = formDataValue.email;
    if (formDataValue.telefono) (cleanData as any).telefono = formDataValue.telefono;
    if (formDataValue.direccion) (cleanData as any).direccion = formDataValue.direccion;

    // Documents for creation mode
    if (!this.editMode()) {
      (cleanData as any).documentos = this.pendingDocuments();
    }

    this.onSubmitForm.emit(cleanData);
  }

  async handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof DocumentosAgrupadosPropietarioDto,
  ) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc: PropietarioDocumentoResultDto = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as PropietarioDocumentoResultDto;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.propietario()) return;

    const documento: ApiBody<'propietarios', 'createDocumento'> = {
      propietarioId: this.propietario()!.id,
      tipo: tipo as 'dni' | 'ruc' | 'contrato' | 'otros',
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    this.propietarioService
      .createDocumento(documento)
      .then((doc) => {
        this.toastService.success('Documento guardado exitosamente');
        this.addDocumentToLocalList(doc);
      })
      .catch((err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al guardar documento'));
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
          const t = tipo as keyof DocumentosAgrupadosPropietarioDto;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as Array<PropietarioDocumentoResultDto>).map((d) =>
              d.id === event.id
                ? ({
                    ...d,
                    ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
                    ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
                  } as PropietarioDocumentoResultDto)
                : d,
            );
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    try {
      const payload: ApiBody<'propietarios', 'updateDocumento'> = {
        ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
        ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
      };
      const doc = await this.propietarioService.updateDocumento(event.id, payload);
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
    }
  }

  deleteDocument(id: number, tipo: keyof DocumentosAgrupadosPropietarioDto) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

    this.propietarioService
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

  private addDocumentToLocalList(doc: PropietarioDocumentoResultDto) {
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

  private updateDocumentInLocalList(doc: PropietarioDocumentoResultDto) {
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

  private removeDocumentFromLocalList(id: number, tipo: keyof DocumentosAgrupadosPropietarioDto) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof DocumentosAgrupadosPropietarioDto): PropietarioDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] as PropietarioDocumentoResultDto[]) || [];
  }
}
