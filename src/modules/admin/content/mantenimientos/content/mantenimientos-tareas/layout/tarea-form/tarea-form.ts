import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareaResultDto } from '@interface/admin/mantenimiento.interface';

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarea-form.html',
  styleUrl: './tarea-form.css',
})
export class TareaForm {
  private fb = inject(FormBuilder);

  tarea = input<TareaResultDto | null>(null);
  onSubmit = output<{ codigo: string; descripcion: string }>();
  onCancel = output<void>();

  tareaForm: FormGroup = this.fb.group({
    codigo: ['', [Validators.required, Validators.maxLength(50)]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  constructor() {
    effect(() => {
      const t = this.tarea();
      if (t) {
        this.tareaForm.patchValue({
          codigo: t.codigo,
          descripcion: t.descripcion,
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
