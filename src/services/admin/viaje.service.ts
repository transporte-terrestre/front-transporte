import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam, ApiResponse } from 'api/backend.api';
import { generateHojaRutaPdf } from '@template/hoja-ruta.template';
type ViajeResultDto = ApiResponse<'viajes', 'findOne'>;
@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'viajes', 'findAll'>) {
    return await this.api.viajes.findAll(query).then((response) => response.data);
  }
  async findOne(id: ApiParam<'viajes', 'findOne', 'id'>) {
    const viaje = await this.api.viajes.findOne({ id }).then((response) => response.data);
    const conductorPrincipal = viaje.conductores?.find((c) => c.esPrincipal);
    const vehiculoPrincipal = viaje.vehiculos?.find((v) => v.esPrincipal);
    return {
      ...viaje,
      conductorPrincipal,
      vehiculoPrincipal,
    };
  }
  async create(viaje: ApiBody<'viajes', 'create'>) {
    return await this.api.viajes.create(viaje).then((response) => response.data);
  }
  async update(id: ApiParam<'viajes', 'update', 'id'>, viaje: ApiBody<'viajes', 'update'>) {
    return await this.api.viajes.update({ id }, viaje).then((response) => response.data);
  }
  async delete(id: ApiParam<'viajes', 'remove', 'id'>) {
    return await this.api.viajes.remove({ id }).then((response) => response.data);
  }

  // Pasajeros
  async findPasajeros(viajeId: number) {
    return await this.api.viajes.findPasajeros({ viajeId }).then((response) => response.data);
  }

  async upsertPasajeros(viajeId: number, pasajeros: { pasajeroId: number; asistencia: boolean }[]) {
    return await this.api.viajes
      .upsertPasajeros({ viajeId }, { pasajeros })
      .then((response) => response.data);
  }
  // Conductores
  async getConductores(viajeId: ApiParam<'viajes', 'findConductores', 'viajeId'>) {
    return await this.api.viajes.findConductores({ viajeId }).then((response) => response.data);
  }
  async assignConductor(data: ApiBody<'viajes', 'assignConductor'>) {
    return await this.api.viajes.assignConductor(data).then((response) => response.data);
  }
  async updateConductor(
    viajeId: ApiParam<'viajes', 'updateConductor', 'viajeId'>,
    conductorId: ApiParam<'viajes', 'updateConductor', 'conductorId'>,
    data: ApiBody<'viajes', 'updateConductor'>,
  ) {
    return await this.api.viajes
      .updateConductor({ viajeId, conductorId }, data)
      .then((response) => response.data);
  }
  async removeConductor(
    viajeId: ApiParam<'viajes', 'removeConductor', 'viajeId'>,
    conductorId: ApiParam<'viajes', 'removeConductor', 'conductorId'>,
  ) {
    return await this.api.viajes
      .removeConductor({ viajeId, conductorId })
      .then((response) => response.data);
  }
  // Vehiculos
  async getVehiculos(viajeId: ApiParam<'viajes', 'findVehiculos', 'viajeId'>) {
    return await this.api.viajes.findVehiculos({ viajeId }).then((response) => response.data);
  }
  async assignVehiculo(data: ApiBody<'viajes', 'assignVehiculo'>) {
    return await this.api.viajes.assignVehiculo(data).then((response) => response.data);
  }
  async updateVehiculo(
    viajeId: ApiParam<'viajes', 'updateVehiculo', 'viajeId'>,
    vehiculoId: ApiParam<'viajes', 'updateVehiculo', 'vehiculoId'>,
    data: ApiBody<'viajes', 'updateVehiculo'>,
  ) {
    return await this.api.viajes
      .updateVehiculo({ viajeId, vehiculoId }, data)
      .then((response) => response.data);
  }
  async removeVehiculo(
    viajeId: ApiParam<'viajes', 'removeVehiculo', 'viajeId'>,
    vehiculoId: ApiParam<'viajes', 'removeVehiculo', 'vehiculoId'>,
  ) {
    return await this.api.viajes
      .removeVehiculo({ viajeId, vehiculoId })
      .then((response) => response.data);
  }
  // Comentarios
  async getComentarios(viajeId: ApiParam<'viajes', 'findComentarios', 'viajeId'>) {
    return await this.api.viajes.findComentarios({ viajeId }).then((response) => response.data);
  }
  async createComentario(data: ApiBody<'viajes', 'createComentario'>) {
    return await this.api.viajes.createComentario(data).then((response) => response.data);
  }
  async updateComentario(
    id: ApiParam<'viajes', 'updateComentario', 'id'>,
    data: ApiBody<'viajes', 'updateComentario'>,
  ) {
    return await this.api.viajes.updateComentario({ id }, data).then((response) => response.data);
  }
  async deleteComentario(id: ApiParam<'viajes', 'deleteComentario', 'id'>) {
    return await this.api.viajes.deleteComentario({ id }).then((response) => response.data);
  }
  // Servicios / Tramos
  async findServicios(viajeId: ApiParam<'viajes', 'findServicios', 'viajeId'>) {
    return await this.api.viajes.findServicios({ viajeId }).then((response) => response.data);
  }

  async registrarSalida(
    viajeId: ApiParam<'viajes', 'registrarSalida', 'viajeId'>,
    data: ApiBody<'viajes', 'registrarSalida'>,
  ) {
    return await this.api.viajes
      .registrarSalida({ viajeId }, data)
      .then((response) => response.data);
  }

  async registrarLlegada(
    viajeId: ApiParam<'viajes', 'registrarLlegada', 'viajeId'>,
    data: ApiBody<'viajes', 'registrarLlegada'>,
  ) {
    return await this.api.viajes
      .registrarLlegada({ viajeId }, data)
      .then((response) => response.data);
  }

  async registrarPunto(
    viajeId: ApiParam<'viajes', 'registrarPunto', 'viajeId'>,
    data: ApiBody<'viajes', 'registrarPunto'>,
  ) {
    return await this.api.viajes
      .registrarPunto({ viajeId }, data)
      .then((response) => response.data);
  }

  async registrarParada(
    viajeId: ApiParam<'viajes', 'registrarParada', 'viajeId'>,
    data: ApiBody<'viajes', 'registrarParada'>,
  ) {
    return await this.api.viajes
      .registrarParada({ viajeId }, data)
      .then((response) => response.data);
  }

  async registrarDescanso(
    viajeId: ApiParam<'viajes', 'registrarDescanso', 'viajeId'>,
    data: ApiBody<'viajes', 'registrarDescanso'>,
  ) {
    return await this.api.viajes
      .registrarDescanso({ viajeId }, data)
      .then((response) => response.data);
  }

  async updateServicio(
    id: ApiParam<'viajes', 'updateServicio', 'id'>,
    data: ApiBody<'viajes', 'updateServicio'>,
  ) {
    return await this.api.viajes.updateServicio({ id }, data).then((response) => response.data);
  }

  async deleteServicio(id: ApiParam<'viajes', 'deleteServicio', 'id'>) {
    return await this.api.viajes.deleteServicio({ id }).then((response) => response.data);
  }

  async getProximoTramo(viajeId: number) {
    return await this.api.viajes.getProximoTramo({ viajeId }).then((response) => response.data);
  }

  async getHojaRuta(viajeId: number) {
    return await this.api.viajes.getHojaRuta({ viajeId }).then((response) => response.data);
  }

  async findTrayecto(viajeId: number) {
    return await this.api.viajes.findTrayecto({ id: viajeId }).then((response) => response.data);
  }

  generateHojaRuta(viaje: ViajeResultDto): void {
    generateHojaRutaPdf(viaje);
  }
}
