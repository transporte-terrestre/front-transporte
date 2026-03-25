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
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { RutaService } from '@service/admin/ruta.service';
import { ToastService } from '@service/toast.service';
import * as L from 'leaflet';

import { RutaFormOptions } from './layout/ruta-form-options/ruta-form-options';
import { RutaFormMap } from './layout/ruta-form-map/ruta-form-map';
import { RutaFormSections } from './layout/ruta-form-sections/ruta-form-sections';

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
type DetalleInput = Required<CreateBody>['ida'] & { paradas?: any[] };
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
  paradas: any[];
  paradasVuelta: any[];
}

@Component({
  selector: 'app-ruta-form',
  imports: [CommonModule, ReactiveFormsModule, RutaFormOptions, RutaFormMap, RutaFormSections],
  templateUrl: './ruta-form.html',
  styleUrl: './ruta-form.css',
})
export class RutaForm implements OnInit, AfterViewInit, OnDestroy {
  private fb = inject(FormBuilder);
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Maps & Markers
  private maps: Record<MapType, L.Map | undefined> = { ida: undefined, vuelta: undefined };
  public legDistances: Record<MapType, number[]> = { ida: [], vuelta: [] };
  private markers: Record<MapType, { origin?: L.Marker; dest?: L.Marker; paradas: L.Marker[] }> = {
    ida: { paradas: [] },
    vuelta: { paradas: [] },
  };
  private routeLayers: Record<MapType, L.Layer | undefined> = { ida: undefined, vuelta: undefined };

  // Inputs/Outputs
  ruta = input<RutaResult | null>(null);
  editMode = input<boolean>(false);
  onSubmitForm = output<void>();

  // State
  esVueltaIgual = signal(true);
  tipoTrayecto = signal<'ida' | 'vuelta' | 'ambos'>('ida');
  showVuelta = computed(() => this.tipoTrayecto() === 'ambos' && !this.esVueltaIgual());

  hasDestinoIda = signal(true);
  hasDestinoVuelta = signal(true);

  private lastCoordsHash: Record<MapType, string> = { ida: '', vuelta: '' };
  private initialDrawDone: Record<MapType, boolean> = { ida: false, vuelta: false };
  private isLoadingRuta = false;

  rutaForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    origen: ['', [Validators.required]],
    destino: [''],
    origenLat: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLng: ['', [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLat: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLng: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distancia: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
    tiempoEstimado: [0, [Validators.required, Validators.min(1)]],
    tiempoEstimadoDestino: [0, [Validators.min(0)]],
    paradas: this.fb.array<any>([]),
    // VUELTA
    origenVuelta: [''],
    destinoVuelta: [''],
    origenLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    origenLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLatVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    destinoLngVuelta: ['', [Validators.pattern(/^-?\d+(\.\d+)?$/)]],
    distanciaVuelta: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
    tiempoEstimadoVuelta: [0],
    tiempoEstimadoDestinoVuelta: [0],
    paradasVuelta: this.fb.array<any>([]),
  });

  get paradasIdaFA() {
    return this.rutaForm.get('paradas') as FormArray;
  }

  get paradasVueltaFA() {
    return this.rutaForm.get('paradasVuelta') as FormArray;
  }

  getLegTimeControl(type: 'ida' | 'vuelta', index: number): FormControl {
    const fa = type === 'ida' ? this.paradasIdaFA : this.paradasVueltaFA;
    if (index < fa.controls.length) {
      return fa.at(index).get('tiempoEstimado') as FormControl;
    }
    const destField = type === 'ida' ? 'tiempoEstimadoDestino' : 'tiempoEstimadoDestinoVuelta';
    return this.rutaForm.get(destField) as FormControl;
  }

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

