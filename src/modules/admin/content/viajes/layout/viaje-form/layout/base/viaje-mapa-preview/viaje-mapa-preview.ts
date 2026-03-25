import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeFormService } from '../../../viaje-form.service';
import { ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-viaje-mapa-preview',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viaje-mapa-preview.html',
})
export class ViajeMapaPreview implements OnInit, OnDestroy {
  viajeContext = inject(ViajeFormService);
  showMapOcasional = false;
  private mapOcasional: L.Map | null = null;
  private markerOcasional: L.Marker | null = null;

  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  ngOnInit() {
    // Optionally setup initialization if auto-open
  }

  ngOnDestroy() {
    if (this.mapOcasional) {
      this.mapOcasional.remove();
      this.mapOcasional = null;
    }
  }

  get form() {
    return this.viajeContext.viajeForm;
  }

  toggleMapOcasional() {
    this.showMapOcasional = !this.showMapOcasional;
    if (this.showMapOcasional) {
      setTimeout(() => this.initMapOcasional(), 100);
    } else {
      if (this.mapOcasional) {
        this.mapOcasional.remove();
        this.mapOcasional = null;
        this.markerOcasional = null;
      }
    }
  }

  private initMapOcasional() {
    if (this.mapOcasional || !this.mapElement) {
      this.mapOcasional?.invalidateSize();
      return;
    }

    this.mapOcasional = L.map(this.mapElement.nativeElement).setView([-12.046374, -77.042793], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.mapOcasional);

    const metadata = this.form.get('metadata')?.value;
    const puntoPartida = metadata?.puntoPartida;
    if (puntoPartida && puntoPartida.lat != null && puntoPartida.lng != null) {
      this.setMarkerOcasional(puntoPartida.lat, puntoPartida.lng);
      this.mapOcasional.setView([puntoPartida.lat, puntoPartida.lng], 15);
    } else {
      const defaultLat = -12.046374;
      const defaultLng = -77.042793;
      this.setMarkerOcasional(defaultLat, defaultLng);
      this.mapOcasional.setView([defaultLat, defaultLng], 12);
      this.updateMetadataPuntoPartida(defaultLat, defaultLng);
    }

    this.mapOcasional.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarkerOcasional(e.latlng.lat, e.latlng.lng);
      this.updateMetadataPuntoPartida(e.latlng.lat, e.latlng.lng);
    });
  }

  private setMarkerOcasional(lat: number, lng: number) {
    if (!this.mapOcasional) return;

    if (this.markerOcasional) {
      this.markerOcasional.setLatLng([lat, lng]);
    } else {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="position: relative; width: 30px; height: 30px;">
            <div style="width: 30px; height: 30px; border-radius: 50% 50% 50% 0; background: #22c55e; position: absolute; transform: rotate(-45deg); left: 0; top: 0; box-shadow: -1px 1px 4px rgba(0,0,0,0.3);"></div>
            <i class="fas fa-map-marker-alt" style="color: white; font-size: 12px; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); z-index: 10;"></i>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 30],
      });
      this.markerOcasional = L.marker([lat, lng], { icon, draggable: true }).addTo(this.mapOcasional);
      this.markerOcasional.on('dragend', () => {
        const coords = this.markerOcasional!.getLatLng();
        this.updateMetadataPuntoPartida(coords.lat, coords.lng);
      });
    }
  }

  updateMetadataPuntoPartida(lat: number, lng: number) {
    const metaControls = this.form.get('metadata');
    const meta = metaControls?.value || {};
    meta.puntoPartida = { lat, lng };
    metaControls?.patchValue(meta);
  }

  updateMapCoordsFromInputs(latInput: string, lngInput: string) {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      this.setMarkerOcasional(lat, lng);
      this.mapOcasional?.setView([lat, lng], 15);
      this.updateMetadataPuntoPartida(lat, lng);
    }
  }
}
