import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConductorResultDto, ConductorCreateDto, ConductorUpdateDto, ClaseLicencia, CategoriaLicencia } from '@interface/admin/conductor.interface';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import { DocumentsUpload } from '@module/admin/components/documents-upload/documents-upload';

@Component({
  selector: 'app-conductor-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsUpload],
  templateUrl: './conductor-form.html',
  styleUrl: './conductor-form.css',
})
export class ConductorForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  conductor = input<ConductorResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ConductorCreateDto | ConductorUpdateDto>();

  // State
  imagenes = signal<string[]>([]);
  documentos = signal<string[]>([]);

  conductorForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    numeroLicencia: ['', [Validators.required, Validators.minLength(5)]],
    claseLicencia: ['', [Validators.required]],
    categoriaLicencia: ['', [Validators.required]],
    fechaExpedicion: ['', [Validators.required]],
    fechaRevalidacion: ['', [Validators.required]],
  });

  clases: ClaseLicencia[] = ['A', 'B'];
  categorias: CategoriaLicencia[] = ['Uno', 'Dos', 'Tres'];

  constructor() {
    // Effect para actualizar formulario cuando cambia el conductor
    effect(() => {
      const conductorData = this.conductor();
      const isEditMode = this.editMode();

      if (isEditMode && conductorData) {
        this.conductorForm.patchValue({
          dni: conductorData.dni,
          nombre: conductorData.nombre,
          numeroLicencia: conductorData.numeroLicencia,
          claseLicencia: conductorData.claseLicencia,
          categoriaLicencia: conductorData.categoriaLicencia,
          fechaExpedicion: conductorData.fechaExpedicion.split('T')[0],
          fechaRevalidacion: conductorData.fechaRevalidacion.split('T')[0],
        });
        this.imagenes.set(conductorData.imagenes || []);
        this.documentos.set(conductorData.documentos || []);
      } else {
        this.conductorForm.reset();
        this.imagenes.set([]);
        this.documentos.set([]);
      }
    });
  }

  ngOnInit() {}

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  onDocumentosChange(docs: string[]) {
    this.documentos.set(docs);
  }

  submitForm() {
    if (this.conductorForm.invalid) {
      this.conductorForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.conductorForm.value,
      imagenes: this.imagenes(),
      documentos: this.documentos(),
    };
    this.onSubmitForm.emit(formData);
  }
}
