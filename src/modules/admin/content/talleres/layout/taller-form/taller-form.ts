import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { TallerService } from '@service/admin/taller.service';
import { SucursalInputSearch } from '@module/admin/components/input-searchs/sucursal-input-search/sucursal-input-search';
@Component({
  selector: 'app-taller-form',
  imports: [CommonModule, ReactiveFormsModule, SucursalInputSearch],
  templateUrl: './taller-form.html',
  styleUrl: './taller-form.css',
})
export class TallerForm implements OnInit {
  private fb = inject(FormBuilder);
  private tallerService = inject(TallerService);

  // Inputs
  taller = input<ApiResponse<'talleres', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'talleres', 'create'> | ApiBody<'talleres', 'update'>>();

  tallerForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.pattern(/^[0-9]{11}$/)]],
    razonSocial: ['', [Validators.required, Validators.minLength(2)]],
    nombreComercial: [''],
    sucursalIds: [[]],
    tipo: ['externo', [Validators.required]],
    telefono: [''],
    email: ['', [Validators.email]],
    direccion: [''],
  });

  tipos: Array<{ value: 'interno' | 'externo'; label: string; icon: string }> = [
    { value: 'interno', label: 'Interno', icon: 'fa-building' },
    { value: 'externo', label: 'Externo', icon: 'fa-globe' },
  ];

  sucursales: any[] = [];

  constructor() {
    effect(() => {
      const tallerData = this.taller();
      const isEditMode = this.editMode();

      if (isEditMode && tallerData) {
        this.tallerForm.patchValue({
          ruc: tallerData.ruc,
          razonSocial: tallerData.razonSocial,
          nombreComercial: tallerData.nombreComercial,
          sucursalIds: tallerData.sucursalIds || [],
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

  async ngOnInit() {
    this.sucursales = await this.tallerService.findAllSucursales();
  }

  submitForm() {
    if (this.tallerForm.invalid) {
      this.tallerForm.markAllAsTouched();
      return;
    }

    const formData = this.tallerForm.value;
    if (this.editMode()) {
      this.onSubmitForm.emit(formData as ApiBody<'talleres', 'update'>);
    } else {
      this.onSubmitForm.emit(formData as ApiBody<'talleres', 'create'>);
    }
  }
}
