import { Component, input, inject, signal, effect, AfterViewInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViajeService } from '@service/admin/viaje.service';
import { ApiResponse } from 'api/backend.api';
import * as L from 'leaflet';

// Leaflet icon fix so markers display correctly
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

export type ViajeIndividual = NonNullable<ApiResponse<'viajes', 'findAll'>['data'][0]['ida']>;
import { ViajeHojaRutaResultDto, ViajePuntoTrayectoDto } from '@api/backend.api';
import { generateReporteDiarioPdf } from '@template/reporte-diario.template';

@Component({
  selector: 'app-viaje-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './viaje-detail.html',
  styleUrl: './viaje-detail.css',
})
export class ViajeDetail implements AfterViewInit {
  viaje = input<ViajeIndividual | null>(null);
  hojaRuta = signal<ViajeHojaRutaResultDto | null>(null);
  loading = signal(false);
  hiddenTramoIndexes = signal<Set<number>>(new Set());

  private viajeService = inject(ViajeService);

  puntosTrayecto = signal<ViajePuntoTrayectoDto[]>([]);

  hojaRutaDisplay = computed(() => {
    const hr = this.hojaRuta();
    if (!hr) return null;

    const indexes = this.hiddenTramoIndexes();
    if (indexes.size === 0) return hr;

    const filteredTramos = hr.tramos.filter((_, index) => !indexes.has(index));

    // Recalculate totals
    let totalKm = 0;
    let totalMinutes = 0;

    filteredTramos.forEach((t) => {
      // Parse KM
      const kmStr = t.kilometrajeRecorrido || '';
      const kmValue = parseFloat(kmStr.replace(/[^\d.]/g, '')) || 0;
      totalKm += kmValue;

      // Parse Time
      const timeStr = t.tiempoRecorrido || '';
      if (timeStr.includes('h')) {
        const parts = timeStr.split('h');
        const hours = parseInt(parts[0]) || 0;
        const mins = parseInt(parts[1]?.split('min')[0]) || 0;
        totalMinutes += hours * 60 + mins;
      } else {
        const mins = parseInt(timeStr.split('min')[0]) || 0;
        totalMinutes += mins;
      }
    });

    return {
      ...hr,
      tramos: filteredTramos,
      kilometrajeTotal: `${totalKm.toFixed(0)} KM`,
      tiempoTotal:
        totalMinutes >= 60
          ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}min`
          : `${totalMinutes} min`,
    };
  });

  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  private polyline: L.Polyline | null = null;

  constructor() {
    effect(() => {
      const v = this.viaje();
      if (v) {
        // Reset and load
        this.hiddenTramoIndexes.set(new Set());
        if (v.id) {
          this.loadHojaRuta(v.id);
          setTimeout(() => this.updateMap(), 0);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    if (typeof window === 'undefined') return;
    const el = document.getElementById('viaje-detail-map');
    if (!el) return;
    this.map = L.map(el).setView([0, 0], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private async updateMap() {
    if (!this.map) return;

    const puntos = this.puntosTrayecto();
    if (puntos.length === 0) {
      const v = this.viaje();
      if (!v || !v.ruta) return;
      const r = v.ruta;
      const oLat = parseFloat(r.origenLat);
      const oLng = parseFloat(r.origenLng);
      const dLat = r.destinoLat ? parseFloat(r.destinoLat) : null;
      const dLng = r.destinoLng ? parseFloat(r.destinoLng) : null;
      const hasDestino = dLat != null && dLng != null;

      const points: L.LatLngExpression[] = [[oLat, oLng]];
      if (hasDestino) points.push([dLat!, dLng!]);

      const bounds = L.latLngBounds(points);

      this.markers.forEach((m) => m.remove());
      this.markers = [];
      if (this.polyline) {
        this.polyline.remove();
      }
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) {
          layer.remove();
        }
      });

      const originMarker = L.marker([oLat, oLng]).addTo(this.map!);
      this.markers.push(originMarker);

      if (hasDestino) {
        const destMarker = L.marker([dLat!, dLng!]).addTo(this.map!);
        this.markers.push(destMarker);
        this.polyline = L.polyline([[oLat, oLng], [dLat!, dLng!]], {
          color: '#0088cc',
          weight: 4,
          opacity: 0.3,
          dashArray: '10, 10',
        }).addTo(this.map!);
      }

      this.map!.fitBounds(hasDestino ? bounds.pad(0.2) : bounds, {
        maxZoom: 15,
      });
      return;
    }

    // Limpiar elementos previos
    this.markers.forEach((m) => m.remove());
    this.markers = [];
    if (this.polyline) {
      this.polyline.remove();
    }
    // Limpiar cualquier otra capa de polilínea (como la sólida de completados)
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Polyline) {
        layer.remove();
      }
    });

    const latLngsParaMarcadores: [number, number][] = [];
    const puntosValidos = puntos.filter((p) => p.latitud != null && p.longitud != null);

    puntosValidos.forEach((p, index) => {
      const pos: [number, number] = [p.latitud!, p.longitud!];
      latLngsParaMarcadores.push(pos);

      // Crear marcador personalizado
      const marker = this.createMarker(p, index, puntos.length);
      if (marker) {
        marker
          .addTo(this.map!)
          .bindPopup(`<b>${p.nombre}</b><br>${p.completado ? 'Completado' : 'Pendiente'}`);
        this.markers.push(marker);
      }
    });

    if (puntosValidos.length > 1) {
      // 1. Dibujar la ruta COMPLETA proyectada (Punteada por las calles)
      const fullRouteCoords = puntosValidos.map(
        (p) => [p.latitud!, p.longitud!] as [number, number],
      );
      const fullGeometry = await this.getRouteGeometry(fullRouteCoords);

      this.polyline = L.polyline(fullGeometry, {
        color: '#0088cc',
        weight: 4,
        opacity: 0.3,
        dashArray: '10, 10',
      }).addTo(this.map);

      // 2. Dibujar la ruta REAL ya recorrida (Sólida por las calles)
      const completados = puntosValidos.filter((p) => p.completado);
      if (completados.length > 1) {
        const completedCoords = completados.map(
          (p) => [p.latitud!, p.longitud!] as [number, number],
        );
        const completedGeometry = await this.getRouteGeometry(completedCoords);

        L.polyline(completedGeometry, {
          color: '#0088cc',
          weight: 5,
          opacity: 0.9,
        }).addTo(this.map);
      }

      const bounds = L.latLngBounds(fullRouteCoords);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private async getRouteGeometry(points: [number, number][]): Promise<L.LatLngExpression[]> {
    if (points.length < 2) return points;

    // OSRM espera lon,lat separados por comas, y puntos por punto y coma
    const coordsStr = points.map((p) => `${p[1]},${p[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes?.length > 0) {
        // OSRM retorna [lon, lat], convertimos a [lat, lon] para Leaflet
        return data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
      }
    } catch (e) {
      console.error('Error obteniendo ruta real:', e);
    }

    // Si falla la API, devolvemos las líneas rectas como fallback
    return points;
  }

  private createMarker(p: ViajePuntoTrayectoDto, index: number, total: number): L.Marker | null {
    if (p.latitud == null || p.longitud == null) return null;

    let colorClass = p.completado ? 'bg-info' : 'bg-slate-400';
    let iconClass = 'fa-map-marker-alt';

    if (p.tipo === 'origen') {
      colorClass = p.completado ? 'bg-success' : 'bg-slate-400';
      iconClass = 'fa-play';
    } else if (p.tipo === 'destino') {
      colorClass = p.completado ? 'bg-danger' : 'bg-slate-400';
      iconClass = 'fa-flag-checkered';
    }

    const iconHtml = `
      <div class="flex items-center justify-center">
        <div class="w-7 h-7 ${colorClass} text-white rounded-full flex items-center justify-center border-2 border-white shadow-lg relative z-10 transition-all">
          ${
            p.tipo === 'punto' || p.tipo === 'parada'
              ? `<span class="text-[10px] font-inter-bold">${index}</span>`
              : `<i class="fas ${iconClass} text-[10px]"></i>`
          }
        </div>
        <!-- Sombra sutil en el mapa -->
        <div class="absolute -bottom-0.5 w-6 h-1.5 bg-black/15 rounded-full blur-[2px] -z-10"></div>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: 'custom-ball-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });

    return L.marker([p.latitud, p.longitud], { icon });
  }

  private async loadHojaRuta(id: number) {
    this.loading.set(true);
    try {
      const [data, trayecto] = await Promise.all([
        this.viajeService.getHojaRuta(id),
        this.viajeService.findTrayecto(id),
      ]);
      this.hojaRuta.set(data);
      this.puntosTrayecto.set(trayecto.puntos);
    } catch (err) {
      console.error('Error loading hoja ruta', err);
    } finally {
      this.loading.set(false);
      setTimeout(() => this.updateMap(), 0);
    }
  }

  descargarReporteDiario() {
    const data = this.viaje();
    const hr = this.hojaRutaDisplay();
    if (!data || !hr) return;
    generateReporteDiarioPdf(data as any, hr);
  }

  toggleTramoVisibility(index: number) {
    this.hiddenTramoIndexes.update((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  isTramoHidden(index: number): boolean {
    return this.hiddenTramoIndexes().has(index);
  }

  getClienteDisplay(v: ViajeIndividual): string {
    if (!v.cliente) return '—';
    const clienteName = v.cliente.razonSocial || v.cliente.nombreCompleto || '—';
    const entidadName = v.entidad?.nombreServicio;

    let display = clienteName;
    if (entidadName) display += ` (${entidadName})`;
    return display;
  }

  getRutaDisplay(v: ViajeIndividual): string {
    if (v.nombreRuta) return v.nombreRuta;
    if (v.ruta) {
      const { origen, destino } = v.ruta;
      return destino ? `${origen} → ${destino}` : origen;
    }
    return v.rutaOcasional || 'Ruta no especificada';
  }

  getVehiculoDisplay(v: ViajeIndividual): string {
    if (!v.vehiculoPrincipal) return '—';
    const vehiculo = v.vehiculoPrincipal;
    return `${vehiculo.placa} ${vehiculo.marca ? '- ' + vehiculo.marca : ''}`;
  }

  getConductorDisplay(v: ViajeIndividual): string {
    if (!v.conductorPrincipal) return '—';
    const conductor = v.conductorPrincipal;
    return `${conductor.nombres} ${conductor.apellidos}`;
  }
}
