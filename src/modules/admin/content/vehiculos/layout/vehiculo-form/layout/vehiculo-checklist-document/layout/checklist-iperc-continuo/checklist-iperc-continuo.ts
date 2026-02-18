import { Component, input } from '@angular/core';
import { ApiResponse } from '@api/backend.api';

@Component({
  selector: 'app-checklist-iperc-continuo',
  standalone: true,
  imports: [],
  templateUrl: './checklist-iperc-continuo.html',
  styleUrls: ['./checklist-iperc-continuo.css'],
})
export class ChecklistIpercContinuo {
  data = input<ApiResponse<'vehiculos', 'findIpercContinuo'> | null>(null);
}
