import { Component, inject, input, output, effect, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiBody } from 'api/backend.api';
import { ModalForm } from '../../../../../../components/modal-form/modal-form';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { ApisPeruService } from '@service/out/apisperu.service';
import { ToastService } from '@service/toast.service';

export interface PasajeroData {
  id?: number;
  clienteId: number;
  dni: string;
  nombres: string;
  apellidos: string;
}

@Component({
  selector: 'app-pasajero-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalForm],
  templateUrl: './pasajero-form.html',
  styleUrl: './pasajero-form.css',
})
export class PasajeroForm implements OnInit {
  private fb = inject(FormBuilder);
  private apisPeruService = inject(ApisPeruService);
  private toastService = inject(ToastService);

  searchingDni = signal(false);

  pasajero = input<PasajeroData | null>(null);
  clienteId = input.required<number>();

  onCancel = output<void>();
  onSave = output<PasajeroData>();

  form: FormGroup = this.fb.group({
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
  });

  constructor() {
    effect(() => {
      const data = this.pasajero();
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
    const data: any = {
      clienteId: this.clienteId(),
      dni: value.dni,
      nombres: value.nombres,
      apellidos: value.apellidos,
    };

    const currentPasajero = this.pasajero();

    if (currentPasajero) {
      data.id = currentPasajero.id;
    }

    this.onSave.emit(data);
  }

  cancel() {
    this.onCancel.emit();
  }
}
