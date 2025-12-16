import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  MantenimientoCreateDto,
  MantenimientoResultDto,
  MantenimientoUpdateDto,
  PaginatedMantenimientoResultDto,
} from '@interface/admin/mantenimiento.interface';

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
}
