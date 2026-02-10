import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ChecklistItemResultDto } from 'api/backend.api';

@Component({
  selector: 'app-vehiculo-checklist-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehiculo-checklist-document.component.html',
  styleUrls: ['./vehiculo-checklist-document.component.css'],
})
export class VehiculoChecklistDocumentComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);

  // Inputs
  vehiculoId = input.required<number>();

  // State
  checklistItems = signal<ChecklistItemResultDto[]>([]);
  selectedItem = signal<ChecklistItemResultDto | null>(null);
  history = signal<any[]>([]); // We use any for now as the DTO is in backend
  loading = signal<boolean>(false);

  // Pagination state (for later use, currently simplified)
  page = signal<number>(1);
  limit = signal<number>(10);
  total = signal<number>(0);

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

  async selectItem(item: ChecklistItemResultDto) {
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
      const result = await this.vehiculoService.findChecklistHistory(
        vId,
        item.id,
        this.page(),
        this.limit(),
      );

      this.history.set(result.data);
      this.total.set(result.meta.total);
    } catch (error) {
      console.error('Error loading history', error);
      this.history.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
