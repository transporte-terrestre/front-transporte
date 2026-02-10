import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ClienteService } from '@service/admin/cliente.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApiResponse } from 'api/backend.api';

type ViajeData = ApiResponse<'viajes', 'findOne'>;

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

  showModal = signal(false);
  loading = signal(false);
  mode = signal<'list' | 'add'>('list');

  // Data
  pasajeros = signal<any[]>([]); // Pasajeros asignados al viaje
  clientePasajeros = signal<any[]>([]); // Pasajeros del cliente (para agregar)
  selectedIds = signal<Set<number>>(new Set());

  constructor() {
    effect(() => {
      const v = this.viaje();
      // Only load if we have a valid ID and we haven't loaded this ID yet (or if forced refresh logic is needed elsewhere)
      // To strictly prevent loop if 'v' object reference changes but ID is same:
      // Note: We use a local tracker or just check against current state if we store the ID?
      // Simplify: Just load. The issue is likely that loading causes a parent refresh.
      // We will add a check: if we are already loading or if the ID matches what we think we have...
      // But we don't store "loadedViajeId". Let's add it implicitly or just trust the 'loading' guard?
      // The user reported infinite loop which means the loading guard + effect combo isn't enough OR
      // 'loading' is toggling true/false fast enough.

      // Fix: Use untracked for the ID check maybe? No, we want to track 'viaje'.
      // Better Fix: Do not auto-load in effect if we can help it, or ensure we debounce/check ID.

      // Let's implement a simple ID check.
      if (v?.id && v.id !== this.lastLoadedViajeId()) {
        this.loadPasajeros();
        this.lastLoadedViajeId.set(v.id);
      }
    });
  }

  // New property to track last loaded ID to prevent loops from reference changes
  private lastLoadedViajeId = signal<number | null>(null);

  ngOnInit() {
    // We can use an effect here too if we want, or just relying on the constructor effect.
    // Let's rewrite the effect in constructor correctly.
  }

  openModal() {
    this.showModal.set(true);
    this.mode.set('list');
    this.loadPasajeros();
  }

  closeModal() {
    this.showModal.set(false);
    // this.onDataChange.emit(); // Removed to prevent full view reload
  }

  async loadPasajeros() {
    // Avoid loading if already loading
    if (this.loading()) return;

    this.loading.set(true);
    try {
      const data = await this.viajeService.findPasajeros(this.viaje().id);
      this.pasajeros.set(data);
      if (data.length === 0) {
        // Only if we are already in the modal and it's empty, we might want to suggest adding
        // But to avoid flickering, let's default to list unless explicitly opening for the first time
        if (this.pasajeros().length === 0 && this.mode() !== 'add') {
          this.switchToMode('add');
        }
      } else {
        // If we have data, ensure we are in list mode (unless user is already in add mode adding more?)
        // Better to just stay in list mode if data exists
        if (this.mode() === 'add' && this.pasajeros().length > 0) {
          // Keep in add mode if user wants to add more
        } else {
          this.mode.set('list');
        }
      }
    } catch (error) {
      console.error('Error cargando pasajeros', error);
      // Suppress toast on init load to avoid spam if just viewing form
    } finally {
      this.loading.set(false);
    }
  }

  async switchToMode(mode: 'list' | 'add') {
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
      const current = this.pasajeros().map((p) => ({
        pasajeroId: p.pasajeroId,
        asistencia: p.asistencia,
      }));
      // Add new ones with default asistencia = false
      const newPasajeros = ids.map((id) => ({ pasajeroId: id, asistencia: false }));

      const toUpsert = [...current, ...newPasajeros];

      await this.viajeService.upsertPasajeros(this.viaje().id, toUpsert);
      this.toastService.success('Pasajeros agregados correctamente');

      this.closeModal();
      this.onDataChange.emit();
    } catch (error) {
      console.error('Error agregando pasajeros', error);
      this.toastService.error('Error al agregar pasajeros');
      this.loading.set(false);
    }
  }

  // State for pending delete action only
  pendingDelete = signal<any | null>(null);

  removePasajero(pasajero: any) {
    this.pendingDelete.set(pasajero);
  }

  cancelDelete() {
    this.pendingDelete.set(null);
  }

  confirmDelete() {
    const pasajeroToDelete = this.pendingDelete();
    if (!pasajeroToDelete) return;

    // Local remove
    this.pasajeros.update((list) =>
      list.filter((p) => p.pasajeroId !== pasajeroToDelete.pasajeroId),
    );
    this.pendingDelete.set(null);
  }

  toggleAsistencia(pasajero: any) {
    // Local toggle
    this.pasajeros.update((list) =>
      list.map((p) =>
        p.pasajeroId === pasajero.pasajeroId ? { ...p, asistencia: !p.asistencia } : p,
      ),
    );
  }

  async saveAll() {
    this.loading.set(true);
    try {
      const toUpsert = this.pasajeros().map((p) => ({
        pasajeroId: p.pasajeroId,
        asistencia: p.asistencia,
      }));

      await this.viajeService.upsertPasajeros(this.viaje().id, toUpsert);
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
}
