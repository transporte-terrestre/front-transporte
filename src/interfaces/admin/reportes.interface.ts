export interface ReporteQueryDto {
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ViajeDetalladoDto {
  id: number;
  tipoRuta: string;
  rutaOcasional: string | null;
  rutaOrigen: string | null;
  rutaDestino: string | null;
  distanciaEstimada: string | null;
  distanciaFinal: string | null;
  diferencia: number;
  estado: string;
  modalidadServicio: string;
  fechaSalida: string;
  fechaLlegada: string | null;
}

export interface MantenimientoDetalladoVehiculoDto {
  id: number;
  codigoOrden: string | null;
  tipo: string;
  estado: string;
  descripcion: string;
  kilometraje: number;
  costoTotal: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  tallerNombre: string;
  tallerTipo: string;
}

export interface MantenimientoDetalladoTallerDto {
  id: number;
  codigoOrden: string | null;
  tipo: string;
  estado: string;
  descripcion: string;
  kilometraje: number;
  costoTotal: string;
  fechaIngreso: string;
  fechaSalida: string | null;
  vehiculoPlaca: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
}
