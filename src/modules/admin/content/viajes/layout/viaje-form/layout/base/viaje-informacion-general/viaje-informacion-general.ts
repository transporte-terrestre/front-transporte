import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ViajeFormService } from '../../../viaje-form.service';
import { ClienteInputSearch } from '@module/admin/components/input-searchs/cliente-input-search/cliente-input-search';
import { EntidadInputSearch } from '@module/admin/components/input-searchs/entidad-input-search/entidad-input-search';
import { RutaCircuitoInputSearch } from '@module/admin/components/input-searchs/ruta-circuito-input-search/ruta-circuito-input-search';
import { RutaInputSearch } from '@module/admin/components/input-searchs/ruta-input-search/ruta-input-search';
import { ViajeMapaPreview } from '../viaje-mapa-preview/viaje-mapa-preview';
import { ConductorInputSearch } from '@module/admin/components/input-searchs/conductor-input-search/conductor-input-search';
import { VehiculoInputSearch } from '@module/admin/components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { EncargadoInputSearch } from '@module/admin/components/input-searchs/encargado-input-search/encargado-input-search';

@Component({
  selector: 'app-viaje-informacion-general',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClienteInputSearch,
    EntidadInputSearch,
    RutaCircuitoInputSearch,
    RutaInputSearch,
    ViajeMapaPreview,
    ConductorInputSearch,
    VehiculoInputSearch,
    EncargadoInputSearch
  ],
  templateUrl: './viaje-informacion-general.html',
})
export class ViajeInformacionGeneral {
  viajeContext = inject(ViajeFormService);

  get form() {
    return this.viajeContext.viajeForm;
  }

  get editMode() {
    return this.viajeContext.editMode;
  }

  get tipoViaje() {
    return this.viajeContext.tipoViaje;
  }

  get hasRutaIda() {
    return this.viajeContext.hasRutaIda;
  }

  get hasRutaVuelta() {
    return this.viajeContext.hasRutaVuelta;
  }

  get selectedClienteId() {
    return this.viajeContext.selectedClienteId;
  }

  get conductorValidacionMsg() {
    return this.viajeContext.conductorValidacionMsg;
  }

  get vehiculoValidacionMsg() {
    return this.viajeContext.vehiculoValidacionMsg;
  }

  get selectedRutaLabel() {
    return this.viajeContext.selectedRutaLabel;
  }
}
