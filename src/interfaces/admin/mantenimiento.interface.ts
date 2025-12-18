import { TallerResultDto } from "./taller.interface";
import { VehiculoResultDto } from "./vehiculo.interface";

export type TipoMantenimiento = 'preventivo' | 'correctivo';
export type MantenimientoEstado = 'pendiente' | 'en_proceso' | 'finalizado';

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
  codigo?: string;
  categoria?: string;
  descripcion: string;
  responsable?: string;
  horaInicio?: string;
  horaFin?: string;
  completada: boolean;
  costoEstimado?: string;
  costoReal?: string;
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
  codigoOrden: string;
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
  codigo?: string;
  categoria?: string;
  descripcion: string;
  responsable?: string;
  horaInicio?: string;
  horaFin?: string;
  completada?: boolean;
  costoEstimado?: string;
  costoReal?: string;
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
