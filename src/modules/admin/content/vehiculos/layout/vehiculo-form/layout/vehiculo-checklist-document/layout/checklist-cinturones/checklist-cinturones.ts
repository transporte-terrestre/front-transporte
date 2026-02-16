import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-cinturones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-cinturones.html',
  styleUrls: ['./checklist-cinturones.css'],
})
export class ChecklistCinturones {
  data = input<ApiResponse<'vehiculos', 'findCinturones'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }

  getItems() {
    return this.entries(this.data()?.document || {});
  }

  get col1() {
    const items = this.getItems();
    return items.slice(0, Math.ceil(items.length / 2));
  }

  get col2() {
    const items = this.getItems();
    return items.slice(Math.ceil(items.length / 2));
  }
}
