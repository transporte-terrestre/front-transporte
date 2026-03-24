import { Component, inject, signal, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MantenimientoService } from '@service/admin/mantenimiento.service';
import { ApiResponse, ApiBody } from 'api/backend.api';
import { ToastService } from '@service/toast.service';
import { MantenimientoForm, MantenimientoFormSubmitData } from '../../layout/mantenimiento-form/mantenimiento-form';
import { PATH, buildPath } from '@route/path.route';
import { getErrorMessage } from '@helper/error.helper';
import { UserSignatureSelectModal, SignatureSelection } from '../../../../components/user-signature-select-modal/user-signature-select-modal';

@Component({
  selector: 'app-mantenimientos-edit',
  imports: [CommonModule, MantenimientoForm, UserSignatureSelectModal],
  templateUrl: './mantenimientos-edit.html',
  styleUrl: './mantenimientos-edit.css',
})
export class MantenimientosEdit implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mantenimientoService = inject(MantenimientoService);
  private toastService = inject(ToastService);

  mantenimiento = signal<ApiResponse<'mantenimientos', 'findOne'> | null>(null);
  showSignatureModal = signal(false);

  downloadOrdenServicio() {
    if (this.mantenimiento()) {
      this.showSignatureModal.set(true);
    }
  }

  handleSignatureSelected(signatures: SignatureSelection[]) {
    if (this.mantenimiento()) {
      this.mantenimientoService.generateOrdenServicio(this.mantenimiento()!, signatures);
      this.showSignatureModal.set(false);
    }
  }

  handleSignatureClose() {
    this.showSignatureModal.set(false);
  }

  loading = signal(false);

  mantenimientoFormComponent = viewChild<MantenimientoForm>(MantenimientoForm);

  handleDataChange() {
    const m = this.mantenimiento();
    if (m) {
      this.loadMantenimiento(m.id);
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMantenimiento(+id);
    } else {
      this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
    }
  }

  loadMantenimiento(id: number) {
    this.loading.set(true);
    this.mantenimientoService
      .findOne(id)
      .then((mantenimiento) => {
        this.mantenimiento.set(mantenimiento);
        this.loading.set(false);
      })
      .catch((error) => {
        console.error('Error al cargar mantenimiento:', error);
        this.toastService.error('Error al cargar mantenimiento');
        this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
      });
  }

  handleFormSubmit(data: MantenimientoFormSubmitData) {
    const m = this.mantenimiento();
    if (!m) return;

    this.loading.set(true);
    // En edición siempre es un update
    const updateData = data as ApiBody<'mantenimientos', 'update'>;
    this.mantenimientoService
      .update(m.id, updateData)
      .then(() => {
        this.toastService.success('Mantenimiento actualizado exitosamente');
        this.loading.set(false);
        this.loadMantenimiento(m.id);
      })
      .catch((error) => {
        console.error('Error al actualizar mantenimiento:', error);
        this.toastService.error(getErrorMessage(error, 'Error al actualizar mantenimiento'));
        this.loading.set(false);
      });
  }

  onCancel() {
    this.router.navigate([buildPath(PATH.admin.mantenimientos.list)]);
  }
}
