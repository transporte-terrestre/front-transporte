import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  private api = inject(Api);

  // Métodos que apuntan a Circuitos (Nuevo estándar)
  async createCircuito(payload: ApiBody<'rutas', 'createCircuito'>) {
    return await this.api.rutas.createCircuito(payload).then((response) => response.data);
  }

  async updateCircuito(
    id: ApiParam<'rutas', 'updateCircuito', 'id'>,
    payload: ApiBody<'rutas', 'updateCircuito'>,
  ) {
    return await this.api.rutas.updateCircuito({ id }, payload).then((response) => response.data);
  }

  async delete(id: ApiParam<'rutas', 'removeCircuito', 'id'>) {
    return await this.api.rutas.removeCircuito({ id }).then((response) => response.data);
  }

  async findAllCircuitos(query: ApiQuery<'rutas', 'findAllCircuitos'>) {
    return await this.api.rutas.findAllCircuitos(query).then((response) => response.data);
  }

  async findOneCircuito(id: ApiParam<'rutas', 'findOneCircuito', 'id'>) {
    return await this.api.rutas.findOneCircuito({ id }).then((response) => response.data);
  }

  // Métodos Legacy (Rutas individuales) - Mantenidos por si acaso, pero deberían dejar de usarse
  async findAll(query: ApiQuery<'rutas', 'findAll'>) {
    return await this.api.rutas.findAll(query).then((response) => response.data);
  }

  async findOne(id: ApiParam<'rutas', 'findOne', 'id'>) {
    return await this.api.rutas.findOne({ id }).then((response) => response.data);
  }
}
