import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class RutaService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'rutas', 'findAll'>) {
    return await this.api.rutas.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'rutas', 'findOne', 'id'>) {
    return await this.api.rutas.findOne({ id }).then((response) => response.data);
  }
  async create(ruta: ApiBody<'rutas', 'create'>) {
    return await this.api.rutas.create(ruta).then((response) => response.data);
  }
  async update(id: ApiParam<'rutas', 'update', 'id'>, ruta: ApiBody<'rutas', 'update'>) {
    return await this.api.rutas.update({ id }, ruta).then((response) => response.data);
  }
  async delete(id: ApiParam<'rutas', 'remove', 'id'>) {
    return await this.api.rutas.remove({ id }).then((response) => response.data);
  }

  // Paradas
  async findParadas(rutaId: ApiParam<'rutas', 'findParadas', 'rutaId'>) {
    return await this.api.rutas.findParadas({ rutaId }).then((response) => response.data);
  }

  async createParada(
    rutaId: ApiParam<'rutas', 'createParada', 'rutaId'>,
    data: ApiBody<'rutas', 'createParada'>,
  ) {
    return await this.api.rutas.createParada({ rutaId }, data).then((response) => response.data);
  }

  async updateParada(
    rutaId: ApiParam<'rutas', 'updateParada', 'rutaId'>,
    paradaId: ApiParam<'rutas', 'updateParada', 'paradaId'>,
    data: ApiBody<'rutas', 'updateParada'>,
  ) {
    return await this.api.rutas
      .updateParada({ rutaId, paradaId }, data)
      .then((response) => response.data);
  }

  async deleteParada(
    rutaId: ApiParam<'rutas', 'deleteParada', 'rutaId'>,
    paradaId: ApiParam<'rutas', 'deleteParada', 'paradaId'>,
  ) {
    return await this.api.rutas
      .deleteParada({ rutaId, paradaId })
      .then((response) => response.data);
  }

  async reordenarParadas(
    rutaId: ApiParam<'rutas', 'reordenarParadas', 'rutaId'>,
    data: ApiBody<'rutas', 'reordenarParadas'>,
  ) {
    return await this.api.rutas
      .reordenarParadas({ rutaId }, data)
      .then((response) => response.data);
  }
}