    // Toggle Vuelta Map & Enforce Destinations on Round trips
    effect(() => {
      const type = this.tipoTrayecto();
      const showVuelta = this.showVuelta();

      if (type === 'ambos') {
        // Enforce fixed destinations if it's a closed circuit (Ida y Vuelta)
        if (!this.hasDestinoIda()) this.hasDestinoIda.set(true);
        if (!this.hasDestinoVuelta()) this.hasDestinoVuelta.set(true);
      }

      if (showVuelta) {
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
      if (!this.isLoadingRuta) {
        this.checkCoordsChange('ida');
        this.calcTotalTime('ida');
        if (this.showVuelta()) {
          this.checkCoordsChange('vuelta');
          this.calcTotalTime('vuelta');
        }
      }
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

    if (!origen) return;
    const destinoText = destino ? destino : 'Ruta Abierta';

    let newName = `${origen} - ${destinoText}`;

    if (type === 'ambos') {
      if (esIgual) {
        // Round trip pattern: A - B - A
        newName = `${origen} - ${destino} - ${origen}`;
      } else {
        const origenVuelta = val.origenVuelta || '';
        const destinoVuelta = val.destinoVuelta || '';

        if (origenVuelta) {
          const destinoVueltaText = destinoVuelta ? destinoVuelta : 'Ruta Abierta';
          // Check for triangulation (Chain: A -> B -> C)
          if (destino && origenVuelta.toLowerCase().trim() === destino.toLowerCase().trim()) {
            newName = `${origen} - ${destinoText} - ${destinoVueltaText}`;
          } else {
            // Completely independent segments
            newName = `${origen} - ${destinoText} / ${origenVuelta} - ${destinoVueltaText}`;
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

  addParada(type: MapType, index?: number) {
    const arr = type === 'ida' ? this.paradasIdaFA : this.paradasVueltaFA;
    const map = this.maps[type];
    const val = this.rutaForm.getRawValue();

    let lat = -12.0464;
    let lng = -77.0428;

    const center = map?.getCenter() || L.latLng(lat, lng);
    lat = center.lat;
    lng = center.lng;

    const insertIdx = index !== undefined ? index : arr.length;

    // Helper functions
    const getOrigen = () => {
      const oLat = type === 'ida' ? val.origenLat : val.origenLatVuelta;
      const oLng = type === 'ida' ? val.origenLng : val.origenLngVuelta;
      return oLat && oLng ? L.latLng(Number(oLat), Number(oLng)) : null;
    };

    const getDestino = () => {
      const dLat = type === 'ida' ? val.destinoLat : val.destinoLatVuelta;
      const dLng = type === 'ida' ? val.destinoLng : val.destinoLngVuelta;
      return dLat && dLng ? L.latLng(Number(dLat), Number(dLng)) : null;
    };

    const getParada = (i: number) => {
      const p = arr.at(i)?.value;
      return p && p.ubicacionLat && p.ubicacionLng
        ? L.latLng(Number(p.ubicacionLat), Number(p.ubicacionLng))
        : null;
    };

    let prevPt: L.LatLng | null = null;
    let nextPt: L.LatLng | null = null;

    try {
      if (insertIdx === 0) {
        prevPt = getOrigen();
      } else {
        prevPt = getParada(insertIdx - 1);
      }

      if (insertIdx === arr.length) {
        nextPt = getDestino();
      } else {
        nextPt = getParada(insertIdx);
      }

      if (prevPt && nextPt) {
        lat = (prevPt.lat + nextPt.lat) / 2;
        lng = (prevPt.lng + nextPt.lng) / 2;
      } else if (prevPt) {
        lat = prevPt.lat - 0.005; // slight offset
        lng = prevPt.lng;
      } else if (nextPt) {
        lat = nextPt.lat + 0.005;
        lng = nextPt.lng;
      }
    } catch (e) {
      console.error('Error calculating mid-point:', e);
    }

    const newGroup = this.fb.group({
      nombre: [`Parada ${insertIdx + 1}`, Validators.required],
      ubicacionLat: [lat.toFixed(6), Validators.required],
      ubicacionLng: [lng.toFixed(6), Validators.required],
      tiempoEstimado: [0, [Validators.required, Validators.min(0)]],
    });

    if (index !== undefined) {
      arr.insert(index, newGroup);
    } else {
      arr.push(newGroup);
    }
    this.autoRenameParadas(arr);
  }

  removeParada(type: MapType, index: number) {
    const arr = type === 'ida' ? this.paradasIdaFA : this.paradasVueltaFA;
    arr.removeAt(index);
    this.autoRenameParadas(arr);
  }

  // Cache for destination data when toggling open route
  private destinoCache: Record<string, { name: string; lat: string; lng: string; time: number }> = {};

  removeDestino(type: MapType) {
    const suffix = type === 'ida' ? '' : 'Vuelta';
    const dNameField = `destino${suffix}` as keyof RutaFormValue;
    const dLatField = `destinoLat${suffix}` as keyof RutaFormValue;
    const dLngField = `destinoLng${suffix}` as keyof RutaFormValue;
    const dTimeField = `tiempoEstimadoDestino${suffix}` as keyof RutaFormValue;

    // Save current values before clearing
    const v = this.rutaForm.getRawValue();
    this.destinoCache[type] = {
      name: String(v[dNameField] || ''),
      lat: String(v[dLatField] || ''),
      lng: String(v[dLngField] || ''),
      time: Number(v[dTimeField] || 0),
    };

    this.rutaForm.patchValue({
      [dNameField]: '',
      [dLatField]: '',
      [dLngField]: '',
      [dTimeField]: 0,
    });
  }

  private restoreDestino(type: MapType) {
    const cached = this.destinoCache[type];
    if (!cached || (!cached.name && !cached.lat)) return;

    const suffix = type === 'ida' ? '' : 'Vuelta';
    const dNameField = `destino${suffix}` as keyof RutaFormValue;
    const dLatField = `destinoLat${suffix}` as keyof RutaFormValue;
    const dLngField = `destinoLng${suffix}` as keyof RutaFormValue;
    const dTimeField = `tiempoEstimadoDestino${suffix}` as keyof RutaFormValue;

    this.rutaForm.patchValue({
      [dNameField]: cached.name,
      [dLatField]: cached.lat,
      [dLngField]: cached.lng,
      [dTimeField]: cached.time,
    });
  }

  toggleDestino(type: MapType, value: boolean) {
    if (this.tipoTrayecto() === 'ambos') return; // Enforced

    if (type === 'ida') {
      this.hasDestinoIda.set(value);
    } else {
      this.hasDestinoVuelta.set(value);
    }
    if (!value) {
      this.removeDestino(type);
    } else {
      this.restoreDestino(type);
    }
    // Force immediate re-render so child @if blocks update
    this.cdr.detectChanges();
    // Manual update removed because patchValue triggers valueChanges -> checkCoordsChange
  }

  private autoRenameParadas(arr: FormArray) {
    arr.controls.forEach((ctrl, idx) => {
      const name = ctrl.get('nombre')?.value;
      if (!name || /^Parada \d+$/.test(name.trim())) {
        ctrl.get('nombre')?.patchValue(`Parada ${idx + 1}`);
      }
    });
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
        tiempoEstimadoDestinoVuelta: Number(v.tiempoEstimadoDestino) || 0,
      });

      // Map update will be triggered by valueChanges once the map is initialized
    }
  }

  private async loadRutaData(data: RutaResult) {
    this.isLoadingRuta = true;
    this.initialDrawDone = { ida: false, vuelta: false };
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

    // Clear initial paradas
    this.paradasIdaFA.clear();
    this.paradasVueltaFA.clear();

    // Load Main Reference (Ida or Vuelta if Ida missing)
    const ref = data.rutaIda || data.rutaVuelta;
    if (ref) {
      this.hasDestinoIda.set(!!ref.destino);

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

      if ((ref as any).paradas) {
        const sorted = [...(ref as any).paradas].sort((a: any, b: any) => a.orden - b.orden);
        let interNodes = sorted;

        // DB route always includes the origin and destination bounds; strip them from visual stops.
        if (sorted.length >= 2) {
          this.rutaForm.patchValue({
            tiempoEstimadoDestino: Number(sorted[sorted.length - 1].tiempoEstimado) || 0,
          });
          interNodes = sorted.slice(1, sorted.length - 1);
        }

        interNodes.forEach((p: any) => {
          this.paradasIdaFA.push(
            this.fb.group({
              nombre: [p.nombre, Validators.required],
              ubicacionLat: [p.ubicacionLat, Validators.required],
              ubicacionLng: [p.ubicacionLng, Validators.required],
              tiempoEstimado: [
                Number(p.tiempoEstimado) || 0,
                [Validators.required, Validators.min(0)],
              ],
            }),
          );
        });
      }
    }

    // Load Vuelta Specifics if independent
    if (isAmbos && !data.esIgual && data.rutaVuelta) {
      const v = data.rutaVuelta;
      this.hasDestinoVuelta.set(!!v.destino);

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

      if ((v as any).paradas) {
        const sorted = [...(v as any).paradas].sort((a: any, b: any) => a.orden - b.orden);
        let interNodes = sorted;

        // Strip out origin and destination from visual stops
        if (sorted.length >= 2) {
          this.rutaForm.patchValue({
            tiempoEstimadoDestinoVuelta: Number(sorted[sorted.length - 1].tiempoEstimado) || 0,
          });
          interNodes = sorted.slice(1, sorted.length - 1);
        }

        interNodes.forEach((p: any) => {
          this.paradasVueltaFA.push(
            this.fb.group({
              nombre: [p.nombre, Validators.required],
              ubicacionLat: [p.ubicacionLat, Validators.required],
              ubicacionLng: [p.ubicacionLng, Validators.required],
              tiempoEstimado: [
                Number(p.tiempoEstimado) || 0,
                [Validators.required, Validators.min(0)],
              ],
            }),
          );
        });
      }
    }

    // Esperamos un momento asíncrono corto para que Angular dibuje los inputs
    await new Promise((resolve) => setTimeout(resolve, 50));

    await this.updateMapMarkers('ida');
    if (this.showVuelta()) {
      await this.updateMapMarkers('vuelta');
    }

    // Sincronizar el hash de coordenadas para que checkCoordsChange
    // no detecte un cambio espurio al reactivar valueChanges
    this.syncCoordsHash('ida');
    if (this.showVuelta()) {
      this.syncCoordsHash('vuelta');
    }

    // Hasta que no hemos mapeado todo completamente (y recuperado los polygonos),
    // no reactivamos el listener de cambios
    this.isLoadingRuta = false;
  }

  /** Sincroniza lastCoordsHash sin disparar updateMapMarkers */
  private syncCoordsHash(type: MapType) {
    const v = this.rutaForm.getRawValue();
    const suffix = type === 'ida' ? '' : 'Vuelta';
    const paradasList = type === 'ida' ? v.paradas : v.paradasVuelta;
    const paradasCoords =
      paradasList?.map((p: any) => ({ lat: p.ubicacionLat, lng: p.ubicacionLng })) || [];

    const hasDestVal = type === 'ida' ? this.hasDestinoIda() : this.hasDestinoVuelta();
    this.lastCoordsHash[type] = JSON.stringify({
      ol: v[`origenLat${suffix}` as keyof RutaFormValue],
      olg: v[`origenLng${suffix}` as keyof RutaFormValue],
      dl: v[`destinoLat${suffix}` as keyof RutaFormValue],
      dlg: v[`destinoLng${suffix}` as keyof RutaFormValue],
      paradas: paradasCoords,
      hd: hasDestVal,
    });
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

    this.paradasIdaFA.clear();
    this.paradasVueltaFA.clear();
    this.clearMarkers('ida');
    this.clearMarkers('vuelta');
    this.esVueltaIgual.set(true);
    this.tipoTrayecto.set('ida');
    this.hasDestinoIda.set(true);
    this.hasDestinoVuelta.set(true);

    // Map update will be handled by valueChanges
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

    // Initial check (skip si estamos cargando datos, loadRutaData lo hará después)
    if (!this.isLoadingRuta) {
      this.updateMapMarkers(type);
    }

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
      // Update will be handled by checkCoordsChange via valueChanges
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

    const paradasList = type === 'ida' ? v.paradas : v.paradasVuelta;
    const paradasCoords =
      paradasList?.map((p: any) => ({ lat: p.ubicacionLat, lng: p.ubicacionLng })) || [];

    const hasDestVal = type === 'ida' ? this.hasDestinoIda() : this.hasDestinoVuelta();
    const hash = JSON.stringify({
      ol: v[`origenLat${suffix}` as keyof RutaFormValue],
      olg: v[`origenLng${suffix}` as keyof RutaFormValue],
      dl: v[`destinoLat${suffix}` as keyof RutaFormValue],
      dlg: v[`destinoLng${suffix}` as keyof RutaFormValue],
      paradas: paradasCoords,
      hd: hasDestVal,
    });

    if (hash !== this.lastCoordsHash[type]) {
      this.lastCoordsHash[type] = hash;
      if (this.maps[type]) this.updateMapMarkers(type);
    }
  }

  private calcTotalTime(type: MapType) {
    const isVuelta = type === 'vuelta';
    const s = isVuelta ? 'Vuelta' : '';
    const val = this.rutaForm.getRawValue();

    const paradas = isVuelta ? val.paradasVuelta : val.paradas;
    let total = 0;

    if (paradas) {
      paradas.forEach((p: any) => {
        total += Number(p.tiempoEstimado) || 0;
      });
    }

    total += Number(val[('tiempoEstimadoDestino' + s) as keyof RutaFormValue]) || 0;

    const targetField = `tiempoEstimado${s}`;

    if (val[targetField as keyof RutaFormValue] !== total) {
      this.rutaForm.patchValue({ [targetField]: total }, { emitEvent: false });
    }
  }

  private async getRoadRoute(
    points: L.LatLng[],
  ): Promise<{ points: L.LatLng[]; distance: number; legs: number[]; legsTime: number[] }> {
    try {
      const coordsString = points.map((p) => `${p.lng},${p.lat}`).join(';');
      const resp = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`,
      );
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates as [number, number][];
        const distance = data.routes[0].distance / 1000; // units are meters, convert to km
        const legs = data.routes[0].legs
          ? data.routes[0].legs.map((leg: any) => parseFloat((leg.distance / 1000).toFixed(2)))
          : [];
        const legsTime = data.routes[0].legs
          ? data.routes[0].legs.map((leg: any) => Math.round(leg.duration / 60)) // in minutes
          : [];

        return {
          points: coords.map((c: [number, number]) => L.latLng(c[1], c[0])),
          distance: parseFloat(distance.toFixed(2)),
          legs,
          legsTime,
        };
      }
    } catch (e) {
      console.error('Error fetching route:', e);
    }
    return { points, distance: 0, legs: [], legsTime: [] }; // Fallback to straight line
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

    const pFA = type === 'ida' ? this.paradasIdaFA : this.paradasVueltaFA;
    const paradasPts: L.LatLng[] = [];
    pFA.controls.forEach((c: any, index: number) => {
      const pVal = c.value;
      const pLat = parseFloat(pVal.ubicacionLat);
      const pLng = parseFloat(pVal.ubicacionLng);
      if (!isNaN(pLat) && !isNaN(pLng)) {
        const pt = L.latLng(pLat, pLng);
        paradasPts.push(pt);
        this.addParadaMarker(type, index, pLat, pLng, pVal.nombre);
      }
    });

    const allPoints: L.LatLng[] = [];
    if (originPt) allPoints.push(originPt);
    allPoints.push(...paradasPts);
    if (destPt) allPoints.push(destPt);

    if (allPoints.length >= 2) {
      const routeData = await this.getRoadRoute(allPoints);
      this.legDistances[type] = routeData.legs || [];

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

      // Auto update time for each leg if calculated
      if (!this.editMode() || this.initialDrawDone[type]) {
        const times = routeData.legsTime || [];
        if (times.length > 0) {
          times.forEach((t: number, i: number) => {
            if (i < pFA.length) {
              pFA.at(i)?.patchValue({ tiempoEstimado: t }, { emitEvent: false });
            } else if (i === pFA.length && destPt) {
              const destTimeField = `tiempoEstimadoDestino${suffix}`;
              this.rutaForm.patchValue({ [destTimeField]: t }, { emitEvent: false });
            }
          });
          this.calcTotalTime(type);
        }
      }

      this.initialDrawDone[type] = true;
      const bounds = L.latLngBounds(routeData.points);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Clear route lines and zero out distances if < 2 points exist
      if (this.routeLayers[type]) {
        this.routeLayers[type]!.remove();
        this.routeLayers[type] = undefined;
      }
      this.legDistances[type] = [];
      const distField = `distancia${suffix}` as keyof RutaFormValue;
      this.rutaForm.patchValue({ [distField]: '0' }, { emitEvent: false });

      pFA.controls.forEach(c => c.patchValue({ tiempoEstimado: 0 }, { emitEvent: false }));
      const destTimeField = `tiempoEstimadoDestino${suffix}`;
      this.rutaForm.patchValue({ [destTimeField]: 0 }, { emitEvent: false });
      this.calcTotalTime(type);

      if (originPt) {
        map.setView(originPt, 13);
      } else if (destPt) {
        map.setView(destPt, 13);
      }
    }

    this.cdr.detectChanges();
  }

  private addMarker(type: MapType, point: 'origin' | 'dest', lat: number, lng: number) {
    const map = this.maps[type];
    if (!map) return;

    // Prevent duplicates
    if (this.markers[type][point]) return;

    // Lock Vuelta Origin to sync with Ida Destination only when both routes exist
    const isDraggable = !(
      type === 'vuelta' &&
      point === 'origin' &&
      this.tipoTrayecto() === 'ambos'
    );

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

  private addParadaMarker(type: MapType, index: number, lat: number, lng: number, title: string) {
    const map = this.maps[type];
    if (!map) return;

    // Custom Icon for Paradas (Blue)
    const markerIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-pin" style="background: #3b82f6; opacity: 1"></div><span style="color: white; font-size: 10px; font-weight: bold; position: absolute; top: 6px; left: 50%; transform: translateX(-50%); z-index: 10;">${index + 1}</span>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

    const marker = L.marker([lat, lng], {
      draggable: true,
      icon: markerIcon,
      title: title || `Parada ${index + 1}`,
    }).addTo(map);

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      const pFA = type === 'ida' ? this.paradasIdaFA : this.paradasVueltaFA;
      const control = pFA.at(index);
      if (control) {
        control.patchValue({
          ubicacionLat: lat.toFixed(6),
          ubicacionLng: lng.toFixed(6),
        });
      }
    });

    this.markers[type].paradas.push(marker);
  }

  private clearMarkers(type: MapType) {
    const m = this.markers[type];
    if (m.origin) m.origin.remove();
    if (m.dest) m.dest.remove();
    m.paradas.forEach((p) => p.remove());
    if (this.routeLayers[type]) this.routeLayers[type]!.remove();

    this.markers[type] = { paradas: [] };
    this.routeLayers[type] = undefined;
  }

  async submitForm() {
    if (this.rutaForm.invalid) {
      this.rutaForm.markAllAsTouched();

      const invalidFields: string[] = [];
      const fieldLabels: Record<string, string> = {
        nombre: 'Nombre de ruta',
        origen: 'Punto de Origen (Ida)',
        destino: 'Punto de Destino (Ida)',
        origenLat: 'Ubicación Origen (Ida)',
        origenLng: 'Ubicación Origen (Ida)',
        destinoLat: 'Ubicación Destino (Ida)',
        destinoLng: 'Ubicación Destino (Ida)',
        distancia: 'Distancia (Ida)',
        tiempoEstimado: 'Tiempo Estimado (Ida)',
        origenVuelta: 'Punto de Origen (Vuelta)',
        destinoVuelta: 'Punto de Destino (Vuelta)',
        origenLatVuelta: 'Ubicación Origen (Vuelta)',
        origenLngVuelta: 'Ubicación Origen (Vuelta)',
        destinoLatVuelta: 'Ubicación Destino (Vuelta)',
        destinoLngVuelta: 'Ubicación Destino (Vuelta)',
        distanciaVuelta: 'Distancia (Vuelta)',
        tiempoEstimadoVuelta: 'Tiempo Estimado (Vuelta)',
      };

      for (const [key, control] of Object.entries(this.rutaForm.controls)) {
        if (control.invalid) {
          const label = fieldLabels[key] || key;
          if (!invalidFields.includes(label)) {
            invalidFields.push(label);
          }
        }
      }

      // Check FormArrays as well just in case
      if (this.paradasIdaFA.invalid) invalidFields.push('Tiempos en Paradas (Ida)');
      if (this.paradasVueltaFA.invalid) invalidFields.push('Tiempos en Paradas (Vuelta)');

      const msg =
        invalidFields.length > 0
          ? 'Revisa los campos requeridos: ' + invalidFields.join(', ')
          : 'Complete todos los campos de la ruta.';

      this.toastService.warning(msg);
      return;
    }

    const val = this.rutaForm.getRawValue();
    const type = this.tipoTrayecto();
    const esIgual = this.esVueltaIgual();

    const buildDetalle = (isVueltaField = false): DetalleInput => {
      const s = isVueltaField ? 'Vuelta' : '';
      const mapKey = isVueltaField ? 'vuelta' : 'ida';

      const hasDestinoForType = isVueltaField ? this.hasDestinoVuelta() : this.hasDestinoIda();

      const formParadas = (val[('paradas' + s) as keyof RutaFormValue] as any[]) || [];
      const distances = this.legDistances[mapKey] || [];

      const originNode = {
        nombre: String(val[('origen' + s) as keyof RutaFormValue] || ''),
        ubicacionLat: String(val[('origenLat' + s) as keyof RutaFormValue] || ''),
        ubicacionLng: String(val[('origenLng' + s) as keyof RutaFormValue] || ''),
        orden: 1,
        tiempoEstimado: 0,
        distanciaPreviaParada: '0',
      };

      const interNodes = formParadas.map((p, idx) => ({
        nombre: p.nombre,
        ubicacionLat: p.ubicacionLat,
        ubicacionLng: p.ubicacionLng,
        orden: idx + 2,
        tiempoEstimado: Number(p.tiempoEstimado) || 0,
        distanciaPreviaParada: String(distances[idx] || 0),
      }));

      const paradas = [originNode, ...interNodes];

      // Only include destination node if hasDestino is active
      if (hasDestinoForType) {
        const destNode = {
          nombre: String(val[('destino' + s) as keyof RutaFormValue] || ''),
          ubicacionLat: String(val[('destinoLat' + s) as keyof RutaFormValue] || ''),
          ubicacionLng: String(val[('destinoLng' + s) as keyof RutaFormValue] || ''),
          orden: formParadas.length + 2,
          tiempoEstimado: Number(val[('tiempoEstimadoDestino' + s) as keyof RutaFormValue]) || 0,
          distanciaPreviaParada: String(distances[formParadas.length] || 0),
        };
        paradas.push(destNode);
      }

      return {
        origen: originNode.nombre,
        destino: hasDestinoForType ? String(val[('destino' + s) as keyof RutaFormValue] || '') : null,
        origenLat: originNode.ubicacionLat,
        origenLng: originNode.ubicacionLng,
        destinoLat: hasDestinoForType ? String(val[('destinoLat' + s) as keyof RutaFormValue] || '') : null,
        destinoLng: hasDestinoForType ? String(val[('destinoLng' + s) as keyof RutaFormValue] || '') : null,
        distancia: String(val[('distancia' + s) as keyof RutaFormValue] || ''),
        tiempoEstimado: Number(val[('tiempoEstimado' + s) as keyof RutaFormValue]) || 0,
        paradas,
      } as any;
    };

    const idaDetalle = buildDetalle(false);
    const payload: Partial<ApiBody<'rutas', 'createCircuito'>> = {
      nombre: val.nombre!,
      // esIgual only makes sense when both ida and vuelta exist
      esIgual: type === 'ambos' ? esIgual : false,
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
          paradas: [...(idaDetalle.paradas || [])].reverse().map((p, idx, arr) => {
            const originalIndex = arr.length - 1 - idx;
            // The distance/time from previous point in reversed direction
            // is exactly the distance/time TO the point in original direction!!
            const distNode = idx === 0 ? null : arr[originalIndex + 1];
            return {
              ...p,
              orden: idx + 1,
              distanciaPreviaParada: idx === 0 ? '0' : distNode!.distanciaPreviaParada,
              tiempoEstimado: idx === 0 ? 0 : distNode!.tiempoEstimado,
            };
          }),
        } as any;
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
