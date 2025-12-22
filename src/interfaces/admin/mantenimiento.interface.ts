import { TallerResultDto } from './taller.interface';
import { VehiculoResultDto } from './vehiculo.interface';

export type TipoMantenimiento = 'preventivo' | 'correctivo';
export type MantenimientoEstado = 'pendiente' | 'en_proceso' | 'finalizado';

// ========== CATÁLOGO DE TAREAS ==========
export interface TareaResultDto {
  id: number;
  codigo: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TareaCreateDto {
  codigo: string;
  descripcion: string;
}

export interface TareaUpdateDto extends Partial<TareaCreateDto> {}

export interface PaginatedTareaResultDto {
  data: TareaResultDto[];
  meta: PaginationMeta;
}

// ========== MANTENIMIENTO ==========
export interface MantenimientoResultDto {
  id: number;
  vehiculoId: number;
  tallerId: number;
  codigoOrden: string;
  tipo: TipoMantenimiento;
  costoTotal: string;
  descripcion: string;
  fechaIngreso: string;
  fechaSalida: string;
  kilometraje: number;
  estado: MantenimientoEstado;
  creadoEn: string;
  actualizadoEn: string;
  vehiculo?: VehiculoResultDto;
  taller?: TallerResultDto;
  tareas: MantenimientoTareaResultDto[];
  documentos: MantenimientoDocumentoResultDto[];
}

export interface MantenimientoTareaResultDto {
  id: number;
  mantenimientoId: number;
  tareaId: number;
  tarea: TareaResultDto;
  responsable?: string;
  horaInicio?: string;
  horaFin?: string;
  completada: boolean;
  observaciones?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MantenimientoDocumentoResultDto {
  id: number;
  mantenimientoId: number;
  tipo: string;
  nombre: string;
  url: string;
  descripcion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MantenimientoCreateDto {
  vehiculoId: number;
  tallerId: number;
  tipo: TipoMantenimiento;
  costoTotal: string;
  descripcion: string;
  fechaIngreso: string;
  fechaSalida: string;
  kilometraje: number;
  estado: MantenimientoEstado;
}

export interface MantenimientoTareaCreateDto {
  mantenimientoId: number;
  tareaId: number;
  responsable?: string;
  horaInicio?: string;
  horaFin?: string;
  completada?: boolean;
  observaciones?: string;
}

export interface MantenimientoTareaUpdateDto extends Partial<MantenimientoTareaCreateDto> {}

export interface MantenimientoDocumentoCreateDto {
  mantenimientoId: number;
  tipo: string;
  nombre: string;
  url: string;
  descripcion?: string;
}

export interface MantenimientoDocumentoUpdateDto extends Partial<MantenimientoDocumentoCreateDto> {}

export interface MantenimientoUpdateDto extends Partial<MantenimientoCreateDto> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedMantenimientoResultDto {
  data: MantenimientoResultDto[];
  meta: PaginationMeta;
}

export interface MantenimientoPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipo?: TipoMantenimiento;
  estado?: MantenimientoEstado;
}
