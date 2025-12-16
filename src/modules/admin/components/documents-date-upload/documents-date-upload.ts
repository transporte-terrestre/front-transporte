import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface DocumentWithDate {
  file: File;
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

  // Inputs
  documents = input<DocumentItem[]>([]);
  label = input<string>('Documentos');
  maxDocuments = input<number>(10);
  accept = input<string>('.pdf,.jpg,.jpeg,.png');

  // Outputs
  onUpload = output<DocumentWithDate>();
  onUpdate = output<{ id: number; fechaEmision: string; fechaExpiracion: string }>();
  onDelete = output<number>();

  // State
  showUploadModal = signal(false);
  editingDocId = signal<number | null>(null);
  pendingFile: File | null = null;
  editingDocName: string | null = null;

  documentUploadForm: FormGroup = this.fb.group({
    fechaEmision: ['', [Validators.required]],
    fechaExpiracion: ['', [Validators.required]],
  });

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
      fechaEmision: doc.fechaEmision ? new Date(doc.fechaEmision).toISOString().split('T')[0] : '',
      fechaExpiracion: doc.fechaExpiracion
        ? new Date(doc.fechaExpiracion).toISOString().split('T')[0]
        : '',
    });

    this.showUploadModal.set(true);
  }

  cancelUpload() {
    this.showUploadModal.set(false);
    this.pendingFile = null;
    this.editingDocId.set(null);
    this.editingDocName = null;
    this.documentUploadForm.reset();
  }

  confirmUpload() {
    if (this.documentUploadForm.invalid) {
      this.documentUploadForm.markAllAsTouched();
      return;
    }

    const { fechaEmision, fechaExpiracion } = this.documentUploadForm.value;

    if (this.editingDocId()) {
      // Update existing document
      this.onUpdate.emit({
        id: this.editingDocId()!,
        fechaEmision: new Date(fechaEmision).toISOString(),
        fechaExpiracion: new Date(fechaExpiracion).toISOString(),
      });
    } else if (this.pendingFile) {
      // Upload new document
      this.onUpload.emit({
        file: this.pendingFile,
        nombre: this.pendingFile.name,
        fechaEmision: new Date(fechaEmision).toISOString(),
        fechaExpiracion: new Date(fechaExpiracion).toISOString(),
      });
    }

    this.cancelUpload();
  }

  deleteDocument(id: number | undefined) {
    if (id !== undefined) {
      this.onDelete.emit(id);
    }
  }

  canAddMore(): boolean {
    return this.documents().length < this.maxDocuments();
  }
}
