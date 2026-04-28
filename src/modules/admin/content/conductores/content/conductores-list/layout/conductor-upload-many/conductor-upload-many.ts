import { Component, signal, inject, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ConductorService } from '@service/admin/conductor.service';
import { ToastService } from '@service/toast.service';
import { StorageService } from '@service/admin/storage.service';
import { ApiResponse } from 'api/backend.api';
import { ConductorInputSearch } from '@module/admin/components/input-searchs/conductor-input-search/conductor-input-search';
import { ModalForm } from '@module/admin/components/modal-form/modal-form';

@Component({
  selector: 'app-conductor-upload-many',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ModalForm, ConductorInputSearch],
  templateUrl: './conductor-upload-many.html',
  styleUrl: './conductor-upload-many.css',
})
export class ConductorUploadMany implements OnInit {
  private fb = inject(FormBuilder);
  private conductorService = inject(ConductorService);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);

  onUploaded = output<void>();

  showModal = signal(false);
  loading = signal(false);

  excludedConductores = signal<ApiResponse<'conductores', 'findAll'>['data']>([]);

  pendingFile: File | null = null;
  fileName = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    tipo: ['', Validators.required],
    nombre: ['', Validators.required],
    fechaEmision: [''],
    fechaExpiracion: [''],
  });

  documentTypes = [
    { value: 'dni', label: 'DNI' },
    { value: 'licencia_mtc', label: 'Licencia MTC' },
    { value: 'seguro_vida_ley', label: 'Seguro Vida Ley' },
    { value: 'sctr', label: 'SCTR' },
    { value: 'examen_medico', label: 'Examen Médico' },
    { value: 'psicosensometrico', label: 'Psicosensométrico' },
    { value: 'induccion_general', label: 'Inducción General' },
    { value: 'manejo_defensivo', label: 'Manejo Defensivo' },
    { value: 'licencia_interna', label: 'Licencia Interna' },
    { value: 'autoriza_ssgg', label: 'Autorización SSGG' },
    { value: 'curso_seguridad_portuaria', label: 'Curso Seguridad Portuaria' },
    { value: 'curso_mercancias_peligrosas', label: 'Curso Mercancías Peligrosas' },
    { value: 'curso_basico_pbip', label: 'Curso Básico PBIP' },
    { value: 'examen_medico_temporal', label: 'Examen Médico Temporal' },
    { value: 'induccion_visita', label: 'Inducción Visita' },
    { value: 'em_visita', label: 'EM Visita' },
    { value: 'pase_conduc', label: 'Pase Conducción' },
    { value: 'foto_funcionario', label: 'Foto Funcionario' },
  ];

  ngOnInit() {}

  async openModal() {
    this.form.reset({ tipo: '', nombre: '', fechaEmision: '', fechaExpiracion: '' });
    this.pendingFile = null;
    this.fileName.set(null);
    this.excludedConductores.set([]);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.pendingFile = file;
    this.fileName.set(file.name);
  }

  onConductorSelected(conductor: ApiResponse<'conductores', 'findAll'>['data'][number] | null) {
    if (!conductor) return;
    const current = this.excludedConductores();
    if (!current.find((c) => c.id === conductor.id)) {
      this.excludedConductores.set([...current, conductor]);
    }
  }

  removeExclusion(id: number) {
    this.excludedConductores.update((list) => list.filter((c) => c.id !== id));
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.error('Completa los campos obligatorios');
      return;
    }
    if (!this.pendingFile) {
      this.toastService.error('Debes seleccionar un archivo');
      return;
    }

    this.loading.set(true);
    try {
      const uploadRes = await this.storageService.upload(this.pendingFile, 'documentos_masivos');
      if (!uploadRes) throw new Error('No se pudo subir el archivo');

      const values = this.form.value;

      const payload: any = {
        documento: {
          tipo: values.tipo,
          nombre: values.nombre,
          url: uploadRes.secureUrl,
          ...(values.fechaEmision ? { fechaEmision: new Date(values.fechaEmision).toISOString() } : {}),
          ...(values.fechaExpiracion
            ? { fechaExpiracion: new Date(values.fechaExpiracion).toISOString() }
            : {}),
        },
      };

      const exclusions = this.excludedConductores().map((c) => c.id);
      if (exclusions.length > 0) {
        payload.excepto = exclusions;
      }

      const response = await this.conductorService.createDocumentoMasivo(payload);

      this.toastService.success(response?.message || 'Documento subido masivamente con éxito');
      this.showModal.set(false);
      this.onUploaded.emit();
    } catch (error) {
      console.error(error);
      this.toastService.error('Error al realizar la carga masiva');
    } finally {
      this.loading.set(false);
    }
  }
}
