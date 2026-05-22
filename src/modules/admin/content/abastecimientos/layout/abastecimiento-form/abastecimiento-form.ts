import { CommonModule } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ApiBody, ApiResponse } from 'api/backend.api';

type Abastecimiento = ApiResponse<'abastecimientos', 'findAll'>['data'][number];
type VehiculoOption = ApiResponse<'vehiculos', 'findAll'>['data'][number];
type CombustibleTipo = ApiBody<'abastecimientos', 'create'>['combustible'];

export type AbastecimientoFormSubmitData = ApiBody<'abastecimientos', 'create'>;

interface AbastecimientoFormState {
  vehiculoId: number | null;
  combustible: CombustibleTipo | '';
  galonesEstablecidos: string;
}

@Component({
  selector: 'app-abastecimiento-form',
  imports: [CommonModule, FormsModule, VehiculoInputSearch],
  templateUrl: './abastecimiento-form.html',
})
export class AbastecimientoForm {
  abastecimiento = input<Abastecimiento | null>(null);
  editMode = input(false);

  onSubmitForm = output<AbastecimientoFormSubmitData>();

  selectedVehiculo = signal<number | VehiculoOption | null>(null);
  form = signal<AbastecimientoFormState>({
    vehiculoId: null,
    combustible: '',
    galonesEstablecidos: '',
  });

  combustibleOptions: { value: CombustibleTipo; label: string }[] = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'gasolina', label: 'Gasolina' },
    { value: 'gnv', label: 'GNV' },
    { value: 'glp', label: 'GLP' },
    { value: 'electrico', label: 'Eléctrico' },
    { value: 'hibrido', label: 'Híbrido' },
  ];

  constructor() {
    effect(() => {
      const item = this.abastecimiento();
      if (this.editMode() && item) {
        this.form.set({
          vehiculoId: item.vehiculoId,
          combustible: this.normalizeCombustible(item.combustible),
          galonesEstablecidos: item.galonesEstablecidos,
        });
        this.selectedVehiculo.set(item.vehiculoId);
      } else {
        this.form.set({ vehiculoId: null, combustible: '', galonesEstablecidos: '' });
        this.selectedVehiculo.set(null);
      }
    });
  }

  updateForm<K extends keyof AbastecimientoFormState>(key: K, value: AbastecimientoFormState[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  onVehiculoChange(vehiculo: VehiculoOption | null) {
    this.selectedVehiculo.set(vehiculo);
    this.updateForm('vehiculoId', vehiculo?.id || null);
  }

  submitForm() {
    const form = this.form();
    const galones = Number(form.galonesEstablecidos);
    if (!form.vehiculoId || !form.combustible || Number.isNaN(galones) || galones <= 0) return;

    this.onSubmitForm.emit({
      vehiculoId: form.vehiculoId,
      combustible: form.combustible,
      galonesEstablecidos: galones,
    });
  }

  private normalizeCombustible(value: string): CombustibleTipo | '' {
    const option = this.combustibleOptions.find((item) => item.value === value);
    return option?.value || '';
  }
}
