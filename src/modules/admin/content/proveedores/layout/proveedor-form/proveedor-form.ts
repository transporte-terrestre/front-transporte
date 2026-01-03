import { Component, inject, input, output, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { ImagesUpload } from '@module/admin/components/images-upload/images-upload';
import {
  DocumentsDateUpload,
  DocumentWithDate,
} from '../../../../components/documents-date-upload/documents-date-upload';
import { ProveedorService } from '@service/admin/proveedor.service';
import { ToastService } from '@service/toast.service';
import { getErrorMessage } from '@helper/error.helper';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ImagesUpload, DocumentsDateUpload],
  templateUrl: './proveedor-form.html',
  styleUrl: './proveedor-form.css',
})
export class ProveedorForm implements OnInit {
  private fb = inject(FormBuilder);
  private proveedorService = inject(ProveedorService);
  private toastService = inject(ToastService);

  // Inputs
  proveedor = input<ApiResponse<'proveedores', 'findOne'> | null>(null);
  editMode = input<boolean>(false);

  // Outputs
  onSubmitForm = output<ApiBody<'proveedores', 'create'> | ApiBody<'proveedores', 'update'>>();

  // State
  imagenes = signal<string[]>([]);
  localDocuments = signal<ApiResponse<'proveedores', 'findOne'>['documentos'] | null>(null);

  proveedorForm: FormGroup = this.fb.group({
    tipoDocumento: ['DNI', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(20)]],
    ruc: ['', [Validators.maxLength(20)]],
    nombres: ['', [Validators.maxLength(100)]],
    apellidos: ['', [Validators.maxLength(100)]],
    razonSocial: ['', [Validators.maxLength(200)]],
    email: ['', [Validators.email, Validators.maxLength(100)]],
    telefono: ['', [Validators.maxLength(20)]],
    direccion: ['', [Validators.maxLength(255)]],
  });

  documentTypes: {
    value: string;
    label: string;
  }[] = [
    { value: 'dni', label: 'DNI' },
    { value: 'ruc', label: 'RUC' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'otros', label: 'Otros' },
  ];

  constructor() {
    effect(() => {
      const proveedorData = this.proveedor();
      const isEditMode = this.editMode();

      if (isEditMode && proveedorData) {
        this.proveedorForm.patchValue({
          tipoDocumento: proveedorData.tipoDocumento,
          dni: proveedorData.dni || '',
          ruc: proveedorData.ruc || '',
          nombres: proveedorData.nombres || '',
          apellidos: proveedorData.apellidos || '',
          razonSocial: proveedorData.razonSocial || '',
          email: proveedorData.email || '',
          telefono: proveedorData.telefono || '',
          direccion: proveedorData.direccion || '',
        });
        this.imagenes.set(proveedorData.imagenes || []);
        this.localDocuments.set(JSON.parse(JSON.stringify(proveedorData.documentos)));
      } else {
        this.proveedorForm.reset({ tipoDocumento: 'DNI' });
        this.imagenes.set([]);
        this.localDocuments.set(null);
      }
    });
  }

  ngOnInit() {
    this.proveedorForm.get('tipoDocumento')?.valueChanges.subscribe((tipo) => {
      const dniControl = this.proveedorForm.get('dni');
      const rucControl = this.proveedorForm.get('ruc');
      const nombresControl = this.proveedorForm.get('nombres');
      const apellidosControl = this.proveedorForm.get('apellidos');
      const razonSocialControl = this.proveedorForm.get('razonSocial');

      if (tipo === 'DNI') {
        dniControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        nombresControl?.setValidators([Validators.required, Validators.maxLength(100)]);
        apellidosControl?.setValidators([Validators.required, Validators.maxLength(100)]);

        rucControl?.clearValidators();
        razonSocialControl?.clearValidators();
      } else {
        rucControl?.setValidators([Validators.required, Validators.maxLength(20)]);
        razonSocialControl?.setValidators([Validators.required, Validators.maxLength(200)]);

        dniControl?.clearValidators();
        nombresControl?.clearValidators();
        apellidosControl?.clearValidators();
      }

      dniControl?.updateValueAndValidity();
      rucControl?.updateValueAndValidity();
      nombresControl?.updateValueAndValidity();
      apellidosControl?.updateValueAndValidity();
      razonSocialControl?.updateValueAndValidity();
    });
  }

  onImagesChange(images: string[]) {
    this.imagenes.set(images);
  }

  submitForm() {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    const formData = this.proveedorForm.value;
    const cleanData: any = {
      tipoDocumento: formData.tipoDocumento,
      imagenes: this.imagenes(),
    };

    if (formData.tipoDocumento === 'DNI') {
      cleanData.dni = formData.dni;
      cleanData.nombres = formData.nombres;
      cleanData.apellidos = formData.apellidos;
    } else {
      cleanData.ruc = formData.ruc;
      cleanData.razonSocial = formData.razonSocial;
    }

    if (formData.email) cleanData.email = formData.email;
    if (formData.telefono) cleanData.telefono = formData.telefono;
    if (formData.direccion) cleanData.direccion = formData.direccion;

    if (this.editMode()) {
      this.onSubmitForm.emit(cleanData as ApiBody<'proveedores', 'update'>);
    } else {
      this.onSubmitForm.emit(cleanData as ApiBody<'proveedores', 'create'>);
    }
  }

  handleDocumentUpload(
    event: DocumentWithDate,
    tipo: string
  ) {
    if (!this.proveedor()) return;

    const documento: ApiBody<'proveedores', 'createDocumento'> = {
      proveedorId: this.proveedor()!.id,
      tipo: tipo,
      numero: event.nombre,
      archivos: [event.url],
      fechaEmision: event.fechaEmision,
      fechaVencimiento: event.fechaExpiracion,
    };

    this.proveedorService
      .createDocumento(documento)
      .then(() => {
        this.toastService.success('Documento guardado exitosamente');
      })
      .catch((err) => {
        console.error('Error al guardar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al guardar documento'));
      });
  }

  handleDocumentUpdate(event: { id: number; fechaEmision: string; fechaExpiracion: string }) {
    this.proveedorService
      .updateDocumento(event.id, {
        fechaEmision: event.fechaEmision,
      })
      .then(() => {
        this.toastService.success('Documento actualizado exitosamente');
      })
      .catch((err) => {
        console.error('Error al actualizar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al actualizar documento'));
      });
  }

  deleteDocument(id: number, tipo: string) {
    this.proveedorService
      .deleteDocumento(id)
      .then(() => {
        this.toastService.success('Documento eliminado exitosamente');
      })
      .catch((err) => {
        console.error('Error al eliminar documento:', err);
        this.toastService.error(getErrorMessage(err, 'Error al eliminar documento'));
      });
  }

  getDocuments(tipo: string): any[] {
    return [];
  }
}
