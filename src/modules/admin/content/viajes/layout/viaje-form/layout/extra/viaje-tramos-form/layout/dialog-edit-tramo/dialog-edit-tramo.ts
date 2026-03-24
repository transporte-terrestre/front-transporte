import { Component, inject, input, output, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@service/toast.service';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeTramoResultDto } from 'api/backend.api';
import * as L from 'leaflet';

@Component({
  selector: 'app-dialog-edit-tramo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './dialog-edit-tramo.html',
})
export class DialogEditTramoComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private viajeService = inject(ViajeService);

  // Inputs
  tramo = input.required<ViajeTramoResultDto>();

  // Outputs
  onSaved = output<void>();
  onClose = output<void>();

  // State
  isSubmitting = false;
  esDescanso = false;

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  // Form
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      tipo: ['', [Validators.required]],
      nombreLugar: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      kilometrajeFinal: [0, [Validators.required, Validators.min(0)]],
      numeroPasajeros: [0],
      latitud: [0, [Validators.required]],
      longitud: [0, [Validators.required]],
    });
  }

  ngOnInit() {
    const s = this.tramo();
    this.esDescanso = s.tipo === 'descanso';

    // Para descanso, no requerimos nombre, km ni pasajeros
    // Para descanso, no requerimos nombre, km, pasajeros ni coordenadas
    if (this.esDescanso) {
      this.form.get('tipo')?.disable();
      this.form.get('nombreLugar')?.clearValidators();
      this.form.get('kilometrajeFinal')?.clearValidators();
      this.form.get('numeroPasajeros')?.clearValidators();
      this.form.get('latitud')?.clearValidators();
      this.form.get('longitud')?.clearValidators();
      
      this.form.get('nombreLugar')?.updateValueAndValidity();
      this.form.get('kilometrajeFinal')?.updateValueAndValidity();
      this.form.get('numeroPasajeros')?.updateValueAndValidity();
      this.form.get('latitud')?.updateValueAndValidity();
      this.form.get('longitud')?.updateValueAndValidity();
    }

    let fValue = '';
    let hValue = '';

    if (s.horaFinal) {
      const d = new Date(s.horaFinal);
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, '0');
      const day = String(d.getUTCDate()).padStart(2, '0');
      const hours = String(d.getUTCHours()).padStart(2, '0');
      const minutes = String(d.getUTCMinutes()).padStart(2, '0');
      fValue = `${year}-${month}-${day}`;
      hValue = `${hours}:${minutes}`;
    }

    this.form.patchValue({
      tipo: s.tipo,
      nombreLugar: s.nombreLugar || '',
      fecha: fValue,
      hora: hValue,
      kilometrajeFinal: s.kilometrajeFinal || 0,
      numeroPasajeros: s.numeroPasajeros || 0,
      latitud: s.latitud || 0,
      longitud: s.longitud || 0,
    });

    // Escuchar cambios en los inputs para mover el marcador
    this.form.get('latitud')?.valueChanges.subscribe((val) => this.updateMarkerFromInputs());
    this.form.get('longitud')?.valueChanges.subscribe((val) => this.updateMarkerFromInputs());
  }

  ngAfterViewInit() {
    if (!this.esDescanso) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  private initMap() {
    const lat = this.form.get('latitud')?.value || -12.046374;
    const lng = this.form.get('longitud')?.value || -77.042793;

    this.map = L.map('edit-tramo-map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

    this.marker.on('dragend', () => {
      const pos = this.marker?.getLatLng();
      if (pos) {
        this.form.patchValue({
          latitud: Number(pos.lat.toFixed(6)),
          longitud: Number(pos.lng.toFixed(6)),
        }, { emitEvent: false });
      }
    });
  }

  private updateMarkerFromInputs() {
    if (!this.map || !this.marker) return;
    const lat = this.form.get('latitud')?.value;
    const lng = this.form.get('longitud')?.value;
    if (lat && lng) {
      this.marker.setLatLng([lat, lng]);
      this.map.panTo([lat, lng]);
    }
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
      await this.viajeService.updateTramo(this.tramo().id, {
        tipo: val.tipo,
        nombreLugar: val.nombreLugar,
        horaFinal: isoString,
        kilometrajeFinal: Number(val.kilometrajeFinal),
        numeroPasajeros: Number(val.numeroPasajeros),
        latitud: Number(val.latitud),
        longitud: Number(val.longitud),
      });
      this.toastService.success('Registro actualizado');
      this.onSaved.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al actualizar registro');
    } finally {
      this.isSubmitting = false;
    }
  }

  close() {
    this.onClose.emit();
  }
}
