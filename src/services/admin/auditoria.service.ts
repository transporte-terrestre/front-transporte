import { Injectable, inject } from '@angular/core';
import { Api, ApiParam, ApiQuery, ApiResponse } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class AuditoriaService {
  private api = inject(Api);

  /**
   * Obtiene el historial de auditoría usando el nuevo método findAll de la API
   */
  async findAll(query: ApiQuery<'auditorias', 'findAll'>): Promise<ApiResponse<'auditorias', 'findAll'>> {
    return await this.api.auditorias.findAll(query).then((response) => response.data);
  }

  /**
   * Obtiene un registro de auditoría por su ID
   */
  async findOne(id: ApiParam<'auditorias', 'findOne', 'id'>): Promise<ApiResponse<'auditorias', 'findOne'>> {
    return await this.api.auditorias.findOne({ id }).then((response) => response.data);
  }
}
