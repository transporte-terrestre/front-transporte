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
}
