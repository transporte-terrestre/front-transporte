import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-ruta-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-form.html',
  styleUrl: './ruta-form.css',
})
export class RutaForm implements OnInit {
  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);

  // Signals
  mapUrl = signal<SafeResourceUrl | null>(null);

  // Inputs
  ruta = input<ApiResponse<'rutas', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'rutas', 'create'> | ApiBody<'rutas', 'update'>>();

  rutaForm: FormGroup = this.fb.group({
    origen: ['', [Validators.required, Validators.minLength(3)]],
    destino: ['', [Validators.required, Validators.minLength(3)]],
    origenLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    costoBase: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
  });

  constructor() {
    // Effect para actualizar formulario cuando cambia la ruta
    effect(() => {
      const rutaData = this.ruta();
      const isEditMode = this.editMode();

      if (isEditMode && rutaData) {
        this.rutaForm.patchValue({
          origen: rutaData.origen,
          destino: rutaData.destino,
          origenLat: rutaData.origenLat,
          origenLng: rutaData.origenLng,
          destinoLat: rutaData.destinoLat,
          destinoLng: rutaData.destinoLng,
          distancia: rutaData.distancia,
          costoBase: rutaData.costoBase,
        });
      } else {
        this.rutaForm.reset();
      }
    });
  }

  ngOnInit() {
    // Suscribirse a cambios en los campos de coordenadas para actualizar el mapa y calcular distancia automáticamente
    this.rutaForm.get('origenLat')?.valueChanges.subscribe(() => this.onCoordinateChange());
    this.rutaForm.get('origenLng')?.valueChanges.subscribe(() => this.onCoordinateChange());
    this.rutaForm.get('destinoLat')?.valueChanges.subscribe(() => this.onCoordinateChange());
    this.rutaForm.get('destinoLng')?.valueChanges.subscribe(() => this.onCoordinateChange());
  }

  onCoordinateChange() {
    this.calculateDistanceFromCoords();
    this.updateMapUrl();
  }

  updateMapUrl() {
    const origenLat = this.rutaForm.get('origenLat')?.value;
    const origenLng = this.rutaForm.get('origenLng')?.value;
    const destinoLat = this.rutaForm.get('destinoLat')?.value;
    const destinoLng = this.rutaForm.get('destinoLng')?.value;

    if (!origenLat || !origenLng || !destinoLat || !destinoLng) {
      this.mapUrl.set(null);
      return;
    }

    const origin = `${origenLat},${origenLng}`;
    const destination = `${destinoLat},${destinoLng}`;
    const url = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}&mode=driving`;
    this.mapUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));
  }

  submitForm() {
    if (this.rutaForm.invalid) {
      this.rutaForm.markAllAsTouched();
      return;
    }

    const formData = this.rutaForm.value;
    if (this.editMode()) {
      this.onSubmitForm.emit(formData as ApiBody<'rutas', 'update'>);
    } else {
      this.onSubmitForm.emit(formData as ApiBody<'rutas', 'create'>);
    }
  }

  calculateDistanceFromCoords() {
    const origenLat = parseFloat(this.rutaForm.get('origenLat')?.value);
    const origenLng = parseFloat(this.rutaForm.get('origenLng')?.value);
    const destinoLat = parseFloat(this.rutaForm.get('destinoLat')?.value);
    const destinoLng = parseFloat(this.rutaForm.get('destinoLng')?.value);

    if (isNaN(origenLat) || isNaN(origenLng) || isNaN(destinoLat) || isNaN(destinoLng)) {
      return;
    }

    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(destinoLat - origenLat);
    const dLng = this.deg2rad(destinoLng - origenLng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(origenLat)) *
        Math.cos(this.deg2rad(destinoLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    this.rutaForm.patchValue({
      distancia: distance.toFixed(2),
    });
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
