export interface TallerResultDto {
  id: number;
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  contacto?: string;
  estado: 'activo' | 'inactivo';
  creadoEn: string;
  actualizadoEn: string;
}

export interface TallerCreateDto {
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  contacto?: string;
  estado?: 'activo' | 'inactivo';
}

export interface TallerUpdateDto extends Partial<TallerCreateDto> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedTallerResultDto {
  data: TallerResultDto[];
  meta: PaginationMeta;
}

export interface TallerPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'activo' | 'inactivo';
}
