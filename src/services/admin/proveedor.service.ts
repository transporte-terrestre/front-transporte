import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiParam, ApiQuery } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private api = inject(Api);

  async findAll(query: ApiQuery<'proveedores', 'findAll'>) {
    return await this.api.proveedores.findAll(query).then((response) => response.data);
  }

  async findOne(id: ApiParam<'proveedores', 'findOne', 'id'>) {
    return await this.api.proveedores.findOne({ id }).then((response) => response.data);
  }

  async create(proveedor: ApiBody<'proveedores', 'create'>) {
    return await this.api.proveedores.create(proveedor).then((response) => response.data);
  }

  async update(
    id: ApiParam<'proveedores', 'update', 'id'>,
    proveedor: ApiBody<'proveedores', 'update'>
  ) {
    return await this.api.proveedores
      .update({ id }, proveedor)
      .then((response) => response.data);
  }

  async delete(id: ApiParam<'proveedores', 'remove', 'id'>) {
    return await this.api.proveedores.remove({ id }).then((response) => response.data);
  }

  async findDocumento(id: ApiParam<'proveedores', 'findDocumento', 'id'>) {
    return await this.api.proveedores.findDocumento({ id }).then((response) => response.data);
  }

  async createDocumento(documento: ApiBody<'proveedores', 'createDocumento'>) {
    return await this.api.proveedores.createDocumento(documento).then((response) => response.data);
  }

  async updateDocumento(
    id: ApiParam<'proveedores', 'updateDocumento', 'id'>,
    documento: ApiBody<'proveedores', 'updateDocumento'>
  ) {
    return await this.api.proveedores
      .updateDocumento({ id }, documento)
      .then((response) => response.data);
  }

  async deleteDocumento(id: ApiParam<'proveedores', 'deleteDocumento', 'id'>) {
    return await this.api.proveedores.deleteDocumento({ id }).then((response) => response.data);
  }
}
