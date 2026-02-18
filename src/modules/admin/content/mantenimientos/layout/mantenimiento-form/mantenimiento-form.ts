import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField, MantenimientoDocumentoResultDto } from 'api/backend.api';
import { VehiculoInputSearch } from '@module/admin/content/vehiculos/layout/vehiculo-input-search/vehiculo-input-search';
import { TallerInputSearch } from '@module/admin/content/talleres/layout/taller-input-search/taller-input-search';
import { MantenimientoTareasForm } from './content/mantenimiento-tareas-form/mantenimiento-tareas-form';
import {
  DocumentsDateUpload,
  DocumentWithDate,
  DocumentItem,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-mantenimiento-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VehiculoInputSearch,
    TallerInputSearch,
    MantenimientoTareasForm,
    DocumentsDateUpload,
  ],
  templateUrl: './mantenimiento-form.html',
  styleUrl: './mantenimiento-form.css',
})
export class MantenimientoForm implements OnInit {
  private fb = inject(FormBuilder);
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);

  // Inputs
  mantenimiento = input<ApiResponse<'mantenimientos', 'findOne'> | null>(null);
  editMode = input<boolean>(false);
  selectedDate = input<Date | null>(null);

  // Outputs
  onSubmitForm = output<
    ApiBody<'mantenimientos', 'create'> | ApiBody<'mantenimientos', 'update'>
  >();
  onDataChange = output<void>();

  // State
  localDocuments = signal<ApiResponse<'mantenimientos', 'findOne'>['documentos'] | null>(null);

  mantenimientoForm: FormGroup = this.fb.group({
    vehiculo: [null, [Validators.required]],
    taller: [null, [Validators.required]],
    codigoOrden: [{ value: '', disabled: true }],
    tipo: ['preventivo', [Validators.required]],
    costoTotal: ['', [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fechaIngreso: ['', [Validators.required]],
    fechaSalida: ['', [Validators.required]],
    kilometraje: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
    kilometrajeProximoMantenimiento: ['', [Validators.required, Validators.min(0)]],
    estado: ['pendiente', [Validators.required]],
  });

  tipos: Array<{
    value: ApiField<'mantenimientos', 'findOne', 'tipo'>;
    label: string;
    icon: string;
    color: string;
  }> = [
    { value: 'preventivo', label: 'Preventivo', icon: 'fa-shield-alt', color: 'text-info' },
    { value: 'correctivo', label: 'Correctivo', icon: 'fa-wrench', color: 'text-warning' },
  ];

  estados: Array<{
    value: ApiField<'mantenimientos', 'findOne', 'estado'>;
    label: string;
    icon: string;
    color: string;
  }> = [
    { value: 'pendiente', label: 'Pendiente', icon: 'fa-clock', color: 'text-info' },
    { value: 'en_proceso', label: 'En Proceso', icon: 'fa-tools', color: 'text-warning' },
    { value: 'finalizado', label: 'Finalizado', icon: 'fa-check-circle', color: 'text-success' },
  ];

  documentTypes: {
    value: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>;
    label: string;
  }[] = [
    { value: 'factura', label: 'Factura' },
    { value: 'guia_remision', label: 'Guía de Remisión' },
    { value: 'informe_tecnico', label: 'Informe Técnico' },
    { value: 'cotizacion', label: 'Cotización' },
    { value: 'fotos', label: 'Fotos' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    effect(() => {
      const mantenimientoData = this.mantenimiento();
      const isEditMode = this.editMode();
      const dateSelected = this.selectedDate();

      if (isEditMode && mantenimientoData) {
        this.mantenimientoForm.patchValue({
          vehiculo: mantenimientoData.vehiculoId,
          taller: mantenimientoData.tallerId,
          codigoOrden: mantenimientoData.codigoOrden,
          tipo: mantenimientoData.tipo,
          costoTotal: mantenimientoData.costoTotal,
          descripcion: mantenimientoData.descripcion,
          fechaIngreso: mantenimientoData.fechaIngreso
            ? this.formatDateTimeForInput(mantenimientoData.fechaIngreso)
            : '',
          fechaSalida: mantenimientoData.fechaSalida
            ? this.formatDateTimeForInput(mantenimientoData.fechaSalida)
            : '',
          kilometraje: mantenimientoData.kilometraje,
          kilometrajeProximoMantenimiento: mantenimientoData.kilometrajeProximoMantenimiento,
          estado: mantenimientoData.estado,
        });
        this.localDocuments.set(JSON.parse(JSON.stringify(mantenimientoData.documentos)));
      } else {
        const fechaInicial = dateSelected ? this.formatDateTimeForInput(dateSelected) : '';
        this.mantenimientoForm.reset({
          tipo: 'preventivo',
          estado: 'pendiente',
          fechaIngreso: fechaInicial,
        });
        this.localDocuments.set(null);
      }
    });

    // Escuchar cambios en vehículo para setear kilometraje automáticamente
    this.mantenimientoForm.get('vehiculo')?.valueChanges.subscribe((vehiculo) => {
      if (vehiculo && typeof vehiculo === 'object') {
        const vehiculoData = vehiculo as { kilometraje?: number };
        if (vehiculoData.kilometraje !== undefined) {
          this.mantenimientoForm.patchValue({
            kilometraje: vehiculoData.kilometraje,
          });
        }
      }
    });
  }

  ngOnInit() {}

  submitForm() {
    if (this.mantenimientoForm.invalid) {
      this.mantenimientoForm.markAllAsTouched();
      return;
    }

    const formValue = this.mantenimientoForm.getRawValue();
    const formData: ApiBody<'mantenimientos', 'create'> = {
      vehiculoId: formValue.vehiculo?.id
        ? Number(formValue.vehiculo.id)
        : Number(formValue.vehiculo),
      tallerId: formValue.taller?.id ? Number(formValue.taller.id) : Number(formValue.taller),
      tipo: formValue.tipo,
      costoTotal: String(formValue.costoTotal),
      descripcion: formValue.descripcion,
      fechaIngreso: formValue.fechaIngreso ? `${formValue.fechaIngreso}:00.000Z` : '',
      fechaSalida: formValue.fechaSalida ? `${formValue.fechaSalida}:00.000Z` : '',
      kilometraje: Number(formValue.kilometraje),
      kilometrajeProximoMantenimiento: Number(formValue.kilometrajeProximoMantenimiento),
      estado: formValue.estado,
    };

    this.onSubmitForm.emit(formData);
  }

  // Document Management
  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>,
  ) {
    if (!this.mantenimiento()) return;

    const documento: ApiBody<'mantenimientos', 'createDocumento'> = {
      mantenimientoId: this.mantenimiento()!.id,
      tipo: tipo,
      nombre: event.nombre,
      url: event.url,
      fechaEmision: event.fechaEmision,
      fechaExpiracion: event.fechaExpiracion,
    };

    this.mantenimientoService
      .createDocumento(documento)
      .then((doc) => {
        this.toastService.success('Documento guardado exitosamente');
        this.addDocumentToLocalList(doc);
      })
      .catch((err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error('Error al guardar documento');
      });
  }

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.mantenimientoService
      .updateDocumento(event.id, {
        fechaEmision: event.fechaEmision,
        fechaExpiracion: event.fechaExpiracion,
      })
      .then((doc) => {
        this.toastService.success('Documento actualizado exitosamente');
        this.updateDocumentInLocalList(doc);
      })
      .catch((err) => {
        console.error('Error al actualizar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
      });
  }

  deleteDocument(id: number, tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>) {
    this.mantenimientoService
      .deleteDocumento(id)
      .then(() => {
        this.toastService.success('Documento eliminado exitosamente');
        this.removeDocumentFromLocalList(id, tipo);
      })
      .catch((err) => {
        console.error('Error al eliminar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al eliminar documento'));
      });
  }

  private addDocumentToLocalList(
    doc: ApiField<'mantenimientos', 'findOne', 'documentos'>['factura'][number],
  ) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo;
      const newDocs = { ...docs };
      if (!newDocs[tipo]) {
        newDocs[tipo] = [];
      }
      newDocs[tipo] = [...(newDocs[tipo] || []), doc];
      this.localDocuments.set(newDocs);
    }
  }

  private updateDocumentInLocalList(
    doc: ApiField<'mantenimientos', 'findOne', 'documentos'>['factura'][number],
  ) {
    const docs = this.localDocuments();
    if (docs) {
      const tipo = doc.tipo;
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = (newDocs[tipo] || []).map((d) => (d.id === doc.id ? doc : d));
        this.localDocuments.set(newDocs);
      }
    }
  }

  private removeDocumentFromLocalList(
    id: number,
    tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>,
  ) {
    const docs = this.localDocuments();
    if (docs) {
      if (docs[tipo]) {
        const newDocs = { ...docs };
        newDocs[tipo] = (newDocs[tipo] || []).filter((d) => d.id !== id);
        this.localDocuments.set(newDocs);
      }
    }
  }

  getDocuments(tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>): DocumentItem[] {
    const docs = this.localDocuments();
    if (!docs) return [];
    const list = docs[tipo];
    return (list || []) as DocumentItem[];
  }

  formatDateTimeForInput(date: Date | string): string {
    if (typeof date === 'string' && date.indexOf('T') > -1) {
      return date.substring(0, 16);
    }

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
