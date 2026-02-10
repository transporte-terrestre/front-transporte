import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private api = inject(Api);
  // ========== VEHICULOS ==========
  async findAll(query: ApiQuery<'vehiculos', 'findAll'>) {
    return await this.api.vehiculos.findAll(query).then((response) => response.data);
  }

  async findAllEstadoDocumentos(query: ApiQuery<'vehiculos', 'findAllEstadoDocumentos'>) {
    return await this.api.vehiculos.findAllEstadoDocumentos(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'vehiculos', 'findOne', 'id'>) {
    return await this.api.vehiculos.findOne({ id }).then((response) => response.data);
  }
  async create(vehiculo: ApiBody<'vehiculos', 'create'>) {
    return await this.api.vehiculos.create(vehiculo).then((response) => response.data);
  }
  async update(
    id: ApiParam<'vehiculos', 'update', 'id'>,
    vehiculo: ApiBody<'vehiculos', 'update'>
  ) {
    return await this.api.vehiculos.update({ id }, vehiculo).then((response) => response.data);
  }
  async delete(id: ApiParam<'vehiculos', 'remove', 'id'>) {
    return await this.api.vehiculos.remove({ id }).then((response) => response.data);
  }
  // ========== DOCUMENTOS ==========
  async findDocumento(id: ApiParam<'vehiculos', 'findDocumento', 'id'>) {
    return await this.api.vehiculos.findDocumento({ id }).then((response) => response.data);
  }
  async createDocumento(documento: ApiBody<'vehiculos', 'createDocumento'>) {
    return await this.api.vehiculos.createDocumento(documento).then((response) => response.data);
  }
  async updateDocumento(
    id: ApiParam<'vehiculos', 'updateDocumento', 'id'>,
    documento: ApiBody<'vehiculos', 'updateDocumento'>
  ) {
    return await this.api.vehiculos
      .updateDocumento({ id }, documento)
      .then((response) => response.data);
  }
  async deleteDocumento(id: ApiParam<'vehiculos', 'deleteDocumento', 'id'>) {
    return await this.api.vehiculos.deleteDocumento({ id }).then((response) => response.data);
  }
  // ========== MARCAS ==========
  async findAllMarcas(query: ApiQuery<'vehiculos', 'findAllMarcas'>) {
    return await this.api.vehiculos.findAllMarcas(query).then((response) => response.data);
  }
  async findOneMarca(id: ApiParam<'vehiculos', 'findOneMarca', 'id'>) {
    return await this.api.vehiculos.findOneMarca({ id }).then((response) => response.data);
  }
  async createMarca(marca: ApiBody<'vehiculos', 'createMarca'>) {
    return await this.api.vehiculos.createMarca(marca).then((response) => response.data);
  }
  async updateMarca(id: ApiParam<'vehiculos', 'updateMarca', 'id'>, marca: ApiBody<'vehiculos', 'updateMarca'>) {
    return await this.api.vehiculos.updateMarca({ id }, marca).then((response) => response.data);
  }
  async deleteMarca(id: ApiParam<'vehiculos', 'deleteMarca', 'id'>) {
    return await this.api.vehiculos.deleteMarca({ id }).then((response) => response.data);
  }
  // ========== MODELOS ==========
  async findAllModelos(query: ApiQuery<'vehiculos', 'findAllModelos'>) {
    return await this.api.vehiculos.findAllModelos(query).then((response) => response.data);
  }
  async findOneModelo(id: ApiParam<'vehiculos', 'findOneModelo', 'id'>) {
    return await this.api.vehiculos.findOneModelo({ id }).then((response) => response.data);
  }
  async createModelo(modelo: ApiBody<'vehiculos', 'createModelo'>) {
    return await this.api.vehiculos.createModelo(modelo).then((response) => response.data);
  }
  async updateModelo(
    id: ApiParam<'vehiculos', 'updateModelo', 'id'>,
    modelo: ApiBody<'vehiculos', 'updateModelo'>
  ) {
    return await this.api.vehiculos.updateModelo({ id }, modelo).then((response) => response.data);
  }
  async deleteModelo(id: ApiParam<'vehiculos', 'deleteModelo', 'id'>) {
    return await this.api.vehiculos.deleteModelo({ id }).then((response) => response.data);
  }
}
