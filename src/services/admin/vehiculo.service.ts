import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  VehiculoCreateDto,
  VehiculoResultDto,
  VehiculoUpdateDto,
} from '@interface/admin/vehiculo.interface';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private http = inject(HttpClient);

  findAll(): Observable<VehiculoResultDto[]> {
    return this.http.get<VehiculoResultDto[]>(API_URL.vehiculos.findAll);
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
}
