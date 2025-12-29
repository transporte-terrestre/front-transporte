import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea-form.html',
  styleUrl: './tarea-form.css',
})
export class TareaForm {
  private fb = inject(FormBuilder);

  tarea = input<ApiResponse<'mantenimientos', 'findAllTareas'>['data'][number] | null>(null);
  onSubmit = output<ApiBody<'mantenimientos', 'createTarea'>>();
  onCancel = output<void>();

  tareaForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    nombreTrabajo: ['', [Validators.required, Validators.maxLength(255)]],
    grupo: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    effect(() => {
      const t = this.tarea();
      if (t) {
        this.tareaForm.patchValue({
          codigo: t.codigo,
          nombreTrabajo: t.nombreTrabajo,
          grupo: t.grupo,
        });
      } else {
        this.tareaForm.reset();
      }
    });
  }

  submit() {
    if (this.tareaForm.invalid) {
      this.tareaForm.markAllAsTouched();
      return;
    }

    this.onSubmit.emit(this.tareaForm.value);
  }

  cancel() {
    this.onCancel.emit();
  }
}
