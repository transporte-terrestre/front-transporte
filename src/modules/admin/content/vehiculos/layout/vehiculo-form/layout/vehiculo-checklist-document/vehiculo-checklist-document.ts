import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ApiResponse } from 'api/backend.api';
import { ChecklistIpercContinuo } from './layout/checklist-iperc-continuo/checklist-iperc-continuo';
import { ChecklistHojaInspeccion } from './layout/checklist-hoja-inspeccion/checklist-hoja-inspeccion';
import { ChecklistInspeccionDocumentos } from './layout/checklist-inspeccion-documentos/checklist-inspeccion-documentos';
import { ChecklistLuces } from './layout/checklist-luces/checklist-luces';
import { ChecklistCinturones } from './layout/checklist-cinturones/checklist-cinturones';
import { ChecklistHerramientas } from './layout/checklist-herramientas/checklist-herramientas';
import { ChecklistBotiquines } from './layout/checklist-botiquines/checklist-botiquines';
import { ChecklistKitAntiderrames } from './layout/checklist-kit-antiderrames/checklist-kit-antiderrames';
import { ChecklistRevisionVehiculos } from './layout/checklist-revision-vehiculos/checklist-revision-vehiculos';
import { ModalInfo } from '@module/admin/components/modal-info/modal-info';

@Component({
  selector: 'app-vehiculo-checklist-document',
  standalone: true,
  imports: [
    CommonModule,
    ChecklistIpercContinuo,
    ChecklistHojaInspeccion,
    ChecklistInspeccionDocumentos,
    ChecklistLuces,
    ChecklistCinturones,
    ChecklistHerramientas,
    ChecklistBotiquines,
    ChecklistKitAntiderrames,
    ChecklistRevisionVehiculos,
    ModalInfo,
  ],
  templateUrl: './vehiculo-checklist-document.html',
  styleUrls: ['./vehiculo-checklist-document.css'],
})
export class VehiculoChecklistDocumentComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);

  // Inputs
  vehiculoId = input.required<number>();

  // State
  checklistItems = signal<ApiResponse<'viajes', 'findChecklistItem'>[]>([]);
  selectedItem = signal<ApiResponse<'viajes', 'findChecklistItem'> | null>(null);
  history = signal<any[]>([]);
  loading = signal<boolean>(false);

  // Pagination state (for later use, currently simplified)
  page = signal<number>(1);
  limit = signal<number>(10);
  total = signal<number>(0);

  // Modal State
  showingDetail = signal<boolean>(false);
  detailData = signal<any>(null);

  async ngOnInit() {
    await this.loadChecklistItems();
  }

  async loadChecklistItems() {
    try {
      this.loading.set(true);
      const items = await this.vehiculoService.findAllCheckListItems();
      this.checklistItems.set(items);

      // Auto-select first item if available
      if (items.length > 0) {
        this.selectItem(items[0]);
      }
    } catch (error) {
      console.error('Error loading checklist items', error);
    } finally {
      this.loading.set(false);
    }
  }

  async selectItem(item: ApiResponse<'viajes', 'findChecklistItem'>) {
    this.selectedItem.set(item);
    this.page.set(1); // Reset page
    await this.loadHistory();
  }

  async loadHistory() {
    const item = this.selectedItem();
    const vId = this.vehiculoId();

    if (!item || !vId) return;

    try {
      this.loading.set(true);
      const result = await this.vehiculoService.findChecklistHistory({
        id: vId,
        checklistItemId: item.id,
        page: this.page(),
        limit: this.limit(),
      });

      this.history.set(result.data);
      this.total.set(result.meta.total);
    } catch (error) {
      console.error('Error loading history', error);
      this.history.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  async openDetail(doc: any) {
    const item = this.selectedItem();
    if (!item || !doc?.id) return;

    // Extract document ID from the history object
    const documentId = doc.id;

    // Logic to fetch based on type
    const normalizedName = item.nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    try {
      if (normalizedName.includes('iperc')) {
        const data = await this.vehiculoService.findChecklistIpercContinuo(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('hoja') && normalizedName.includes('inspeccion')) {
        const data = await this.vehiculoService.findChecklistHojaInspeccion(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('inspeccion') && normalizedName.includes('documentos')) {
        const data = await this.vehiculoService.findChecklistInspeccionDocumentos(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('luces')) {
        const data = await this.vehiculoService.findChecklistLuces(this.vehiculoId(), documentId);
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('cinturon')) {
        const data = await this.vehiculoService.findChecklistCinturones(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('herramienta')) {
        const data = await this.vehiculoService.findChecklistHerramientas(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('botiquin')) {
        const data = await this.vehiculoService.findChecklistBotiquines(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('derrames')) {
        const data = await this.vehiculoService.findChecklistKitAntiderrames(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else if (normalizedName.includes('revision')) {
        const data = await this.vehiculoService.findChecklistRevisionVehiculos(
          this.vehiculoId(),
          documentId,
        );
        this.detailData.set(data);
        this.showingDetail.set(true);
      } else {
        console.warn('Detail view not implemented for:', item.nombre);
      }
    } catch (e) {
      console.error('Error fetching detail', e);
    }
  }

  closeDetail() {
    this.showingDetail.set(false);
    this.detailData.set(null);
  }
}
