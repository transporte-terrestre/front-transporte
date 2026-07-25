import { Component, inject, input, output, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeProximoTramoResultDto } from 'api/backend.api';
import { reverseGeocodePlaceName } from '@helper/geocoding.helper';
import * as L from 'leaflet';

@Component({
  selector: 'app-dialog-parada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './dialog-parada.html',
})
export class DialogParadaComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  viajeId = input.required<number>();
  sugerencia = input<ViajeProximoTramoResultDto | null>(null);

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  isSubmitting = false;
  isResolvingPlace = signal(false);
  private geocodingRequestId = 0;

  // Map
  private map?: L.Map;
  private marker?: L.Marker;

  // Form
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      nombreLugar: ['', [Validators.required]],
      latitud: [-12.0464, [Validators.required]],
      longitud: [-77.0428, [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      kilometrajeActual: [0, [Validators.required, Validators.min(0)]],
      cantidadPasajeros: [0],
    });
  }

  ngOnInit() {
    this.initializeForm();
    setTimeout(() => this.initMap(), 150);
  }

  ngOnDestroy() {
    this.destroyMap();
  }

  private initializeForm() {
    const sug = this.sugerencia();
    // Usar la hora de la sugerencia o la del sistema
    const dateValue = sug?.ultimaHora ? new Date(sug.ultimaHora) : new Date();

    const year = dateValue.getUTCFullYear();
    const month = String(dateValue.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getUTCDate()).padStart(2, '0');
    const hours = String(dateValue.getUTCHours()).padStart(2, '0');
    const minutes = String(dateValue.getUTCMinutes()).padStart(2, '0');

    this.form.patchValue({
      nombreLugar: '', // Editable
      latitud: sug?.latitud ? Number(sug.latitud) : -12.0464,
      longitud: sug?.longitud ? Number(sug.longitud) : -77.0428,
      fecha: `${year}-${month}-${day}`,
      hora: `${hours}:${minutes}`,
      kilometrajeActual: sug?.ultimoKilometraje || 0,
      cantidadPasajeros: sug?.ultimosPasajeros || 0,
    });
  }

  private async updatePlaceNameFromMap(latitude: number, longitude: number) {
    const requestId = ++this.geocodingRequestId;
    this.isResolvingPlace.set(true);
    this.form.patchValue({ nombreLugar: '' });

    try {
      const nombreLugar = await reverseGeocodePlaceName(latitude, longitude);
      if (requestId === this.geocodingRequestId) {
        this.form.patchValue({ nombreLugar: nombreLugar || '' });
      }
    } catch (error) {
      console.warn('No se pudo obtener el nombre de la ubicación:', error);
    } finally {
      if (requestId === this.geocodingRequestId) {
        this.isResolvingPlace.set(false);
      }
    }
  }

  private validateForm(): boolean {
    this.form.markAllAsTouched();

    const requiredFields = [
      { control: 'nombreLugar', label: 'Nombre del lugar' },
      { control: 'latitud', label: 'Ubicación del mapa' },
      { control: 'longitud', label: 'Ubicación del mapa' },
      { control: 'fecha', label: 'Fecha de la parada' },
      { control: 'hora', label: 'Hora de la parada' },
      { control: 'kilometrajeActual', label: 'Kilometraje actual' },
    ];

    const missingFields = [
      ...new Set(
        requiredFields
          .filter(({ control }) => {
            const field = this.form.get(control);
            return (
              !field ||
              field.hasError('required') ||
              field.value === null ||
              field.value === undefined ||
              String(field.value).trim() === ''
            );
          })
          .map(({ label }) => label),
      ),
    ];

    if (missingFields.length > 0) {
      this.toastService.warning(`Falta completar: ${missingFields.join(', ')}.`);
      return false;
    }

    if (this.form.get('kilometrajeActual')?.hasError('min')) {
      this.toastService.warning('El kilometraje actual no puede ser negativo.');
      return false;
    }

    if (this.form.invalid) {
      this.toastService.warning('Revisa los datos ingresados antes de registrar la parada.');
      return false;
    }

    return true;
  }

  async save() {
    if (!this.validateForm()) return;

    this.isSubmitting = true;
    const val = this.form.getRawValue();
    const nombreLugar = String(val.nombreLugar || '').trim();
    const isoString = `${val.fecha}T${val.hora}:00.000Z`;

    try {
      await this.viajeService.registrarParada(this.viajeId(), {
        nombreLugar,
        latitud: Number(val.latitud),
        longitud: Number(val.longitud),
        horaActual: isoString,
        kilometrajeActual: Number(val.kilometrajeActual),
        cantidadPasajeros: this.sugerencia()?.ultimosPasajeros || 0,
      });
      this.toastService.success('Parada ocasional registrada');
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al registrar parada');
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.onClose.emit();
  }

  private initMap() {
    if (!document.getElementById('map-parada')) return;

    const lat = Number(this.form.get('latitud')?.value);
    const lng = Number(this.form.get('longitud')?.value);

    this.map = L.map('map-parada').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Ícono naranja personalizado para paradas
    const orangeIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.marker = L.marker([lat, lng], { draggable: true, icon: orangeIcon }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker?.getLatLng();
      if (pos) {
        this.form.patchValue({
          latitud: pos.lat.toFixed(6),
          longitud: pos.lng.toFixed(6),
        });
        void this.updatePlaceNameFromMap(pos.lat, pos.lng);
      }
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker?.setLatLng(e.latlng);
      this.form.patchValue({
        latitud: e.latlng.lat.toFixed(6),
        longitud: e.latlng.lng.toFixed(6),
      });
      void this.updatePlaceNameFromMap(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => this.map?.invalidateSize(), 150);
  }

  private destroyMap() {
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}
