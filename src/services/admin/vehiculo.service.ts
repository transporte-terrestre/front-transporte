import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  VehiculoCreateDto,
  VehiculoResultDto,
  VehiculoUpdateDto,
  PaginatedVehiculoResultDto,
  VehiculoDocumentoResultDto,
  VehiculoDocumentoCreateDto,
  VehiculoDocumentoUpdateDto,
} from '@interface/admin/vehiculo.interface';

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
export class VehiculoService {
  private http = inject(HttpClient);

  findAll(params?: PaginationParams): Observable<PaginatedVehiculoResultDto> {
    return this.http.get<PaginatedVehiculoResultDto>(API_URL.vehiculos.findAll(params));
  }

  findOne(id: number): Observable<VehiculoResultDto> {
    return this.http.get<VehiculoResultDto>(API_URL.vehiculos.findOne(id));
  }

  create(vehiculo: VehiculoCreateDto): Observable<VehiculoResultDto> {
    return this.http.post<VehiculoResultDto>(API_URL.vehiculos.create, vehiculo);
  }

  update(id: number, vehiculo: VehiculoUpdateDto): Observable<VehiculoResultDto> {
    return this.http.patch<VehiculoResultDto>(API_URL.vehiculos.update(id), vehiculo);
  }

  delete(id: number): Observable<VehiculoResultDto> {
    return this.http.delete<VehiculoResultDto>(API_URL.vehiculos.delete(id));
  }

  findDocumento(id: number): Observable<VehiculoDocumentoResultDto> {
    return this.http.get<VehiculoDocumentoResultDto>(API_URL.vehiculos.documentos.find(id));
  }

  createDocumento(documento: VehiculoDocumentoCreateDto): Observable<VehiculoDocumentoResultDto> {
    return this.http.post<VehiculoDocumentoResultDto>(
      API_URL.vehiculos.documentos.create,
      documento
    );
  }

  updateDocumento(
    id: number,
    documento: VehiculoDocumentoUpdateDto
  ): Observable<VehiculoDocumentoResultDto> {
    return this.http.patch<VehiculoDocumentoResultDto>(
      API_URL.vehiculos.documentos.update(id),
      documento
    );
  }

  deleteDocumento(id: number): Observable<VehiculoDocumentoResultDto> {
    return this.http.delete<VehiculoDocumentoResultDto>(API_URL.vehiculos.documentos.delete(id));
  }
}
