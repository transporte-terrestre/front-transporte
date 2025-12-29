import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { PropietarioService } from '@service/admin/propietario.service';
import { ToastService } from '@service/toast.service';

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

  // Inputs
  propietario = input<ApiResponse<'propietarios', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'propietarios', 'create'> | ApiBody<'propietarios', 'update'>>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<ApiResponse<'propietarios', 'findOne'>['documentos'] | null>(null);

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
    value: keyof ApiField<'propietarios', 'findOne', 'documentos'>;
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
        this.imagenes.set(propietarioData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(propietarioData.documentos)));
      } else {
        this.propietarioForm.reset({ tipoDocumento: 'DNI' });
        this.imagenes.set([]);
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {
    this.propietarioForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
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
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.propietarioForm.invalid) {
      this.propietarioForm.markAllAsTouched();
      return;
    }

    const formData = this.propietarioForm.value;
    const cleanData: any = {
      tipoDocumento: formData.tipoDocumento,
      imagenes: this.imagenes(),
    };

    if (formData.tipoDocumento === 'DNI') {
      cleanData.dni = formData.dni;
      cleanData.nombres = formData.nombres;
      cleanData.apellidos = formData.apellidos;
    } else {
      cleanData.ruc = formData.ruc;
      cleanData.razonSocial = formData.razonSocial;
    }

    if (formData.email) cleanData.email = formData.email;
    if (formData.telefono) cleanData.telefono = formData.telefono;
    if (formData.direccion) cleanData.direccion = formData.direccion;

    if (this.editMode()) {
      this.onSubmitForm.emit(cleanData as ApiBody<'propietarios', 'update'>);
    } else {
      this.onSubmitForm.emit(cleanData as ApiBody<'propietarios', 'create'>);
    }
  }

  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'propietarios', 'findOne', 'documentos'>
  ) {
    if (!this.propietario()) return;

    const documento: ApiBody<'propietarios', 'createDocumento'> = {
      propietarioId: this.propietario()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.propietarioService
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

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.propietarioService
      .updateDocumento(event.id, {
        fechaEmision: event.fechaEmision,
        fechaExpiracion: event.fechaExpiracion,
      })
      .then((doc) => {
        this.toastService.success('Documento actualizado exitosamente');
        this.updateDocumentInLocalList(doc);
      })
      .catch((err) => {
        console.error('Error al actualizar documento:', err);
        this.toastService.error('Error al actualizar documento');
      });
  }

  deleteDocument(id: number, tipo: keyof ApiField<'propietarios', 'findOne', 'documentos'>) {
    this.propietarioService
      .deleteDocumento(id)
      .then(() => {
        this.toastService.success('Documento eliminado exitosamente');
        this.removeDocumentFromLocalList(id, tipo);
      })
      .catch((err) => {
        console.error('Error al eliminar documento:', err);
        this.toastService.error('Error al eliminar documento');
      });
  }

  private addDocumentToLocalList(
    doc: ApiField<'propietarios', 'findOne', 'documentos'>['dni'][number]
  ) {
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

  private updateDocumentInLocalList(
    doc: ApiField<'propietarios', 'findOne', 'documentos'>['dni'][number]
  ) {
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
    tipo: keyof ApiField<'propietarios', 'findOne', 'documentos'>
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

  getDocuments(
    tipo: keyof ApiField<'propietarios', 'findOne', 'documentos'>
  ): ApiField<'propietarios', 'findOne', 'documentos'>['dni'] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return docs[tipo] || [];
  }
}
