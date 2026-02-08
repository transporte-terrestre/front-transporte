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
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { RutaService } from '@service/admin/ruta.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import * as L from 'leaflet';

// Fix Leaflet marker icons
const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
const iconUrl = 'assets/leaflet/marker-icon.png';
const shadowUrl = 'assets/leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

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
  private alertService = inject(AlertService);

  // Map related
  private map: L.Map | undefined;
  private markers: { [key: string]: L.Marker } = {};
  private routeLayer: L.Layer | undefined;

  // Inputs
  ruta = input<ApiResponse<'rutas', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'rutas', 'create'> | ApiBody<'rutas', 'update'>>();

  // Signals for Paradas Logic
  paradas = signal<ApiResponse<'rutas', 'findParadas'>>([]);
  loadingParadas = signal(false);

  private lastCoordsHash = '';

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

        // Load Paradas
        this.loadParadas();

        setTimeout(() => this.updateMapMarkers(), 500);
      } else {
        this.rutaForm.reset();
        this.clearMarkers();
        this.paradas.set([]);
      }
    });

    // Watch paradas changes to update map
    effect(() => {
      const currentParadas = this.paradas();

      // Calculate hash based on coordinates and order ONLY
      const hash = JSON.stringify(
        currentParadas.map((p) => ({
          lat: p.ubicacionLat,
          lng: p.ubicacionLng,
          orden: p.orden,
        })),
      );

      if (hash === this.lastCoordsHash) {
        return;
      }
      this.lastCoordsHash = hash;

      if (this.map) {
        this.syncMarkersWithParadas(currentParadas);
      }
    });
  }

  ngOnInit() {
    this.rutaForm
      .get('origenLat')
      ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'origin'));
    this.rutaForm
      .get('origenLng')
      ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'origin'));
    this.rutaForm
      .get('destinoLat')
      ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'destination'));
    this.rutaForm
      .get('destinoLng')
      ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'destination'));
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  initMap() {
    this.map = L.map('map').setView([-12.0464, -77.0428], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.updateMapMarkers();

    // Set defaults if new
    const current = this.rutaForm.value;
    if (!current.origenLat && !current.destinoLat && !this.editMode()) {
      this.rutaForm.patchValue({
        origen: 'Lima',
        destino: 'Huacho',
        costoBase: '0.00',
        origenLat: -12.0464,
        origenLng: -77.0428,
        destinoLat: -11.116,
        destinoLng: -77.6074,
      });

      // Also initialize paradas so the list shows something
      this.paradas.set([
        { id: -1, nombre: 'Lima', orden: 0, ubicacionLat: '-12.0464', ubicacionLng: '-77.0428' },
        { id: -2, nombre: 'Huacho', orden: 1, ubicacionLat: '-11.1160', ubicacionLng: '-77.6074' },
      ] as any);
    }
  }

  // --- PARADAS LOGIC ---

  async loadParadas() {
    if (!this.ruta()) return;
    this.loadingParadas.set(true);
    try {
      const paradas = await this.rutaService.findParadas(this.ruta()!.id);
      const sortedParadas = paradas.sort((a, b) => a.orden - b.orden);
      this.paradas.set(sortedParadas);
    } catch (error) {
      console.error('Error al cargar paradas:', error);
    } finally {
      this.loadingParadas.set(false);
    }
  }

  async addDefaultParada(orden?: number) {
    const ruta = this.ruta();
    const currentParadas = this.paradas();
    // Logic: Insert midpoint between neighbors
    let targetIndex = orden !== undefined ? orden : currentParadas.length;
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex > currentParadas.length) targetIndex = currentParadas.length;

    let lat = 0,
      lng = 0;
    const prev = currentParadas[targetIndex - 1];
    const next = currentParadas[targetIndex];

    if (prev && next) {
      lat = (Number(prev.ubicacionLat) + Number(next.ubicacionLat)) / 2;
      lng = (Number(prev.ubicacionLng) + Number(next.ubicacionLng)) / 2;
    } else if (ruta) {
      lat = (Number(ruta.origenLat) + Number(ruta.destinoLat)) / 2;
      lng = (Number(ruta.origenLng) + Number(ruta.destinoLng)) / 2;
    }

    const newParada = {
      id: -Date.now() - Math.floor(Math.random() * 10000),
      nombre: `Parada X`,
      ubicacionLat: lat.toString(),
      ubicacionLng: lng.toString(),
      orden: targetIndex,
      rutaId: ruta?.id || 0,
    } as any;

    const newParadas = [...currentParadas];
    newParadas.splice(targetIndex, 0, newParada);
    newParadas.forEach((p, index) => (p.orden = index));
    this.renumberDefaultParadas(newParadas);
    this.paradas.set(newParadas);
  }

  renumberDefaultParadas(paradas: any[]) {
    if (paradas.length < 3) return;
    let intermediateCounter = 1;
    for (let i = 1; i < paradas.length - 1; i++) {
      const p = paradas[i];
      if (/^Parada (\d+|X)$/.test(p.nombre)) {
        p.nombre = `Parada ${intermediateCounter}`;
      }
      intermediateCounter++;
    }
  }

  async moveParada(index: number, direction: 'up' | 'down') {
    const paradas = [...this.paradas()];
    const neighborIndex = direction === 'up' ? index - 1 : index + 1;
    if (neighborIndex <= 0 || neighborIndex >= paradas.length - 1) return;

    [paradas[index], paradas[neighborIndex]] = [paradas[neighborIndex], paradas[index]];
    paradas.forEach((p, i) => (p.orden = i));
    this.renumberDefaultParadas(paradas);
    this.paradas.set(paradas);
  }

  deleteParada(paradaId: number) {
    this.alertService.delete(
      'Eliminar Parada',
      '¿Estás seguro de eliminar esta parada de la ruta?',
      () => {
        const paradas = this.paradas().filter((p) => p.id !== paradaId);
        paradas.forEach((p, i) => (p.orden = i));
        this.renumberDefaultParadas(paradas);
        this.paradas.set(paradas);
      },
    );
  }

  updateParadaFromMap(id: number, lat: number, lng: number) {
    const paradas = [...this.paradas()];
    const index = paradas.findIndex((p) => p.id === id);
    if (index !== -1) {
      paradas[index] = {
        ...paradas[index],
        ubicacionLat: lat.toString(),
        ubicacionLng: lng.toString(),
      };
      this.paradas.set(paradas);
    }
  }

  updateEndCoordinates(type: 'origin' | 'destination', lat: number, lng: number) {
    const paradas = [...this.paradas()];
    if (paradas.length < 2) return;
    const index = type === 'origin' ? 0 : paradas.length - 1;
    paradas[index] = {
      ...paradas[index],
      ubicacionLat: lat.toString(),
      ubicacionLng: lng.toString(),
    };
    this.paradas.set(paradas);
  }

  isExtremo(index: number): boolean {
    const list = this.paradas();
    if (list.length < 2) return false;
    return index === 0 || index === list.length - 1;
  }

  // --- MAP LOGIC ---

  syncMarkersWithParadas(paradas: any[]) {
    if (!this.map) return;
    // Clean existing intermediate markers
    Object.keys(this.markers).forEach((key) => {
      if (key.startsWith('parada-')) {
        this.markers[key].remove();
        delete this.markers[key];
      }
    });

    paradas.forEach((p, index) => {
      if (index === 0 || index === paradas.length - 1) return; // Skip Ends
      if (p.ubicacionLat && p.ubicacionLng) {
        const id = `parada-${p.id}`;
        const icon = L.icon({ ...iconDefault.options, className: 'marker-blue' });
        const m = L.marker([Number(p.ubicacionLat), Number(p.ubicacionLng)], {
          draggable: true,
          icon,
        })
          .addTo(this.map!)
          .bindTooltip(`#${index}`, {
            permanent: true,
            direction: 'top',
            className: 'bg-white px-1 font-bold text-xs rounded shadow',
          })
          .bindPopup(p.nombre)
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.updateParadaFromMap(p.id, pos.lat, pos.lng);
          });
        this.markers[id] = m;
      }
    });
    this.updateMapMarkers();
  }

  clearMarkers() {
    Object.values(this.markers).forEach((m) => m.remove());
    this.markers = {};
  }

  onCoordinateChange(source: 'input' | 'map', type?: 'origin' | 'destination') {
    if (source === 'input') {
      const val = this.rutaForm.value;
      if (type === 'origin' && val.origenLat) {
        this.updateEndCoordinates('origin', val.origenLat, val.origenLng);
      } else if (type === 'destination' && val.destinoLat) {
        this.updateEndCoordinates('destination', val.destinoLat, val.destinoLng);
      }
      this.updateMapMarkers();
    }
  }

  updateMapMarkers() {
    if (!this.map) return;
    const val = this.rutaForm.value;
    const origenLat = parseFloat(val.origenLat);
    const origenLng = parseFloat(val.origenLng);
    const destinoLat = parseFloat(val.destinoLat);
    const destinoLng = parseFloat(val.destinoLng);

    // Origen
    if (!isNaN(origenLat) && !isNaN(origenLng)) {
      if (!this.markers['origen']) {
        const icon = L.icon({ ...iconDefault.options, className: 'marker-green' });
        this.markers['origen'] = L.marker([origenLat, origenLng], {
          draggable: true,
          icon,
          zIndexOffset: 1000,
        })
          .addTo(this.map)
          .bindPopup('Origen')
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.rutaForm.patchValue(
              {
                origenLat: pos.lat.toFixed(6),
                origenLng: pos.lng.toFixed(6),
              },
              { emitEvent: false },
            );
            this.updateEndCoordinates('origin', pos.lat, pos.lng);
          });
      } else {
        this.markers['origen'].setLatLng([origenLat, origenLng]);
      }
    }

    // Destino
    if (!isNaN(destinoLat) && !isNaN(destinoLng)) {
      if (!this.markers['destino']) {
        const icon = L.icon({ ...iconDefault.options, className: 'marker-red' });
        this.markers['destino'] = L.marker([destinoLat, destinoLng], {
          draggable: true,
          icon,
          zIndexOffset: 1000,
        })
          .addTo(this.map)
          .bindPopup('Destino')
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.rutaForm.patchValue(
              {
                destinoLat: pos.lat.toFixed(6),
                destinoLng: pos.lng.toFixed(6),
              },
              { emitEvent: false },
            );
            this.updateEndCoordinates('destination', pos.lat, pos.lng);
          });
      } else {
        this.markers['destino'].setLatLng([destinoLat, destinoLng]);
      }
    }

    // Route Line (Trip Service)
    if (this.markers['origen'] && this.markers['destino']) {
      let points: [number, number][] = [];
      const start = this.markers['origen'].getLatLng();
      const end = this.markers['destino'].getLatLng();

      points.push([start.lat, start.lng]);

      // Add intermediates from paradas list
      const intermediates = this.paradas();
      if (intermediates.length > 2) {
        // slice strict intermediates
        const mids = intermediates.slice(1, -1);
        mids.forEach((p) => {
          if (p.ubicacionLat) points.push([Number(p.ubicacionLat), Number(p.ubicacionLng)]);
        });
      }

      points.push([end.lat, end.lng]);
      this.calculateRoute(points);
    }
  }

  async calculateRoute(points: [number, number][]) {
    try {
      const coordsString = points.map((p) => `${p[1]},${p[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        // Total Distance
        const dist = (route.distance / 1000).toFixed(2);
        this.rutaForm.patchValue({ distancia: dist }, { emitEvent: false });

        // Update Layer
        if (this.routeLayer) this.routeLayer.remove();
        this.routeLayer = L.geoJSON(route.geometry, {
          style: { color: '#3b82f6', weight: 5, opacity: 0.8 },
        }).addTo(this.map!);

        // Update Paradas Distances (Legs)
        // Legs correspond to segments between waypoints.
        // points: [Origin, P1, P2, Dest] -> 4 points.
        // legs: [Leg0(Orig->P1), Leg1(P1->P2), Leg2(P2->Dest)] -> 3 legs.
        // Paradas list matches these points (excluding skipped intermediate logic if any, but syncMarkersWithParadas builds points from all valid paradas).
        // actually syncMarkers logic uses ALL paradas.
        if (route.legs && route.legs.length > 0) {
          const paradas = [...this.paradas()];
          // Assuming points array was built from paradas array in order.
          // paradas[0] is Origin. No previous distance.
          // paradas[1] corresponds to end of Leg 0.
          route.legs.forEach((leg: any, index: number) => {
            const paradaIndex = index + 1;
            if (paradas[paradaIndex]) {
              paradas[paradaIndex] = {
                ...paradas[paradaIndex],
                distanciaPreviaParada: (leg.distance / 1000).toFixed(2),
              };
            }
          });
          this.paradas.set(paradas);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  updateParadaName(id: number, name: string) {
    const paradas = [...this.paradas()];
    const index = paradas.findIndex((p) => p.id === id);
    if (index !== -1) {
      paradas[index] = { ...paradas[index], nombre: name };
      this.paradas.set(paradas);
    }
  }

  submitForm() {
    if (this.rutaForm.invalid) {
      this.rutaForm.markAllAsTouched();
      return;
    }
    const val = this.rutaForm.value;
    const paradasPayload = this.paradas().map((p, index) => ({
      id: p.id && p.id > 0 ? p.id : undefined,
      nombre: p.nombre,
      orden: index, // Explicit order based on array position
      ubicacionLat: p.ubicacionLat?.toString(),
      ubicacionLng: p.ubicacionLng?.toString(),
      distanciaPreviaParada: p.distanciaPreviaParada?.toString(),
    }));

    const payload = {
      ...val,
      paradas: paradasPayload,
    };

    this.onSubmitForm.emit(payload as any);
  }
}
