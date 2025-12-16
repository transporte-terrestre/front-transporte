import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RutaService } from '@service/admin/ruta.service';
import { RutaResultDto, RutaUpdateDto } from '@interface/admin/ruta.interface';
import { ToastService } from '@service/toast.service';
import { RutaForm } from '../../layout/ruta-form/ruta-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-rutas-edit',
  imports: [CommonModule, RutaForm],
  templateUrl: './rutas-edit.html',
  styleUrl: './rutas-edit.css',
})
export class RutasEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rutaService = inject(RutaService);
  private toastService = inject(ToastService);

  ruta = signal<RutaResultDto | null>(null);
  loading = signal(false);

  rutaFormComponent = viewChild<RutaForm>(RutaForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadRuta(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.rutas.list)]);
    }
  }

  loadRuta(id: number) {
    this.loading.set(true);
    this.rutaService.findOne(id).subscribe({
      next: (ruta) => {
        this.ruta.set(ruta);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ruta:', error);
        this.toastService.error('Error al cargar ruta');
        this.router.navigate([buildPath(PATH.admin.rutas.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.ruta()) return;

    this.loading.set(true);
    this.rutaService.update(this.ruta()!.id, data as RutaUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Ruta actualizada exitosamente');
        this.router.navigate([buildPath(PATH.admin.rutas.list)]);
      },
      error: (error) => {
        console.error('Error al actualizar ruta:', error);
        this.toastService.error('Error al actualizar ruta');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.rutas.list)]);
  }
}
