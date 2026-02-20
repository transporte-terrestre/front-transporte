import {
  Component,
  inject,
  input,
  output,
  OnInit,
  effect,
  signal,
  OnDestroy,
  AfterViewInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { RutaService } from '@service/admin/ruta.service';
import { ToastService } from '@service/toast.service';
import * as L from 'leaflet';

// Leaflet Icon Setup
const iconDefault = L.icon({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

type MapType = 'ida' | 'vuelta';

type CreateBody = ApiBody<'rutas', 'createCircuito'>;
type DetalleInput = Required<CreateBody>['ida'];
type RutaResult = ApiResponse<'rutas', 'findOneCircuito'>;

interface RutaFormValue {
  nombre: CreateBody['nombre'];
  origen: DetalleInput['origen'];
  destino: DetalleInput['destino'];
  origenLat: DetalleInput['origenLat'];
  origenLng: DetalleInput['origenLng'];
  destinoLat: DetalleInput['destinoLat'];
  destinoLng: DetalleInput['destinoLng'];
  distancia: DetalleInput['distancia'];
  tiempoEstimado: DetalleInput['tiempoEstimado'];
  origenVuelta: DetalleInput['origen'];
  destinoVuelta: DetalleInput['destino'];
  origenLatVuelta: DetalleInput['origenLat'];
  origenLngVuelta: DetalleInput['origenLng'];
  destinoLatVuelta: DetalleInput['destinoLat'];
  destinoLngVuelta: DetalleInput['destinoLng'];
  distanciaVuelta: DetalleInput['distancia'];
  tiempoEstimadoVuelta: DetalleInput['tiempoEstimado'];
}

@Component({
  selector: 'app-ruta-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-form.html',
  styleUrl: './ruta-form.css',
})
export class RutaForm implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);

  // Maps & Markers
  private maps: Record<MapType, L.Map | undefined> = { ida: undefined, vuelta: undefined };
  private markers: Record<MapType, { origin?: L.Marker; dest?: L.Marker }> = {
    ida: {},
    vuelta: {},
  };
  private routeLayers: Record<MapType, L.Layer | undefined> = { ida: undefined, vuelta: undefined };

  // Inputs/Outputs
  ruta = input<RutaResult | null>(null);
  editMode = input<boolean>(false);
  onSubmitForm = output<void>();

  // State
  esVueltaIgual = signal(true);
  tipoTrayecto = signal<'ida' | 'vuelta' | 'ambos'>('ambos');
  showVuelta = computed(() => this.tipoTrayecto() === 'ambos' && !this.esVueltaIgual());

  private lastCoordsHash: Record<MapType, string> = { ida: '', vuelta: '' };

  rutaForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    origen: ['', [Validators.required]],
    destino: ['', [Validators.required]],
    origenLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    tiempoEstimado: [0, [Validators.required, Validators.min(1)]],
    // VUELTA
    origenVuelta: [''],
    destinoVuelta: [''],
    origenLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distanciaVuelta: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
    tiempoEstimadoVuelta: [0],
  });

  constructor() {
    // Load Data Effect
    effect(() => {
      const data = this.ruta();
      if (this.editMode() && data) {
        this.loadRutaData(data);
      } else {
        this.resetForm();
      }
    });

    // Toggle Vuelta Map
    effect(() => {
      if (this.showVuelta()) {
        setTimeout(() => this.initMap('vuelta'), 100);
      } else {
        this.maps.vuelta?.remove();
        this.maps.vuelta = undefined;
      }
    });

    // Also update when toggle changes
    effect(() => {
      this.esVueltaIgual(); // dependency
      this.tipoTrayecto(); // dependency
      this.updateSuggestedName();
    });
  }

  ngOnInit() {
    // Monitor coordinates for map updates
    this.rutaForm.valueChanges.subscribe(() => {
      this.checkCoordsChange('ida');
      if (this.showVuelta()) this.checkCoordsChange('vuelta');
    });

    // Auto-generate name based on route details
    const nameFields: (keyof RutaFormValue)[] = [
      'origen',
      'destino',
      'origenVuelta',
      'destinoVuelta',
    ];
    nameFields.forEach((field) => {
      this.rutaForm.get(field)?.valueChanges.subscribe(() => this.updateSuggestedName());
    });

    // Sync Destino Ida -> Origen Vuelta for independent routes (Circuit logic)
    const syncFields = ['destino', 'destinoLat', 'destinoLng'] as const;
    syncFields.forEach((field) => {
      this.rutaForm.get(field)?.valueChanges.subscribe((val) => {
        if (!this.esVueltaIgual() && this.tipoTrayecto() === 'ambos') {
          let targetField: keyof RutaFormValue = 'origenVuelta';
          if (field === 'destinoLat') targetField = 'origenLatVuelta';
          if (field === 'destinoLng') targetField = 'origenLngVuelta';

          this.rutaForm.patchValue({ [targetField]: val }, { emitEvent: false });
        }
      });
    });
  }

  private updateSuggestedName() {
    const val = this.rutaForm.getRawValue();
    const type = this.tipoTrayecto();
    const esIgual = this.esVueltaIgual();

    // Safety check for nulls
    const origen = val.origen || '';
    const destino = val.destino || '';

    // If user manually edited name significantly different from pattern, maybe don't overwrite?
    // But user asked for "logic", implying automation.
    // We'll proceed with overwriting for consistency as requested.

    if (!origen || !destino) return;

    let newName = `${origen} - ${destino}`;

    if (type === 'ambos') {
      if (esIgual) {
        // Round trip pattern: A - B - A
        newName = `${origen} - ${destino} - ${origen}`;
      } else {
        const origenVuelta = val.origenVuelta || '';
        const destinoVuelta = val.destinoVuelta || '';

        if (origenVuelta && destinoVuelta) {
          // Check for triangulation (Chain: A -> B -> C)
          if (origenVuelta.toLowerCase().trim() === destino.toLowerCase().trim()) {
            newName = `${origen} - ${destino} - ${destinoVuelta}`;
          } else {
            // Completely independent segments
            newName = `${origen} - ${destino} / ${origenVuelta} - ${destinoVuelta}`;
          }
        }
      }
    }

    // Update name field without triggering valueChanges again if possible (though we didn't subscribe to name)
    const currentName = this.rutaForm.get('nombre')?.value;
    if (currentName !== newName) {
      this.rutaForm.patchValue({ nombre: newName }, { emitEvent: false });
    }
  }

  ngAfterViewInit() {
    this.initMap('ida');
  }

  ngOnDestroy() {
    Object.values(this.maps).forEach((map) => map?.remove());
  }

  toggleVueltaSeparada() {
    const wasEqual = this.esVueltaIgual();
    this.esVueltaIgual.update((v) => !v);

    // If we are breaking the link (Mirror -> Independent),
    // copy Ida fields to Vuelta but inverted
    if (wasEqual) {
      const v = this.rutaForm.getRawValue();
      this.rutaForm.patchValue({
        origenVuelta: v.destino,
        destinoVuelta: v.origen,
        origenLatVuelta: v.destinoLat,
        origenLngVuelta: v.destinoLng,
        destinoLatVuelta: v.origenLat,
        destinoLngVuelta: v.origenLng,
        distanciaVuelta: String(v.distancia || ''),
        tiempoEstimadoVuelta: Number(v.tiempoEstimado) || 0,
      });

      // Trigger map update for vuelta after a short delay for the map container to exist
      setTimeout(() => this.updateMapMarkers('vuelta'), 150);
    }
  }

  private loadRutaData(data: RutaResult) {
    const isVueltaOnly = !data.rutaIda && !!data.rutaVuelta;
    const isIdaOnly = !!data.rutaIda && !data.rutaVuelta;
    const isAmbos = !!data.rutaIda && !!data.rutaVuelta;

    if (isAmbos) {
      this.tipoTrayecto.set('ambos');
      this.esVueltaIgual.set(data.esIgual);
    } else if (isVueltaOnly) {
      this.tipoTrayecto.set('vuelta');
      this.esVueltaIgual.set(true);
    } else if (isIdaOnly) {
      this.tipoTrayecto.set('ida');
      this.esVueltaIgual.set(true);
    }

    // Load Main Reference (Ida or Vuelta if Ida missing)
    const ref = data.rutaIda || data.rutaVuelta;
    if (ref) {
      this.rutaForm.patchValue({
        nombre: data.nombre,
        origen: ref.origen,
        destino: ref.destino,
        origenLat: ref.origenLat,
        origenLng: ref.origenLng,
        destinoLat: ref.destinoLat,
        destinoLng: ref.destinoLng,
        distancia: String(ref.distancia || ''),
        tiempoEstimado: Number(ref.tiempoEstimado) || 0,
      });
    }

    // Load Vuelta Specifics if independent
    if (isAmbos && !data.esIgual && data.rutaVuelta) {
      const v = data.rutaVuelta;
      this.rutaForm.patchValue({
        origenVuelta: v.origen,
        destinoVuelta: v.destino,
        origenLatVuelta: v.origenLat,
        origenLngVuelta: v.origenLng,
        destinoLatVuelta: v.destinoLat,
        destinoLngVuelta: v.destinoLng,
        distanciaVuelta: String(v.distancia || ''),
        tiempoEstimadoVuelta: Number(v.tiempoEstimado) || 0,
      });
    }

    setTimeout(() => {
      this.updateMapMarkers('ida');
      if (this.showVuelta()) this.updateMapMarkers('vuelta');
    }, 500);
  }

  private resetForm() {
    this.rutaForm.reset();

    // Default values (so map isn't empty)
    this.rutaForm.patchValue({
      origen: 'Villa El Salvador',
      destino: 'Santiago de Surco',
      origenLat: '-12.2111',
      origenLng: '-76.9367',
      destinoLat: '-12.1287',
      destinoLng: '-76.9852',
    });

    this.clearMarkers('ida');
    this.clearMarkers('vuelta');
    this.esVueltaIgual.set(true);
    this.tipoTrayecto.set('ambos');

    // Force marker update if map exists
    if (this.maps.ida) {
      this.updateMapMarkers('ida');
    }
  }

  // --- Map Logic ---

  private initMap(type: MapType) {
    const elementId = type === 'ida' ? 'map' : 'map-vuelta';
    if (!document.getElementById(elementId)) return;
    if (this.maps[type]) return;

    const map = L.map(elementId).setView([-12.0464, -77.0428], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    this.maps[type] = map;

    // Initial check
    this.updateMapMarkers(type);

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const m = this.markers[type];
      const isOriginLocked = type === 'vuelta' && !this.esVueltaIgual();

      if (!m.origin && !isOriginLocked) {
        this.setFormCoords(type, 'origin', lat, lng);
        this.addMarker(type, 'origin', lat, lng);
      } else if (!m.dest) {
        this.setFormCoords(type, 'dest', lat, lng);
        this.addMarker(type, 'dest', lat, lng);
      } else {
        this.toastService.info(
          isOriginLocked
            ? 'El origen de vuelta está sincronizado con el destino de ida.'
            : 'Arrastra los marcadores para ajustar.',
        );
      }
      // Force update of visual route
      this.updateMapMarkers(type);
    });
  }

  private setFormCoords(mapType: MapType, point: 'origin' | 'dest', lat: number, lng: number) {
    const suffix = mapType === 'ida' ? '' : 'Vuelta';
    const fieldPrefix = point === 'origin' ? 'origen' : 'destino';
    const latField = `${fieldPrefix}Lat${suffix}` as keyof RutaFormValue;
    const lngField = `${fieldPrefix}Lng${suffix}` as keyof RutaFormValue;

    this.rutaForm.patchValue({
      [latField]: lat.toString(),
      [lngField]: lng.toString(),
    });
  }

  private checkCoordsChange(type: MapType) {
    const v = this.rutaForm.getRawValue();
    const suffix = type === 'ida' ? '' : 'Vuelta';

    const hash = JSON.stringify({
      ol: v[`origenLat${suffix}` as keyof RutaFormValue],
      olg: v[`origenLng${suffix}` as keyof RutaFormValue],
      dl: v[`destinoLat${suffix}` as keyof RutaFormValue],
      dlg: v[`destinoLng${suffix}` as keyof RutaFormValue],
    });

    if (hash !== this.lastCoordsHash[type]) {
      this.lastCoordsHash[type] = hash;
      if (this.maps[type]) this.updateMapMarkers(type);
    }
  }

  private async getRoadRoute(
    p1: L.LatLng,
    p2: L.LatLng,
  ): Promise<{ points: L.LatLng[]; distance: number }> {
    try {
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`,
      );
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates as [number, number][];
        const distance = data.routes[0].distance / 1000; // units are meters, convert to km
        return {
          points: coords.map((c: [number, number]) => L.latLng(c[1], c[0])),
          distance: parseFloat(distance.toFixed(2)),
        };
      }
    } catch (e) {
      console.error('Error fetching route:', e);
    }
    return { points: [p1, p2], distance: 0 }; // Fallback to straight line
  }

  private async updateMapMarkers(type: MapType) {
    const map = this.maps[type];
    if (!map) return;

    const v = this.rutaForm.getRawValue();
    const suffix = type === 'ida' ? '' : 'Vuelta';

    const oLatField = `origenLat${suffix}` as keyof RutaFormValue;
    const oLngField = `origenLng${suffix}` as keyof RutaFormValue;
    const dLatField = `destinoLat${suffix}` as keyof RutaFormValue;
    const dLngField = `destinoLng${suffix}` as keyof RutaFormValue;

    const oLat = parseFloat(String(v[oLatField] || ''));
    const oLng = parseFloat(String(v[oLngField] || ''));
    const dLat = parseFloat(String(v[dLatField] || ''));
    const dLng = parseFloat(String(v[dLngField] || ''));

    this.clearMarkers(type);

    let originPt: L.LatLng | null = null;
    let destPt: L.LatLng | null = null;

    if (!isNaN(oLat) && !isNaN(oLng)) {
      originPt = L.latLng(oLat, oLng);
      this.addMarker(type, 'origin', oLat, oLng);
    }
    if (!isNaN(dLat) && !isNaN(dLng)) {
      destPt = L.latLng(dLat, dLng);
      this.addMarker(type, 'dest', dLat, dLng);
    }

    if (originPt && destPt) {
      const routeData = await this.getRoadRoute(originPt, destPt);

      if (this.routeLayers[type]) this.routeLayers[type]!.remove();

      // Sky blue color logic
      this.routeLayers[type] = L.polyline(routeData.points, {
        color: '#0ea5e9',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Auto update distance in form if 0 or changed
      const distField = `distancia${suffix}` as keyof RutaFormValue;
      if (routeData.distance > 0) {
        this.rutaForm
          .get(distField)
          ?.patchValue(routeData.distance.toString(), { emitEvent: false });
      }

      const bounds = L.latLngBounds(routeData.points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (originPt) {
      map.setView(originPt, 13);
    } else if (destPt) {
      map.setView(destPt, 13);
    }
  }

  private addMarker(type: MapType, point: 'origin' | 'dest', lat: number, lng: number) {
    const map = this.maps[type];
    if (!map) return;

    // Prevent duplicates
    if (this.markers[type][point]) return;

    // Lock Vuelta Origin to sync with Ida Destination
    const isDraggable = !(type === 'vuelta' && point === 'origin');

    // Custom Icons using FontAwesome
    const markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin" style="background: ${
        point === 'origin' ? '#22c55e' : '#ef4444'
      }; opacity: ${isDraggable ? '1' : '0.7'}"></div><i class="fas ${
        point === 'origin' ? 'fa-play' : 'fa-flag-checkered'
      }" style="color: white; font-size: 10px; position: absolute; top: 7px; left: 50%; transform: translateX(-50%); z-index: 10;"></i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

    const marker = L.marker([lat, lng], {
      draggable: isDraggable,
      icon: markerIcon,
      title: point === 'origin' ? (isDraggable ? 'Origen' : 'Origen (Sincronizado)') : 'Destino',
    }).addTo(map);

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      this.setFormCoords(type, point, lat, lng);
    });

    this.markers[type][point] = marker;
  }

  private clearMarkers(type: MapType) {
    const m = this.markers[type];
    if (m.origin) m.origin.remove();
    if (m.dest) m.dest.remove();
    if (this.routeLayers[type]) this.routeLayers[type]!.remove();

    this.markers[type] = {};
    this.routeLayers[type] = undefined;
  }

  async submitForm() {
    if (this.rutaForm.invalid) {
      this.rutaForm.markAllAsTouched();
      this.toastService.warning('Complete todos los campos requeridos.');
      return;
    }

    const val = this.rutaForm.getRawValue();
    const type = this.tipoTrayecto();
    const esIgual = this.esVueltaIgual();

    // Base Ida Helper
    const buildDetalle = (isVueltaField = false): DetalleInput => {
      const s = isVueltaField ? 'Vuelta' : '';
      return {
        origen: String(val[('origen' + s) as keyof RutaFormValue] || ''),
        destino: String(val[('destino' + s) as keyof RutaFormValue] || ''),
        origenLat: String(val[('origenLat' + s) as keyof RutaFormValue] || ''),
        origenLng: String(val[('origenLng' + s) as keyof RutaFormValue] || ''),
        destinoLat: String(val[('destinoLat' + s) as keyof RutaFormValue] || ''),
        destinoLng: String(val[('destinoLng' + s) as keyof RutaFormValue] || ''),
        distancia: String(val[('distancia' + s) as keyof RutaFormValue] || ''),
        tiempoEstimado: Number(val[('tiempoEstimado' + s) as keyof RutaFormValue]) || 0,
      };
    };

    const idaDetalle = buildDetalle(false);
    const payload: Partial<ApiBody<'rutas', 'createCircuito'>> = {
      nombre: val.nombre!,
      esIgual: esIgual,
    };

    if (type === 'ida' || type === 'ambos') {
      payload.ida = idaDetalle;
    }

    if (type === 'vuelta' || type === 'ambos') {
      if (type === 'vuelta') {
        // Solo Vuelta means we used the main fields for the Return route
        payload.vuelta = idaDetalle;
      } else if (esIgual) {
        // Ambos + Igual: Switch origin/dest for Vuelta
        payload.vuelta = {
          origen: idaDetalle.destino,
          destino: idaDetalle.origen,
          origenLat: idaDetalle.destinoLat,
          origenLng: idaDetalle.destinoLng,
          destinoLat: idaDetalle.origenLat,
          destinoLng: idaDetalle.origenLng,
          distancia: idaDetalle.distancia,
          tiempoEstimado: idaDetalle.tiempoEstimado,
        };
      } else {
        // Ambos + Independiente
        payload.vuelta = buildDetalle(true);
      }
    }

    try {
      if (this.editMode() && this.ruta()) {
        await this.rutaService.updateCircuito(
          this.ruta()!.id,
          payload as ApiBody<'rutas', 'updateCircuito'>,
        );
        this.toastService.success('Ruta actualizada exitosamente');
      } else {
        await this.rutaService.createCircuito(payload as ApiBody<'rutas', 'createCircuito'>);
        this.toastService.success('Ruta creada exitosamente');
      }
      this.onSubmitForm.emit();
    } catch (e) {
      console.error(e);
      this.toastService.error('Error al guardar la ruta');
    }
  }
}
