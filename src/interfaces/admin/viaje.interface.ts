import { RutaResultDto } from './ruta.interface';

export type ViajeEstado = 'programado' | 'en_progreso' | 'completado' | 'cancelado';
export type ViajeModalidadServicio = 'regular' | 'expreso' | 'ejecutivo' | 'especial' | 'turismo';
export type ViajeTipoRuta = 'ocasional' | 'fija';

export interface ViajeListDto {
  id: number;
  rutaId?: number;
  rutaOcasional?: string;
  tipoRuta: ViajeTipoRuta;
  clienteId: number;
  tripulantes?: string[];
  modalidadServicio: ViajeModalidadServicio;
  estado: ViajeEstado;
  fechaSalida: string;
  fechaLlegada?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ViajeResultDto {
  id: number;
  rutaId?: number;
  rutaOcasional?: string;
  tipoRuta: ViajeTipoRuta;
  clienteId: number;
  tripulantes?: string[];
  modalidadServicio: ViajeModalidadServicio;
  estado: ViajeEstado;
  fechaSalida: string;
  fechaLlegada?: string | null;
  creadoEn: string;
  actualizadoEn: string;
  conductores?: ViajeConductorResultDto[];
  vehiculos?: ViajeVehiculoResultDto[];
  ruta?: RutaResultDto;
}

export interface ViajeCreateDto {
  rutaId?: number;
  rutaOcasional?: string;
  tipoRuta?: ViajeTipoRuta;
  clienteId: number;
  tripulantes?: string[];
  modalidadServicio?: ViajeModalidadServicio;
  fechaSalida: string;
  fechaLlegada?: string | null;
  estado?: ViajeEstado;
}

export interface ViajeUpdateDto extends Partial<ViajeCreateDto> {}

export interface ViajeConductorResultDto {
  viajeId: number;
  conductorId: number;
  esPrincipal: boolean;
  rol: 'conductor' | 'copiloto' | 'auxiliar';
  creadoEn: string;
  actualizadoEn: string;
}

export interface ViajeConductorCreateDto {
  viajeId: number;
  conductorId: number;
  esPrincipal: boolean;
  rol?: 'conductor' | 'copiloto' | 'auxiliar';
}

export interface ViajeConductorUpdateDto
  extends Partial<Omit<ViajeConductorCreateDto, 'viajeId' | 'conductorId'>> {}

export interface ViajeVehiculoResultDto {
  viajeId: number;
  vehiculoId: number;
  esPrincipal: boolean;
  rol: 'principal' | 'apoyo' | 'emergencia';
  creadoEn: string;
  actualizadoEn: string;
}

export interface ViajeVehiculoCreateDto {
  viajeId: number;
  vehiculoId: number;
  esPrincipal: boolean;
  rol?: 'principal' | 'apoyo' | 'emergencia';
}

export interface ViajeVehiculoUpdateDto
  extends Partial<Omit<ViajeVehiculoCreateDto, 'viajeId' | 'vehiculoId'>> {}

export interface ViajeComentarioResultDto {
  id: number;
  viajeId: number;
  usuarioId: number;
  comentario: string;
  tipo: 'observacion' | 'incidencia' | 'novedad' | 'general';
  creadoEn: string;
  actualizadoEn: string;
}

export interface ViajeComentarioCreateDto {
  viajeId: number;
  usuarioId: number;
  comentario: string;
  tipo?: 'observacion' | 'incidencia' | 'novedad' | 'general';
}

export interface ViajeComentarioUpdateDto
  extends Partial<Omit<ViajeComentarioCreateDto, 'viajeId' | 'usuarioId'>> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedViajeResultDto {
  data: ViajeListDto[];
  meta: PaginationMeta;
}

export interface ViajePaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: ViajeEstado;
  modalidadServicio?: ViajeModalidadServicio;
  tipoRuta?: ViajeTipoRuta;
}
