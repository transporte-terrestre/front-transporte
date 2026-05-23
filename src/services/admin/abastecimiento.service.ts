import { Injectable, inject } from '@angular/core';
import { Api, ApiBody, ApiParam, ApiQuery } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class AbastecimientoService {
  private api = inject(Api);

  async findAll(query: ApiQuery<'abastecimientos', 'findAll'>) {
    return await this.api.abastecimientos.findAll(query).then((response) => response.data);
  }

  async findOne(id: ApiParam<'abastecimientos', 'findOne', 'id'>) {
    return await this.api.abastecimientos.findOne({ id }).then((response) => response.data);
  }

  async findByVehiculo(vehiculoId: ApiParam<'abastecimientos', 'findByVehiculo', 'vehiculoId'>) {
    return await this.api.abastecimientos.findByVehiculo({ vehiculoId }).then((response) => response.data);
  }

  async findByTramo(viajeTramoId: ApiParam<'abastecimientos', 'findByTramo', 'viajeTramoId'>) {
    return await this.api.abastecimientos.findByTramo({ viajeTramoId }).then((response) => response.data);
  }

  async create(data: ApiBody<'abastecimientos', 'create'>) {
    return await this.api.abastecimientos.create(data).then((response) => response.data);
  }

  async update(
    id: ApiParam<'abastecimientos', 'update', 'id'>,
    data: ApiBody<'abastecimientos', 'update'>,
  ) {
    return await this.api.abastecimientos.update({ id }, data).then((response) => response.data);
  }

  async delete(id: ApiParam<'abastecimientos', 'delete', 'id'>) {
    return await this.api.abastecimientos.delete({ id }).then((response) => response.data);
  }
}
