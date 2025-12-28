import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ClienteService } from '@service/admin/cliente.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);

  // Inputs
  cliente = input<ApiResponse<'clientes', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'clientes', 'create'> | ApiBody<'clientes', 'update'>>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<ApiResponse<'clientes', 'findOne'>['documentos'] | null>(null);

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
  });

  documentTypes: {
    value: keyof ApiField<'clientes', 'findOne', 'documentos'>;
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
        });
        this.imagenes.set(clienteData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(clienteData.documentos)));
      } else {
        this.clienteForm.reset({ tipoDocumento: 'DNI' });
        this.imagenes.set([]);
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en tipoDocumento para validaciones
    this.clienteForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
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
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formData = this.clienteForm.value;

    // Limpiar campos vacíos
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
      this.onSubmitForm.emit(cleanData as ApiBody<'clientes', 'update'>);
    } else {
      this.onSubmitForm.emit(cleanData as ApiBody<'clientes', 'create'>);
    }
  }

  // Document Management
  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'clientes', 'findOne', 'documentos'>
  ) {
    if (!this.cliente()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: ApiBody<'clientes', 'createDocumento'> = {
      clienteId: this.cliente()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
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

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.clienteService
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

  deleteDocument(id: number, tipo: keyof ApiField<'clientes', 'findOne', 'documentos'>) {
    this.clienteService
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
    doc: ApiField<'clientes', 'findOne', 'documentos'>['dni'][number]
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
    doc: ApiField<'clientes', 'findOne', 'documentos'>['dni'][number]
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
    tipo: keyof ApiField<'clientes', 'findOne', 'documentos'>
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
    tipo: keyof ApiField<'clientes', 'findOne', 'documentos'>
  ): ApiField<'clientes', 'findOne', 'documentos'>['dni'] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return docs[tipo] || [];
  }
}
