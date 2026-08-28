import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehiculoInputSearch } from '../../../../components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { ApiBody, ApiResponse } from 'api/backend.api';
import { PlaceSearchResult, reverseGeocodePlaceName, searchPlaces } from '@helper/geocoding.helper';
import * as L from 'leaflet';

type Abastecimiento = ApiResponse<'abastecimientos', 'findAll'>['data'][number];
type VehiculoOption = ApiResponse<'vehiculos', 'findAll'>['data'][number];
type CombustibleTipo = ApiBody<'abastecimientos', 'create'>['combustible'];

export type AbastecimientoFormSubmitData = ApiBody<'abastecimientos', 'create'>;

interface AbastecimientoFormState {
  vehiculoId: number | null;
  combustible: CombustibleTipo | '';
  galonesEstablecidos: string;
  kilometrajeSuelto: string;
  tramoSuelto: string;
  fechaAbastecimiento: string;
  horaAbastecimiento: string;
  latitud: number | null;
  longitud: number | null;
}

@Component({
  selector: 'app-abastecimiento-form',
  imports: [CommonModule, FormsModule, VehiculoInputSearch],
  templateUrl: './abastecimiento-form.html',
})
export class AbastecimientoForm implements OnDestroy {
  abastecimiento = input<Abastecimiento | null>(null);
  editMode = input(false);

  onSubmitForm = output<AbastecimientoFormSubmitData>();
  onValidationError = output<string>();

  mapElement = viewChild<ElementRef<HTMLDivElement>>('abastecimientoMap');
  selectedVehiculo = signal<number | VehiculoOption | null>(null);
  isResolvingPlace = signal(false);
  isSearchingPlaces = signal(false);
  placeSearchTerm = signal('');
  placeSearchResults = signal<PlaceSearchResult[]>([]);
  form = signal<AbastecimientoFormState>(this.createEmptyFormState());
  isLinkedToTramo = computed(() => this.editMode() && this.abastecimiento()?.viajeTramoId != null);

