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
  // Marca
  MarcaResultDto,
  MarcaCreateDto,
  MarcaUpdateDto,
  PaginatedMarcaResultDto,
  MarcaPaginationParams,
  // Modelo
  ModeloResultDto,
  ModeloCreateDto,
  ModeloUpdateDto,
  PaginatedModeloResultDto,
  ModeloPaginationParams,
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

  // ========== VEHICULOS ==========
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

  // ========== DOCUMENTOS ==========
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

  // ========== MARCAS ==========
  findAllMarcas(params?: MarcaPaginationParams): Observable<PaginatedMarcaResultDto> {
    return this.http.get<PaginatedMarcaResultDto>(API_URL.vehiculos.marcas.findAll(params));
  }

  findOneMarca(id: number): Observable<MarcaResultDto> {
    return this.http.get<MarcaResultDto>(API_URL.vehiculos.marcas.findOne(id));
  }

  createMarca(marca: MarcaCreateDto): Observable<MarcaResultDto> {
    return this.http.post<MarcaResultDto>(API_URL.vehiculos.marcas.create, marca);
  }

  updateMarca(id: number, marca: MarcaUpdateDto): Observable<MarcaResultDto> {
    return this.http.patch<MarcaResultDto>(API_URL.vehiculos.marcas.update(id), marca);
  }

  deleteMarca(id: number): Observable<MarcaResultDto> {
    return this.http.delete<MarcaResultDto>(API_URL.vehiculos.marcas.delete(id));
  }

  // ========== MODELOS ==========
  findAllModelos(params?: ModeloPaginationParams): Observable<PaginatedModeloResultDto> {
    return this.http.get<PaginatedModeloResultDto>(API_URL.vehiculos.modelos.findAll(params));
  }

  findOneModelo(id: number): Observable<ModeloResultDto> {
    return this.http.get<ModeloResultDto>(API_URL.vehiculos.modelos.findOne(id));
  }

  createModelo(modelo: ModeloCreateDto): Observable<ModeloResultDto> {
    return this.http.post<ModeloResultDto>(API_URL.vehiculos.modelos.create, modelo);
  }

  updateModelo(id: number, modelo: ModeloUpdateDto): Observable<ModeloResultDto> {
    return this.http.patch<ModeloResultDto>(API_URL.vehiculos.modelos.update(id), modelo);
  }

  deleteModelo(id: number): Observable<ModeloResultDto> {
    return this.http.delete<ModeloResultDto>(API_URL.vehiculos.modelos.delete(id));
  }
}
