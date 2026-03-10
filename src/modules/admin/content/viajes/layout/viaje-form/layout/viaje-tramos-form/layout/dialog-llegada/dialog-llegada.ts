import { Component, inject, input, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeProximoTramoResultDto } from 'api/backend.api';
import * as L from 'leaflet';

@Component({
  selector: 'app-dialog-llegada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './dialog-llegada.html',
})
export class DialogLlegadaComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  viajeId = input.required<number>();
  sugerencia = input<ViajeProximoTramoResultDto | null>(null);

  get horaEstimada(): string | null {
    const sug = this.sugerencia();
    if (!sug?.ultimaHora) return null;
    return new Date(sug.ultimaHora).toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  }

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  isSubmitting = false;

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
    const dateValue = sug?.ultimaHora ? new Date(sug.ultimaHora) : new Date();

    const year = dateValue.getUTCFullYear();
    const month = String(dateValue.getUTCMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getUTCDate()).padStart(2, '0');
    const hours = String(dateValue.getUTCHours()).padStart(2, '0');
    const minutes = String(dateValue.getUTCMinutes()).padStart(2, '0');

    this.form.patchValue({
      nombreLugar: sug?.nombreLugar || '',
      latitud: sug?.latitud ? Number(sug.latitud) : -12.0464,
      longitud: sug?.longitud ? Number(sug.longitud) : -77.0428,
      fecha: `${year}-${month}-${day}`,
      hora: `${hours}:${minutes}`,
      kilometrajeActual: sug?.ultimoKilometraje || 0,
      cantidadPasajeros: sug?.ultimosPasajeros || 0,
    });
  }

  async save() {
    if (this.form.invalid) {
      this.toastService.warning('Complete todos los campos');
      return;
    }

    this.isSubmitting = true;
    const val = this.form.getRawValue();
    const isoString = `${val.fecha}T${val.hora}:00.000Z`;

    try {
      await this.viajeService.registrarLlegada(this.viajeId(), {
        nombreLugar: val.nombreLugar,
        latitud: Number(val.latitud),
        longitud: Number(val.longitud),
        horaActual: isoString,
        kilometrajeActual: Number(val.kilometrajeActual),
        cantidadPasajeros: this.sugerencia()?.ultimosPasajeros || 0,
        rutaParadaId: this.sugerencia()?.rutaParadaId || undefined,
      });
      this.toastService.success('Llegada registrada correctamente');
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al registrar llegada');
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.onClose.emit();
  }

  private initMap() {
    if (!document.getElementById('map-llegada')) return;

    const lat = Number(this.form.get('latitud')?.value);
    const lng = Number(this.form.get('longitud')?.value);

    this.map = L.map('map-llegada').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Ícono rojo personalizado para llegada
    const redIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.marker = L.marker([lat, lng], { draggable: true, icon: redIcon }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker?.getLatLng();
      if (pos) {
        this.form.patchValue({
          latitud: pos.lat.toFixed(6),
          longitud: pos.lng.toFixed(6),
        });
      }
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker?.setLatLng(e.latlng);
      this.form.patchValue({
        latitud: e.latlng.lat.toFixed(6),
        longitud: e.latlng.lng.toFixed(6),
      });
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
