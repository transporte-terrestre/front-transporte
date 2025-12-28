import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '@service/admin/storage.service';
import { ApiResponse } from 'api/backend.api';

@Component({
  selector: 'app-images-upload',
  imports: [CommonModule],
  templateUrl: './images-upload.html',
  styleUrl: './images-upload.css',
})
export class ImagesUpload {
  private storageService = inject(StorageService);

  // Inputs
  images = input<string[]>([]);
  folder = input<string>('images');
  maxImages = input<number>(10);
  label = input<string>('Imágenes');

  // Outputs
  imagesChange = output<string[]>();

  // State
  imagesList = signal<string[]>([]);
  uploading = signal<boolean>(false);
  dragOver = signal<boolean>(false);

  constructor() {
    effect(() => {
      const inputImages = this.images();
      if (inputImages && inputImages.length > 0) {
        this.imagesList.set([...inputImages]);
      }
    });
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
      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (files.length > 0) {
        this.uploadFiles(files);
      }
    }
  }

  private async uploadFiles(files: File[]) {
    const currentCount = this.imagesList().length;
    const availableSlots = this.maxImages() - currentCount;

    if (availableSlots <= 0) return;

    const filesToUpload = files.slice(0, availableSlots);
    this.uploading.set(true);

    const newImages: string[] = [];
    const uploadPromises = filesToUpload.map((file) =>
      this.storageService
        .upload(file, this.folder())
        .then((result: ApiResponse<'storage', 'upload'>) => {
          newImages.push(result.secureUrl);
        })
        .catch((err) => {
          console.error('Error uploading image:', err);
        })
    );

    await Promise.all(uploadPromises);

    if (newImages.length > 0) {
      const updatedList = [...this.imagesList(), ...newImages];
      this.imagesList.set(updatedList);
      this.imagesChange.emit(updatedList);
    }
    this.uploading.set(false);
  }

  removeImage(index: number) {
    const currentImages = this.imagesList();
    const imageUrl = currentImages[index];
    const publicId = this.extractPublicId(imageUrl);

    const updateState = () => {
      const updatedList = currentImages.filter((_, i) => i !== index);
      this.imagesList.set(updatedList);
      this.imagesChange.emit(updatedList);
    };

    if (publicId) {
      this.storageService
        .delete(publicId)
        .then(() => {
          updateState();
        })
        .catch((err) => {
          console.error('Error deleting image:', err);
          updateState();
        });
    } else {
      updateState();
    }
  }

  private extractPublicId(url: string): string | null {
    try {
      // URL formato: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{folder}/{publicId}.{ext}
      const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  canAddMore(): boolean {
    return this.imagesList().length < this.maxImages();
  }
}
