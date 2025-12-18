import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '@service/admin/viaje.service';
import { ViajeResultDto, ViajeUpdateDto } from '@interface/admin/viaje.interface';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import { ViajeForm } from '../../layout/viaje-form/viaje-form';
import { PATH, buildPath } from '@route/path.route';

@Component({
  selector: 'app-viajes-edit',
  imports: [CommonModule, ViajeForm],
  templateUrl: './viajes-edit.html',
  styleUrl: './viajes-edit.css',
})
export class ViajesEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private viajeService = inject(ViajeService);
  private toastService = inject(ToastService);
  private alertService = inject(AlertService);

  viaje = signal<ViajeResultDto | null>(null);

  downloadHojaRuta() {
    if (this.viaje()) {
      this.viajeService.generateHojaRuta(this.viaje()!);
    }
  }
  loading = signal(false);

  viajeFormComponent = viewChild<ViajeForm>(ViajeForm);

  // Modal States
  showConductorModal = signal(false);
  showVehiculoModal = signal(false);
  showComentarioModal = signal(false);

  // Forms for Modals
  addConductorForm = this.fb.group({
    conductorId: ['', Validators.required],
    rol: ['conductor', Validators.required],
    esPrincipal: [false],
  });

  addVehiculoForm = this.fb.group({
    vehiculoId: ['', Validators.required],
    rol: ['apoyo', Validators.required],
    esPrincipal: [false],
  });

  addComentarioForm = this.fb.group({
    comentario: ['', Validators.required],
    tipo: ['general', Validators.required],
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadViaje(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.viajes.list)]);
    }
  }

  loadViaje(id: number) {
    this.loading.set(true);
    this.viajeService.findOne(id).subscribe({
      next: (viaje) => {
        this.viaje.set(viaje);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar viaje:', error);
        this.toastService.error('Error al cargar viaje');
        this.router.navigate([buildPath(PATH.admin.viajes.list)]);
      },
    });
  }

  handleFormSubmit(data: any) {
    if (!this.viaje()) return;

    this.loading.set(true);
    this.viajeService.update(this.viaje()!.id, data as ViajeUpdateDto).subscribe({
      next: () => {
        this.toastService.success('Viaje actualizado exitosamente');
        this.loadViaje(this.viaje()!.id);
      },
      error: (error) => {
        console.error('Error al actualizar viaje:', error);
        this.toastService.error('Error al actualizar viaje');
        this.loading.set(false);
      },
    });
  }

  reloadViaje() {
    if (this.viaje()) {
      this.loadViaje(this.viaje()!.id);
    }
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.viajes.list)]);
  }
}
