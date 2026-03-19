import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField, MantenimientoDocumentoResultDto } from 'api/backend.api';
import { VehiculoInputSearch } from '@module/admin/components/input-searchs/vehiculo-input-search/vehiculo-input-search';
import { TallerInputSearch } from '@module/admin/components/input-searchs/taller-input-search/taller-input-search';
import { TallerSucursalInputSearch } from '@module/admin/components/input-searchs/taller-sucursal-input-search/taller-sucursal-input-search';
import { MantenimientoTareasForm } from './content/mantenimiento-tareas-form/mantenimiento-tareas-form';
import {
  DocumentsDateUpload,
  DocumentWithDate,
  DocumentItem,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';

export interface PendingMantenimientoDocument {
  tipo: keyof ApiResponse<'mantenimientos', 'findOne'>['documentos'];
  data: DocumentWithDate;
  tempId: number;
}

export type MantenimientoFormSubmitData =
  | (ApiBody<'mantenimientos', 'create'> & { documentos?: PendingMantenimientoDocument[] })
  | ApiBody<'mantenimientos', 'update'>;

@Component({
  selector: 'app-mantenimiento-form',
  imports: [
    ReactiveFormsModule,
    VehiculoInputSearch,
    TallerInputSearch,
    TallerSucursalInputSearch,
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
  onSubmitForm = output<MantenimientoFormSubmitData>();
  onDataChange = output<void>();

  // State
  localDocuments = signal<ApiResponse<'mantenimientos', 'findOne'>['documentos'] | null>({} as any);
  pendingDocuments = signal<PendingMantenimientoDocument[]>([]);
  selectedTallerId = signal<number | null>(null);
  private tempIdCounter = 0;

  mantenimientoForm: FormGroup = this.fb.group({
    vehiculo: [null, [Validators.required]],
    taller: [null, [Validators.required]],
    sucursal: [null],
    codigoOrden: [{ value: '', disabled: true }],
    tipo: ['preventivo', [Validators.required]],
    costoTotal: ['', [Validators.required, Validators.min(0)]],
    descripcion: ['', [Validators.required, Validators.minLength(10)]],
    fechaIngresoDate: ['', [Validators.required]],
    fechaIngresoTime: ['00:00', [Validators.required]],
    fechaSalidaDate: [''],
    fechaSalidaTime: ['00:00'],
    kilometraje: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
    kilometrajeProximoMantenimiento: ['', [Validators.required, Validators.min(0)]],
    estado: ['pendiente', [Validators.required]],
    marcarEnTaller: [false],
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
    requireIssue?: boolean;
    requireExpiration?: boolean;
  }[] = [
    { value: 'factura', label: 'Factura', requireIssue: false, requireExpiration: false },
    { value: 'guia_remision', label: 'Guía de Remisión', requireIssue: false, requireExpiration: false },
    { value: 'informe_tecnico', label: 'Informe Técnico', requireIssue: false, requireExpiration: false },
    { value: 'cotizacion', label: 'Cotización', requireIssue: false, requireExpiration: false },
    { value: 'fotos', label: 'Fotos', requireIssue: false, requireExpiration: false },
    { value: 'cartilla', label: 'Cartilla', requireIssue: false, requireExpiration: false },
    { value: 'otros', label: 'Otros', requireIssue: false, requireExpiration: false },
  ];

  constructor() {
    effect(() => {
      const mantenimientoData = this.mantenimiento();
      const isEditMode = this.editMode();
      const dateSelected = this.selectedDate();

      if (isEditMode && mantenimientoData) {
        this.selectedTallerId.set(mantenimientoData.tallerId || null);
        this.mantenimientoForm.patchValue({
          vehiculo: mantenimientoData.vehiculoId,
          taller: mantenimientoData.tallerId,
          sucursal: mantenimientoData.sucursalId,
          codigoOrden: mantenimientoData.codigoOrden,
          tipo: mantenimientoData.tipo,
          costoTotal: mantenimientoData.costoTotal,
          descripcion: mantenimientoData.descripcion,
          fechaIngresoDate: mantenimientoData.fechaIngreso
            ? mantenimientoData.fechaIngreso.split('T')[0]
            : '',
          fechaIngresoTime: mantenimientoData.fechaIngreso
            ? mantenimientoData.fechaIngreso.split('T')[1]?.substring(0, 5) || '00:00'
            : '00:00',
          fechaSalidaDate: mantenimientoData.fechaSalida
            ? mantenimientoData.fechaSalida.split('T')[0]
            : '',
          fechaSalidaTime: mantenimientoData.fechaSalida
            ? mantenimientoData.fechaSalida.split('T')[1]?.substring(0, 5) || '00:00'
            : '00:00',
          kilometraje: mantenimientoData.kilometraje,
          kilometrajeProximoMantenimiento: mantenimientoData.kilometrajeProximoMantenimiento,
          estado: mantenimientoData.estado,
        });
        this.localDocuments.set(JSON.parse(JSON.stringify(mantenimientoData.documentos)));
      } else {
        const entryDate = dateSelected || new Date();
        const exitDate = new Date(entryDate);
        exitDate.setDate(entryDate.getDate() + 1);

        this.mantenimientoForm.reset({
          tipo: 'preventivo',
          estado: 'pendiente',
          fechaIngresoDate: entryDate.toISOString().split('T')[0],
          fechaIngresoTime: '00:00',
          fechaSalidaDate: exitDate.toISOString().split('T')[0],
          fechaSalidaTime: '00:00',
        });
        this.localDocuments.set({} as any);
        this.pendingDocuments.set([]);
      }
    });

    // Escuchar cambios en vehículo para setear kilometraje automáticamente
    this.mantenimientoForm.get('vehiculo')?.valueChanges.subscribe((vehiculo) => {
      if (vehiculo && typeof vehiculo === 'object') {
        const vehiculoData = vehiculo as {
          kilometraje?: number;
          kilometrajeMantenimiento?: number;
        };

        const kmActual = vehiculoData.kilometraje ?? 0;
        const kmIntervalo = vehiculoData.kilometrajeMantenimiento ?? 0;

        this.mantenimientoForm.patchValue({
          kilometraje: kmActual,
          kilometrajeProximoMantenimiento: kmActual + kmIntervalo,
        });
      }
    });

    // Escuchar cambios en taller para resetear sucursal y actualizar id
    this.mantenimientoForm.get('taller')?.valueChanges.subscribe((taller) => {
      this.mantenimientoForm.patchValue({ sucursal: null }, { emitEvent: false });
      if (taller && typeof taller === 'object') {
        this.selectedTallerId.set(taller.id || null);
      } else if (taller && typeof taller === 'number') {
        this.selectedTallerId.set(taller);
      } else {
        this.selectedTallerId.set(null);
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
    const formData: MantenimientoFormSubmitData = {
      vehiculoId: formValue.vehiculo?.id
        ? Number(formValue.vehiculo.id)
        : Number(formValue.vehiculo),
      tallerId: formValue.taller?.id ? Number(formValue.taller.id) : Number(formValue.taller),
      sucursalId: (formValue.sucursal?.id
        ? Number(formValue.sucursal.id)
        : formValue.sucursal
          ? Number(formValue.sucursal)
          : undefined) as any,
      tipo: formValue.tipo,
      costoTotal: String(formValue.costoTotal),
      descripcion: formValue.descripcion,
      fechaIngreso: formValue.fechaIngresoDate
        ? `${formValue.fechaIngresoDate}T${formValue.fechaIngresoTime || '00:00'}:00.000Z`
        : '',
      fechaSalida: formValue.fechaSalidaDate
        ? `${formValue.fechaSalidaDate}T${formValue.fechaSalidaTime || '00:00'}:00.000Z`
        : '',
      kilometraje: Number(formValue.kilometraje),
      kilometrajeProximoMantenimiento: Number(formValue.kilometrajeProximoMantenimiento),
      estado: formValue.estado,
      marcarEnTaller: formValue.marcarEnTaller || false,
      documentos: !this.editMode() ? this.pendingDocuments() : undefined,
    };

    this.onSubmitForm.emit(formData);
  }

  // Document Management
  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>,
  ) {
    if (!this.editMode()) {
      // Creation mode: save locally with a temporary ID
      const tempId = --this.tempIdCounter;
      const doc = {
        ...event,
        id: tempId,
        tipo: tipo,
      } as any;
      this.addDocumentToLocalList(doc);
      this.pendingDocuments.update((prev) => [...prev, { tipo, data: event, tempId }]);
      return;
    }

    if (!this.mantenimiento()) return;

    const documento: ApiBody<'mantenimientos', 'createDocumento'> = {
      mantenimientoId: this.mantenimiento()!.id,
      tipo: tipo as any,
      nombre: event.nombre,
      url: event.url,
      ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
      ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
    };

    this.mantenimientoService
      .createDocumento(documento)
      .then((doc) => {
        this.toastService.success('Documento guardado exitosamente');
        this.addDocumentToLocalList(doc as any);
      })
      .catch((err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error('Error al guardar documento');
      });
  }

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    if (event.id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) =>
        prev.map((d) =>
          d.tempId === event.id
            ? {
                ...d,
                data: {
                  ...d.data,
                  fechaEmision: event.fechaEmision,
                  fechaExpiracion: event.fechaExpiracion,
                },
              }
            : d,
        ),
      );
      // Also update local list for UI
      const docs = this.localDocuments();
      if (docs) {
        const newDocs = { ...docs };
        for (const tipo in newDocs) {
          const t = tipo as keyof ApiField<'mantenimientos', 'findOne', 'documentos'>;
          if (newDocs[t]) {
            newDocs[t] = (newDocs[t] as any[]).map((d) =>
              d.id === event.id
                ? {
                    ...d,
                    fechaEmision: event.fechaEmision,
                    fechaExpiracion: event.fechaExpiracion,
                  }
                : d,
            ) as any;
          }
        }
        this.localDocuments.set(newDocs);
      }
      return;
    }

    this.mantenimientoService
      .updateDocumento(event.id, {
        ...(event.fechaEmision ? { fechaEmision: event.fechaEmision } : {}),
        ...(event.fechaExpiracion ? { fechaExpiracion: event.fechaExpiracion } : {}),
      })
      .then((doc) => {
        this.toastService.success('Documento actualizado exitosamente');
        this.updateDocumentInLocalList(doc as any);
      })
      .catch((err) => {
        console.error('Error al actualizar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
      });
  }

  deleteDocument(id: number, tipo: keyof ApiField<'mantenimientos', 'findOne', 'documentos'>) {
    if (id < 0) {
      // Pending document in creation mode
      this.pendingDocuments.update((prev) => prev.filter((d) => d.tempId !== id));
      this.removeDocumentFromLocalList(id, tipo);
      return;
    }

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
