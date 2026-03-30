import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ruta-form-sections',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ruta-form-sections.html',
})
export class RutaFormSections {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) paradasArray!: FormArray;
  @Input({ required: true }) type!: 'ida' | 'vuelta';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) legDistances!: number[];
  @Input() readonly: boolean = false;
  @Input() hasDestino: boolean = true;
  @Input() allowOpenRoute: boolean = true;
  @Input() disableDestinoToggle: boolean = false;

  @Input({ required: true }) origenControlName!: string;
  @Input({ required: true }) origenLatControlName!: string;
  @Input({ required: true }) origenLngControlName!: string;
  @Input({ required: true }) destinoControlName!: string;
  @Input({ required: true }) destinoLatControlName!: string;
  @Input({ required: true }) destinoLngControlName!: string;

  @Output() onAddParada = new EventEmitter<{ type: 'ida' | 'vuelta'; index: number }>();
  @Output() onRemoveParada = new EventEmitter<{ type: 'ida' | 'vuelta'; index: number }>();
  @Output() onRemoveDestino = new EventEmitter<{ type: 'ida' | 'vuelta' }>();
  @Output() onToggleDestino = new EventEmitter<{ type: 'ida' | 'vuelta'; value: boolean }>();

  getLegTimeControl(index: number): FormControl {
    if (index < this.paradasArray.controls.length) {
      return this.paradasArray.at(index).get('tiempoEstimado') as FormControl;
    }
    const destField = this.type === 'ida' ? 'tiempoEstimadoDestino' : 'tiempoEstimadoDestinoVuelta';
    return this.form.get(destField) as FormControl;
  }

  get showConnections(): boolean {
    return this.hasDestino || this.paradasArray.controls.length > 0;
  }
}
