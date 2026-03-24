import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiParam, ApiQuery } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class AlquilerService {
  private api = inject(Api);

  async findAll(query?: ApiQuery<'alquileres', 'findAll'>) {
    const { data } = await this.api.alquileres.findAll(query || {});
    return data;
  }

  async findOne(id: number) {
    const { data } = await this.api.alquileres.findOne({ id });
    return data;
  }

  async create(payload: ApiBody<'alquileres', 'create'>) {
    const { data } = await this.api.alquileres.create(payload);
    return data;
  }

  async update(id: number, payload: ApiBody<'alquileres', 'update'>) {
    const { data } = await this.api.alquileres.update({ id }, payload);
    return data;
  }

  async terminar(id: number, payload: ApiBody<'alquileres', 'terminar'>) {
    const { data } = await this.api.alquileres.terminar({ id }, payload);
    return data;
  }

  async findDocumento(id: ApiParam<'alquileres', 'findDocumento', 'id'>) {
    const { data } = await this.api.alquileres.findDocumento({ id });
    return data;
  }

  async createDocumento(payload: ApiBody<'alquileres', 'createDocumento'>) {
    const { data } = await this.api.alquileres.createDocumento(payload);
    return data;
  }

  async updateDocumento(id: ApiParam<'alquileres', 'updateDocumento', 'id'>, payload: ApiBody<'alquileres', 'updateDocumento'>) {
    const { data } = await this.api.alquileres.updateDocumento({ id }, payload);
    return data;
  }

  async deleteDocumento(id: ApiParam<'alquileres', 'deleteDocumento', 'id'>) {
    const { data } = await this.api.alquileres.deleteDocumento({ id });
    return data;
  }

  async delete(id: number) {
    const { data } = await this.api.alquileres.delete({ id });
    return data;
  }

  async validarVehiculo(query: ApiQuery<'alquileres', 'validarVehiculo'>) {
    const { data } = await this.api.alquileres.validarVehiculo(query);
    return data;
  }
}
