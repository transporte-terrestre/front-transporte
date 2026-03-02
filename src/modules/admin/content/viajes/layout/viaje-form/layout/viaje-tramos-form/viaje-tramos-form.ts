import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ViajeService } from '@service/admin/viaje.service';
import {
  ViajeHojaRutaResultDto,
  ViajeProximoTramoResultDto,
  ViajePuntoTrayectoDto,
  ViajeResultDto,
  ViajeTramoResultDto,
} from 'api/backend.api';
import { DialogSalidaComponent } from './layout/dialog-salida/dialog-salida';
import { DialogLlegadaComponent } from './layout/dialog-llegada/dialog-llegada';
import { DialogPuntoComponent } from './layout/dialog-punto/dialog-punto';
import { DialogParadaComponent } from './layout/dialog-parada/dialog-parada';
import { DialogDescansoComponent } from './layout/dialog-descanso/dialog-descanso';
import { DialogEditTramoComponent } from './layout/dialog-edit-tramo/dialog-edit-tramo';
import { DialogPasajerosTramoComponent } from './layout/dialog-pasajeros-tramo/dialog-pasajeros-tramo';

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
  selector: 'app-viaje-tramos-form',
  standalone: true,
  imports: [
    CommonModule,
    DialogSalidaComponent,
    DialogLlegadaComponent,
    DialogPuntoComponent,
    DialogParadaComponent,
    DialogDescansoComponent,
    DialogEditTramoComponent,
    DialogPasajerosTramoComponent,
  ],
  templateUrl: './viaje-tramos-form.html',
  styleUrl: './viaje-tramos-form.css',
})
export class ViajeTramosFormComponent implements AfterViewInit, OnDestroy {
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private viajeService = inject(ViajeService);

  // Inputs
  viaje = input.required<ViajeResultDto>();

  // State
  tramos = signal<ViajeTramoResultDto[]>([]);
  puntosTrayecto = signal<ViajePuntoTrayectoDto[]>([]);
  loading = signal(false);
  showDropdown = signal(false);
  vistaHojaRuta = signal(false);
  hojaRuta = signal<ViajeHojaRutaResultDto | null>(null);
  loadingHojaRuta = signal(false);

  // Map state
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private polyline: L.Polyline | null = null;

  // Dialog visibility
  showSalida = signal(false);
  showLlegada = signal(false);
  showPunto = signal(false);
  showParada = signal(false);
  showDescanso = signal(false);
  showEdit = signal(false);
  showPasajeros = signal(false);
  hasSalida = computed(() => this.tramos().some((s) => s.tipo === 'origen'));
  hasLlegada = computed(() => this.tramos().some((s) => s.tipo === 'destino'));

  selectedTramo = signal<ViajeTramoResultDto | null>(null);
  proximoTramoSugerido = signal<ViajeProximoTramoResultDto | null>(null);
  loadingSugerencia = signal(false);

