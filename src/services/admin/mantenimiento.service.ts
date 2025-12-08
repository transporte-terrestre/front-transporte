import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  MantenimientoCreateDto,
  MantenimientoResultDto,
  MantenimientoUpdateDto,
} from '@interface/admin/mantenimiento.interface';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private http = inject(HttpClient);

  findAll(): Observable<MantenimientoResultDto[]> {
    return this.http.get<MantenimientoResultDto[]>(API_URL.mantenimientos.findAll);
  }

  findOne(id: number): Observable<MantenimientoResultDto> {
    return this.http.get<MantenimientoResultDto>(API_URL.mantenimientos.findOne(id));
  }

  create(mantenimiento: MantenimientoCreateDto): Observable<MantenimientoResultDto> {
    return this.http.post<MantenimientoResultDto>(API_URL.mantenimientos.create, mantenimiento);
  }

  update(id: number, mantenimiento: MantenimientoUpdateDto): Observable<MantenimientoResultDto> {
    return this.http.patch<MantenimientoResultDto>(API_URL.mantenimientos.update(id), mantenimiento);
  }

  delete(id: number): Observable<MantenimientoResultDto> {
    return this.http.delete<MantenimientoResultDto>(API_URL.mantenimientos.delete(id));
  }
}
