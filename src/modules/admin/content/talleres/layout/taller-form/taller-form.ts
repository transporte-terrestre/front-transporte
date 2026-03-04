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
  });

  tipos: Array<{ value: 'interno' | 'externo'; label: string; icon: string }> = [
    { value: 'interno', label: 'Interno', icon: 'fa-building' },
    { value: 'externo', label: 'Externo', icon: 'fa-globe' },
  ];

  sucursales: any[] = [];
  selectedSucursalesDetalle: any[] = [];

  constructor() {
    effect(() => {
      const tallerData = this.taller();
      const isEditMode = this.editMode();

      if (isEditMode && tallerData) {
        this.selectedSucursalesDetalle = tallerData.sucursales ? [...tallerData.sucursales] : [];
        // Map id if needed
        this.selectedSucursalesDetalle.forEach((s) => {
          if (!s.sucursalId && s.id) s.sucursalId = s.id;
        });

        this.tallerForm.patchValue(
          {
            ruc: tallerData.ruc,
            razonSocial: tallerData.razonSocial,
            nombreComercial: tallerData.nombreComercial,
            sucursalIds: tallerData.sucursalIds || [],
            tipo: tallerData.tipo,
            telefono: tallerData.telefono,
            email: tallerData.email,
          },
          { emitEvent: false },
        );
      } else {
        // Create mode or loading state
        this.tallerForm.patchValue(
          {
            ruc: '',
            razonSocial: '',
            nombreComercial: '',
            sucursalIds: [],
            tipo: 'externo',
            telefono: '',
            email: '',
          },
          { emitEvent: false },
        );
        this.selectedSucursalesDetalle = [];
      }

      // Asegurar que procesamos los detalles si ya tenemos sucursales cargadas
      if (this.sucursales.length > 0) {
        this.processSucursalDetails(this.tallerForm.get('sucursalIds')?.value || []);
      }
    });

    this.tallerForm.get('sucursalIds')?.valueChanges.subscribe((ids: number[] | null) => {
      this.processSucursalDetails(ids || []);
    });
  }

  // Cache de sucursales completas recibidas del input-search
  private cachedSucursalesMap = new Map<number, any>();

  processSucursalDetails(ids: number[]) {
    const newDetails: any[] = [];
    ids.forEach((id) => {
      const numericId = Number(id);
      let existing = (this.selectedSucursalesDetalle || []).find(
        (s) => Number(s.sucursalId || s.id) === numericId,
      );

      // Buscar primero en el cache (datos frescos del input-search), luego en la lista general
      const sucursalBase =
        this.cachedSucursalesMap.get(numericId) ||
        (this.sucursales || []).find((s) => Number(s.id) === numericId);

      if (!existing) {
        existing = {
          sucursalId: numericId,
          departamento: sucursalBase?.departamento || '',
          provincia: sucursalBase?.provincia || '',
          distrito: sucursalBase?.distrito || '',
          direccion: '',
        };
      } else if (sucursalBase) {
        existing.departamento = sucursalBase.departamento;
        existing.provincia = sucursalBase.provincia;
        existing.distrito = sucursalBase.distrito;
        if (!existing.sucursalId) existing.sucursalId = numericId;
      }
      newDetails.push(existing);
    });
    this.selectedSucursalesDetalle = newDetails;
  }

  onSucursalesSelectionChange(sucursalesCompletas: any[]) {
    // Actualizar el cache con los datos completos del input-search
    (sucursalesCompletas || []).forEach((s) => {
      this.cachedSucursalesMap.set(Number(s.id), s);
    });
    // Re-procesar detalles con los nuevos datos disponibles
    this.processSucursalDetails(this.tallerForm.get('sucursalIds')?.value || []);
  }

  updateDireccion(id: number, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const item = this.selectedSucursalesDetalle.find((s) => s.sucursalId === id || s.id === id);
    if (item) {
      item.direccion = value;
    }
  }

  async ngOnInit() {
    this.sucursales = (await this.tallerService.findAllSucursales()) || [];
    // Llenar el cache con la lista general
    this.sucursales.forEach((s) => this.cachedSucursalesMap.set(Number(s.id), s));
    // Re-procesar detalles para llenar labels faltantes
    this.processSucursalDetails(this.tallerForm.get('sucursalIds')?.value || []);
  }

  submitForm() {
    if (this.tallerForm.invalid) {
      this.tallerForm.markAllAsTouched();
      return;
    }

    const formData = { ...this.tallerForm.value };

    formData.sucursales = this.selectedSucursalesDetalle.map((s) => ({
      sucursalId: s.sucursalId || s.id,
      direccion: s.direccion || 'Sin dirección',
    }));
    delete formData.sucursalIds;

    if (this.editMode()) {
      this.onSubmitForm.emit(formData as unknown as ApiBody<'talleres', 'update'>);
    } else {
      this.onSubmitForm.emit(formData as unknown as ApiBody<'talleres', 'create'>);
    }
  }
}
