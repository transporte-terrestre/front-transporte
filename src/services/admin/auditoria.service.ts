import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiResponse } from 'api/backend.api';

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
}
