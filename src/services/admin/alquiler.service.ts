import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody } from 'api/backend.api';

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

  async delete(id: number) {
    const { data } = await this.api.alquileres.delete({ id });
    return data;
  }
}
