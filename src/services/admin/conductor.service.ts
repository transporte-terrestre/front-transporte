import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ConductorCreateDto,
  ConductorResultDto,
  ConductorUpdateDto,
  PaginatedConductorResultDto,
  ConductorDocumentoResultDto,
  ConductorDocumentoCreateDto,
  ConductorDocumentoUpdateDto,
} from '@interface/admin/conductor.interface';

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
export class ConductorService {
  private http = inject(HttpClient);

  findAll(params?: PaginationParams): Observable<PaginatedConductorResultDto> {
    return this.http.get<PaginatedConductorResultDto>(API_URL.conductores.findAll(params));
  }

  findOne(id: number): Observable<ConductorResultDto> {
    return this.http.get<ConductorResultDto>(API_URL.conductores.findOne(id));
  }

  create(conductor: ConductorCreateDto): Observable<ConductorResultDto> {
    return this.http.post<ConductorResultDto>(API_URL.conductores.create, conductor);
  }

  update(id: number, conductor: ConductorUpdateDto): Observable<ConductorResultDto> {
    return this.http.patch<ConductorResultDto>(API_URL.conductores.update(id), conductor);
  }

  delete(id: number): Observable<ConductorResultDto> {
    return this.http.delete<ConductorResultDto>(API_URL.conductores.delete(id));
  }

  findDocumento(id: number): Observable<ConductorDocumentoResultDto> {
    return this.http.get<ConductorDocumentoResultDto>(API_URL.conductores.documentos.find(id));
  }

  createDocumento(documento: ConductorDocumentoCreateDto): Observable<ConductorDocumentoResultDto> {
    return this.http.post<ConductorDocumentoResultDto>(
      API_URL.conductores.documentos.create,
      documento
    );
  }

  updateDocumento(
    id: number,
    documento: ConductorDocumentoUpdateDto
  ): Observable<ConductorDocumentoResultDto> {
    return this.http.patch<ConductorDocumentoResultDto>(
      API_URL.conductores.documentos.update(id),
      documento
    );
  }

  deleteDocumento(id: number): Observable<ConductorDocumentoResultDto> {
    return this.http.delete<ConductorDocumentoResultDto>(API_URL.conductores.documentos.delete(id));
  }
}
