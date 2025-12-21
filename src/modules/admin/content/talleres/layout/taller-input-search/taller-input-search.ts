import { Component, inject, signal, ElementRef, HostListener, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TallerService } from '@service/admin/taller.service';
import { TallerResultDto } from '@interface/admin/taller.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-taller-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './taller-input-search.html',
  styleUrl: './taller-input-search.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TallerInputSearch,
      multi: true,
    },
  ],
})
export class TallerInputSearch implements ControlValueAccessor {
  private tallerService = inject(TallerService);
  private elementRef = inject(ElementRef);

  // Inputs
  placeholder = input<string>('Seleccionar taller...');

  // State
  isOpen = signal(false);
  loading = signal(false);
  talleres = signal<TallerResultDto[]>([]);
  selectedTaller = signal<TallerResultDto | null>(null);

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: TallerResultDto | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.tallerService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.talleres.set(response.data);
        },
        error: (err) => {
          console.error('Error searching talleres:', err);
          this.talleres.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialTaller(obj);
    } else {
      this.selectedTaller.set(null);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {}

  // UI Actions
  toggleDropdown() {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      if (this.talleres().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectTaller(taller: TallerResultDto) {
    this.selectedTaller.set(taller);
    this.onChange(taller);
    this.isOpen.set(false);
  }

  loadInitialTaller(id: number) {
    this.tallerService.findOne(id).subscribe({
      next: (taller) => {
        this.selectedTaller.set(taller);
      },
      error: () => {
        console.error('Could not load initial taller');
      },
    });
  }

  getDisplayText(): string {
    const t = this.selectedTaller();
    if (!t) return this.placeholder();
    return t.nombreComercial || t.razonSocial;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
