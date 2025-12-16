import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  TallerResultDto,
  TallerCreateDto,
  TallerUpdateDto,
  PaginatedTallerResultDto,
  PaginationMeta,
} from '@interface/admin/taller.interface';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TallerService {
  private http = inject(HttpClient);

  findAll(params?: PaginationParams): Observable<PaginatedTallerResultDto> {
    return this.http.get<PaginatedTallerResultDto>(API_URL.talleres.findAll(params));
  }

  findOne(id: number): Observable<TallerResultDto> {
    return this.http.get<TallerResultDto>(API_URL.talleres.findOne(id));
  }

  create(data: TallerCreateDto): Observable<TallerResultDto> {
    return this.http.post<TallerResultDto>(API_URL.talleres.create, data);
  }

  update(id: number, data: TallerUpdateDto): Observable<TallerResultDto> {
    return this.http.patch<TallerResultDto>(API_URL.talleres.update(id), data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API_URL.talleres.delete(id));
  }
}
