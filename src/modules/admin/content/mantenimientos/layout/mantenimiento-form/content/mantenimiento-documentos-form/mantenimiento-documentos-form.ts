import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiResponse, ApiBody, ApiField } from 'api/backend.api';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { StorageService } from '@service/admin/storage.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-mantenimiento-documentos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mantenimiento-documentos-form.html',
  styleUrl: './mantenimiento-documentos-form.css',
})
export class MantenimientoDocumentosForm {
  private fb = inject(FormBuilder);
  private mantenimientoService = inject(MantenimientoService);
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  mantenimiento = input.required<ApiResponse<'mantenimientos', 'findOne'>>();
  onDataChange = output<void>();

  allDocumentos = computed(() => {
    const docs = this.mantenimiento().documentos;
    if (!docs) return [];
    return Object.values(docs).flat();
  });

  showDocumentoModal = signal(false);
  uploading = signal(false);
  pendingFile: File | null = null;
  editingDocId = signal<number | null>(null);
  editingDocUrl: string | null = null;

  addDocumentoForm = this.fb.group({
    nombre: ['', Validators.required],
    tipo: ['otros', Validators.required],
    descripcion: [''],
  });

  openAddDocumento() {
    this.editingDocId.set(null);
    this.editingDocUrl = null;
    this.pendingFile = null;
    this.addDocumentoForm.reset({ tipo: 'otros' });
    this.showDocumentoModal.set(true);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.pendingFile = file;
    // If not already in modal (e.g. from top button), open it
    if (!this.showDocumentoModal()) {
      this.openAddDocumento();
      // Restore pending file as openAddDoc resets it
      this.pendingFile = file;
    }

    this.addDocumentoForm.patchValue({
      nombre: file.name,
    });

    // Reset the input so same file can be selected again
    event.target.value = '';
  }

  editDocument(doc: ApiField<'mantenimientos', 'findOne', 'documentos'>['otros'][number]) {
    this.editingDocId.set(doc.id);
    this.editingDocUrl = doc.url;
    this.pendingFile = null;

    this.addDocumentoForm.patchValue({
      nombre: doc.nombre,
      tipo: doc.tipo,
    });
    this.showDocumentoModal.set(true);
  }

  closeAddDocumento() {
    this.showDocumentoModal.set(false);
    this.pendingFile = null;
    this.editingDocId.set(null);
    this.editingDocUrl = null;
    this.addDocumentoForm.reset();
  }

  saveDocumento() {
    if (this.addDocumentoForm.invalid) {
      this.addDocumentoForm.markAllAsTouched();
      return;
    }

    if (!this.editingDocId() && !this.pendingFile) {
      this.toastService.error('Debes seleccionar un archivo');
      return;
    }

    this.uploading.set(true);

    // Helper to process the save after getting URL
    const processSave = (url: string) => {
      const val = this.addDocumentoForm.value;
      const tipo = val.tipo as
        | 'otros'
        | 'factura'
        | 'guia_remision'
        | 'informe_tecnico'
        | 'cotizacion'
        | 'fotos';

      if (this.editingDocId()) {
        const updateDto: ApiBody<'mantenimientos', 'updateDocumento'> = {
          nombre: val.nombre!,
          tipo: tipo,
          url: url,
        };
        this.mantenimientoService
          .updateDocumento(this.editingDocId()!, updateDto)
          .then(() => {
            this.toastService.success('Documento actualizado');
            this.closeAddDocumento();
            this.onDataChange.emit();
          })
          .catch(() => this.toastService.error('Error al actualizar documento'))
          .finally(() => this.uploading.set(false));
      } else {
        const createDto: ApiBody<'mantenimientos', 'createDocumento'> = {
          mantenimientoId: this.mantenimiento().id,
          nombre: val.nombre!,
          url: url,
          tipo: tipo,
        };
        this.mantenimientoService
          .createDocumento(createDto)
          .then(() => {
            this.toastService.success('Documento agregado');
            this.closeAddDocumento();
            this.onDataChange.emit();
          })
          .catch(() => this.toastService.error('Error al guardar documento'))
          .finally(() => this.uploading.set(false));
      }
    };

    if (this.pendingFile) {
      this.storageService
        .upload(this.pendingFile, 'mantenimientos')
        .then((res) => processSave(res.secureUrl))
        .catch(() => {
          this.uploading.set(false);
          this.toastService.error('Error al subir archivo');
        });
    } else if (this.editingDocUrl) {
      processSave(this.editingDocUrl);
    } else {
      this.uploading.set(false);
    }
  }

  removeDocumento(documentoId: number) {
    this.alertService.delete(
      'Eliminar Documento',
      '¿Estás seguro de eliminar este documento?',
      () => {
        this.mantenimientoService
          .deleteDocumento(documentoId)
          .then(() => {
            this.toastService.success('Documento eliminado');
            this.onDataChange.emit();
          })
          .catch(() => this.toastService.error('Error al eliminar documento'));
      }
    );
  }
}
