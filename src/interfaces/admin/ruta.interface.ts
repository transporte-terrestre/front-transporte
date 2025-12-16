export interface RutaResultDto {
  id: number;
  origen: string;
  destino: string;
  origenLat: string;
  origenLng: string;
  destinoLat: string;
  destinoLng: string;
  distancia: string;
  costoBase: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RutaCreateDto {
  origen: string;
  destino: string;
  origenLat: string;
  origenLng: string;
  destinoLat: string;
  destinoLng: string;
  distancia: string;
  costoBase: string;
}

export interface RutaUpdateDto extends Partial<RutaCreateDto> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedRutaResultDto {
  data: RutaResultDto[];
  meta: PaginationMeta;
}

export interface RutaPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
}
