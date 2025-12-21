export interface ReporteQueryDto {
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ReporteViajesVehiculoDto {
  vehiculoId: number;
  placa: string;
  marca: string;
  modelo: string;
  totalViajes: number;
}

export interface ReporteViajesConductorDto {
  conductorId: number;
  nombreCompleto: string;
  dni: string;
  totalViajes: number;
}

export interface ReporteKilometrajeVehiculoDto {
  vehiculoId: number;
  placa: string;
  totalKilometros: number;
  totalViajes: number;
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
