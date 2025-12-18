import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MantenimientoResultDto,
  MantenimientoDocumentoCreateDto,
  MantenimientoDocumentoResultDto,
  MantenimientoDocumentoUpdateDto,
} from '@interface/admin/mantenimiento.interface';
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

  mantenimiento = input.required<MantenimientoResultDto>();
  onDataChange = output<void>();

  showDocumentoModal = signal(false);
  uploading = signal(false);
  pendingFile: File | null = null;
  editingDocId = signal<number | null>(null);
  editingDocUrl: string | null = null;

  addDocumentoForm = this.fb.group({
    nombre: ['', Validators.required],
    // url: ['', Validators.required], // URL is now handled by file upload or existing doc
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

  editDocument(doc: MantenimientoDocumentoResultDto) {
    this.editingDocId.set(doc.id);
    this.editingDocUrl = doc.url;
    this.pendingFile = null;

    this.addDocumentoForm.patchValue({
      nombre: doc.nombre,
      tipo: doc.tipo,
      descripcion: doc.descripcion,
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

    // Validation: Require file if creating new, or if editing but replacing file?
    // Actually, if editing, file is optional (keep existing). If creating, file is required.
    if (!this.editingDocId() && !this.pendingFile) {
      this.toastService.error('Debes seleccionar un archivo');
      return;
    }

    this.uploading.set(true);

    // Helper to process the save after getting URL
    const processSave = (url: string) => {
      const val = this.addDocumentoForm.value;

      if (this.editingDocId()) {
        const updateDto: MantenimientoDocumentoUpdateDto = {
          nombre: val.nombre!,
          tipo: val.tipo!,
          descripcion: val.descripcion || undefined,
          url: url,
        };
        this.mantenimientoService
          .updateDocumento(this.mantenimiento().id, this.editingDocId()!, updateDto)
          .pipe(finalize(() => this.uploading.set(false)))
          .subscribe({
            next: () => {
              this.toastService.success('Documento actualizado');
              this.closeAddDocumento();
              this.onDataChange.emit();
            },
            error: () => this.toastService.error('Error al actualizar documento'),
          });
      } else {
        const createDto: MantenimientoDocumentoCreateDto = {
          mantenimientoId: this.mantenimiento().id,
          nombre: val.nombre!,
          url: url,
          tipo: val.tipo!,
          descripcion: val.descripcion || undefined,
        };
        this.mantenimientoService
          .createDocumento(createDto)
          .pipe(finalize(() => this.uploading.set(false)))
          .subscribe({
            next: () => {
              this.toastService.success('Documento agregado');
              this.closeAddDocumento();
              this.onDataChange.emit();
            },
            error: () => this.toastService.error('Error al guardar documento'),
          });
      }
    };

    if (this.pendingFile) {
      // New file selected -> Upload first
      this.storageService.upload(this.pendingFile, 'mantenimientos').subscribe({
        next: (res) => processSave(res.secureUrl),
        error: () => {
          this.uploading.set(false);
          this.toastService.error('Error al subir archivo');
        },
      });
    } else if (this.editingDocUrl) {
      // Editing metadata only -> Use existing URL
      processSave(this.editingDocUrl);
    } else {
      // Should not happen based on validation
      this.uploading.set(false);
    }
  }

  removeDocumento(documentoId: number) {
    this.alertService.delete(
      'Eliminar Documento',
      '¿Estás seguro de eliminar este documento?',
      () => {
        this.mantenimientoService.deleteDocumento(this.mantenimiento().id, documentoId).subscribe({
          next: () => {
            this.toastService.success('Documento eliminado');
            this.onDataChange.emit();
          },
          error: () => this.toastService.error('Error al eliminar documento'),
        });
      }
    );
  }
}
