import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-form',
  imports: [NgClass],
  templateUrl: './modal-form.html',
  styleUrl: './modal-form.css',
})
export class ModalForm {
  // Inputs
  title = input.required<string>();
  submitText = input<string>('Guardar');
  cancelText = input<string>('Cancelar');
  loading = input<boolean>(false);
  maxWidth = input<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'>('md');

  // Outputs
  onSubmit = output<void>();
  onClose = output<void>();

  handleSubmit() {
    this.onSubmit.emit();
  }

  handleClose() {
    this.onClose.emit();
  }

  getMaxWidthClass(): string {
    const widthMap = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl'
    };
    return widthMap[this.maxWidth()];
  }
}
