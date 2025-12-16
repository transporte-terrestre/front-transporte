import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ConductorResultDto,
  ConductorCreateDto,
  ConductorUpdateDto,
  ClaseLicencia,
  CategoriaLicencia,
} from '@interface/admin/conductor.interface';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';

@Component({
  selector: 'app-conductor-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload],
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
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    numeroLicencia: ['', [Validators.required, Validators.minLength(5)]],
    claseLicencia: ['', [Validators.required]],
    categoriaLicencia: ['', [Validators.required]],
  });

  clases: ClaseLicencia[] = ['Uno', 'Dos', 'Tres'];
  categorias: CategoriaLicencia[] = ['A', 'B'];

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
      } else {
        this.conductorForm.reset();
        this.imagenes.set([]);
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
}
