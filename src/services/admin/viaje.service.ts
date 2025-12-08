import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ViajeCreateDto,
  ViajeResultDto,
  ViajeUpdateDto,
} from '@interface/admin/viaje.interface';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private http = inject(HttpClient);

  findAll(): Observable<ViajeResultDto[]> {
    return this.http.get<ViajeResultDto[]>(API_URL.viajes.findAll);
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
}
