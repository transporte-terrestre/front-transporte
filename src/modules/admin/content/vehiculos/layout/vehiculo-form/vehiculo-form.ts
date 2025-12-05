import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiculoResultDto, VehiculoCreateDto, VehiculoUpdateDto } from '@interface/admin/vehiculo.interface';

@Component({
  selector: 'app-vehiculo-form',
  imports: [CommonModule, ReactiveFormsModule],
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
      } else {
        this.vehiculoForm.reset({ estado: 'activo' });
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    const formData = this.vehiculoForm.value;
    this.onSubmitForm.emit(formData);
  }
}
