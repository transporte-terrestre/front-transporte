import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-botiquines',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-botiquines.html',
  styleUrls: ['./checklist-botiquines.css'],
})
export class ChecklistBotiquines {
  data = input<ApiResponse<'vehiculos', 'findBotiquines'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }

  items = computed(() => {
    const doc = this.data()?.document;
    if (!doc) return [];
    return this.entries(doc).filter(
      (item) => typeof item.value === 'object' && item.key !== 'ubicacionBotiquin',
    );
  });

  ubicacion = computed(() => {
    const doc = this.data()?.document;
    return (doc as any)?.['ubicacionBotiquin'] || '';
  });
}
