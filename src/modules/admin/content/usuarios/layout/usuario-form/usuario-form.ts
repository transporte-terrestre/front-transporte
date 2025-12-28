import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { UsuarioService } from '@service/admin/usuario.service';
import { ToastService } from '@service/toast.service';

import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';

@Component({
  selector: 'app-usuario-form',
  imports: [CommonModule, ReactiveFormsModule, DocumentsDateUpload],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit {
  private fb = inject(FormBuilder);

  private usuarioService = inject(UsuarioService);
  private toastService = inject(ToastService);

  // Inputs
  usuario = input<ApiResponse<'usuarios', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Local state for documents
  localDocuments = signal<ApiField<'usuarios', 'findOne', 'documentos'> | null>(null);

  // Outputs
  onSubmitForm = output<ApiBody<'usuarios', 'create'> | ApiBody<'usuarios', 'update'>>();

  usuarioForm: FormGroup = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    roles: [['empleado'], [Validators.required]],
  });

  roles: NonNullable<ApiField<'usuarios', 'findOne', 'roles'>>[number][] = ['admin', 'empleado'];

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'seguro_vida_ley', label: 'Seguro Vida Ley' },
    { value: 'sctr', label: 'SCTR' },
    { value: 'examen_medico', label: 'Examen Médico' },
    { value: 'induccion_general', label: 'Inducción General' },
  ];

  constructor() {
    // Effect para actualizar formulario cuando cambia el usuario
    effect(() => {
      const usuarioData = this.usuario();
      const isEditMode = this.editMode();

      if (isEditMode && usuarioData) {
        this.usuarioForm.patchValue({
          nombres: usuarioData.nombres,
          apellidos: usuarioData.apellidos,
          email: usuarioData.email,
          roles: usuarioData.roles,
        });
        this.usuarioForm.get('contrasenia')?.clearValidators();
        this.usuarioForm.get('contrasenia')?.updateValueAndValidity();

        // Initialize local documents
        this.localDocuments.set(JSON.parse(JSON.stringify(usuarioData.documentos)));
      } else {
        this.usuarioForm.reset({ roles: ['empleado'] });
        this.usuarioForm
          .get('contrasenia')
          ?.setValidators([Validators.required, Validators.minLength(6)]);
        this.usuarioForm.get('contrasenia')?.updateValueAndValidity();
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    const formData = this.usuarioForm.value;

    if (this.editMode()) {
      const updateData: ApiBody<'usuarios', 'update'> = { ...formData };
      if (!updateData.contrasenia) {
        delete updateData.contrasenia;
      }
      this.onSubmitForm.emit(updateData);
    } else {
      const createData: ApiBody<'usuarios', 'create'> = formData;
      this.onSubmitForm.emit(createData);
    }
  }

  toggleRole(role: NonNullable<ApiField<'usuarios', 'findOne', 'roles'>>[number]) {
    const currentRoles = this.usuarioForm.get('roles')?.value || [];
    const index = currentRoles.indexOf(role);

    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }

    this.usuarioForm.patchValue({ roles: currentRoles });
  }

  hasRole(role: NonNullable<ApiField<'usuarios', 'findOne', 'roles'>>[number]): boolean {
    const currentRoles = this.usuarioForm.get('roles')?.value || [];
    return currentRoles.includes(role);
  }

  // Document Management
  handleDocumentUpload(event: DocumentWithDate, tipo: string) {
    if (!this.usuario()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: ApiBody<'usuarios', 'createDocumento'> = {
      usuarioId: this.usuario()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.usuarioService
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
    this.usuarioService
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

  deleteDocument(id: number, tipo: string) {
    this.usuarioService
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

  private addDocumentToLocalList(doc: ApiResponse<'usuarios', 'findDocumento'>) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof ApiField<'usuarios', 'findOne', 'documentos'>;
      const newDocs = { ...docs };
      if (!newDocs[tipo]) {
        newDocs[tipo] = [];
      }
      newDocs[tipo] = [...newDocs[tipo], doc];
      this.localDocuments.set(newDocs);
    }
  }

  private updateDocumentInLocalList(doc: ApiResponse<'usuarios', 'findDocumento'>) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof ApiField<'usuarios', 'findOne', 'documentos'>;
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
      const tipoKey = tipo as keyof ApiField<'usuarios', 'findOne', 'documentos'>;
      if (docs[tipoKey]) {
        const newDocs = { ...docs };
        newDocs[tipoKey] = newDocs[tipoKey].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocumentCount(tipo: string): number {
    const docs = this.localDocuments();
    if (!docs) return 0;
    const tipoKey = tipo as keyof ApiField<'usuarios', 'findOne', 'documentos'>;
    return docs[tipoKey] ? docs[tipoKey].length : 0;
  }

  getDocuments(tipo: string): ApiResponse<'usuarios', 'findDocumento'>[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    const tipoKey = tipo as keyof ApiField<'usuarios', 'findOne', 'documentos'>;
    return docs[tipoKey] || [];
  }
}
