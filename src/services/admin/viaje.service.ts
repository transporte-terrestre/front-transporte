import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ViajeCreateDto,
  ViajeResultDto,
  ViajeUpdateDto,
  PaginatedViajeResultDto,
  ViajeConductorResultDto,
  ViajeConductorCreateDto,
  ViajeConductorUpdateDto,
  ViajeVehiculoResultDto,
  ViajeVehiculoCreateDto,
  ViajeVehiculoUpdateDto,
  ViajeComentarioResultDto,
  ViajeComentarioCreateDto,
  ViajeComentarioUpdateDto,
  ViajePaginationParams,
} from '@interface/admin/viaje.interface';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private http = inject(HttpClient);

  findAll(params?: ViajePaginationParams): Observable<PaginatedViajeResultDto> {
    return this.http.get<PaginatedViajeResultDto>(API_URL.viajes.findAll(params));
  }

  findOne(id: number): Observable<ViajeResultDto> {
    return this.http.get<ViajeResultDto>(API_URL.viajes.findOne(id));
  }

  create(viaje: ViajeCreateDto): Observable<ViajeResultDto> {
    return this.http.post<ViajeResultDto>(API_URL.viajes.create, viaje);
  }

  update(id: number, viaje: ViajeUpdateDto): Observable<ViajeResultDto> {
    return this.http.patch<ViajeResultDto>(API_URL.viajes.update(id), viaje);
  }

  delete(id: number): Observable<ViajeResultDto> {
    return this.http.delete<ViajeResultDto>(API_URL.viajes.delete(id));
  }

  // Conductores
  getConductores(viajeId: number): Observable<ViajeConductorResultDto[]> {
    return this.http.get<ViajeConductorResultDto[]>(API_URL.viajes.conductores.findAll(viajeId));
  }

  assignConductor(data: ViajeConductorCreateDto): Observable<ViajeConductorResultDto> {
    return this.http.post<ViajeConductorResultDto>(API_URL.viajes.conductores.assign, data);
  }

  updateConductor(
    viajeId: number,
    conductorId: number,
    data: ViajeConductorUpdateDto
  ): Observable<ViajeConductorResultDto> {
    return this.http.patch<ViajeConductorResultDto>(
      API_URL.viajes.conductores.update(viajeId, conductorId),
      data
    );
  }

  removeConductor(viajeId: number, conductorId: number): Observable<ViajeConductorResultDto> {
    return this.http.delete<ViajeConductorResultDto>(
      API_URL.viajes.conductores.delete(viajeId, conductorId)
    );
  }

  // Vehiculos
  getVehiculos(viajeId: number): Observable<ViajeVehiculoResultDto[]> {
    return this.http.get<ViajeVehiculoResultDto[]>(API_URL.viajes.vehiculos.findAll(viajeId));
  }

  assignVehiculo(data: ViajeVehiculoCreateDto): Observable<ViajeVehiculoResultDto> {
    return this.http.post<ViajeVehiculoResultDto>(API_URL.viajes.vehiculos.assign, data);
  }

  updateVehiculo(
    viajeId: number,
    vehiculoId: number,
    data: ViajeVehiculoUpdateDto
  ): Observable<ViajeVehiculoResultDto> {
    return this.http.patch<ViajeVehiculoResultDto>(
      API_URL.viajes.vehiculos.update(viajeId, vehiculoId),
      data
    );
  }

  removeVehiculo(viajeId: number, vehiculoId: number): Observable<ViajeVehiculoResultDto> {
    return this.http.delete<ViajeVehiculoResultDto>(
      API_URL.viajes.vehiculos.delete(viajeId, vehiculoId)
    );
  }

  // Comentarios
  getComentarios(viajeId: number): Observable<ViajeComentarioResultDto[]> {
    return this.http.get<ViajeComentarioResultDto[]>(API_URL.viajes.comentarios.findAll(viajeId));
  }

  createComentario(data: ViajeComentarioCreateDto): Observable<ViajeComentarioResultDto> {
    return this.http.post<ViajeComentarioResultDto>(API_URL.viajes.comentarios.create, data);
  }

  updateComentario(
    id: number,
    data: ViajeComentarioUpdateDto
  ): Observable<ViajeComentarioResultDto> {
    return this.http.patch<ViajeComentarioResultDto>(API_URL.viajes.comentarios.update(id), data);
  }

  deleteComentario(id: number): Observable<ViajeComentarioResultDto> {
    return this.http.delete<ViajeComentarioResultDto>(API_URL.viajes.comentarios.delete(id));
  }
}
