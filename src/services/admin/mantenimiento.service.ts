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
  TareaResultDto,
  TareaCreateDto,
  TareaUpdateDto,
  PaginatedTareaResultDto,
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

export interface TareaPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
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

  // ========== CATÁLOGO DE TAREAS ==========
  findAllTareas(params?: TareaPaginationParams): Observable<PaginatedTareaResultDto> {
    return this.http.get<PaginatedTareaResultDto>(API_URL.mantenimientos.tareas.findAll(params));
  }

  findOneTarea(id: number): Observable<TareaResultDto> {
    return this.http.get<TareaResultDto>(API_URL.mantenimientos.tareas.findOne(id));
  }

  createTareaCatalogo(tarea: TareaCreateDto): Observable<TareaResultDto> {
    return this.http.post<TareaResultDto>(API_URL.mantenimientos.tareas.create, tarea);
  }

  updateTareaCatalogo(id: number, tarea: TareaUpdateDto): Observable<TareaResultDto> {
    return this.http.patch<TareaResultDto>(API_URL.mantenimientos.tareas.update(id), tarea);
  }

  deleteTareaCatalogo(id: number): Observable<TareaResultDto> {
    return this.http.delete<TareaResultDto>(API_URL.mantenimientos.tareas.delete(id));
  }

  // ========== MANTENIMIENTO-TAREAS (relación) ==========
  createMantenimientoTarea(tarea: MantenimientoTareaCreateDto): Observable<any> {
    return this.http.post(API_URL.mantenimientos.mantenimientoTareas.create, tarea);
  }

  updateMantenimientoTarea(id: number, tarea: MantenimientoTareaUpdateDto): Observable<any> {
    return this.http.patch(API_URL.mantenimientos.mantenimientoTareas.update(id), tarea);
  }

  deleteMantenimientoTarea(id: number): Observable<any> {
    return this.http.delete(API_URL.mantenimientos.mantenimientoTareas.delete(id));
  }

  // ========== DOCUMENTOS ==========
  createDocumento(documento: MantenimientoDocumentoCreateDto): Observable<MantenimientoResultDto> {
    return this.http.post<MantenimientoResultDto>(
      API_URL.mantenimientos.documentos.create,
      documento
    );
  }

  updateDocumento(
    id: number,
    documento: MantenimientoDocumentoUpdateDto
  ): Observable<MantenimientoResultDto> {
    return this.http.patch<MantenimientoResultDto>(
      API_URL.mantenimientos.documentos.update(id),
      documento
    );
  }

  deleteDocumento(id: number): Observable<MantenimientoResultDto> {
    return this.http.delete<MantenimientoResultDto>(API_URL.mantenimientos.documentos.delete(id));
  }

  generateOrdenServicio(mantenimiento: MantenimientoResultDto): void {
    generateOrdenServicioPdf(mantenimiento);
  }
}
