import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteResultDto, ClienteCreateDto, ClienteUpdateDto } from '@interface/admin/cliente.interface';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css',
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  cliente = input<ClienteResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ClienteCreateDto | ClienteUpdateDto>();

  clienteForm: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(20)]],
    direccion: ['', [Validators.maxLength(255)]],
  });

  constructor() {
    // Effect para actualizar formulario cuando cambia el cliente
    effect(() => {
      const clienteData = this.cliente();
      const isEditMode = this.editMode();

      if (isEditMode && clienteData) {
        this.clienteForm.patchValue({
          dni: clienteData.dni,
          nombre: clienteData.nombre,
          apellido: clienteData.apellido,
          email: clienteData.email || '',
          telefono: clienteData.telefono || '',
          direccion: clienteData.direccion || '',
        });
      } else {
        this.clienteForm.reset();
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formData = this.clienteForm.value;

    // Limpiar campos vacíos
    const cleanData: any = {
      dni: formData.dni,
      nombre: formData.nombre,
      apellido: formData.apellido,
    };

    if (formData.email) cleanData.email = formData.email;
    if (formData.telefono) cleanData.telefono = formData.telefono;
    if (formData.direccion) cleanData.direccion = formData.direccion;

    if (this.editMode()) {
      this.onSubmitForm.emit(cleanData as ClienteUpdateDto);
    } else {
      this.onSubmitForm.emit(cleanData as ClienteCreateDto);
    }
  }
}
