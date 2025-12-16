import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConductorService } from '@service/admin/conductor.service';
import { ConductorResultDto, ConductorUpdateDto } from '@interface/admin/conductor.interface';
import { ToastService } from '@service/toast.service';
import { ConductorForm } from '../../layout/conductor-form/conductor-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-conductores-edit',
  imports: [CommonModule, ConductorForm],
  templateUrl: './conductores-edit.html',
  styleUrl: './conductores-edit.css',
})
export class ConductoresEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);

  conductor = signal<ConductorResultDto | null>(null);
  loading = signal(false);

  conductorFormComponent = viewChild<ConductorForm>(ConductorForm);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadConductor(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.conductores.list)]);
    }
  }

  loadConductor(id: number) {
    this.loading.set(true);
    this.conductorService.findOne(id).subscribe({
      next: (conductor) => {
        this.conductor.set(conductor);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar conductor:', error);
        this.toastService.error('Error al cargar conductor');
        this.router.navigate([buildPath(PATH.admin.conductores.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.conductor()) return;

    this.loading.set(true);
    this.conductorService.update(this.conductor()!.id, data as ConductorUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Conductor actualizado exitosamente');
        this.router.navigate([buildPath(PATH.admin.conductores.list)]);
      },
      error: (error) => {
        console.error('Error al actualizar conductor:', error);
        this.toastService.error('Error al actualizar conductor');
        this.loading.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.conductores.list)]);
  }
}
