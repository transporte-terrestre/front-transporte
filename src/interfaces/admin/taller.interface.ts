export type TallerTipo = 'interno' | 'externo';

export interface TallerResultDto {
  id: number;
  ruc?: string;
  razonSocial: string;
  nombreComercial?: string;
  tipo: TallerTipo;
  telefono?: string;
  email?: string;
  direccion?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface TallerCreateDto {
  ruc?: string;
  razonSocial: string;
  nombreComercial?: string;
  tipo: TallerTipo;
  telefono?: string;
  email?: string;
  direccion?: string;
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
  tipo?: TallerTipo;
}
