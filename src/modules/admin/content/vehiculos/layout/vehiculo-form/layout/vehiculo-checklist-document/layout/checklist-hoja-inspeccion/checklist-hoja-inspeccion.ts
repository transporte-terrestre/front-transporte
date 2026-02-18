import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-hoja-inspeccion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-hoja-inspeccion.html',
  styleUrls: ['./checklist-hoja-inspeccion.css'],
})
export class ChecklistHojaInspeccion {
  data = input<ApiResponse<'vehiculos', 'findHojaInspeccion'> | null>(null);

  getDots(color: string): number[] {
    switch (color) {
      case 'rojo':
        return [1, 2, 3];
      case 'amarillo':
        return [1, 2];
      case 'verde':
        return [1];
      default:
        return [];
    }
  }

  getDotClass(color: string): string {
    switch (color) {
      case 'rojo':
        return 'bg-danger';
      case 'amarillo':
        return 'bg-warning';
      case 'verde':
        return 'bg-success';
      default:
        return 'bg-text/20';
    }
  }

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }
}
