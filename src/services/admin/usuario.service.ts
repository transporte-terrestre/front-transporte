import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'usuarios', 'findAll'>) {
    return await this.api.usuarios.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'usuarios', 'findOne', 'id'>) {
    return await this.api.usuarios.findOne({ id }).then((response) => response.data);
  }
  async create(usuario: ApiBody<'usuarios', 'create'>) {
    return await this.api.usuarios.create(usuario).then((response) => response.data);
  }
  async update(id: ApiParam<'usuarios', 'update', 'id'>, usuario: ApiBody<'usuarios', 'update'>) {
    return await this.api.usuarios.update({ id }, usuario).then((response) => response.data);
  }
  async delete(id: ApiParam<'usuarios', 'remove', 'id'>) {
    return await this.api.usuarios.remove({ id }).then((response) => response.data);
  }
  async findDocumento(id: ApiParam<'usuarios', 'findDocumento', 'id'>) {
    return await this.api.usuarios.findDocumento({ id }).then((response) => response.data);
  }
  async createDocumento(documento: ApiBody<'usuarios', 'createDocumento'>) {
    return await this.api.usuarios.createDocumento(documento).then((response) => response.data);
  }
  async updateDocumento(id: ApiParam<'usuarios', 'updateDocumento', 'id'>, documento: ApiBody<'usuarios', 'updateDocumento'>) {
    return await this.api.usuarios.updateDocumento({ id }, documento).then((response) => response.data);
  }
  async deleteDocumento(id: ApiParam<'usuarios', 'deleteDocumento', 'id'>) {
    return await this.api.usuarios.deleteDocumento({ id }).then((response) => response.data);
  }
  async findFirmas(id: ApiParam<'usuarios', 'findFirmas', 'id'>) {
    return await this.api.usuarios.findFirmas({ id }).then((response) => response.data);
  }
}