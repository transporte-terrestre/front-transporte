import { Component, inject, signal, ElementRef, HostListener, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConductorService } from '@service/admin/conductor.service';
import { ConductorListDto } from '@interface/admin/conductor.interface';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-conductor-input-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conductor-input-search.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ConductorInputSearch,
      multi: true,
    },
  ],
})
export class ConductorInputSearch implements ControlValueAccessor {
  private conductorService = inject(ConductorService);
  private elementRef = inject(ElementRef);

  // State
  isOpen = signal(false);
  loading = signal(false);
  conductores = signal<ConductorListDto[]>([]);
  selectedConductor = signal<ConductorListDto | null>(null);

  // Output to emit the full entity
  onEntitySelected = output<ConductorListDto | null>();

  // Search Control
  searchControl = new FormControl('');

  // Value Accessor callbacks
  onChange: (value: number | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((term) => {
          if (!term && term !== '') return of({ data: [], meta: { total: 0 } } as any);
          return this.conductorService
            .findAll({ search: term || '', limit: 10 })
            .pipe(finalize(() => this.loading.set(false)));
        })
      )
      .subscribe({
        next: (response) => {
          this.conductores.set(response.data);
        },
        error: (err) => {
          console.error('Error searching conductores:', err);
          this.conductores.set([]);
          this.loading.set(false);
        },
      });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.loadInitialConductor(obj);
    } else {
      this.selectedConductor.set(null);
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
      if (this.conductores().length === 0) {
        this.searchControl.setValue('');
      }
    } else {
      this.onTouched();
    }
  }

  selectConductor(conductor: ConductorListDto) {
    this.selectedConductor.set(conductor);
    this.onChange(conductor.id);
    this.onEntitySelected.emit(conductor);
    this.isOpen.set(false);
  }

  loadInitialConductor(id: number) {
    this.conductorService.findOne(id).subscribe({
      next: (conductor) => {
        this.selectedConductor.set(conductor as unknown as ConductorListDto);
      },
      error: () => {
        console.error('Could not load initial conductor');
      },
    });
  }

  getDisplayText(): string {
    const c = this.selectedConductor();
    if (!c) return 'Seleccionar conductor...';
    return `${c.nombres} ${c.apellidos}`;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.onTouched();
    }
  }
}
