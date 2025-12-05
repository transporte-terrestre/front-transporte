import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioResultDto, UsuarioCreateDto, UsuarioUpdateDto, Rol } from '@interface/admin/usuario.interface';

@Component({
  selector: 'app-usuario-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  usuario = input<UsuarioResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<UsuarioCreateDto | UsuarioUpdateDto>();

  usuarioForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    contrasenia: ['', [Validators.required, Validators.minLength(6)]],
    roles: [['empleado'], [Validators.required]],
  });

  roles: Rol[] = ['admin', 'empleado'];

  constructor() {
    // Effect para actualizar formulario cuando cambia el usuario
    effect(() => {
      const usuarioData = this.usuario();
      const isEditMode = this.editMode();

      if (isEditMode && usuarioData) {
        this.usuarioForm.patchValue({
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          email: usuarioData.email,
          roles: usuarioData.roles,
        });
        this.usuarioForm.get('contrasenia')?.clearValidators();
        this.usuarioForm.get('contrasenia')?.updateValueAndValidity();
      } else {
        this.usuarioForm.reset({ roles: ['empleado'] });
        this.usuarioForm.get('contrasenia')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.usuarioForm.get('contrasenia')?.updateValueAndValidity();
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
      const updateData: UsuarioUpdateDto = { ...formData };
      if (!updateData.contrasenia) {
        delete updateData.contrasenia;
      }
      this.onSubmitForm.emit(updateData);
    } else {
      const createData: UsuarioCreateDto = formData;
      this.onSubmitForm.emit(createData);
    }
  }

  toggleRole(role: Rol) {
    const currentRoles = this.usuarioForm.get('roles')?.value || [];
    const index = currentRoles.indexOf(role);

    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(role);
    }

    this.usuarioForm.patchValue({ roles: currentRoles });
  }

  hasRole(role: Rol): boolean {
    const currentRoles = this.usuarioForm.get('roles')?.value || [];
    return currentRoles.includes(role);
  }
}
