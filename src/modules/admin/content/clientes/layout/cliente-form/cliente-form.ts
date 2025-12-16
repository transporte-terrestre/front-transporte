import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ClienteResultDto,
  ClienteCreateDto,
  ClienteUpdateDto,
  ClienteDocumentoCreateDto,
  ClienteDocumentoResultDto,
  DocumentosAgrupadosClienteDto,
} from '@interface/admin/cliente.interface';
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
  cliente = input<ClienteResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ClienteCreateDto | ClienteUpdateDto>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosClienteDto | null>(null);

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

  documentTypes = [
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
      this.onSubmitForm.emit(cleanData as ClienteUpdateDto);
    } else {
      this.onSubmitForm.emit(cleanData as ClienteCreateDto);
    }
  }

  // Document Management
  handleDocumentUpload(event: DocumentWithDate, tipo: string) {
    if (!this.cliente()) return;

    const fakeUrl = URL.createObjectURL(event.file);

    const documento: ClienteDocumentoCreateDto = {
      clienteId: this.cliente()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: fakeUrl,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.clienteService.createDocumento(documento).subscribe({
      next: (doc) => {
        this.toastService.success('Documento subido exitosamente');
        this.addDocumentToLocalList(doc);
      },
      error: (err) => {
        console.error('Error al subir documento:', err);
        this.toastService.error('Error al subir documento');
      },
    });
  }

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.clienteService
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
    this.clienteService.deleteDocumento(id).subscribe({
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

  private addDocumentToLocalList(doc: ClienteDocumentoResultDto) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof DocumentosAgrupadosClienteDto;
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
      const tipo = doc.tipo as keyof DocumentosAgrupadosClienteDto;
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
      const tipoKey = tipo as keyof DocumentosAgrupadosClienteDto;
      if (docs[tipoKey]) {
        const newDocs = { ...docs };
        newDocs[tipoKey] = newDocs[tipoKey].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: string): ClienteDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    const tipoKey = tipo as keyof DocumentosAgrupadosClienteDto;
    return docs[tipoKey] || [];
  }
}
