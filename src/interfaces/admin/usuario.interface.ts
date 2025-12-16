export type Rol = 'admin' | 'empleado';

export interface UsuarioDocumentoResultDto {
  id: number;
  usuarioId: number;
  tipo: 'dni' | 'seguro_vida_ley' | 'sctr' | 'examen_medico' | 'induccion_general';
  url: string;
  fechaExpiracion?: string | null;
  fechaEmision?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DocumentosAgrupadosDto {
  dni: UsuarioDocumentoResultDto[];
  seguro_vida_ley: UsuarioDocumentoResultDto[];
  sctr: UsuarioDocumentoResultDto[];
  examen_medico: UsuarioDocumentoResultDto[];
  induccion_general: UsuarioDocumentoResultDto[];
}

export interface UsuarioListDto {
  id: number;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  email: string;
  roles: Rol[];
  fotocheck: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsuarioResultDto extends UsuarioListDto {
  documentos: DocumentosAgrupadosDto;
}

export interface UsuarioCreateDto {
  nombres: string;
  apellidos: string;
  email: string;
  contrasenia: string;
  roles: Rol[];
  fotocheck?: string[];
}

export interface UsuarioUpdateDto extends Partial<UsuarioCreateDto> {}

export interface UsuarioDocumentoCreateDto {
  usuarioId: number;
  tipo: 'dni' | 'seguro_vida_ley' | 'sctr' | 'examen_medico' | 'induccion_general';
  url: string;
  fechaExpiracion?: string;
  fechaEmision?: string;
}

export interface UsuarioDocumentoUpdateDto
  extends Partial<Omit<UsuarioDocumentoCreateDto, 'usuarioId'>> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedUsuarioResultDto {
  data: UsuarioListDto[];
  meta: PaginationMeta;
}

export interface UsuarioPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  rol?: Rol;
}
