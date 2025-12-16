import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ClienteResultDto,
  ClienteCreateDto,
  ClienteUpdateDto,
} from '@interface/admin/cliente.interface';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';

@Component({
  selector: 'app-cliente-form',
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload],
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

  // State
  imagenes = signal<string[]>([]);

  clienteForm: FormGroup = this.fb.group({
    tipoDocumento: ['DNI', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    ruc: ['', [Validators.maxLength(20)]],
    nombres: ['', [Validators.maxLength(100)]],
    apellidos: ['', [Validators.maxLength(100)]],
    razonSocial: ['', [Validators.maxLength(200)]],
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
          tipoDocumento: clienteData.tipoDocumento,
          dni: clienteData.dni || '',
          ruc: clienteData.ruc || '',
          nombres: clienteData.nombres || '',
          apellidos: clienteData.apellidos || '',
          razonSocial: clienteData.razonSocial || '',
          email: clienteData.email || '',
          telefono: clienteData.telefono || '',
          direccion: clienteData.direccion || '',
        });
        this.imagenes.set(clienteData.imagenes || []);
      } else {
        this.clienteForm.reset({ tipoDocumento: 'DNI' });
        this.imagenes.set([]);
      }
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en tipoDocumento para validaciones
    this.clienteForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      const dniControl = this.clienteForm.get('dni');
      const rucControl = this.clienteForm.get('ruc');
      const nombresControl = this.clienteForm.get('nombres');
      const apellidosControl = this.clienteForm.get('apellidos');
      const razonSocialControl = this.clienteForm.get('razonSocial');

      if (tipo === 'DNI') {
        dniControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        nombresControl?.setValidators([Validators.required, Validators.maxLength(100)]);
        apellidosControl?.setValidators([Validators.required, Validators.maxLength(100)]);

        rucControl?.clearValidators();
        razonSocialControl?.clearValidators();
      } else {
        rucControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        razonSocialControl?.setValidators([Validators.required, Validators.maxLength(200)]);

        dniControl?.clearValidators();
        nombresControl?.clearValidators();
        apellidosControl?.clearValidators();
      }

      dniControl?.updateValueAndValidity();
      rucControl?.updateValueAndValidity();
      nombresControl?.updateValueAndValidity();
      apellidosControl?.updateValueAndValidity();
      razonSocialControl?.updateValueAndValidity();
    });
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const formData = this.clienteForm.value;

    // Limpiar campos vacíos
    const cleanData: any = {
      tipoDocumento: formData.tipoDocumento,
      imagenes: this.imagenes(),
    };

    if (formData.tipoDocumento === 'DNI') {
      cleanData.dni = formData.dni;
      cleanData.nombres = formData.nombres;
      cleanData.apellidos = formData.apellidos;
    } else {
      cleanData.ruc = formData.ruc;
      cleanData.razonSocial = formData.razonSocial;
    }

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
