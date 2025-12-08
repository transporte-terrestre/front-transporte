import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoResultDto, VehiculoCreateDto, VehiculoUpdateDto } from '@interface/admin/vehiculo.interface';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import { DocumentsUpload } from '@module/admin/components/documents-upload/documents-upload';

@Component({
  selector: 'app-vehiculo-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsUpload],
  templateUrl: './vehiculo-form.html',
  styleUrl: './vehiculo-form.css',
})
export class VehiculoForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  vehiculo = input<VehiculoResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<VehiculoCreateDto | VehiculoUpdateDto>();

  // State
  imagenes = signal<string[]>([]);
  documentos = signal<string[]>([]);

  vehiculoForm: FormGroup = this.fb.group({
    placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6,7}$/)]],
    marca: ['', [Validators.required, Validators.minLength(2)]],
    modelo: ['', [Validators.required, Validators.minLength(2)]],
    anio: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
    kilometraje: ['', [Validators.required, Validators.min(0)]],
    fechaVencimientoSoat: ['', [Validators.required]],
    estado: ['activo', [Validators.required]],
  });

  estados: Array<{ value: 'activo' | 'taller' | 'retirado'; label: string; icon: string }> = [
    { value: 'activo', label: 'Activo', icon: 'fa-check-circle' },
    { value: 'taller', label: 'En Taller', icon: 'fa-wrench' },
    { value: 'retirado', label: 'Retirado', icon: 'fa-times-circle' },
  ];

  constructor() {
    // Effect para actualizar formulario cuando cambia el vehículo
    effect(() => {
      const vehiculoData = this.vehiculo();
      const isEditMode = this.editMode();

      if (isEditMode && vehiculoData) {
        this.vehiculoForm.patchValue({
          placa: vehiculoData.placa,
          marca: vehiculoData.marca,
          modelo: vehiculoData.modelo,
          anio: vehiculoData.anio,
          kilometraje: vehiculoData.kilometraje,
          fechaVencimientoSoat: vehiculoData.fechaVencimientoSoat.split('T')[0],
          estado: vehiculoData.estado,
        });
        this.imagenes.set(vehiculoData.imagenes || []);
        this.documentos.set(vehiculoData.documentos || []);
      } else {
        this.vehiculoForm.reset({ estado: 'activo' });
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
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.vehiculoForm.value,
      imagenes: this.imagenes(),
      documentos: this.documentos(),
    };
    this.onSubmitForm.emit(formData);
  }
}
