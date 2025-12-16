export type VehiculoEstado = 'activo' | 'taller' | 'retirado';

export interface VehiculoDocumentoResultDto {
  id: number;
  vehiculoId: number;
  tipo:
    | 'tarjeta_propiedad'
    | 'tarjeta_unica_circulacion'
    | 'citv'
    | 'soat'
    | 'poliza'
    | 'certificado_operatividad_factura'
    | 'plan_mantenimiento_historico'
    | 'certificado_instalacion_gps'
    | 'certificado_valor_anadido'
    | 'constancia_gps'
    | 'certificado_tacos'
    | 'certificado_extintores_hidrostatica'
    | 'certificado_norma_r66'
    | 'certificado_laminados_lunas'
    | 'certificado_carroceria'
    | 'certificado_caracteristicas_tecnicas'
    | 'certificado_adas'
    | 'otros';
  url: string;
  fechaExpiracion?: string | null;
  fechaEmision?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DocumentosAgrupadosVehiculoDto {
  tarjeta_propiedad: VehiculoDocumentoResultDto[];
  tarjeta_unica_circulacion: VehiculoDocumentoResultDto[];
  citv: VehiculoDocumentoResultDto[];
  soat: VehiculoDocumentoResultDto[];
  poliza: VehiculoDocumentoResultDto[];
  certificado_operatividad_factura: VehiculoDocumentoResultDto[];
  plan_mantenimiento_historico: VehiculoDocumentoResultDto[];
  certificado_instalacion_gps: VehiculoDocumentoResultDto[];
  certificado_valor_anadido: VehiculoDocumentoResultDto[];
  constancia_gps: VehiculoDocumentoResultDto[];
  certificado_tacos: VehiculoDocumentoResultDto[];
  certificado_extintores_hidrostatica: VehiculoDocumentoResultDto[];
  certificado_norma_r66: VehiculoDocumentoResultDto[];
  certificado_laminados_lunas: VehiculoDocumentoResultDto[];
  certificado_carroceria: VehiculoDocumentoResultDto[];
  certificado_caracteristicas_tecnicas: VehiculoDocumentoResultDto[];
  certificado_adas: VehiculoDocumentoResultDto[];
  otros: VehiculoDocumentoResultDto[];
}

export interface VehiculoListDto {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  estado: VehiculoEstado;
  imagenes: string[];
  fechaVencimientoSoat?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface VehiculoResultDto {
  id: number;
  placa: string;
  codigoInterno: string | null;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  fechaVencimientoSoat: string;
  estado: VehiculoEstado;
  imagenes: string[];
  documentosLegacy: string[];
  documentos: DocumentosAgrupadosVehiculoDto;
  creadoEn: string;
  actualizadoEn: string;
}

export interface VehiculoCreateDto {
  placa: string;
  codigoInterno?: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  fechaVencimientoSoat: string;
  estado?: VehiculoEstado;
  imagenes?: string[];
  documentos?: string[];
}

export interface VehiculoUpdateDto extends Partial<VehiculoCreateDto> {}

export interface VehiculoDocumentoCreateDto {
  vehiculoId: number;
  tipo:
    | 'tarjeta_propiedad'
    | 'tarjeta_unica_circulacion'
    | 'citv'
    | 'soat'
    | 'poliza'
    | 'certificado_operatividad_factura'
    | 'plan_mantenimiento_historico'
    | 'certificado_instalacion_gps'
    | 'certificado_valor_anadido'
    | 'constancia_gps'
    | 'certificado_tacos'
    | 'certificado_extintores_hidrostatica'
    | 'certificado_norma_r66'
    | 'certificado_laminados_lunas'
    | 'certificado_carroceria'
    | 'certificado_caracteristicas_tecnicas'
    | 'certificado_adas'
    | 'otros';
  url: string;
  fechaExpiracion?: string;
  fechaEmision?: string;
}

export interface VehiculoDocumentoUpdateDto
  extends Partial<Omit<VehiculoDocumentoCreateDto, 'vehiculoId'>> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedVehiculoResultDto {
  data: VehiculoListDto[];
  meta: PaginationMeta;
}

export interface VehiculoPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: VehiculoEstado;
}
