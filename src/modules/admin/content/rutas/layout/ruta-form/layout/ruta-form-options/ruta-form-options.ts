import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ruta-form-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-form-options.html',
})
export class RutaFormOptions {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) tipoTrayecto!: 'ida' | 'vuelta' | 'ambos';
  @Input({ required: true }) esVueltaIgual!: boolean;

  @Output() tipoTrayectoChange = new EventEmitter<'ida' | 'vuelta' | 'ambos'>();
  @Output() toggleVuelta = new EventEmitter<void>();
}
