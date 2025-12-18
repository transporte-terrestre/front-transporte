import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TallerService } from '@service/admin/taller.service';
import { TallerResultDto, TallerUpdateDto } from '@interface/admin/taller.interface';
import { ToastService } from '@service/toast.service';
import { TallerForm } from '../../layout/taller-form/taller-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-talleres-edit',
  imports: [CommonModule, TallerForm],
  templateUrl: './talleres-edit.html',
  styleUrl: './talleres-edit.css',
})
export class TalleresEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tallerService = inject(TallerService);
  private toastService = inject(ToastService);

  taller = signal<TallerResultDto | null>(null);
  loading = signal(false);

  tallerFormComponent = viewChild<TallerForm>(TallerForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTaller(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.talleres.list)]);
    }
  }

  loadTaller(id: number) {
    this.loading.set(true);
    this.tallerService.findOne(id).subscribe({
      next: (taller) => {
        this.taller.set(taller);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar taller:', error);
        this.toastService.error('Error al cargar información del taller');
        this.router.navigate([buildPath(PATH.admin.talleres.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.taller()) return;

    this.loading.set(true);
    this.tallerService.update(this.taller()!.id, data as TallerUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Taller actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.talleres.list)]);
      },
      error: (error) => {
        console.error('Error al actualizar taller:', error);
        this.toastService.error('Error al actualizar taller');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.talleres.list)]);
  }
}
