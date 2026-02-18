import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StorageService } from '@service/admin/storage.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';

export interface DocumentWithDate {
  url: string;
  nombre: string;
  fechaEmision: string;
  fechaExpiracion: string;
}

export interface DocumentItem {
  id?: number;
  nombre: string;
  url: string;
  fechaEmision?: string | null;
  fechaExpiracion?: string | null;
}

@Component({
  selector: 'app-documents-date-upload',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './documents-date-upload.html',
  styleUrl: './documents-date-upload.css',
})
export class DocumentsDateUpload {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  // Inputs
  documents = input<DocumentItem[]>([]);
  label = input<string>('Documentos');
  maxDocuments = input<number>(10);
  accept = input<string>('.pdf,.jpg,.jpeg,.png');
  folder = input<string>('documentos'); // Cloudinary folder
  requireIssueDate = input<boolean>(true);
  requireExpirationDate = input<boolean>(true);

  // Outputs - now emits URL instead of File
  onUpload = output<DocumentWithDate>();
  onUpdate = output<{ id: number; fechaEmision: string; fechaExpiracion: string }>();
  onDelete = output<number>();

  // State
  showUploadModal = signal(false);
  uploading = signal(false);
  editingDocId = signal<number | null>(null);
  pendingFile: File | null = null;
  editingDocName: string | null = null;

  documentUploadForm: FormGroup = this.fb.group({
    fechaEmision: [''],
    fechaExpiracion: [''],
  });

  constructor() {
    effect(() => {
      const emisionRequired = this.requireIssueDate();
      const expiracionRequired = this.requireExpirationDate();

      const emisionControl = this.documentUploadForm.get('fechaEmision');
      const expiracionControl = this.documentUploadForm.get('fechaExpiracion');

      if (emisionRequired) {
        emisionControl?.setValidators([Validators.required]);
      } else {
        emisionControl?.clearValidators();
      }
      emisionControl?.updateValueAndValidity();

      if (expiracionRequired) {
        expiracionControl?.setValidators([Validators.required]);
      } else {
        expiracionControl?.clearValidators();
      }
      expiracionControl?.updateValueAndValidity();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.pendingFile = file;
    this.editingDocId.set(null);
    this.editingDocName = null;
    this.documentUploadForm.reset();
    this.showUploadModal.set(true);

    // Reset input value so same file can be selected again if cancelled
    event.target.value = '';
  }

  editDocument(doc: DocumentItem) {
    if (!doc.id) return;

    this.editingDocId.set(doc.id);
    this.editingDocName = doc.nombre;
    this.pendingFile = null;

    this.documentUploadForm.patchValue({
      fechaEmision: doc.fechaEmision ? this.formatDateForInput(doc.fechaEmision) : '',
      fechaExpiracion: doc.fechaExpiracion ? this.formatDateForInput(doc.fechaExpiracion) : '',
    });

    this.showUploadModal.set(true);
  }

  cancelUpload() {
    this.showUploadModal.set(false);
    this.pendingFile = null;
    this.editingDocId.set(null);
    this.editingDocName = null;
    this.uploading.set(false);
    this.documentUploadForm.reset();
  }

  confirmUpload() {
    if (this.documentUploadForm.invalid) {
      this.documentUploadForm.markAllAsTouched();
      return;
    }

    const { fechaEmision, fechaExpiracion } = this.documentUploadForm.value;

    if (this.editingDocId()) {
      // Update existing document dates only
      this.onUpdate.emit({
        id: this.editingDocId()!,
        fechaEmision: fechaEmision ? new Date(fechaEmision).toISOString() : '', // Handle empty
        fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion).toISOString() : '', // Handle empty
      });
      this.cancelUpload();
    } else if (this.pendingFile) {
      // Upload new document to Cloudinary first
      this.uploading.set(true);

      const promise = this.storageService
        .upload(this.pendingFile, this.folder())
        .then((res) => {
          if (!res) throw new Error('No response from upload');
          this.onUpload.emit({
            url: res.secureUrl,
            nombre: this.pendingFile!.name,
            fechaEmision: fechaEmision ? new Date(fechaEmision).toISOString() : '',
            fechaExpiracion: fechaExpiracion ? new Date(fechaExpiracion).toISOString() : '',
          });
          // this.toastService.success('Documento subido correctamente');
          this.cancelUpload();
        })
        .catch(() => {
          this.toastService.error('Error al subir el documento');
        })
        .finally(() => {
          this.uploading.set(false);
        });
    }
  }

  deleteDocument(id: number | undefined) {
    if (id !== undefined) {
      this.alertService.delete(
        'Eliminar documento',
        '¿Estás seguro de que deseas eliminar este documento?',
        () => {
          this.onDelete.emit(id);
        },
      );
    }
  }

  canAddMore(): boolean {
    return this.documents().length < this.maxDocuments();
  }

  private formatDateForInput(dateStr: string): string {
    try {
      // Parse as local date to avoid timezone issues
      const [year, month, day] = dateStr.split('T')[0].split('-');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  }
}
