import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  RutaCreateDto,
  RutaResultDto,
  RutaUpdateDto,
  PaginatedRutaResultDto,
} from '@interface/admin/ruta.interface';

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
export class RutaService {
  private http = inject(HttpClient);

  findAll(params?: PaginationParams): Observable<PaginatedRutaResultDto> {
    return this.http.get<PaginatedRutaResultDto>(API_URL.rutas.findAll(params));
  }

  findOne(id: number): Observable<RutaResultDto> {
    return this.http.get<RutaResultDto>(API_URL.rutas.findOne(id));
  }

  create(ruta: RutaCreateDto): Observable<RutaResultDto> {
    return this.http.post<RutaResultDto>(API_URL.rutas.create, ruta);
  }

  update(id: number, ruta: RutaUpdateDto): Observable<RutaResultDto> {
    return this.http.patch<RutaResultDto>(API_URL.rutas.update(id), ruta);
  }

  delete(id: number): Observable<RutaResultDto> {
    return this.http.delete<RutaResultDto>(API_URL.rutas.delete(id));
  }
}
