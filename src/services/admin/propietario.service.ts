import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiParam, ApiQuery } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class PropietarioService {
  private api = inject(Api);

  async findAll(query: ApiQuery<'propietarios', 'findAll'>) {
    return await this.api.propietarios.findAll(query).then((response) => response.data);
  }

  async findOne(id: ApiParam<'propietarios', 'findOne', 'id'>) {
    return await this.api.propietarios.findOne({ id }).then((response) => response.data);
  }

  async create(propietario: ApiBody<'propietarios', 'create'>) {
    return await this.api.propietarios.create(propietario).then((response) => response.data);
  }

  async update(
    id: ApiParam<'propietarios', 'update', 'id'>,
    propietario: ApiBody<'propietarios', 'update'>
  ) {
    return await this.api.propietarios
      .update({ id }, propietario)
      .then((response) => response.data);
  }

  async delete(id: ApiParam<'propietarios', 'remove', 'id'>) {
    return await this.api.propietarios.remove({ id }).then((response) => response.data);
  }

  async findDocumento(id: ApiParam<'propietarios', 'findDocumento', 'id'>) {
    return await this.api.propietarios.findDocumento({ id }).then((response) => response.data);
  }

  async createDocumento(documento: ApiBody<'propietarios', 'createDocumento'>) {
    return await this.api.propietarios.createDocumento(documento).then((response) => response.data);
  }

  async updateDocumento(
    id: ApiParam<'propietarios', 'updateDocumento', 'id'>,
    documento: ApiBody<'propietarios', 'updateDocumento'>
  ) {
    return await this.api.propietarios
      .updateDocumento({ id }, documento)
      .then((response) => response.data);
  }

  async deleteDocumento(id: ApiParam<'propietarios', 'deleteDocumento', 'id'>) {
    return await this.api.propietarios.deleteDocumento({ id }).then((response) => response.data);
  }
}
