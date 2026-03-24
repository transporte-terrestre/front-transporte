import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { TallerService } from '@service/admin/taller.service';
import { SucursalService } from '@service/admin/sucursal.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ApisPeruService } from '@service/out/apisperu.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { SucursalForm, SucursalData } from './layout/sucursal-form/sucursal-form';

@Component({
  selector: 'app-taller-form',
  imports: [CommonModule, ReactiveFormsModule, SucursalForm],
  templateUrl: './taller-form.html',
  styleUrl: './taller-form.css',
})
export class TallerForm implements OnInit {
  private fb = inject(FormBuilder);
  private tallerService = inject(TallerService);
  private sucursalService = inject(SucursalService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);
  private apisPeruService = inject(ApisPeruService);

  // Inputs
  taller = input<ApiResponse<'talleres', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'talleres', 'create'> | ApiBody<'talleres', 'update'>>();

  tallerForm: FormGroup = this.fb.group({
    ruc: ['', [Validators.pattern(/^$|^[0-9]{11}$/)]], // Permitir vacío o 11 dígitos
    razonSocial: ['', [Validators.required, Validators.minLength(2)]],
    nombreComercial: [''],
    tipo: ['externo', [Validators.required]],
    telefono: [''],
    email: ['', [Validators.email]],
  });

  tipos: Array<{ value: 'interno' | 'externo'; label: string; icon: string }> = [
    { value: 'interno', label: 'Interno', icon: 'fa-building' },
    { value: 'externo', label: 'Externo', icon: 'fa-globe' },
  ];

  // State
  searchingRuc = signal(false);

  // Sucursales Management
  sucursalesList = signal<SucursalData[]>([]);
  showSucursalModal = signal(false);
  selectedSucursal = signal<SucursalData | null>(null);

  constructor() {
    effect(() => {
      const tallerData = this.taller();
      const isEditMode = this.editMode();

      if (isEditMode && tallerData) {
        this.sucursalesList.set(tallerData.sucursales ? [...tallerData.sucursales] : []);
        
        this.tallerForm.patchValue(
          {
            ruc: tallerData.ruc,
            razonSocial: tallerData.razonSocial,
            nombreComercial: tallerData.nombreComercial,
            tipo: tallerData.tipo,
            telefono: tallerData.telefono,
            email: tallerData.email,
          },
          { emitEvent: false },
        );
      } else {
        this.tallerForm.reset({
          tipo: 'externo',
          ruc: '',
          razonSocial: '',
          nombreComercial: '',
          telefono: '',
          email: '',
        });
        this.sucursalesList.set([]);
      }
    });
  }

  ngOnInit() {
    // Autocompletado RUC
    this.tallerForm
      .get('ruc')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => value && value.length === 11),
      )
      .subscribe(async (ruc) => {
        try {
          this.searchingRuc.set(true);
          const data = await this.apisPeruService.getRuc(ruc);
          if (data && data.razonSocial) {
            this.tallerForm.patchValue({
              razonSocial: data.razonSocial,
            });
            this.toastService.success('RUC encontrado');
          }
        } catch (error) {
          console.error('Error al consultar RUC:', error);
          this.toastService.error('Error al consultar RUC');
        } finally {
          this.searchingRuc.set(false);
        }
      });
  }

  // Sucursales Methods
  loadSucursales() {
    const t = this.taller();
    if (!t) return;

    this.tallerService.findSucursalesByTaller(t.id)
      .then(res => {
        this.sucursalesList.set(res as SucursalData[]);
      })
      .catch(err => {
        console.error('Error al cargar sucursales:', err);
      });
  }

  openSucursalModal(sucursal: SucursalData | null = null) {
    this.selectedSucursal.set(sucursal);
    this.showSucursalModal.set(true);
  }

  closeSucursalModal() {
    this.showSucursalModal.set(false);
    this.selectedSucursal.set(null);
  }

  handleSaveSucursal(data: SucursalData) {
    if (!this.editMode() || !this.taller()) {
      // Logic for creation mode (currently hidden according to plan)
      return;
    }

    const tallerId = this.taller()!.id;
    const promise = data.id
      ? this.sucursalService.update(data.id, { ...data, tallerId })
      : this.sucursalService.create({ ...data, tallerId });

    promise
      .then(() => {
        this.toastService.success(
          data.id ? 'Sucursal actualizada exitosamente' : 'Sucursal creada exitosamente',
        );
        this.loadSucursales();
        this.closeSucursalModal();
      })
      .catch((err) => {
        console.error('Error al guardar sucursal:', err);
        this.toastService.error('Error al guardar sucursal');
      });
  }

  deleteSucursal(id: number | undefined) {
    if (!id) return;

    this.alertService.delete(
      'Eliminar sucursal',
      '¿Estás seguro de eliminar esta sucursal?',
      () => {
        this.sucursalService
          .delete(id)
          .then(() => {
            this.toastService.success('Sucursal eliminada exitosamente');
            this.loadSucursales();
          })
          .catch((err) => {
            console.error('Error al eliminar sucursal:', err);
            this.toastService.error('Error al eliminar sucursal');
          });
      },
    );
  }

  submitForm() {
    if (this.tallerForm.invalid) {
      this.tallerForm.markAllAsTouched();
      return;
    }

    const formData: any = { ...this.tallerForm.value };

    // Clean optional fields: convert empty strings to null
    const optionalFields = ['ruc', 'nombreComercial', 'telefono', 'email'];
    optionalFields.forEach((field) => {
      if (formData[field] === '') {
        formData[field] = null;
      }
    });

    if (this.editMode()) {
      this.onSubmitForm.emit(formData as unknown as ApiBody<'talleres', 'update'>);
    } else {
      this.onSubmitForm.emit(formData as unknown as ApiBody<'talleres', 'create'>);
    }
  }
}
