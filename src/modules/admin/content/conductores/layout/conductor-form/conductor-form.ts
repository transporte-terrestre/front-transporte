import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ConductorService } from '@service/admin/conductor.service';
import { ToastService } from '@service/toast.service';

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

  // Inputs
  conductor = input<ApiResponse<'conductores', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'conductores', 'create'> | ApiBody<'conductores', 'update'>>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<ApiResponse<'conductores', 'findOne'>['documentos'] | null>(null);

  conductorForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    email: [''],
    celular: [''],
    numeroLicencia: ['', [Validators.required, Validators.minLength(5)]],
    claseLicencia: ['', [Validators.required]],
    categoriaLicencia: ['', [Validators.required]],
  });

  clases: ApiField<'conductores', 'findOne', 'claseLicencia'>[] = ['A', 'B'];
  categorias: ApiField<'conductores', 'findOne', 'categoriaLicencia'>[] = ['Uno', 'Dos', 'Tres'];

  documentTypes: {
    value: keyof ApiField<'conductores', 'findOne', 'documentos'>;
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
          dni: conductorData.dni,
          nombres: conductorData.nombres,
          apellidos: conductorData.apellidos,
          email: conductorData.email,
          celular: conductorData.celular,
          numeroLicencia: conductorData.numeroLicencia,
          claseLicencia: conductorData.claseLicencia,
          categoriaLicencia: conductorData.categoriaLicencia,
        });
        this.imagenes.set(conductorData.fotocheck || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(conductorData.documentos)));
      } else {
        this.conductorForm.reset();
        this.imagenes.set([]);
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {}

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.conductorForm.invalid) {
      this.conductorForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.conductorForm.value,
      fotocheck: this.imagenes(),
    };

    if (this.editMode()) {
      this.onSubmitForm.emit(formData as ApiBody<'conductores', 'update'>);
    } else {
      this.onSubmitForm.emit(formData as ApiBody<'conductores', 'create'>);
    }
  }

  // Document Management
  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'conductores', 'findOne', 'documentos'>
  ) {
    if (!this.conductor()) return;

    // URL now comes directly from the event (already uploaded to Cloudinary)
    const documento: ApiBody<'conductores', 'createDocumento'> = {
      conductorId: this.conductor()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
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

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.conductorService
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

  deleteDocument(id: number, tipo: keyof ApiField<'conductores', 'findOne', 'documentos'>) {
    this.conductorService
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
    doc: ApiField<'conductores', 'findOne', 'documentos'>['dni'][number]
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
    doc: ApiField<'conductores', 'findOne', 'documentos'>['dni'][number]
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
    tipo: keyof ApiField<'conductores', 'findOne', 'documentos'>
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
    tipo: keyof ApiField<'conductores', 'findOne', 'documentos'>
  ): ApiField<'conductores', 'findOne', 'documentos'>['dni'] {
    const docs = this.localDocuments();
    if (!docs) return [];
    return docs[tipo] || [];
  }
}