  private map?: L.Map;
  private marker?: L.Marker;
  private geocodingRequestId = 0;
  private placeSearchRequestId = 0;
  private placeSearchTimer?: ReturnType<typeof setTimeout>;
  private placeSearchAbortController?: AbortController;

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
        const fechaHora = this.getLocalDateTimeParts(
          item.fechaAbastecimiento || item.creadoEn,
        );
        this.form.set({
          vehiculoId: item.vehiculoId,
          combustible: this.normalizeCombustible(item.combustible),
          galonesEstablecidos: item.galonesEstablecidos,
          kilometrajeSuelto: item.kilometrajeSuelto || '',
          tramoSuelto: item.tramoSuelto || '',
          fechaAbastecimiento: fechaHora.fecha,
          horaAbastecimiento: fechaHora.hora,
          latitud: item.metadata?.ubicacion.lat ?? null,
          longitud: item.metadata?.ubicacion.lng ?? null,
        });
        this.selectedVehiculo.set(item.vehiculoId);
        this.placeSearchTerm.set(item.tramoSuelto || '');
      } else {
        this.form.set(this.createEmptyFormState());
        this.selectedVehiculo.set(null);
        this.placeSearchTerm.set('');
      }
      this.cancelPlaceSearch();
      this.placeSearchResults.set([]);
    });

    effect(() => {
      const element = this.mapElement()?.nativeElement;
      const linkedToTramo = this.isLinkedToTramo();

      if (linkedToTramo || !element) {
        if (linkedToTramo) this.destroyMap();
        return;
      }

      if (!this.map) {
        setTimeout(() => {
          if (!this.map && this.mapElement()?.nativeElement === element) {
            untracked(() => this.initMap(element));
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.cancelPlaceSearch();
    this.destroyMap();
  }

  updateForm<K extends keyof AbastecimientoFormState>(key: K, value: AbastecimientoFormState[K]) {
    this.form.update((current) => ({ ...current, [key]: value }));
  }

  onVehiculoChange(vehiculo: number | VehiculoOption | null) {
    this.selectedVehiculo.set(vehiculo);
    const vehiculoId = typeof vehiculo === 'number' ? vehiculo : vehiculo?.id || null;
    const combustible =
      typeof vehiculo === 'number' ? '' : this.normalizeCombustible(vehiculo?.combustible || '');

    this.form.update((current) => ({
      ...current,
      vehiculoId,
      combustible,
    }));
  }

  onPlaceSearchChange(value: string) {
    this.placeSearchTerm.set(value);
    this.placeSearchResults.set([]);
    this.cancelPlaceSearch();

    const query = value.trim();
    if (query.length < 3) return;

    this.placeSearchTimer = setTimeout(() => {
      void this.runPlaceSearch(query);
    }, 500);
  }

  onPlaceSearchEnter(event: Event) {
    event.preventDefault();
    const firstResult = this.placeSearchResults()[0];

    if (firstResult) {
      this.selectPlaceSearchResult(firstResult);
      return;
    }

    const query = this.placeSearchTerm().trim();
    if (query.length < 3) return;

    this.cancelPlaceSearch();
    void this.runPlaceSearch(query);
  }

  selectPlaceSearchResult(result: PlaceSearchResult) {
    this.cancelPlaceSearch();
    this.placeSearchResults.set([]);
    this.placeSearchTerm.set(result.label);
    this.selectLocation(result.lat, result.lng, result.label);
    this.map?.flyTo([result.lat, result.lng], 17);
  }

  submitForm() {
    const form = this.form();
    const galones = Number(form.galonesEstablecidos);
    if (!form.vehiculoId) {
      this.onValidationError.emit('Selecciona un vehículo');
      return;
    }
    if (!form.combustible) {
      this.onValidationError.emit('Selecciona el tipo de combustible');
      return;
    }
    if (Number.isNaN(galones) || galones <= 0) {
      this.onValidationError.emit('Ingresa una cantidad de galones mayor a 0');
      return;
    }

    const payload: AbastecimientoFormSubmitData = {
      vehiculoId: form.vehiculoId,
      combustible: form.combustible,
      galonesEstablecidos: galones,
    };

    if (!this.isLinkedToTramo()) {
      const kilometraje = Number(form.kilometrajeSuelto);
      if (!form.fechaAbastecimiento) {
        this.onValidationError.emit('Selecciona la fecha del abastecimiento');
        return;
      }
      if (!form.horaAbastecimiento) {
        this.onValidationError.emit('Selecciona la hora del abastecimiento');
        return;
      }
      if (Number.isNaN(kilometraje) || kilometraje < 0) {
        this.onValidationError.emit('Ingresa un kilometraje válido');
        return;
      }
      if (!form.tramoSuelto.trim()) {
        this.onValidationError.emit('Ingresa el tramo o lugar del abastecimiento');
        return;
      }

      if (form.latitud == null || form.longitud == null) {
        this.onValidationError.emit('Selecciona la ubicación del abastecimiento en el mapa');
        return;
      }

      payload.kilometrajeSuelto = kilometraje;
      payload.tramoSuelto = form.tramoSuelto.trim();
      payload.fechaAbastecimiento = this.combineLocalDateTime(
        form.fechaAbastecimiento,
        form.horaAbastecimiento,
      );

      payload.metadata = {
        ubicacion: {
          lat: form.latitud,
          lng: form.longitud,
        },
      };
    }

    this.onSubmitForm.emit(payload);
  }

  private normalizeCombustible(value: string): CombustibleTipo | '' {
    const option = this.combustibleOptions.find((item) => item.value === value);
    return option?.value || '';
  }

  private createEmptyFormState(): AbastecimientoFormState {
    const fechaHora = this.getLocalDateTimeParts();
    return {
      vehiculoId: null,
      combustible: '',
      galonesEstablecidos: '',
      kilometrajeSuelto: '',
      tramoSuelto: '',
      fechaAbastecimiento: fechaHora.fecha,
      horaAbastecimiento: fechaHora.hora,
      latitud: null,
      longitud: null,
    };
  }

  private getLocalDateTimeParts(value?: string | null) {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return { fecha: value, hora: '00:00' };
    }

    const parsed = value ? new Date(value) : new Date();
    const date = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
    const pad = (part: number) => String(part).padStart(2, '0');

    return {
      fecha: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      hora: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    };
  }

  private combineLocalDateTime(fecha: string, hora: string) {
    const [year, month, day] = fecha.split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString();
  }

  private initMap(element: HTMLDivElement) {
    const form = this.form();
    const hasSavedLocation = form.latitud != null && form.longitud != null;
    const initialLat = form.latitud ?? -12.0464;
    const initialLng = form.longitud ?? -77.0428;

    this.map = L.map(element).setView([initialLat, initialLng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    if (hasSavedLocation) {
      this.createOrMoveMarker(initialLat, initialLng);
    }

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.selectLocation(event.latlng.lat, event.latlng.lng);
    });

    setTimeout(() => this.map?.invalidateSize(), 150);
  }

  private createOrMoveMarker(latitude: number, longitude: number) {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([latitude, longitude]);
      return;
    }

    const orangeIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.marker = L.marker([latitude, longitude], {
      draggable: true,
      icon: orangeIcon,
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker?.getLatLng();
      if (position) this.selectLocation(position.lat, position.lng);
    });
  }

  private selectLocation(latitude: number, longitude: number, placeName?: string) {
    const selectedPlaceName = placeName || this.getFallbackPlaceName(latitude, longitude);

    this.placeSearchResults.set([]);
    this.placeSearchTerm.set(selectedPlaceName);
    this.createOrMoveMarker(latitude, longitude);
    this.form.update((current) => ({
      ...current,
      latitud: latitude,
      longitud: longitude,
      tramoSuelto: selectedPlaceName,
    }));

    if (placeName) {
      this.geocodingRequestId++;
      this.isResolvingPlace.set(false);
    } else {
      void this.updatePlaceNameFromMap(latitude, longitude);
    }
  }

  private async updatePlaceNameFromMap(latitude: number, longitude: number) {
    const requestId = ++this.geocodingRequestId;
    this.isResolvingPlace.set(true);

    try {
      const placeName = await reverseGeocodePlaceName(latitude, longitude);
      if (requestId === this.geocodingRequestId && placeName) {
        this.form.update((current) => ({ ...current, tramoSuelto: placeName }));
        this.placeSearchTerm.set(placeName);
      }
    } catch (error) {
      console.warn('No se pudo obtener el nombre de la ubicación:', error);
    } finally {
      if (requestId === this.geocodingRequestId) {
        this.isResolvingPlace.set(false);
      }
    }
  }

  private getFallbackPlaceName(latitude: number, longitude: number) {
    return `Ubicación ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  private async runPlaceSearch(query: string) {
    const requestId = ++this.placeSearchRequestId;
    const abortController = new AbortController();
    this.placeSearchTimer = undefined;
    this.placeSearchAbortController = abortController;
    this.isSearchingPlaces.set(true);

    try {
      const results = await searchPlaces(query, abortController.signal);
      if (requestId === this.placeSearchRequestId && query === this.placeSearchTerm().trim()) {
        this.placeSearchResults.set(results);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.warn('No se pudieron buscar lugares:', error);
      }
    } finally {
      if (requestId === this.placeSearchRequestId) {
        this.placeSearchAbortController = undefined;
        this.isSearchingPlaces.set(false);
      }
    }
  }

  private cancelPlaceSearch() {
    if (this.placeSearchTimer) {
      clearTimeout(this.placeSearchTimer);
      this.placeSearchTimer = undefined;
    }

    this.placeSearchAbortController?.abort();
    this.placeSearchAbortController = undefined;
    this.placeSearchRequestId++;
    this.isSearchingPlaces.set(false);
  }

  private destroyMap() {
    this.geocodingRequestId++;
    this.isResolvingPlace.set(false);
    this.marker = undefined;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
  }
}
