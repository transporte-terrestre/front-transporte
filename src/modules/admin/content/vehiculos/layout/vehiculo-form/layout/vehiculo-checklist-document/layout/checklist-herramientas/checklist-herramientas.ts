import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-herramientas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-herramientas.html',
  styleUrls: ['./checklist-herramientas.css'],
})
export class ChecklistHerramientas {
  data = input<ApiResponse<'vehiculos', 'findHerramientas'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }
}
