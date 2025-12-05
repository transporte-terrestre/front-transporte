import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ConductorCreateDto,
  ConductorResultDto,
  ConductorUpdateDto,
} from '@interface/admin/conductor.interface';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private http = inject(HttpClient);

  findAll(): Observable<ConductorResultDto[]> {
    return this.http.get<ConductorResultDto[]>(API_URL.conductores.findAll);
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
}
