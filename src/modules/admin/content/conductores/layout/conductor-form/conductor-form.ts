import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConductorResultDto,
  ConductorCreateDto,
  ConductorUpdateDto,
  ClaseLicencia,
  CategoriaLicencia,
  ConductorDocumentoCreateDto,
  ConductorDocumentoResultDto,
  DocumentosAgrupadosConductorDto,
} from '@interface/admin/conductor.interface';
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
  conductor = input<ConductorResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ConductorCreateDto | ConductorUpdateDto>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<DocumentosAgrupadosConductorDto | null>(null);

  conductorForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    numeroLicencia: ['', [Validators.required, Validators.minLength(5)]],
    claseLicencia: ['', [Validators.required]],
    categoriaLicencia: ['', [Validators.required]],
  });

  clases: ClaseLicencia[] = ['A', 'B'];
  categorias: CategoriaLicencia[] = ['Uno', 'Dos', 'Tres'];

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'licencia_mtc', label: 'Licencia MTC' },
    { value: 'seguro_vida_ley', label: 'Seguro Vida Ley' },
    { value: 'sctr', label: 'SCTR' },
    { value: 'examen_medico', label: 'Examen Médico' },
    { value: 'psicosensometrico', label: 'Psicosensométrico' },
    { value: 'induccion_general', label: 'Inducción General' },
    { value: 'manejo_defensivo', label: 'Manejo Defensivo' },
    { value: 'licencia_interna', label: 'Licencia Interna' },
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
    this.onSubmitForm.emit(formData);
  }

  // Document Management
  handleDocumentUpload(event: DocumentWithDate, tipo: string) {
    if (!this.conductor()) return;

    const fakeUrl = URL.createObjectURL(event.file);

    const documento: ConductorDocumentoCreateDto = {
      conductorId: this.conductor()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: fakeUrl,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.conductorService.createDocumento(documento).subscribe({
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
    this.conductorService
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
    this.conductorService.deleteDocumento(id).subscribe({
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

  private addDocumentToLocalList(doc: ConductorDocumentoResultDto) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo as keyof DocumentosAgrupadosConductorDto;
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
      const tipo = doc.tipo as keyof DocumentosAgrupadosConductorDto;
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
      const tipoKey = tipo as keyof DocumentosAgrupadosConductorDto;
      if (docs[tipoKey]) {
        const newDocs = { ...docs };
        newDocs[tipoKey] = newDocs[tipoKey].filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: string): ConductorDocumentoResultDto[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    const tipoKey = tipo as keyof DocumentosAgrupadosConductorDto;
    return docs[tipoKey] || [];
  }
}
