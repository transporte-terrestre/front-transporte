import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class TallerService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'talleres', 'findAll'>) {
    return await this.api.talleres.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'talleres', 'findOne', 'id'>) {
    return await this.api.talleres.findOne({ id }).then((response) => response.data);
  }
  async findSucursalesByTaller(id: number) {
    return await this.api.talleres.findSucursalesByTaller({ id }).then((response) => response.data);
  }
  async create(data: ApiBody<'talleres', 'create'>) {
    return await this.api.talleres.create(data).then((response) => response.data);
  }
  async update(id: ApiParam<'talleres', 'update', 'id'>, data: ApiBody<'talleres', 'update'>) {
    return await this.api.talleres.update({ id }, data).then((response) => response.data);
  }
  async delete(id: ApiParam<'talleres', 'remove', 'id'>) {
    return await this.api.talleres.remove({ id }).then((response) => response.data);
  }
  async findAllSucursales() {
    return await this.api.talleres.findAllSucursales().then((response) => response.data);
  }
}
