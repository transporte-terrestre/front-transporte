export type NotificacionTipo = 'info' | 'warning' | 'error' | 'success';

export interface NotificacionResultDto {
  id: number;
  titulo: string;
  mensaje: string;
  tipo: NotificacionTipo;
  creadoEn: string;
  leido: boolean;
}

export interface NotificacionCreateDto {
  titulo: string;
  mensaje: string;
  tipo?: NotificacionTipo;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedNotificacionResultDto {
  data: NotificacionResultDto[];
  meta: PaginationMeta;
}

export interface NotificacionPaginationParams {
  page?: number;
  limit?: number;
  userId: number;
}
