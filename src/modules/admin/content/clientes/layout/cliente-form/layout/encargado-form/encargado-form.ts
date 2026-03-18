import { Component, inject, input, output, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';
import { ToastService } from '@service/toast.service';

export interface EncargadoData {
  id?: number;
  clienteId: number;
  dni: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-encargado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './encargado-form.html',
  styleUrl: './encargado-form.css',
})
export class EncargadoForm implements OnInit {
  private fb = inject(FormBuilder);
  private apisPeruService = inject(ApisPeruService);
  private toastService = inject(ToastService);

  searchingDni = signal(false);

  encargado = input<EncargadoData | null>(null);
  clienteId = input.required<number>();

  onCancel = output<void>();
  onSave = output<EncargadoData>();

  form: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    effect(() => {
      const data = this.encargado();
      if (data) {
        this.form.patchValue({
          dni: data.dni,
          nombres: data.nombres,
          apellidos: data.apellidos,
        });
      } else {
        this.form.reset();
      }
    });
  }

  ngOnInit() {
    this.form
      .get('dni')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => value && value.length === 8),
      )
      .subscribe(async (dni) => {
        try {
          this.searchingDni.set(true);
          const data = await this.apisPeruService.getDni(dni);
          if (data.success) {
            this.form.patchValue({
              nombres: data.nombres,
              apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
            });
            this.toastService.success('DNI encontrado');
          }
        } catch (error) {
          console.error('Error al consultar DNI:', error);
          this.toastService.error('Error al consultar DNI');
        } finally {
          this.searchingDni.set(false);
        }
      });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const data: EncargadoData = {
      clienteId: this.clienteId(),
      dni: value.dni,
      nombres: value.nombres,
      apellidos: value.apellidos,
    };

    const currentEncargado = this.encargado();

    if (currentEncargado) {
      data.id = currentEncargado.id;
    }

    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
