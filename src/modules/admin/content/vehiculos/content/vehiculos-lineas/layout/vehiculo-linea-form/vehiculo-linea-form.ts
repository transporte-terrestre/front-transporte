import { Component, inject, input, output, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { VehiculoService } from '@service/admin/vehiculo.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-vehiculo-linea-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-linea-form.html',
  styleUrl: './vehiculo-linea-form.css',
})
export class VehiculoLineaForm {
  private fb = inject(FormBuilder);
  private vehiculoService = inject(VehiculoService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  // Inputs
  marca = input<ApiResponse<'vehiculos', 'findOneMarca'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitSuccess = output<void>();

  // State
  loading = signal(false);
  modelos = signal<ApiResponse<'vehiculos', 'findAllModelos'>['data']>([]);

  // Form
  marcaForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    modelos: this.fb.array([]),
  });

  constructor() {
    effect(
      () => {
        const marcaData = this.marca();
        const isEditMode = this.editMode();

        console.log('Effect triggered:', { marcaData, isEditMode });

        if (isEditMode && marcaData) {
          this.marcaForm.patchValue({
            nombre: marcaData.nombre,
          });
          this.loadModelos(marcaData.id);
        } else {
          this.marcaForm.reset();
          this.modelosArray.clear();
          this.modelos.set([]);
        }
      },
      { allowSignalWrites: true }
    );
  }

  get modelosArray(): FormArray {
    // @ts-ignore
    return this.marcaForm.get('modelos');
  }

  async loadModelos(marcaId: number) {
    console.log('loadModelos called with marcaId:', marcaId);
    try {
      const response = await this.vehiculoService.findAllModelos({ marcaId, limit: 100 });
      console.log('Modelos received:', response.data);
      console.log('ModelosArray before clear:', this.modelosArray.length);
      this.modelos.set(response.data);
      // Clear and rebuild array
      this.modelosArray.clear();
      response.data.forEach((modelo) => {
        this.modelosArray.push(
          this.fb.group({
            id: [modelo.id],
            nombre: [modelo.nombre, [Validators.required, Validators.minLength(1)]],
            isNew: [false],
            isEdited: [false],
          })
        );
      });
      console.log('ModelosArray after rebuild:', this.modelosArray.length);
      console.log('ModelosArray controls:', this.modelosArray.controls);
      // Force change detection
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loading modelos:', err);
      this.toastService.error('Error al cargar modelos');
    }
  }

  async removeModelo(index: number) {
    const modelo = this.modelosArray.at(index).value;
    if (modelo.id && !modelo.isNew) {
      // Delete from API
      try {
        await this.vehiculoService.deleteModelo(modelo.id);
        this.toastService.success('Modelo eliminado');
        this.modelosArray.removeAt(index);
      } catch (err) {
        console.error('Error deleting modelo:', err);
        this.toastService.error('Error al eliminar modelo');
      }
    } else {
      this.modelosArray.removeAt(index);
    }
  }

  addModelo() {
    this.modelosArray.push(
      this.fb.group({
        id: [null],
        nombre: ['', [Validators.required, Validators.minLength(1)]],
        isNew: [true],
        isEdited: [false],
      })
    );
  }

  markAsEdited(index: number) {
    const control = this.modelosArray.at(index);
    control.patchValue({ isEdited: true });
  }

  async submitForm() {
    if (this.marcaForm.invalid) {
      this.marcaForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      let marcaId: number;

      if (this.editMode() && this.marca()) {
        // Update marca
        const updateData: ApiBody<'vehiculos', 'updateMarca'> = {
          nombre: this.marcaForm.value.nombre,
        };
        await this.vehiculoService.updateMarca(this.marca()!.id, updateData);
        marcaId = this.marca()!.id;
        this.toastService.success('Marca actualizada');
      } else {
        // Create marca
        const createData: ApiBody<'vehiculos', 'createMarca'> = {
          nombre: this.marcaForm.value.nombre,
        };
        const marca = await this.vehiculoService.createMarca(createData);
        marcaId = marca!.id;
        this.toastService.success('Marca creada');
      }

      // Process modelos
      for (const modeloControl of this.modelosArray.controls) {
        const modelo = modeloControl.value;

        if (modelo.isNew && modelo.nombre.trim()) {
          // Create new modelo
          const createModelo: ApiBody<'vehiculos', 'createModelo'> = {
            nombre: modelo.nombre,
            marcaId: marcaId,
          };
          await this.vehiculoService.createModelo(createModelo);
        } else if (modelo.isEdited && modelo.id) {
          // Update existing modelo
          await this.vehiculoService.updateModelo(modelo.id, { nombre: modelo.nombre });
        }
      }

      this.loading.set(false);
      this.onSubmitSuccess.emit();
    } catch (error) {
      console.error('Error saving:', error);
      this.toastService.error('Error al guardar');
      this.loading.set(false);
    }
  }
}
