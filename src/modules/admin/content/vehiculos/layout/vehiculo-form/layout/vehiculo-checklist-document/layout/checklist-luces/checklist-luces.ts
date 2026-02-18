import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-luces',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-luces.html',
  styleUrls: ['./checklist-luces.css'],
})
export class ChecklistLuces {
  data = input<ApiResponse<'vehiculos', 'findLuces'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }

  // Helper to get all items
  get items() {
    return this.entries(this.data()?.document || {});
  }
}