  constructor() {
    effect(() => {
      const v = this.viaje();
      if (v?.id) {
        this.loadData();
      }
    });

    // Efecto para actualizar el mapa cuando cambian los puntos
    effect(() => {
      const puntos = this.puntosTrayecto();
      if (puntos.length > 0) {
        // Pequeño timeout para asegurar que el DOM del mapa esté listo
        setTimeout(() => this.updateMap(), 100);
      }
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    if (this.map) return;

    this.map = L.map('viaje-map').setView([-12.046374, -77.042793], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private async updateMap() {
    if (!this.map) return;

    const puntos = this.puntosTrayecto();
    if (puntos.length === 0) return;

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

    let iconHtml = '';
    let colorClass = p.completado ? 'bg-info' : 'bg-slate-400';
    let iconClass = 'fa-map-marker-alt';

    if (p.tipo === 'origen') {
      colorClass = p.completado ? 'bg-success' : 'bg-slate-400';
      iconClass = 'fa-play';
    } else if (p.tipo === 'destino') {
      colorClass = p.completado ? 'bg-danger' : 'bg-slate-400';
      iconClass = 'fa-flag-checkered';
    }

    iconHtml = `
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

  async loadData() {
    this.loading.set(true);
    try {
      const viajeId = this.viaje().id;

      // Cargar datos en paralelo
      const [dataTramos, dataTrayecto] = await Promise.all([
        this.viajeService.findTramos(viajeId),
        this.viajeService.findTrayecto(viajeId),
      ]);

      this.tramos.set(dataTramos);
      this.puntosTrayecto.set(dataTrayecto.puntos);
      this.hojaRuta.set(null); // Invalidar cache de hoja de ruta
    } catch (error: any) {
      console.error('Error loading data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async toggleVista() {
    const nextVista = !this.vistaHojaRuta();
    this.vistaHojaRuta.set(nextVista);

    // Si regresamos a la vista de registros, invalidar tamaño del mapa
    if (!nextVista && this.map) {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 100);
    }

    if (nextVista && !this.hojaRuta()) {
      this.loadingHojaRuta.set(true);
      try {
        const data = await this.viajeService.getHojaRuta(this.viaje().id);
        this.hojaRuta.set(data);
      } catch (e) {
        console.error('Error cargando hoja de ruta:', e);
      } finally {
        this.loadingHojaRuta.set(false);
      }
    }
  }

  async prepareAddTramo() {
    if (this.showDropdown()) {
      this.showDropdown.set(false);
      return;
    }

    this.loadingSugerencia.set(true);
    try {
      const sugerencia = await this.viajeService.getProximoTramo({ viajeId: this.viaje().id });
      this.proximoTramoSugerido.set(sugerencia);
      this.showDropdown.set(true);
    } catch (e) {
      console.error('Error al obtener sugerencia:', e);
      this.proximoTramoSugerido.set(null);
    } finally {
      this.loadingSugerencia.set(false);
    }
  }

  async openDialog(tipo: string) {
    this.showDropdown.set(false);
    this.closeAllDialogs();

    // Si el tipo solicitado no coincide con la sugerencia actual, pedir al backend la sugerencia específica
    const sugActual = this.proximoTramoSugerido();
    if (
      sugActual &&
      sugActual.tipo !== tipo &&
      (tipo === 'origen' || tipo === 'destino' || tipo === 'punto')
    ) {
      try {
        const sugEspecifica = await this.viajeService.getProximoTramo({
          viajeId: this.viaje().id,
          tipo: tipo as 'origen' | 'punto' | 'parada' | 'descanso' | 'destino',
        });
        this.proximoTramoSugerido.set(sugEspecifica);
      } catch (e) {
        console.error('Error al obtener sugerencia específica:', e);
      }
    }

    switch (tipo) {
      case 'origen':
        this.showSalida.set(true);
        break;
      case 'destino':
        this.showLlegada.set(true);
        break;
      case 'punto':
        this.showPunto.set(true);
        break;
      case 'parada':
        this.showParada.set(true);
        break;
      case 'descanso':
        this.showDescanso.set(true);
        break;
    }
  }

  prepareEditTramo(tramo: ViajeTramoResultDto) {
    this.selectedTramo.set(tramo);
    this.showEdit.set(true);
  }

  preparePasajeros(tramo: ViajeTramoResultDto) {
    this.selectedTramo.set(tramo);
    this.showPasajeros.set(true);
  }

  onDialogSaved() {
    this.closeAllDialogs();
    this.loadData();
  }

  closeAllDialogs() {
    this.showSalida.set(false);
    this.showLlegada.set(false);
    this.showPunto.set(false);
    this.showParada.set(false);
    this.showDescanso.set(false);
    this.showEdit.set(false);
    this.showPasajeros.set(false);
    this.selectedTramo.set(null);
  }

  async deleteTramo(id: number) {
    this.alertService.delete(
      'Eliminar Tramo',
      '¿Estás seguro de eliminar este tramo del viaje?',
      async () => {
        try {
          await this.viajeService.deleteTramo(id);
          this.toastService.success('Tramo eliminado');
          this.loadData();
        } catch (error: any) {
          console.error('Error deleting tramo:', error);
          this.toastService.error('Error al eliminar el tramo');
        }
      },
    );
  }

  formatSoloFechaUTC(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const day = String(d.getUTCDate()).padStart(2, '0');
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }

  formatSoloHoraUTC(dateStr: string | null | undefined): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  getNombreLugar(tramo: ViajeTramoResultDto, index: number): string {
    if (tramo.tipo !== 'descanso') {
      return tramo.nombreLugar || '—';
    }

    // Para descanso, calcular minutos dinámicamente
    const lista = this.tramos();
    if (index > 0 && tramo.horaFinal && lista[index - 1]?.horaFinal) {
      const actual = new Date(tramo.horaFinal).getTime();
      const anterior = new Date(lista[index - 1].horaFinal!).getTime();
      const diffMin = Math.round((actual - anterior) / 60000);
      if (diffMin > 0) {
        return `Descanso (${diffMin} min)`;
      }
    }

    return 'Descanso';
  }
}
