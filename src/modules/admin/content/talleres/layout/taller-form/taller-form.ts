import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TallerResultDto,
  TallerCreateDto,
  TallerUpdateDto,
} from '@interface/admin/taller.interface';

@Component({
  selector: 'app-taller-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './taller-form.html',
  styleUrl: './taller-form.css',
})
export class TallerForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  taller = input<TallerResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<TallerCreateDto | TallerUpdateDto>();

  tallerForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.pattern(/^[0-9]{11}$/)]],
    razonSocial: ['', [Validators.required, Validators.minLength(2)]],
    nombreComercial: [''],
    tipo: ['externo', [Validators.required]],
    telefono: [''],
    email: ['', [Validators.email]],
    direccion: [''],
  });

  tipos: Array<{ value: 'interno' | 'externo'; label: string; icon: string }> = [
    { value: 'interno', label: 'Interno', icon: 'fa-building' },
    { value: 'externo', label: 'Externo', icon: 'fa-globe' },
  ];

  constructor() {
    effect(() => {
      const tallerData = this.taller();
      const isEditMode = this.editMode();

      if (isEditMode && tallerData) {
        this.tallerForm.patchValue({
          ruc: tallerData.ruc,
          razonSocial: tallerData.razonSocial,
          nombreComercial: tallerData.nombreComercial,
          tipo: tallerData.tipo,
          telefono: tallerData.telefono,
          email: tallerData.email,
          direccion: tallerData.direccion,
        });
      } else {
        this.tallerForm.reset({ tipo: 'externo' });
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.tallerForm.invalid) {
      this.tallerForm.markAllAsTouched();
      return;
    }

    const formData = this.tallerForm.value;
    this.onSubmitForm.emit(formData);
  }
}
