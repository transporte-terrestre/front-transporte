export type ClaseLicencia = 'Uno' | 'Dos' | 'Tres';
export type CategoriaLicencia = 'A' | 'B';

export interface ConductorDocumentoResultDto {
  id: number;
  conductorId: number;
  tipo:
    | 'dni'
    | 'licencia_mtc'
    | 'seguro_vida_ley'
    | 'sctr'
    | 'examen_medico'
    | 'psicosensometrico'
    | 'induccion_general'
    | 'manejo_defensivo'
    | 'licencia_interna';
  url: string;
  fechaExpiracion?: string | null;
  fechaEmision?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DocumentosAgrupadosConductorDto {
  dni: ConductorDocumentoResultDto[];
  licencia_mtc: ConductorDocumentoResultDto[];
  seguro_vida_ley: ConductorDocumentoResultDto[];
  sctr: ConductorDocumentoResultDto[];
  examen_medico: ConductorDocumentoResultDto[];
  psicosensometrico: ConductorDocumentoResultDto[];
  induccion_general: ConductorDocumentoResultDto[];
  manejo_defensivo: ConductorDocumentoResultDto[];
  licencia_interna: ConductorDocumentoResultDto[];
}

export interface ConductorListDto {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  numeroLicencia: string;
  claseLicencia: ClaseLicencia;
  categoriaLicencia: CategoriaLicencia;
  fotocheck: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConductorResultDto {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  numeroLicencia: string;
  claseLicencia: ClaseLicencia;
  categoriaLicencia: CategoriaLicencia;
  fotocheck: string[];
  creadoEn: string;
  actualizadoEn: string;
  documentos: DocumentosAgrupadosConductorDto;
}

export interface ConductorCreateDto {
  dni: string;
  nombres: string;
  apellidos: string;
  numeroLicencia: string;
  claseLicencia: ClaseLicencia;
  categoriaLicencia: CategoriaLicencia;
  fotocheck?: string[];
}

export interface ConductorUpdateDto extends Partial<ConductorCreateDto> {}

export interface ConductorDocumentoCreateDto {
  conductorId: number;
  tipo:
    | 'dni'
    | 'licencia_mtc'
    | 'seguro_vida_ley'
    | 'sctr'
    | 'examen_medico'
    | 'psicosensometrico'
    | 'induccion_general'
    | 'manejo_defensivo'
    | 'licencia_interna';
  url: string;
  fechaExpiracion?: string;
  fechaEmision?: string;
}

export interface ConductorDocumentoUpdateDto
  extends Partial<Omit<ConductorDocumentoCreateDto, 'conductorId'>> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedConductorResultDto {
  data: ConductorListDto[];
  meta: PaginationMeta;
}

export interface ConductorPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  claseLicencia?: ClaseLicencia;
  categoriaLicencia?: CategoriaLicencia;
}
