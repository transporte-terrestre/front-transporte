import { Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-info',
  standalone: true,
  imports: [NgClass],
  templateUrl: './modal-info.html',
  styleUrl: './modal-info.css',
})
export class ModalInfo {
  // Inputs
  title = input<string>('');
  maxWidth = input<'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'>('md');

  // Outputs
  onClose = output<void>();

  handleClose() {
    this.onClose.emit();
  }

  getMaxWidthClass(): string {
    const widthMap = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      full: 'max-w-full',
    };
    return widthMap[this.maxWidth()] || 'max-w-md';
  }
}
