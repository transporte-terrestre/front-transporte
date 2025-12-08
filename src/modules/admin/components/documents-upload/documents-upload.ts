import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '@service/admin/storage.service';
import { StorageResultDto } from '@interface/admin/storage.interface';

export interface DocumentItem {
  url: string;
  name: string;
  type: 'pdf' | 'word' | 'excel' | 'other';
}

@Component({
  selector: 'app-documents-upload',
  imports: [CommonModule],
  templateUrl: './documents-upload.html',
  styleUrl: './documents-upload.css',
})
export class DocumentsUpload {
  private storageService = inject(StorageService);

  // Inputs
  documents = input<string[]>([]);
  folder = input<string>('documents');
  maxDocuments = input<number>(10);
  label = input<string>('Documentos');

  // Outputs
  documentsChange = output<string[]>();

  // State
  documentsList = signal<DocumentItem[]>([]);
  uploading = signal<boolean>(false);
  dragOver = signal<boolean>(false);

  constructor() {
    effect(() => {
      const inputDocs = this.documents();
      if (inputDocs && inputDocs.length > 0) {
        const items = inputDocs.map(url => this.urlToDocumentItem(url));
        this.documentsList.set(items);
      }
    });
  }

  private urlToDocumentItem(url: string): DocumentItem {
    const name = this.extractFileName(url);
    const type = this.getDocumentType(url);
    return { url, name, type };
  }

  private extractFileName(url: string): string {
    try {
      const match = url.match(/\/([^/]+)\.\w+$/);
      if (match) {
        // Remover el timestamp del nombre
        const nameWithTimestamp = match[1];
        const cleanName = nameWithTimestamp.replace(/_\d+$/, '');
        return decodeURIComponent(cleanName);
      }
      return 'Documento';
    } catch {
      return 'Documento';
    }
  }

  private getDocumentType(url: string): 'pdf' | 'word' | 'excel' | 'other' {
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('.pdf')) return 'pdf';
    if (lowerUrl.includes('.doc') || lowerUrl.includes('.docx')) return 'word';
    if (lowerUrl.includes('.xls') || lowerUrl.includes('.xlsx')) return 'excel';
    return 'other';
  }

  getDocumentIcon(type: string): string {
    switch (type) {
      case 'pdf': return 'fa-file-pdf';
      case 'word': return 'fa-file-word';
      case 'excel': return 'fa-file-excel';
      default: return 'fa-file-alt';
    }
  }

  getDocumentColor(type: string): string {
    switch (type) {
      case 'pdf': return 'text-red-500';
      case 'word': return 'text-blue-500';
      case 'excel': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }

  getDocumentBgColor(type: string): string {
    switch (type) {
      case 'pdf': return 'bg-red-50';
      case 'word': return 'bg-blue-50';
      case 'excel': return 'bg-green-50';
      default: return 'bg-gray-50';
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadFiles(Array.from(input.files));
    }
    input.value = '';
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.uploadFiles(Array.from(event.dataTransfer.files));
    }
  }

  private uploadFiles(files: File[]) {
    const currentCount = this.documentsList().length;
    const availableSlots = this.maxDocuments() - currentCount;

    if (availableSlots <= 0) return;

    const filesToUpload = files.slice(0, availableSlots);
    this.uploading.set(true);

    let completed = 0;
    const newDocs: DocumentItem[] = [];

    filesToUpload.forEach(file => {
      this.storageService.upload(file, this.folder()).subscribe({
        next: (result: StorageResultDto) => {
          const docItem = this.urlToDocumentItem(result.secureUrl);
          docItem.name = file.name.replace(/\.[^/.]+$/, ''); // Usar nombre original
          newDocs.push(docItem);
          completed++;

          if (completed === filesToUpload.length) {
            const updatedList = [...this.documentsList(), ...newDocs];
            this.documentsList.set(updatedList);
            this.emitUrls(updatedList);
            this.uploading.set(false);
          }
        },
        error: (err) => {
          console.error('Error uploading document:', err);
          completed++;
          if (completed === filesToUpload.length) {
            if (newDocs.length > 0) {
              const updatedList = [...this.documentsList(), ...newDocs];
              this.documentsList.set(updatedList);
              this.emitUrls(updatedList);
            }
            this.uploading.set(false);
          }
        }
      });
    });
  }

  removeDocument(index: number) {
    const currentDocs = this.documentsList();
    const doc = currentDocs[index];

    const publicId = this.extractPublicId(doc.url);

    if (publicId) {
      this.storageService.delete(publicId).subscribe({
        next: () => {
          const updatedList = currentDocs.filter((_, i) => i !== index);
          this.documentsList.set(updatedList);
          this.emitUrls(updatedList);
        },
        error: (err) => {
          console.error('Error deleting document:', err);
          const updatedList = currentDocs.filter((_, i) => i !== index);
          this.documentsList.set(updatedList);
          this.emitUrls(updatedList);
        }
      });
    } else {
      const updatedList = currentDocs.filter((_, i) => i !== index);
      this.documentsList.set(updatedList);
      this.emitUrls(updatedList);
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  private emitUrls(docs: DocumentItem[]) {
    this.documentsChange.emit(docs.map(d => d.url));
  }

  openDocument(url: string) {
    window.open(url, '_blank');
  }

  canAddMore(): boolean {
    return this.documentsList().length < this.maxDocuments();
  }
}
