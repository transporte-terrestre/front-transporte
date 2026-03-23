import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField, ProveedorDocumentoResultDto, DocumentosAgrupadosProveedorDto } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ProveedorService } from '@service/admin/proveedor.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';

export interface PendingProveedorDocument {
  tipo: keyof DocumentosAgrupadosProveedorDto;
  data: DocumentWithDate;
  tempId: number;
}

export type ProveedorFormSubmitData =
  | (ApiBody<'proveedores', 'create'> & { documentos?: PendingProveedorDocument[] })
  | ApiBody<'proveedores', 'update'>;

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './proveedor-form.html',
  styleUrl: './proveedor-form.css',
})
export class ProveedorForm implements OnInit {
  private fb = inject(FormBuilder);
  private proveedorService = inject(ProveedorService);
  private toastService = inject(ToastService);
  private apisPeruService = inject(ApisPeruService);

  // Inputs
  proveedor = input<ApiResponse<'proveedores', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ProveedorFormSubmitData>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosProveedorDto | null>({} as DocumentosAgrupadosProveedorDto);
  pendingDocuments = signal<PendingProveedorDocument[]>([]);
  private tempIdCounter = 0;

  searchingDni = signal(false);
  searchingRuc = signal(false);

  proveedorForm: FormGroup = this.fb.group({
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
    value: keyof DocumentosAgrupadosProveedorDto;
    label: string;
  }[] = [
    { value: 'dni', label: 'DNI' },
    { value: 'ruc', label: 'RUC' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    effect(() => {
      const proveedorData = this.proveedor();
      const isEditMode = this.editMode();

      if (isEditMode && proveedorData) {
        this.proveedorForm.patchValue({
          tipoDocumento: proveedorData.tipoDocumento,
          dni: proveedorData.dni || '',
          ruc: proveedorData.ruc || '',
          nombres: proveedorData.nombres || '',
          apellidos: proveedorData.apellidos || '',
          razonSocial: proveedorData.razonSocial || '',
          email: proveedorData.email || '',
          telefono: proveedorData.telefono || '',
          direccion: proveedorData.direccion || '',
        });
        this.imagenes.set(proveedorData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(proveedorData.documentos)));
      } else {
        this.proveedorForm.reset({ tipoDocumento: 'DNI' });
        this.imagenes.set([]);
        this.localDocuments.set({} as DocumentosAgrupadosProveedorDto);
        this.pendingDocuments.set([]);
      }
    });
  }

  ngOnInit() {
    this.proveedorForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      const dniControl = this.proveedorForm.get('dni');
      const rucControl = this.proveedorForm.get('ruc');
      const nombresControl = this.proveedorForm.get('nombres');
      const apellidosControl = this.proveedorForm.get('apellidos');
      const razonSocialControl = this.proveedorForm.get('razonSocial');

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
    this.proveedorForm
      .get('dni')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value && value.length === 8 && this.proveedorForm.get('tipoDocumento')?.value === 'DNI',
        ),
      )
      .subscribe(async (dni) => {
        try {
          this.searchingDni.set(true);
          const data = await this.apisPeruService.getDni(dni);
          if (data.success) {
            this.proveedorForm.patchValue({
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
    this.proveedorForm
      .get('ruc')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter(
          (value) =>
            value && value.length === 11 && this.proveedorForm.get('tipoDocumento')?.value === 'RUC',
        ),
      )
      .subscribe(async (ruc) => {
        try {
          this.searchingRuc.set(true);
          const data = await this.apisPeruService.getRuc(ruc);
          if (data && data.razonSocial) {
            this.proveedorForm.patchValue({
              razonSocial: data.razonSocial,
              direccion: data.direccion || this.proveedorForm.get('direccion')?.value,
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
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const formDataValue = this.proveedorForm.value;
    const cleanData: any = {
      tipoDocumento: formDataValue.tipoDocumento,
      imagenes: this.imagenes(),
    };

    if (formDataValue.tipoDocumento === 'DNI') {
      cleanData.dni = formDataValue.dni;
      cleanData.nombres = formDataValue.nombres;
      cleanData.apellidos = formDataValue.apellidos;
    } else {
      cleanData.ruc = formDataValue.ruc;
      cleanData.razonSocial = formDataValue.razonSocial;
    }

    if (formDataValue.email) cleanData.email = formDataValue.email;
    if (formDataValue.telefono) cleanData.telefono = formDataValue.telefono;
    if (formDataValue.direccion) cleanData.direccion = formDataValue.direccion;

    // Documents for creation mode
    if (!this.editMode()) {
      cleanData.documentos = this.pendingDocuments();
    }

    this.onSubmitForm.emit(cleanData as ProveedorFormSubmitData);
  }

  async handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof DocumentosAgrupadosProveedorDto
  ) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc: ProveedorDocumentoResultDto = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as ProveedorDocumentoResultDto;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.proveedor()) return;

    const documento: ApiBody<'proveedores', 'createDocumento'> = {
      proveedorId: this.proveedor()!.id,
      tipo: tipo as "dni" | "ruc" | "contrato" | "otros",
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    this.proveedorService
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
            : d
        )
      );
      // Also update local list for UI
      const docs = this.localDocuments();
      if (docs) {
        const newDocs = { ...docs };
        for (const tipo in newDocs) {
          const t = tipo as keyof DocumentosAgrupadosProveedorDto;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as Array<ProveedorDocumentoResultDto>).map((d) =>
              d.id === event.id
                ? ({
                    ...d,
                    ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
                    ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
                  } as ProveedorDocumentoResultDto)
                : d
            );
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    try {
      const payload: ApiBody<'proveedores', 'updateDocumento'> = {
        ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
        ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
      };
      const doc = await this.proveedorService.updateDocumento(event.id, payload);
      this.toastService.success('Documento actualizado exitosamente');
      this.updateDocumentInLocalList(doc);
    } catch (err) {
      console.error('Error al actualizar documento:', err);
      this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
    }
  }

  deleteDocument(id: number, tipo: keyof DocumentosAgrupadosProveedorDto) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

    this.proveedorService
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

  private addDocumentToLocalList(doc: ProveedorDocumentoResultDto) {
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

  private updateDocumentInLocalList(doc: ProveedorDocumentoResultDto) {
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

  private removeDocumentFromLocalList(id: number, tipo: keyof DocumentosAgrupadosProveedorDto) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = newDocs[tipo].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof DocumentosAgrupadosProveedorDto): ProveedorDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return (docs[tipo] as ProveedorDocumentoResultDto[]) || [];
  }
}
