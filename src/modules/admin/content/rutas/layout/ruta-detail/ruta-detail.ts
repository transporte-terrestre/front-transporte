import { Component, input, inject, signal, effect, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from 'api/backend.api';
import { RutaService } from '@service/admin/ruta.service';
import * as L from 'leaflet';

type Circuito = ApiResponse<'rutas', 'findOneCircuito'>;
type RutaIndividual = NonNullable<Circuito['rutaIda']>;
type MapType = 'ida' | 'vuelta';

// Leaflet default icon setup
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

@Component({
  selector: 'app-ruta-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ruta-detail.html',
  styleUrl: './ruta-detail.css',
})
export class RutaDetail implements OnDestroy {
  circuitoId = input<number>();
  
  private rutaService = inject(RutaService);
  private cdr = inject(ChangeDetectorRef);

  circuito = signal<Circuito | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  private maps: Record<MapType, L.Map | undefined> = { ida: undefined, vuelta: undefined };
  private routeLayers: Record<MapType, L.Layer | undefined> = { ida: undefined, vuelta: undefined };
  private markersMap: Record<MapType, L.Marker[]> = { ida: [], vuelta: [] };
  
  // Storage for distances extracted from OSRM
  public legDistances: Record<MapType, number[]> = { ida: [], vuelta: [] };

  constructor() {
    effect(() => {
      const id = this.circuitoId();
      if (id) {
        this.loadCircuitoData(id);
      }
    });
  }

  ngOnDestroy() {
    this.destroyMaps();
  }

  private destroyMaps() {
    Object.values(this.maps).forEach((map) => map?.remove());
    this.maps = { ida: undefined, vuelta: undefined };
    this.markersMap = { ida: [], vuelta: [] };
    this.routeLayers = { ida: undefined, vuelta: undefined };
  }

  hasDestino(ruta: RutaIndividual | undefined): boolean {
    return !!(ruta?.destino && ruta?.destinoLat);
  }

  async loadCircuitoData(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.destroyMaps();

    try {
      const data = await this.rutaService.findOneCircuito(id);
      this.circuito.set(data);
      
      this.cdr.detectChanges();
      
      // Allow DOM to process the @if blocks before initializing Leaflet instances
      setTimeout(() => {
        if (data.rutaIda) {
          this.initMapAndDraw('ida', data.rutaIda);
        }
        if (!data.esIgual && data.rutaVuelta) {
          this.initMapAndDraw('vuelta', data.rutaVuelta);
        }
      }, 100);

    } catch (err) {
      console.error('Error loading ruta:', err);
      this.error.set('Error al cargar la información de la ruta.');
    } finally {
      this.loading.set(false);
    }
  }

  private async initMapAndDraw(type: MapType, ruta: RutaIndividual) {
    const elementId = type === 'ida' ? 'map-detail-ida' : 'map-detail-vuelta';
    const container = document.getElementById(elementId);
    if (!container) return;

    if (this.maps[type]) this.maps[type]!.remove();

    const map = L.map(elementId, { zoomControl: true, dragging: false, scrollWheelZoom: false }).setView([-12.0464, -77.0428], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    this.maps[type] = map;

    // Collect all points
    const points: L.LatLng[] = [];
    
    // Origin
    if (ruta.origenLat && ruta.origenLng) {
      const pt = L.latLng(Number(ruta.origenLat), Number(ruta.origenLng));
      points.push(pt);
      this.addCustomMarker(map, pt, 'origin');
    }

    // Paradas (excluding structural origin/dest injected by backend)
    const paradas = (ruta as any).paradas;
    if (paradas && paradas.length > 0) {
      let sorted = [...paradas].sort((a: any, b: any) => a.orden - b.orden);
      if (sorted.length >= 2) {
        sorted = sorted.slice(1, sorted.length - 1);
      }
      sorted.forEach((p: any, idx: number) => {
        if (p.ubicacionLat && p.ubicacionLng) {
          const pt = L.latLng(Number(p.ubicacionLat), Number(p.ubicacionLng));
          points.push(pt);
          this.addCustomMarker(map, pt, 'stop', idx + 1);
        }
      });
    }

    // Destination
    if (ruta.destinoLat && ruta.destinoLng) {
      const pt = L.latLng(Number(ruta.destinoLat), Number(ruta.destinoLng));
      points.push(pt);
      this.addCustomMarker(map, pt, 'dest');
    }

    if (points.length >= 2) {
      const routeData = await this.getRoadRoute(points);
      this.legDistances[type] = routeData.legs || [];

      this.routeLayers[type] = L.polyline(routeData.points, {
        color: '#0ea5e9',
        weight: 6,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      const bounds = L.latLngBounds(routeData.points);
      map.fitBounds(bounds, { padding: [50, 50] });

      this.cdr.detectChanges();
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }

  getSortedParadas(ruta: RutaIndividual | undefined): any[] {
    if (!ruta) return [];
    const p = (ruta as any).paradas;
    if (!p || p.length === 0) return [];
    let sorted = [...p].sort((a: any, b: any) => a.orden - b.orden);
    if (sorted.length >= 2) {
      sorted = sorted.slice(1, sorted.length - 1);
    }
    return sorted;
  }

  private addCustomMarker(map: L.Map, latlng: L.LatLng, pointType: 'origin'|'dest'|'stop', stopNumber?: number) {
    let html = '';
    // Determine the map context from the map element ID if possible, or just use stopNumber colors
    // Actually, markers usually stay green for origin, red for dest. Let's just update the 'stop' marker blue.
    if (pointType === 'origin') {
      html = `<div style="background-color: #34A851; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 14px;"><i class="fas fa-play" style="margin-left: 2px;"></i></div>`;
    } else if (pointType === 'dest') {
      html = `<div style="background-color: #ef4444; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 14px;"><i class="fas fa-flag-checkered"></i></div>`;
    } else {
      // For stops, we'll use a generic blueish color or secondary? Let's use blue (#4590F2)
      html = `<div style="background-color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: #4590F2; border: 3px solid #4590F2; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-weight: bold; font-family: sans-serif;">${stopNumber}</div>`;
    }

    const icon = L.divIcon({
      html,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    L.marker(latlng, { icon }).addTo(map);
  }

  private async getRoadRoute(points: L.LatLng[]): Promise<{ points: L.LatLng[]; legs: number[] }> {
    try {
      const coordsString = points.map((p) => `${p.lng},${p.lat}`).join(';');
      const resp = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
      const data = await resp.json();
      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates as [number, number][];
        const legs = data.routes[0].legs ? data.routes[0].legs.map((leg: any) => parseFloat((leg.distance / 1000).toFixed(2))) : [];
        return {
          points: coords.map((c: [number, number]) => L.latLng(c[1], c[0])),
          legs,
        };
      }
    } catch (e) {
      console.error('Error fetching route from OSRM:', e);
    }
    return { points, legs: [] };
  }
}
