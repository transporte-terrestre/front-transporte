export interface ClienteDocumentoResultDto {
  id: number;
  clienteId: number;
  tipo: 'dni' | 'ruc' | 'contrato' | 'carta_compromiso' | 'ficha_ruc' | 'otros';
  nombre: string;
  url: string;
  fechaExpiracion?: string | null;
  fechaEmision?: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface DocumentosAgrupadosClienteDto {
  dni: ClienteDocumentoResultDto[];
  ruc: ClienteDocumentoResultDto[];
  contrato: ClienteDocumentoResultDto[];
  carta_compromiso: ClienteDocumentoResultDto[];
  ficha_ruc: ClienteDocumentoResultDto[];
  otros: ClienteDocumentoResultDto[];
}

export interface ClienteListDto {
  id: number;
  dni: string | null;
  nombres: string | null;
  apellidos: string | null;
  razonSocial: string | null;
  nombreCompleto: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  imagenes: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface ClienteResultDto {
  id: number;
  tipoDocumento: 'DNI' | 'RUC';
  dni: string | null;
  ruc: string | null;
  nombres: string | null;
  apellidos: string | null;
  razonSocial: string | null;
  nombreCompleto: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  imagenes: string[];
  creadoEn: string;
  actualizadoEn: string;
  documentos: DocumentosAgrupadosClienteDto;
}

export interface ClienteCreateDto {
  tipoDocumento: 'DNI' | 'RUC';
  dni?: string;
  ruc?: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  imagenes?: string[];
}

export interface ClienteUpdateDto extends Partial<ClienteCreateDto> {}

export interface ClienteDocumentoCreateDto {
  clienteId: number;
  tipo: 'dni' | 'ruc' | 'contrato' | 'carta_compromiso' | 'ficha_ruc' | 'otros';
  nombre: string;
  url: string;
  fechaExpiracion?: string;
  fechaEmision?: string;
}

export interface ClienteDocumentoUpdateDto
  extends Partial<Omit<ClienteDocumentoCreateDto, 'clienteId'>> {}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedClienteResultDto {
  data: ClienteListDto[];
  meta: PaginationMeta;
}

export interface ClientePaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoDocumento?: 'DNI' | 'RUC';
}
