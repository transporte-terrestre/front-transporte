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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
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

type TrayectoTarget = 'ida' | 'vuelta';

interface ParadaUI {
  id: number;
  nombre: string;
  ubicacionLat?: string;
  ubicacionLng?: string;
  orden: number;
  distanciaPreviaParada?: string;
  rutaId?: number;
}

interface RutaDetalle {
  origen: string;
  destino: string;
  origenLat: string;
  origenLng: string;
  destinoLat: string;
  destinoLng: string;
  distancia: string;
  costoBase: string;
  paradas?: ParadaUI[];
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
  private alertService = inject(AlertService);

  // Maps
  private map: L.Map | undefined;
  private mapVuelta: L.Map | undefined;

  // Markers
  private markers: { [key: string]: L.Marker } = {};
  private markersVuelta: { [key: string]: L.Marker } = {};

  // Layers
  private routeLayer: L.Layer | undefined;
  private routeLayerVuelta: L.Layer | undefined;

  // Inputs
  ruta = input<ApiResponse<'rutas', 'findOneCircuito'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<any>();

  // Signals
  paradas = signal<ParadaUI[]>([]);
  loadingParadas = signal(false);
  tipoTrayecto = signal<'ida' | 'vuelta' | 'ambos'>('ambos');

  // Logic for Independent Vuelta
  esVueltaIgual = signal(true);
  paradasVuelta = signal<ParadaUI[]>([]);

  showVuelta = computed(() => this.tipoTrayecto() === 'ambos' && !this.esVueltaIgual());

  private lastCoordsHash = '';
  private lastCoordsHashVuelta = '';

  rutaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    origen: ['', [Validators.required, Validators.minLength(3)]],
    destino: ['', [Validators.required, Validators.minLength(3)]],
    origenLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    costoBase: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    // VUELTA
    origenVuelta: [''],
    destinoVuelta: [''],
    origenLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distanciaVuelta: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
    costoBaseVuelta: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
  });

  constructor() {
    effect(() => {
      const rutaData = this.ruta();
      const isEditMode = this.editMode();

      if (isEditMode && rutaData) {
        // Usar rutaIda como referencia principal
        const rutaReferencia = (rutaData.rutaIda || rutaData.rutaVuelta) as unknown as RutaDetalle;
        const rutaVueltaRef = rutaData.rutaVuelta as unknown as RutaDetalle;

        // Determinar tipo de trayecto
        if (rutaData.rutaIda && rutaData.rutaVuelta) {
          this.tipoTrayecto.set('ambos');

          if ('es_igual' in rutaData) {
            this.esVueltaIgual.set((rutaData as any).es_igual);
          } else {
            this.esVueltaIgual.set(false);
          }
        } else if (rutaData.rutaIda) {
          this.tipoTrayecto.set('ida');
        } else if (rutaData.rutaVuelta) {
          this.tipoTrayecto.set('vuelta');
        }

        if (rutaReferencia) {
          this.rutaForm.patchValue({
            nombre: rutaData.nombre,
            origen: rutaReferencia.origen,
            destino: rutaReferencia.destino,
            origenLat: rutaReferencia.origenLat,
            origenLng: rutaReferencia.origenLng,
            destinoLat: rutaReferencia.destinoLat,
            destinoLng: rutaReferencia.destinoLng,
            distancia: rutaReferencia.distancia,
            costoBase: rutaReferencia.costoBase,
          });

          if (rutaReferencia.paradas) {
            const sortedParadas = [...rutaReferencia.paradas].sort((a, b) => a.orden - b.orden);
            this.paradas.set(sortedParadas as unknown as ParadaUI[]);
          }
        }

        // Cargar vuelta si existe
        if (rutaVueltaRef && rutaData.rutaIda) {
          // Solo si hay AMBAS, consideramos cargar la segunda como tal
          this.rutaForm.patchValue({
            origenVuelta: rutaVueltaRef.origen,
            destinoVuelta: rutaVueltaRef.destino,
            origenLatVuelta: rutaVueltaRef.origenLat,
            origenLngVuelta: rutaVueltaRef.origenLng,
            destinoLatVuelta: rutaVueltaRef.destinoLat,
            destinoLngVuelta: rutaVueltaRef.destinoLng,
            distanciaVuelta: rutaVueltaRef.distancia,
            costoBaseVuelta: rutaVueltaRef.costoBase,
          });

          if (rutaVueltaRef.paradas) {
            const sorted = [...rutaVueltaRef.paradas].sort((a: any, b: any) => a.orden - b.orden);
            this.paradasVuelta.set(sorted);
          }

          // Si cargamos ambas, asumimos que son vuelta separada por ahora si el usuario está en modo AMBOS?
          // O verificamos si son espejo? Por simplicidad, si hay datos explícitos de vuelta, podríamos activar el switch OFF (separada).
          // Pero dejemos en true (igual) por defecto y que toggleen ellos, salvo que detectemos gran diferencia.
          // Mejor: DEJAR EN TRUE por defecto.
        }

        setTimeout(() => this.updateMapMarkers('ida'), 500);
      } else {
        this.rutaForm.reset();
        this.clearMarkers('ida');
        this.clearMarkers('vuelta');
        this.paradas.set([]);
        this.paradasVuelta.set([]);
        this.esVueltaIgual.set(true);
      }
    });

    // Watch paradas IDA changes
    effect(() => {
      const currentParadas = this.paradas();
      const hash = JSON.stringify(
        currentParadas.map((p) => ({ lat: p.ubicacionLat, lng: p.ubicacionLng, orden: p.orden })),
      );

      if (hash !== this.lastCoordsHash) {
        this.lastCoordsHash = hash;
        if (this.map) this.syncMarkersWithParadas(currentParadas, 'ida');
      }
    });

    // Watch paradas VUELTA changes
    effect(() => {
      // Activar mapa vuelta si es necesario
      if (this.showVuelta()) {
        setTimeout(() => this.initMap('vuelta'), 100);
      } else {
        if (this.mapVuelta) {
          this.mapVuelta.remove();
          this.mapVuelta = undefined;
        }
      }

      const current = this.paradasVuelta();
      const hash = JSON.stringify(
        current.map((p) => ({ lat: p.ubicacionLat, lng: p.ubicacionLng, orden: p.orden })),
      );

      if (hash !== this.lastCoordsHashVuelta) {
        this.lastCoordsHashVuelta = hash;
        if (this.mapVuelta) this.syncMarkersWithParadas(current, 'vuelta');
      }
    });
  }

  ngOnInit() {
    // Listeners Ida
    ['origenLat', 'origenLng'].forEach((field) =>
      this.rutaForm
        .get(field)
        ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'origin', 'ida')),
    );
    ['destinoLat', 'destinoLng'].forEach((field) =>
      this.rutaForm
        .get(field)
        ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'destination', 'ida')),
    );

    // Listeners Vuelta
    ['origenLatVuelta', 'origenLngVuelta'].forEach((field) =>
      this.rutaForm
        .get(field)
        ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'origin', 'vuelta')),
    );
    ['destinoLatVuelta', 'destinoLngVuelta'].forEach((field) =>
      this.rutaForm
        .get(field)
        ?.valueChanges.subscribe(() => this.onCoordinateChange('input', 'destination', 'vuelta')),
    );
  }

  ngAfterViewInit() {
    this.initMap('ida');
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
    if (this.mapVuelta) this.mapVuelta.remove();
  }

  initMap(target: TrayectoTarget = 'ida') {
    const mapId = target === 'ida' ? 'map' : 'map-vuelta';
    const isVuelta = target === 'vuelta';

    // Check if element exists (it might be hidden by ngIf)
    if (!document.getElementById(mapId)) return;

    // Check if map instance exists
    if (isVuelta && this.mapVuelta) return;
    if (!isVuelta && this.map) return;

    const m = L.map(mapId).setView([-12.1568, -76.9812], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(m);

    if (isVuelta) this.mapVuelta = m;
    else this.map = m;

    this.updateMapMarkers(target);

    // Set defaults if new for IDA only
    if (!isVuelta) {
      const current = this.rutaForm.value;
      if (!current.origenLat && !current.destinoLat && !this.editMode()) {
        this.rutaForm.patchValue({
          nombre: 'Villa el Salvador - Surco',
          origen: 'Villa el Salvador',
          destino: 'Surco',
          costoBase: '0.00',
          origenLat: -12.2125,
          origenLng: -76.9416,
          destinoLat: -12.1464,
          destinoLng: -76.9912,
        });

        this.paradas.set([
          {
            id: -1,
            nombre: 'Villa el Salvador',
            orden: 0,
            ubicacionLat: '-12.2125',
            ubicacionLng: '-76.9416',
          },
          { id: -2, nombre: 'Surco', orden: 1, ubicacionLat: '-12.1464', ubicacionLng: '-76.9912' },
        ] as any);
      }
    }
  }

  toggleVueltaSeparada() {
    const nuevo = !this.esVueltaIgual();
    this.esVueltaIgual.set(nuevo);

    // Si se separa y está vacía la vuelta, clonar inversa
    if (!nuevo && this.paradasVuelta().length === 0 && this.paradas().length > 0) {
      const val = this.rutaForm.value;
      this.rutaForm.patchValue({
        origenVuelta: val.destino,
        destinoVuelta: val.origen,
        origenLatVuelta: val.destinoLat,
        origenLngVuelta: val.destinoLng,
        destinoLatVuelta: val.origenLat,
        destinoLngVuelta: val.origenLng,
        costoBaseVuelta: val.costoBase,
      });

      const inversa = [...this.paradas()].reverse().map((p, i) => ({
        ...p,
        id: -Date.now() - Math.floor(Math.random() * 10000) - i,
        orden: i,
        nombre: p.nombre, // Mantiene nombre origen->destino invertido? Si.
      }));
      this.paradasVuelta.set(inversa);
    }

    setTimeout(() => {
      if (!nuevo) this.initMap('vuelta');
    }, 200);
  }

  // --- PARADAS LOGIC ---

  async addDefaultParada(orden?: number, target: TrayectoTarget = 'ida') {
    const ruta = this.ruta();
    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const currentParadas = paradasSignal();

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
    } else {
      // Fallback logic
      const val = this.rutaForm.value;
      const suffix = target === 'ida' ? '' : 'Vuelta';
      const oLat = val[`origenLat${suffix}`];
      const dLat = val[`destinoLat${suffix}`];
      const oLng = val[`origenLng${suffix}`];
      const dLng = val[`destinoLng${suffix}`];

      if (oLat && dLat) {
        lat = (Number(oLat) + Number(dLat)) / 2;
        lng = (Number(oLng) + Number(dLng)) / 2;
      }
    }

    const newParada: ParadaUI = {
      id: -Date.now() - Math.floor(Math.random() * 10000),
      nombre: `Parada X`,
      ubicacionLat: lat.toString(),
      ubicacionLng: lng.toString(),
      orden: targetIndex,
      rutaId: ruta?.id || 0,
    };

    const newParadas = [...currentParadas];
    newParadas.splice(targetIndex, 0, newParada);
    newParadas.forEach((p, index) => (p.orden = index));
    this.renumberDefaultParadas(newParadas);
    paradasSignal.set(newParadas);
  }

  renumberDefaultParadas(paradas: ParadaUI[]) {
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

  async moveParada(index: number, direction: 'up' | 'down', target: TrayectoTarget = 'ida') {
    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const paradas = [...paradasSignal()];
    const neighborIndex = direction === 'up' ? index - 1 : index + 1;
    if (neighborIndex <= 0 || neighborIndex >= paradas.length - 1) return;

    [paradas[index], paradas[neighborIndex]] = [paradas[neighborIndex], paradas[index]];
    paradas.forEach((p, i) => (p.orden = i));
    this.renumberDefaultParadas(paradas);
    paradasSignal.set(paradas);
  }

  deleteParada(paradaId: number, target: TrayectoTarget = 'ida') {
    this.alertService.delete(
      'Eliminar Parada',
      '¿Estás seguro de eliminar esta parada de la ruta?',
      () => {
        const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
        const paradas = paradasSignal().filter((p) => p.id !== paradaId);
        paradas.forEach((p, i) => (p.orden = i));
        this.renumberDefaultParadas(paradas);
        paradasSignal.set(paradas);
      },
    );
  }

  updateParadaName(id: number, name: string, target: TrayectoTarget = 'ida') {
    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const paradas = [...paradasSignal()];
    const index = paradas.findIndex((p) => p.id === id);
    if (index !== -1) {
      paradas[index] = { ...paradas[index], nombre: name };
      paradasSignal.set(paradas);
    }
  }

  updateParadaFromMap(id: number, lat: number, lng: number, target: TrayectoTarget = 'ida') {
    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const paradas = [...paradasSignal()];
    const index = paradas.findIndex((p) => p.id === id);
    if (index !== -1) {
      paradas[index] = {
        ...paradas[index],
        ubicacionLat: lat.toString(),
        ubicacionLng: lng.toString(),
      };
      paradasSignal.set(paradas);
    }
  }

  updateParadaCoords(id: number, latStr: string, lngStr: string, target: TrayectoTarget = 'ida') {
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    if (isNaN(lat) || isNaN(lng)) return;

    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const paradas = [...paradasSignal()];
    const index = paradas.findIndex((p) => p.id === id);
    if (index === -1) return;

    paradas[index] = {
      ...paradas[index],
      ubicacionLat: lat.toString(),
      ubicacionLng: lng.toString(),
    };
    paradasSignal.set(paradas);

    if (index === 0) {
      this.updateFormCoordinates(target, 'origin', lat, lng);
    } else if (index === paradas.length - 1) {
      this.updateFormCoordinates(target, 'destination', lat, lng);
    }
  }

  updateFormCoordinates(
    target: TrayectoTarget,
    type: 'origin' | 'destination',
    lat: number,
    lng: number,
  ) {
    const suffix = target === 'ida' ? '' : 'Vuelta';
    const prefix = type === 'origin' ? 'origen' : 'destino';
    this.rutaForm.patchValue(
      {
        [`${prefix}Lat${suffix}`]: lat.toFixed(6),
        [`${prefix}Lng${suffix}`]: lng.toFixed(6),
      },
      { emitEvent: false },
    );
  }

  updateEndCoordinates(
    type: 'origin' | 'destination',
    lat: number,
    lng: number,
    target: TrayectoTarget = 'ida',
  ) {
    const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
    const paradas = [...paradasSignal()];
    if (paradas.length < 2) return;
    const index = type === 'origin' ? 0 : paradas.length - 1;
    paradas[index] = {
      ...paradas[index],
      ubicacionLat: lat.toString(),
      ubicacionLng: lng.toString(),
    };
    paradasSignal.set(paradas);
  }

  isExtremo(index: number, target: TrayectoTarget = 'ida'): boolean {
    const list = target === 'ida' ? this.paradas() : this.paradasVuelta();
    if (list.length < 2) return false;
    return index === 0 || index === list.length - 1;
  }

  // --- MAP LOGIC ---

  syncMarkersWithParadas(paradas: any[], target: TrayectoTarget = 'ida') {
    const map = target === 'ida' ? this.map : this.mapVuelta;
    const markersDict = target === 'ida' ? this.markers : this.markersVuelta;

    if (!map) return;

    // Clean existing intermediate markers
    Object.keys(markersDict).forEach((key) => {
      if (key.startsWith('parada-')) {
        markersDict[key].remove();
        delete markersDict[key];
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
          .addTo(map)
          .bindTooltip(`#${index}`, {
            permanent: true,
            direction: 'top',
            className: 'bg-background px-1 font-bold text-xs rounded shadow',
          })
          .bindPopup(p.nombre)
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.updateParadaFromMap(p.id, pos.lat, pos.lng, target);
          });
        markersDict[id] = m;
      }
    });
    this.updateMapMarkers(target);
  }

  clearMarkers(target: TrayectoTarget) {
    const markersDict = target === 'ida' ? this.markers : this.markersVuelta;
    Object.values(markersDict).forEach((m) => m.remove());
    if (target === 'ida') this.markers = {};
    else this.markersVuelta = {};
  }

  onCoordinateChange(
    source: 'input' | 'map',
    type: 'origin' | 'destination',
    target: TrayectoTarget = 'ida',
  ) {
    if (source === 'input') {
      const val = this.rutaForm.value;
      const suffix = target === 'ida' ? '' : 'Vuelta';
      const latName = type === 'origin' ? `origenLat${suffix}` : `destinoLat${suffix}`;
      const lngName = type === 'origin' ? `origenLng${suffix}` : `destinoLng${suffix}`;

      const lat = val[latName];
      const lng = val[lngName];

      if (lat && lng) {
        this.updateEndCoordinates(type, lat, lng, target);
      }
      this.updateMapMarkers(target);
    }
  }

  updateMapMarkers(target: TrayectoTarget = 'ida') {
    const map = target === 'ida' ? this.map : this.mapVuelta;
    if (!map) return;

    const markersDict = target === 'ida' ? this.markers : this.markersVuelta;
    const val = this.rutaForm.value;
    const suffix = target === 'ida' ? '' : 'Vuelta';

    const origenLat = parseFloat(val[`origenLat${suffix}`]);
    const origenLng = parseFloat(val[`origenLng${suffix}`]);
    const destinoLat = parseFloat(val[`destinoLat${suffix}`]);
    const destinoLng = parseFloat(val[`destinoLng${suffix}`]);

    // Origen
    if (!isNaN(origenLat) && !isNaN(origenLng)) {
      if (!markersDict['origen']) {
        const icon = L.icon({ ...iconDefault.options, className: 'marker-green' });
        markersDict['origen'] = L.marker([origenLat, origenLng], {
          draggable: true,
          icon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup('Origen')
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.updateFormCoordinates(target, 'origin', pos.lat, pos.lng);
            this.updateEndCoordinates('origin', pos.lat, pos.lng, target);
          });
      } else {
        markersDict['origen'].setLatLng([origenLat, origenLng]);
      }
    }

    // Destino
    if (!isNaN(destinoLat) && !isNaN(destinoLng)) {
      if (!markersDict['destino']) {
        const icon = L.icon({ ...iconDefault.options, className: 'marker-red' });
        markersDict['destino'] = L.marker([destinoLat, destinoLng], {
          draggable: true,
          icon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup('Destino')
          .on('dragend', (e) => {
            const pos = e.target.getLatLng();
            this.updateFormCoordinates(target, 'destination', pos.lat, pos.lng);
            this.updateEndCoordinates('destination', pos.lat, pos.lng, target);
          });
      } else {
        markersDict['destino'].setLatLng([destinoLat, destinoLng]);
      }
    }

    // Route Line
    if (markersDict['origen'] && markersDict['destino']) {
      let points: [number, number][] = [];
      const start = markersDict['origen'].getLatLng();
      const end = markersDict['destino'].getLatLng();

      points.push([start.lat, start.lng]);

      const intermediates = target === 'ida' ? this.paradas() : this.paradasVuelta();
      if (intermediates.length > 2) {
        const mids = intermediates.slice(1, -1);
        mids.forEach((p) => {
          if (p.ubicacionLat) points.push([Number(p.ubicacionLat), Number(p.ubicacionLng)]);
        });
      }

      points.push([end.lat, end.lng]);
      this.calculateRoute(points, target);
    }
  }

  async calculateRoute(points: [number, number][], target: TrayectoTarget) {
    try {
      const coordsString = points.map((p) => `${p[1]},${p[0]}`).join(';');
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const dist = (route.distance / 1000).toFixed(2);

        if (target === 'ida') {
          this.rutaForm.patchValue({ distancia: dist }, { emitEvent: false });
          if (this.routeLayer) this.routeLayer.remove();
          this.routeLayer = L.geoJSON(route.geometry, {
            style: { color: '#3b82f6', weight: 5, opacity: 0.8 },
          }).addTo(this.map!);
        } else {
          this.rutaForm.patchValue({ distanciaVuelta: dist }, { emitEvent: false });
          if (this.routeLayerVuelta) this.routeLayerVuelta.remove();
          this.routeLayerVuelta = L.geoJSON(route.geometry, {
            style: { color: '#ef4444', weight: 5, opacity: 0.8 },
          }).addTo(this.mapVuelta!);
        }

        if (route.legs && route.legs.length > 0) {
          const paradasSignal = target === 'ida' ? this.paradas : this.paradasVuelta;
          const paradas = [...paradasSignal()];
          route.legs.forEach((leg: any, index: number) => {
            const paradaIndex = index + 1;
            if (paradas[paradaIndex]) {
              paradas[paradaIndex] = {
                ...paradas[paradaIndex],
                distanciaPreviaParada: (leg.distance / 1000).toFixed(2),
              };
            }
          });
          paradasSignal.set(paradas);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  submitForm() {
    if (this.rutaForm.invalid) {
      this.rutaForm.markAllAsTouched();
      return;
    }

    const val = this.rutaForm.value;
    const tipo = this.tipoTrayecto();

    const mapParadas = (pList: ParadaUI[]) =>
      pList.map((p, index) => ({
        nombre: p.nombre,
        orden: index,
        ubicacionLat: p.ubicacionLat?.toString(),
        ubicacionLng: p.ubicacionLng?.toString(),
        distanciaPreviaParada: p.distanciaPreviaParada?.toString(),
      }));

    // Detalle Base IDA
    const detalleIda = {
      origen: val.origen,
      destino: val.destino,
      origenLat: val.origenLat?.toString(),
      origenLng: val.origenLng?.toString(),
      destinoLat: val.destinoLat?.toString(),
      destinoLng: val.destinoLng?.toString(),
      distancia: val.distancia?.toString(),
      costoBase: val.costoBase?.toString(),
      paradas: mapParadas(this.paradas()),
    };

    const payload: any = {
      nombre: val.nombre,
    };

    if (tipo === 'ambos' || tipo === 'ida') {
      payload.ida = detalleIda;
    }

    if (tipo === 'ambos' || tipo === 'vuelta') {
      if (tipo !== 'vuelta' && this.esVueltaIgual()) {
        // Invertir automáticamente para 'ambos' espejo
        payload.vuelta = {
          origen: val.destino,
          destino: val.origen,
          origenLat: val.destinoLat?.toString(),
          origenLng: val.destinoLng?.toString(),
          destinoLat: val.origenLat?.toString(),
          destinoLng: val.origenLng?.toString(),
          distancia: val.distancia?.toString(),
          costoBase: val.costoBase?.toString(),
          paradas: mapParadas([...this.paradas()].reverse()),
        };
      } else {
        // Vuelta independiente O solo vuelta
        // Si solo vuelta, usamos los datos del formulario principal como vuelta?
        // No, el form principal se usó para Ida. Si es solo vuelta, quizás debió ser detalleIda asignado a vuelta.
        // Pero mantengamos simple: Si es vuelta independiente, usamos los datos de vuelta.
        if (tipo === 'vuelta') {
          // Caso raro UI: Solo vuelta. Usamos detalleIda como vuelta
          payload.vuelta = detalleIda;
        } else {
          // Ambos independiente
          payload.vuelta = {
            origen: val.origenVuelta,
            destino: val.destinoVuelta,
            origenLat: val.origenLatVuelta?.toString(),
            origenLng: val.origenLngVuelta?.toString(),
            destinoLat: val.destinoLatVuelta?.toString(),
            destinoLng: val.destinoLngVuelta?.toString(),
            distancia: val.distanciaVuelta?.toString(),
            costoBase: val.costoBaseVuelta?.toString(),
            paradas: mapParadas(this.paradasVuelta()),
          };
        }
      }
    }

    this.onSubmitForm.emit(payload);
  }
}
