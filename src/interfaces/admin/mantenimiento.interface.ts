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
