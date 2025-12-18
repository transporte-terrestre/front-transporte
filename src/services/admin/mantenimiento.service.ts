import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  MantenimientoCreateDto,
  MantenimientoResultDto,
  MantenimientoUpdateDto,
  PaginatedMantenimientoResultDto,
  MantenimientoTareaCreateDto,
  MantenimientoTareaUpdateDto,
  MantenimientoDocumentoCreateDto,
  MantenimientoDocumentoUpdateDto,
} from '@interface/admin/mantenimiento.interface';
import { generateOrdenServicioPdf } from '@template/orden-servicio.template';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private http = inject(HttpClient);

  findAll(params?: PaginationParams): Observable<PaginatedMantenimientoResultDto> {
    return this.http.get<PaginatedMantenimientoResultDto>(API_URL.mantenimientos.findAll(params));
  }

  findOne(id: number): Observable<MantenimientoResultDto> {
    return this.http.get<MantenimientoResultDto>(API_URL.mantenimientos.findOne(id));
  }

  create(mantenimiento: MantenimientoCreateDto): Observable<MantenimientoResultDto> {
    return this.http.post<MantenimientoResultDto>(API_URL.mantenimientos.create, mantenimiento);
  }

  update(id: number, mantenimiento: MantenimientoUpdateDto): Observable<MantenimientoResultDto> {
    return this.http.patch<MantenimientoResultDto>(
      API_URL.mantenimientos.update(id),
      mantenimiento
    );
  }

  delete(id: number): Observable<MantenimientoResultDto> {
    return this.http.delete<MantenimientoResultDto>(API_URL.mantenimientos.delete(id));
  }

  // Tareas
  createTarea(tarea: MantenimientoTareaCreateDto): Observable<MantenimientoResultDto> {
    return this.http.post<MantenimientoResultDto>(`${API_URL.mantenimientos.create}/tarea`, tarea);
  }

  updateTarea(
    mantenimientoId: number,
    tareaId: number,
    tarea: MantenimientoTareaUpdateDto
  ): Observable<MantenimientoResultDto> {
    return this.http.patch<MantenimientoResultDto>(
      `${API_URL.mantenimientos.update(mantenimientoId)}/tarea/${tareaId}`,
      tarea
    );
  }

  deleteTarea(mantenimientoId: number, tareaId: number): Observable<MantenimientoResultDto> {
    return this.http.delete<MantenimientoResultDto>(
      `${API_URL.mantenimientos.delete(mantenimientoId)}/tarea/${tareaId}`
    );
  }

  // Documentos
  createDocumento(documento: MantenimientoDocumentoCreateDto): Observable<MantenimientoResultDto> {
    return this.http.post<MantenimientoResultDto>(
      `${API_URL.mantenimientos.create}/documento`,
      documento
    );
  }

  updateDocumento(
    mantenimientoId: number,
    documentoId: number,
    documento: MantenimientoDocumentoUpdateDto
  ): Observable<MantenimientoResultDto> {
    return this.http.patch<MantenimientoResultDto>(
      `${API_URL.mantenimientos.update(mantenimientoId)}/documento/${documentoId}`,
      documento
    );
  }

  deleteDocumento(
    mantenimientoId: number,
    documentoId: number
  ): Observable<MantenimientoResultDto> {
    return this.http.delete<MantenimientoResultDto>(
      `${API_URL.mantenimientos.delete(mantenimientoId)}/documento/${documentoId}`
    );
  }

  generateOrdenServicio(mantenimiento: MantenimientoResultDto): void {
    generateOrdenServicioPdf(mantenimiento);
  }
}
