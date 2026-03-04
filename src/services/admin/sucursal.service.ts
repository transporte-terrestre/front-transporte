import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  private api = inject(Api);

  async findAllPaginated(query: ApiQuery<'talleres', 'findAllSucursalesPaginated'>) {
    return await this.api.talleres
      .findAllSucursalesPaginated(query)
      .then((response) => response.data);
  }

  async findAll() {
    return await this.api.talleres.findAllSucursales().then((response) => response.data);
  }

  async findOne(id: ApiParam<'talleres', 'findOneSucursal', 'id'>) {
    return await this.api.talleres.findOneSucursal({ id }).then((response) => response.data);
  }

  async create(data: ApiBody<'talleres', 'createSucursal'>) {
    return await this.api.talleres.createSucursal(data).then((response) => response.data);
  }

  async update(
    id: ApiParam<'talleres', 'updateSucursal', 'id'>,
    data: ApiBody<'talleres', 'updateSucursal'>,
  ) {
    return await this.api.talleres.updateSucursal({ id }, data).then((response) => response.data);
  }

  async delete(id: ApiParam<'talleres', 'removeSucursal', 'id'>) {
    return await this.api.talleres.removeSucursal({ id }).then((response) => response.data);
  }
}
