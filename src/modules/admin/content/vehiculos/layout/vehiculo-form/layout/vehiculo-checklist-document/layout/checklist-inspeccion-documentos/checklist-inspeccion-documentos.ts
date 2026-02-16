import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-inspeccion-documentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checklist-inspeccion-documentos.html',
  styleUrls: ['./checklist-inspeccion-documentos.css'],
})
export class ChecklistInspeccionDocumentos {
  data = input<ApiResponse<'vehiculos', 'findInspeccionDocumentos'> | null>(null);

  entries(obj: any): { key: string; value: any }[] {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }
}
