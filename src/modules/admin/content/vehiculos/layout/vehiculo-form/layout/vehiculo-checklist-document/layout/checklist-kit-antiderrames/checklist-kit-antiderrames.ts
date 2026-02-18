import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-kit-antiderrames',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-kit-antiderrames.html',
  styleUrls: ['./checklist-kit-antiderrames.css'],
})
export class ChecklistKitAntiderrames {
  data = input<ApiResponse<'vehiculos', 'findKitAntiderrames'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }

  items = computed(() => {
    const doc = this.data()?.document;
    if (!doc) return [];
    return this.entries(doc).filter(
      (item) => typeof item.value === 'object' && item.key !== 'ubicacion',
    );
  });

  ubicacion = computed(() => {
    const doc = this.data()?.document;
    return (doc as any)?.['ubicacion'] || '';
  });
}
