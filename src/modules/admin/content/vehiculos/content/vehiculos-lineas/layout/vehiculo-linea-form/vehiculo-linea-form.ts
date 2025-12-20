import { Component, inject, input, output, signal, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  MarcaResultDto,
  MarcaCreateDto,
  MarcaUpdateDto,
  ModeloResultDto,
  ModeloCreateDto,
} from '@interface/admin/vehiculo.interface';
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
  marca = input<MarcaResultDto | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitSuccess = output<void>();

  // State
  loading = signal(false);
  modelos = signal<ModeloResultDto[]>([]);

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
    return this.marcaForm.get('modelos') as FormArray;
  }

  loadModelos(marcaId: number) {
    console.log('loadModelos called with marcaId:', marcaId);
    this.vehiculoService.findAllModelos({ marcaId, limit: 100 }).subscribe({
      next: (response) => {
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
      },
      error: (err) => {
        console.error('Error loading modelos:', err);
        this.toastService.error('Error al cargar modelos');
      },
    });
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

  removeModelo(index: number) {
    const modelo = this.modelosArray.at(index).value;
    if (modelo.id && !modelo.isNew) {
      // Delete from API
      this.vehiculoService.deleteModelo(modelo.id).subscribe({
        next: () => {
          this.toastService.success('Modelo eliminado');
          this.modelosArray.removeAt(index);
        },
        error: (err) => {
          console.error('Error deleting modelo:', err);
          this.toastService.error('Error al eliminar modelo');
        },
      });
    } else {
      this.modelosArray.removeAt(index);
    }
  }

  markAsEdited(index: number) {
    const control = this.modelosArray.at(index);
    if (!control.value.isNew) {
      control.patchValue({ isEdited: true });
    }
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
        const updateData: MarcaUpdateDto = {
          nombre: this.marcaForm.value.nombre,
        };
        await this.vehiculoService.updateMarca(this.marca()!.id, updateData).toPromise();
        marcaId = this.marca()!.id;
        this.toastService.success('Marca actualizada');
      } else {
        // Create marca
        const createData: MarcaCreateDto = {
          nombre: this.marcaForm.value.nombre,
        };
        const marca = await this.vehiculoService.createMarca(createData).toPromise();
        marcaId = marca!.id;
        this.toastService.success('Marca creada');
      }

      // Process modelos
      for (const modeloControl of this.modelosArray.controls) {
        const modelo = modeloControl.value;

        if (modelo.isNew && modelo.nombre.trim()) {
          // Create new modelo
          const createModelo: ModeloCreateDto = {
            nombre: modelo.nombre,
            marcaId: marcaId,
          };
          await this.vehiculoService.createModelo(createModelo).toPromise();
        } else if (modelo.isEdited && modelo.id) {
          // Update existing modelo
          await this.vehiculoService.updateModelo(modelo.id, { nombre: modelo.nombre }).toPromise();
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
