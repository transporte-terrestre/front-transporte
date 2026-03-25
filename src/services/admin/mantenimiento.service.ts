import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam, ApiResponse } from 'api/backend.api';
import { generateOrdenServicioPdf, SignatureSelection } from '@template/orden-servicio.template';

@Injectable({
  providedIn: 'root',
})
export class MantenimientoService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'mantenimientos', 'findAll'>) {
    return await this.api.mantenimientos.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'mantenimientos', 'findOne', 'id'>) {
    return await this.api.mantenimientos.findOne({ id }).then((response) => response.data);
  }
  async create(mantenimiento: ApiBody<'mantenimientos', 'create'>) {
    return await this.api.mantenimientos.create(mantenimiento).then((response) => response.data);
  }
  async update(
    id: ApiParam<'mantenimientos', 'update', 'id'>,
    mantenimiento: ApiBody<'mantenimientos', 'update'>,
  ) {
    return await this.api.mantenimientos
      .update({ id }, mantenimiento)
      .then((response) => response.data);
  }
  async delete(id: ApiParam<'mantenimientos', 'remove', 'id'>) {
    return await this.api.mantenimientos.remove({ id }).then((response) => response.data);
  }

  async getReporteEstadoVehiculos(query: ApiQuery<'mantenimientos', 'getReporteEstadoVehiculos'>) {
    return await this.api.mantenimientos
      .getReporteEstadoVehiculos(query)
      .then((response) => response.data);
  }

  // ========== CATÁLOGO DE TAREAS ==========
  async findAllTareas(query: ApiQuery<'mantenimientos', 'findAllTareas'>) {
    return await this.api.mantenimientos.findAllTareas(query).then((response) => response.data);
  }
  async findOneTarea(id: ApiParam<'mantenimientos', 'findOneTarea', 'id'>) {
    return await this.api.mantenimientos.findOneTarea({ id }).then((response) => response.data);
  }
  async createTareaCatalogo(tarea: ApiBody<'mantenimientos', 'createTarea'>) {
    return await this.api.mantenimientos.createTarea(tarea).then((response) => response.data);
  }
  async updateTareaCatalogo(
    id: ApiParam<'mantenimientos', 'updateTarea', 'id'>,
    tarea: ApiBody<'mantenimientos', 'updateTarea'>,
  ) {
    return await this.api.mantenimientos
      .updateTarea({ id }, tarea)
      .then((response) => response.data);
  }
  async deleteTareaCatalogo(id: ApiParam<'mantenimientos', 'deleteTarea', 'id'>) {
    return await this.api.mantenimientos.deleteTarea({ id }).then((response) => response.data);
  }
  // ========== MANTENIMIENTO-TAREAS (relación) ==========
  async createMantenimientoTarea(tarea: ApiBody<'mantenimientos', 'createMantenimientoTarea'>) {
    return await this.api.mantenimientos
      .createMantenimientoTarea(tarea)
      .then((response) => response.data);
  }
  async updateMantenimientoTarea(
    id: ApiParam<'mantenimientos', 'updateMantenimientoTarea', 'id'>,
    tarea: ApiBody<'mantenimientos', 'updateMantenimientoTarea'>,
  ) {
    return await this.api.mantenimientos
      .updateMantenimientoTarea({ id }, tarea)
      .then((response) => response.data);
  }
  async deleteMantenimientoTarea(id: ApiParam<'mantenimientos', 'deleteMantenimientoTarea', 'id'>) {
    return await this.api.mantenimientos
      .deleteMantenimientoTarea({ id })
      .then((response) => response.data);
  }
  // ========== DOCUMENTOS ==========
  async createDocumento(documento: ApiBody<'mantenimientos', 'createDocumento'>) {
    return await this.api.mantenimientos
      .createDocumento(documento)
      .then((response) => response.data);
  }
  async updateDocumento(
    id: ApiParam<'mantenimientos', 'updateDocumento', 'id'>,
    documento: ApiBody<'mantenimientos', 'updateDocumento'>,
  ) {
    return await this.api.mantenimientos
      .updateDocumento({ id }, documento)
      .then((response) => response.data);
  }
  async deleteDocumento(id: ApiParam<'mantenimientos', 'deleteDocumento', 'id'>) {
    return await this.api.mantenimientos.deleteDocumento({ id }).then((response) => response.data);
  }
  async generateOrdenServicio(
    mantenimiento: ApiResponse<'mantenimientos', 'findOne'>,
    signatures?: SignatureSelection[]
  ) {
    await generateOrdenServicioPdf(mantenimiento, signatures, this.api);
  }
}
