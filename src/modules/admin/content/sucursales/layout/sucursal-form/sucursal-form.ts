import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-sucursal-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sucursal-form.html',
  styleUrl: './sucursal-form.css',
})
export class SucursalForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  sucursal = input<ApiResponse<'talleres', 'findOneSucursal'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<
    ApiBody<'talleres', 'createSucursal'> | ApiBody<'talleres', 'updateSucursal'>
  >();

  sucursalForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    direccion: [''],
  });

  constructor() {
    effect(() => {
      const sucursalData = this.sucursal();
      const isEditMode = this.editMode();

      if (isEditMode && sucursalData) {
        this.sucursalForm.patchValue({
          nombre: sucursalData.nombre,
          direccion: sucursalData.direccion,
        });
      } else {
        this.sucursalForm.reset();
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.sucursalForm.invalid) {
      this.sucursalForm.markAllAsTouched();
      return;
    }

    const formData = this.sucursalForm.value;
    if (this.editMode()) {
      this.onSubmitForm.emit(formData as ApiBody<'talleres', 'updateSucursal'>);
    } else {
      this.onSubmitForm.emit(formData as ApiBody<'talleres', 'createSucursal'>);
    }
  }
}
