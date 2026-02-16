import { Component, input } from '@angular/core';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-revision-vehiculos',
  standalone: true,
  imports: [],
  templateUrl: './checklist-revision-vehiculos.html',
  styleUrls: ['./checklist-revision-vehiculos.css'],
})
export class ChecklistRevisionVehiculos {
  data = input<ApiResponse<'vehiculos', 'findRevisionVehiculos'> | null>(null);
}
