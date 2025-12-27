import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiParam, ApiQuery } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private api = inject(Api);async findAll(query: ApiQuery<'clientes', 'findAll'>) {
    return await this.api.clientes.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'clientes', 'findOne', 'id'>) {
    return await this.api.clientes.findOne({ id }).then((response) => response.data);
  }
  async create(cliente: ApiBody<'clientes', 'create'>) {
    return await this.api.clientes.create(cliente).then((response) => response.data);
  }
  async update(id: ApiParam<'clientes', 'update', 'id'>, cliente: ApiBody<'clientes', 'update'>) {
    return await this.api.clientes.update({ id }, cliente).then((response) => response.data);
  }
  async delete(id: ApiParam<'clientes', 'remove', 'id'>) {
    return await this.api.clientes.remove({ id }).then((response) => response.data);
  }
  async findDocumento(id: ApiParam<'clientes', 'findDocumento', 'id'>) {
    return await this.api.clientes.findDocumento({ id }).then((response) => response.data);
  }
  async createDocumento(documento: ApiBody<'clientes', 'createDocumento'>) {
    return await this.api.clientes.createDocumento(documento).then((response) => response.data);
  }
  async updateDocumento(
    id: ApiParam<'clientes', 'updateDocumento', 'id'>,
    documento: ApiBody<'clientes', 'updateDocumento'>
  ) {
    return await this.api.clientes.updateDocumento({ id }, documento).then((response) => response.data);
  }
  async deleteDocumento(id: ApiParam<'clientes', 'deleteDocumento', 'id'>) {
    return await this.api.clientes.deleteDocumento({ id }).then((response) => response.data);
  }
}
