import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ruta-form-map',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-form-map.html',
})
export class RutaFormMap {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) mapId!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) distanceControlName!: string;
  @Input({ required: true }) timeControlName!: string;
}
