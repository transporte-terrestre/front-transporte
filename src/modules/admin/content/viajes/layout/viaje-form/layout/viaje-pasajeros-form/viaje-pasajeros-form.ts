import {
  Component,
  inject,
  input,
  output,
  signal,
  effect,
  untracked,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ClienteService } from '@service/admin/cliente.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse, ViajePasajeroResultDto, PasajeroResultDto } from 'api/backend.api';
import * as XLSX from 'xlsx';
import { generateManifiestoPasajerosPdf } from '../../../../../../../../templates/manifiesto-pasajeros.template';

type ViajeData = ApiResponse<'viajes', 'findOne'>;

interface ExcelRow {
  [key: string]: string | number | boolean | undefined;
}

interface LocalPasajeroItemDto {
  id?: number;
  pasajeroId?: number;
  dni?: string;
  nombres?: string;
  apellidos?: string;
  asistencia: boolean;
  creadoEn?: string;
  actualizadoEn?: string;
}

@Component({
  selector: 'app-viaje-pasajeros-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './viaje-pasajeros-form.html',
  styleUrl: './viaje-pasajeros-form.css',
})
export class ViajePasajerosForm {
  private viajeService = inject(ViajeService);
  private clienteService = inject(ClienteService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viaje = input.required<ViajeData>();
  onDataChange = output<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  viajeId = signal<number | null>(null);

  showModal = signal(false);
  loading = signal(false);
  mode = signal<'list' | 'add' | 'choice'>('list');

  // Data
  pasajeros = signal<ViajePasajeroResultDto[]>([]); // Pasajeros asignados al viaje
  clientePasajeros = signal<PasajeroResultDto[]>([]); // Pasajeros del cliente (para agregar)
  selectedIds = signal<Set<number>>(new Set());
  pendingDelete = signal<ViajePasajeroResultDto | null>(null);

  constructor() {
    effect(() => {
      const v = this.viaje();
      if (v?.id) {
        untracked(() => this.loadPasajeros());
      }
    });
  }

  private lastLoadedViajeId = signal<number | null>(null);

  ngOnInit() {}

  openModal() {
    this.showModal.set(true);
    this.mode.set('list');
    this.loadPasajeros();
  }

  closeModal() {
    this.showModal.set(false);
  }

  async loadPasajeros() {
    if (this.loading()) return;

    this.loading.set(true);
    try {
      const data = await this.viajeService.findPasajeros(this.viaje().id);
      this.pasajeros.set(data);
      if (data.length === 0) {
        if (this.pasajeros().length === 0 && this.mode() !== 'add' && this.mode() !== 'choice') {
          this.mode.set('choice');
        }
      } else {
        if (this.mode() === 'add' && this.pasajeros().length > 0) {
        } else {
          this.mode.set('list');
        }
      }
    } catch (error) {
      console.error('Error cargando pasajeros', error);
    } finally {
      this.loading.set(false);
    }
  }

  async switchToMode(mode: 'list' | 'add' | 'choice') {
    this.mode.set(mode);
    if (mode === 'add') {
      this.loadClientePasajeros();
    }
  }

  async loadClientePasajeros() {
    this.loading.set(true);
    try {
      // Cargar todos los pasajeros del cliente
      const res = await this.clienteService.findAllPasajeros({
        clienteId: this.viaje().clienteId,
        limit: 1000,
        page: 1,
      });

      const allPasajeros = res.data;
      const currentIds = new Set(this.pasajeros().map((p) => p.pasajeroId));

      // Filtrar los que ya están en el viaje
      const available = allPasajeros.filter((p) => !currentIds.has(p.id));
      this.clientePasajeros.set(available);

      // Reset selection
      this.selectedIds.set(new Set());
    } catch (error) {
      console.error('Error cargando pasajeros del cliente', error);
      this.toastService.error('Error al cargar pasajeros disponibles');
    } finally {
      this.loading.set(false);
    }
  }

  async importFromExcel(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.loading.set(true);
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json<ExcelRow>(ws);

        if (rawData.length === 0) {
          this.toastService.warning('El archivo Excel está vacío');
          return;
        }

        const newPasajeros = rawData
          .map((row) => {
            const keys = Object.keys(row);
            const findVal = (terms: string[]) => {
              const key = keys.find((k) =>
                terms.some((term) => k.toUpperCase().trim().includes(term.toUpperCase())),
              );
              return key ? row[key]?.toString().trim() : null;
            };

            return {
              dni: findVal(['DNI', 'DOCUMENTO', 'ID', 'IDENTIFICACION']) || undefined,
              nombres: findVal(['NOMBRES', 'NOMBRE', 'NAME']) || undefined,
              apellidos: findVal(['APELLIDOS', 'APELLIDO', 'LAST NAME', 'SURNAME']) || undefined,
              asistencia: false,
            };
          })
          .filter((p) => p.dni && p.nombres);

        if (newPasajeros.length === 0) {
          this.toastService.error('No se encontraron columnas de DNI y Nombres válidas');
          return;
        }

        const currentList = [...this.pasajeros()];
        let addedCount = 0;

        newPasajeros.forEach((newP) => {
          const exists = currentList.find((p) => p.dni === newP.dni);
          if (!exists) {
            currentList.push({
              ...newP,
              id: Math.random() * -1000,
              viajeId: this.viaje().id,
              asistencia: false,
              pasajeroId: undefined,
              creadoEn: new Date().toISOString(),
              actualizadoEn: new Date().toISOString(),
            } as any as ViajePasajeroResultDto);
            addedCount++;
          }
        });

        if (addedCount > 0) {
          this.pasajeros.set(currentList);
          this.mode.set('list');
        } else {
          this.toastService.info('Todos los pasajeros ya están en la lista');
        }
      } catch (error) {
        console.error('Error procesando Excel', error);
        this.toastService.error('Error al procesar el archivo Excel');
      } finally {
        this.loading.set(false);
        if (this.fileInput) this.fileInput.nativeElement.value = '';
      }
    };
    reader.readAsBinaryString(file);
  }

  triggerExcelImport() {
    this.fileInput.nativeElement.click();
  }

  toggleSelection(id: number) {
    const current = new Set(this.selectedIds());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    this.selectedIds.set(current);
  }

  selectAll() {
    const allIds = this.clientePasajeros().map((p) => p.id);
    this.selectedIds.set(new Set(allIds));
  }

  deselectAll() {
    this.selectedIds.set(new Set());
  }

  async saveSelection() {
    const ids = Array.from(this.selectedIds());
    if (ids.length === 0) return;

    this.loading.set(true);
    try {
      // Get current passengers
      const current = this.pasajeros();
      // Add new ones with default asistencia = false
      const newPasajeros = ids.map((id) => ({ pasajeroId: id, asistencia: false }));

      const toUpsert = [...current, ...newPasajeros].map((p) => {
        const item: LocalPasajeroItemDto = {
          pasajeroId: p.pasajeroId || undefined,
          asistencia: p.asistencia,
        };
        if ('dni' in p) item.dni = p.dni || undefined;
        if ('nombres' in p) item.nombres = p.nombres || undefined;
        if ('apellidos' in p) item.apellidos = p.apellidos || undefined;
        return item;
      });

      await this.viajeService.upsertPasajeros(this.viaje().id, { pasajeros: toUpsert });
      this.toastService.success('Pasajeros agregados correctamente');

      this.closeModal();
      this.onDataChange.emit();
    } catch (error) {
      console.error('Error agregando pasajeros', error);
      this.toastService.error('Error al agregar pasajeros');
      this.loading.set(false);
    }
  }

  removePasajero(pasajero: ViajePasajeroResultDto) {
    this.pendingDelete.set(pasajero);
  }

  cancelDelete() {
    this.pendingDelete.set(null);
  }

  confirmDelete() {
    const pasajeroToDelete = this.pendingDelete();
    if (!pasajeroToDelete) return;

    // Local remove
    this.pasajeros.update((list) => list.filter((p) => p.id !== pasajeroToDelete.id));
    this.pendingDelete.set(null);
  }

  toggleAsistencia(pasajero: ViajePasajeroResultDto) {
    // Local toggle
    this.pasajeros.update((list) =>
      list.map((p) => (p.id === pasajero.id ? { ...p, asistencia: !p.asistencia } : p)),
    );
  }

  getDisplayName(p: ViajePasajeroResultDto | PasajeroResultDto) {
    const nombres = p.nombres || 'Sin nombre';
    const apellidos = p.apellidos || '';
    return `${nombres} ${apellidos}`.trim();
  }

  getDisplayDni(p: ViajePasajeroResultDto | PasajeroResultDto) {
    return p.dni || '---';
  }

  getInitials(p: ViajePasajeroResultDto | PasajeroResultDto) {
    const n = p.nombres || '?';
    const a = p.apellidos || '';
    return (n[0] + (a[0] || '')).toUpperCase();
  }

  async saveAll() {
    this.loading.set(true);
    try {
      const toUpsert = this.pasajeros().map((p) => {
        const item: LocalPasajeroItemDto = {
          pasajeroId: p.pasajeroId || undefined,
          asistencia: p.asistencia,
          dni: p.dni || undefined,
          nombres: p.nombres || undefined,
          apellidos: p.apellidos || undefined,
        };
        return item;
      });

      await this.viajeService.upsertPasajeros(this.viaje().id, { pasajeros: toUpsert });
      this.toastService.success('Cambios guardados correctamente');
      this.closeModal();
      this.onDataChange.emit();
    } catch (error) {
      console.error('Error guardando cambios', error);
      this.toastService.error('Error al guardar cambios');
    } finally {
      this.loading.set(false);
    }
  }

  exportarPDF() {
    if (!this.viaje()) return;
    try {
      generateManifiestoPasajerosPdf(this.viaje(), this.pasajeros());
      this.toastService.success('PDF generado con éxito');
    } catch (error) {
      console.error('Error generando PDF', error);
      this.toastService.error('Error al generar el PDF');
    }
  }
}

