import { Component, inject, input, output, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';

// Service
import { ViajeFormService } from './viaje-form.service';

// Base Components
import { ViajeInformacionGeneral } from './layout/base/viaje-informacion-general/viaje-informacion-general';
import { ViajeProgramacionRecursos } from './layout/base/viaje-programacion-recursos/viaje-programacion-recursos';

// Extra Components
import { ViajeConductoresForm } from './layout/extra/viaje-conductores-form/viaje-conductores-form';
import { ViajeVehiculosForm } from './layout/extra/viaje-vehiculos-form/viaje-vehiculos-form';
import { ViajeComentariosForm } from './layout/extra/viaje-comentarios-form/viaje-comentarios-form';
import { ViajeTramosFormComponent } from './layout/extra/viaje-tramos-form/viaje-tramos-form';
import { ViajePasajerosForm } from './layout/extra/viaje-pasajeros-form/viaje-pasajeros-form';

@Component({
  selector: 'app-viaje-form',
  standalone: true,
  providers: [ViajeFormService],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ViajeInformacionGeneral,
    ViajeProgramacionRecursos,
    ViajeConductoresForm,
    ViajeVehiculosForm,
    ViajePasajerosForm,
    ViajeComentariosForm,
    ViajeTramosFormComponent,
  ],
  templateUrl: './viaje-form.html',
  styleUrl: './viaje-form.css',
})
export class ViajeForm implements OnInit {
  private toastService = inject(ToastService);
  viajeContext = inject(ViajeFormService);

  // Inputs
  viaje = input<ApiResponse<'viajes', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'viajes', 'create'>>();
  onUpdate = output<ApiBody<'viajes', 'update'>>();
  onDataChange = output<void>();

  constructor() {
    // Sincronizar inputs al servicio
    effect(() => {
      const viajeData = this.viaje();
      const isEditMode = this.editMode();

      if (isEditMode && viajeData) {
        this.viajeContext.patchViajeData(viajeData, true);
      } else {
        this.viajeContext.resetForm();
      }
    });
  }

  ngOnInit() {}

  get form() {
    return this.viajeContext.viajeForm;
  }

  get tipoViaje() {
    return this.viajeContext.tipoViaje;
  }

  get hasRutaSelected() {
    return this.viajeContext.hasRutaSelected;
  }

  submitForm() {
    if (this.form.invalid) {
      this.toastService.warning('Faltan campos por completar en el formulario de viaje.');
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.editMode()) {
      const updatePayload = this.viajeContext.toUpdateDto(formValue);
      this.onUpdate.emit(updatePayload);
    } else {
      const createPayload = this.viajeContext.toCreateDto(formValue, this.tipoViaje());
      this.onSubmitForm.emit(createPayload);
    }
  }
}
