/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface LoginDto {
  /**
   * User email
   * @example "xerickcua@gmail.com"
   */
  email: string;
  /**
   * User password
   * @example "123456"
   */
  password: string;
}

export interface UsuarioLoginInfoDto {
  /**
   * User ID
   * @example 1
   */
  id: number;
  /**
   * User first names
   * @example "John Michael"
   */
  nombres: string;
  /**
   * User last names
   * @example "Doe Smith"
   */
  apellidos: string;
  /**
   * User full name
   * @example "John Michael Doe Smith"
   */
  nombreCompleto: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User roles
   * @example ["empleado"]
   */
  roles: ("empleado" | "admin")[];
  /**
   * User fotocheck URLs
   * @example ["https://storage.example.com/fotocheck/1.jpg"]
   */
  fotocheck: any[][];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
}

export interface LoginResultDto {
  /** JWT Access Token */
  accessToken: string;
  /** User information */
  user: UsuarioLoginInfoDto;
}

export interface ConductorLoginDto {
  /**
   * Email del conductor
   * @example "xerickcua@gmail.com"
   */
  email: string;
  /**
   * Contraseña del conductor
   * @example "123456"
   */
  password: string;
}

export interface ConductorLoginInfoDto {
  /**
   * Driver ID
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento de identidad
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Driver DNI
   * @example "12345678"
   */
  dni: string;
  /**
   * Driver first names
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Driver last names
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Driver full name
   * @example "Juan Carlos Perez Garcia"
   */
  nombreCompleto: string;
  /**
   * Driver email
   * @example "juan@example.com"
   */
  email?: string;
  /**
   * Driver phone number
   * @example "987654321"
   */
  celular?: string;
  /**
   * Driver license number
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Driver license class
   * @example "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Driver license category
   * @example "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: "activo" | "inactivo" | "eventual";
}

export interface ConductorLoginResultDto {
  /** JWT Access Token */
  accessToken: string;
  /** Información del conductor */
  conductor: ConductorLoginInfoDto;
}

export interface UsuarioListDto {
  /**
   * User ID
   * @example 1
   */
  id: number;
  /**
   * User first names
   * @example "John Michael"
   */
  nombres: string;
  /**
   * User last names
   * @example "Doe Smith"
   */
  apellidos: string;
  /**
   * User full name
   * @example "John Michael Doe Smith"
   */
  nombreCompleto: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User roles
   * @example ["empleado"]
   */
  roles: ("empleado" | "admin")[];
  /**
   * User fotocheck URLs
   * @example []
   */
  fotocheck: any[][];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example null
   */
  eliminadoEn: string | null;
}

export interface PaginationMetaDto {
  /**
   * Total de elementos encontrados
   * @example 50
   */
  total: number;
  /**
   * Página actual
   * @example 1
   */
  page: number;
  /**
   * Cantidad de elementos por página
   * @example 10
   */
  limit: number;
  /**
   * Total de páginas disponibles
   * @example 5
   */
  totalPages: number;
  /**
   * Indica si existe una página siguiente
   * @example true
   */
  hasNextPage: boolean;
  /**
   * Indica si existe una página anterior
   * @example false
   */
  hasPreviousPage: boolean;
}

export interface PaginatedUsuarioResultDto {
  /** Lista de usuarios en la página actual */
  data: UsuarioListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface UsuarioDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del usuario
   * @example 1
   */
  usuarioId: number;
  /**
   * Tipo de documento
   * @example "dni"
   */
  tipo:
    | "dni"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "induccion_general"
    | "firma";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion: string | null;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
}

export interface DocumentosAgrupadosDto {
  dni: UsuarioDocumentoResultDto[];
  seguro_vida_ley: UsuarioDocumentoResultDto[];
  sctr: UsuarioDocumentoResultDto[];
  examen_medico: UsuarioDocumentoResultDto[];
  induccion_general: UsuarioDocumentoResultDto[];
  firma: UsuarioDocumentoResultDto[];
}

export interface UsuarioResultDto {
  /**
   * User ID
   * @example 1
   */
  id: number;
  /**
   * User first names
   * @example "John Michael"
   */
  nombres: string;
  /**
   * User last names
   * @example "Doe Smith"
   */
  apellidos: string;
  /**
   * User full name
   * @example "John Michael Doe Smith"
   */
  nombreCompleto: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User roles
   * @example ["empleado"]
   */
  roles: ("empleado" | "admin")[];
  /**
   * User fotocheck URLs
   * @example ["https://storage.example.com/fotocheck/1.jpg"]
   */
  fotocheck: any[][];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** User documents grouped by type */
  documentos: DocumentosAgrupadosDto;
}

export interface UsuarioCreateDto {
  /**
   * User first names
   * @example "John Michael"
   */
  nombres: string;
  /**
   * User last names
   * @example "Doe Smith"
   */
  apellidos: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * User password
   * @example "password123"
   */
  contrasenia: string;
  /**
   * User roles
   * @example ["empleado"]
   */
  roles: ("empleado" | "admin")[];
}

export interface UsuarioUpdateDto {
  /**
   * User first names
   * @example "John Michael"
   */
  nombres?: string;
  /**
   * User last names
   * @example "Doe Smith"
   */
  apellidos?: string;
  /**
   * User email
   * @example "john.doe@example.com"
   */
  email?: string;
  /**
   * User password
   * @example "password123"
   */
  contrasenia?: string;
  /**
   * User roles
   * @example ["empleado"]
   */
  roles?: ("empleado" | "admin")[];
}

export interface UsuarioDocumentoCreateDto {
  /**
   * ID del usuario
   * @example 1
   */
  usuarioId: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo:
    | "dni"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "induccion_general"
    | "firma";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface UsuarioDocumentoUpdateDto {
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo?:
    | "dni"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "induccion_general"
    | "firma";
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface ConductorListDto {
  /**
   * Driver ID
   * @example 1
   */
  id: number;
  /**
   * Driver DNI
   * @example "12345678"
   */
  dni: string;
  /**
   * Driver first names
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Driver last names
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Driver full name
   * @example "Juan Carlos Perez Garcia"
   */
  nombreCompleto: string;
  /**
   * Driver email
   * @example "juan@example.com"
   */
  email?: string;
  /**
   * Driver phone number
   * @example "987654321"
   */
  celular?: string;
  /**
   * Driver license number
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Driver license class
   * @example "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Driver license category
   * @example "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: "activo" | "inactivo" | "eventual";
}

export interface PaginatedConductorResultDto {
  /** Lista de conductores en la página actual */
  data: ConductorListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface ConductorEstadoDocumentosDto {
  /**
   * ID del conductor
   * @example 1
   */
  id: number;
  /**
   * Nombres del conductor
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del conductor
   * @example "Pérez López"
   */
  apellidos: string;
  /**
   * Fotos del conductor
   * @example ["https://..."]
   */
  fotocheck: string[];
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: string;
  /**
   * Estado del documento
   * @example "activo"
   */
  dni: string;
  /** @example "activo" */
  licencia_mtc: string;
  /** @example "nulo" */
  seguro_vida_ley: string;
  /** @example "activo" */
  sctr: string;
  /** @example "caducado" */
  examen_medico: string;
  /** @example "activo" */
  psicosensometrico: string;
  /** @example "nulo" */
  induccion_general: string;
  /** @example "activo" */
  manejo_defensivo: string;
  /** @example "nulo" */
  licencia_interna: string;
  /** @example "activo" */
  autoriza_ssgg: string;
  /** @example "nulo" */
  curso_seguridad_portuaria: string;
  /** @example "activo" */
  curso_mercancias_peligrosas: string;
  /** @example "nulo" */
  curso_basico_pbip: string;
  /** @example "activo" */
  examen_medico_temporal: string;
  /** @example "nulo" */
  induccion_visita: string;
  /** @example "activo" */
  em_visita: string;
  /** @example "nulo" */
  pase_conduc: string;
  /** @example "activo" */
  foto_funcionario: string;
}

export interface PaginatedConductorEstadoDocumentosResultDto {
  /** Lista de conductores con sus estados de documentos */
  data: ConductorEstadoDocumentosDto[];
  /** Metadatos de paginación */
  meta: PaginationMetaDto;
}

export interface ConductorDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del conductor
   * @example 1
   */
  conductorId: number;
  /**
   * Tipo de documento
   * @example "dni"
   */
  tipo:
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/licencia-A123456.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion: string | null;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
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
  autoriza_ssgg: ConductorDocumentoResultDto[];
  curso_seguridad_portuaria: ConductorDocumentoResultDto[];
  curso_mercancias_peligrosas: ConductorDocumentoResultDto[];
  curso_basico_pbip: ConductorDocumentoResultDto[];
  examen_medico_temporal: ConductorDocumentoResultDto[];
  induccion_visita: ConductorDocumentoResultDto[];
  em_visita: ConductorDocumentoResultDto[];
  pase_conduc: ConductorDocumentoResultDto[];
  foto_funcionario: ConductorDocumentoResultDto[];
}

export interface ConductorResultDto {
  /**
   * Driver ID
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento de identidad
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Driver DNI
   * @example "12345678"
   */
  dni: string;
  /**
   * Driver first names
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Driver last names
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Driver full name
   * @example "Juan Carlos Perez Garcia"
   */
  nombreCompleto: string;
  /**
   * Driver email
   * @example "juan@example.com"
   */
  email?: string;
  /**
   * Driver phone number
   * @example "987654321"
   */
  celular?: string;
  /**
   * Driver license number
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Driver license class
   * @example "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Driver license category
   * @example "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: "activo" | "inactivo" | "eventual";
  /** Driver documents grouped by type */
  documentos: DocumentosAgrupadosConductorDto;
}

export interface ConductorCreateDto {
  /**
   * Tipo de documento de identidad
   * @default "DNI"
   */
  tipoDocumento: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Número de documento del conductor
   * @example "12345678"
   */
  dni: string;
  /**
   * Nombres del conductor
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del conductor
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Email del conductor (requerido para login)
   * @example "conductor@empresa.com"
   */
  email?: string;
  /**
   * Contraseña del conductor (mínimo 6 caracteres)
   * @example "password123"
   */
  contrasenia: string;
  /**
   * Celular del conductor
   * @example "999888777"
   */
  celular?: string;
  /**
   * Número de licencia del conductor
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Clase de licencia del conductor
   * @default "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Categoría de licencia del conductor
   * @default "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables?: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @default "activo"
   */
  estado?: "activo" | "inactivo" | "eventual";
}

export interface ConductorUpdateDto {
  /**
   * Tipo de documento de identidad
   * @default "DNI"
   */
  tipoDocumento?: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Número de documento del conductor
   * @example "12345678"
   */
  dni?: string;
  /**
   * Nombres del conductor
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del conductor
   * @example "Perez Garcia"
   */
  apellidos?: string;
  /**
   * Email del conductor (requerido para login)
   * @example "conductor@empresa.com"
   */
  email?: string;
  /**
   * Contraseña del conductor (mínimo 6 caracteres)
   * @example "password123"
   */
  contrasenia?: string;
  /**
   * Celular del conductor
   * @example "999888777"
   */
  celular?: string;
  /**
   * Número de licencia del conductor
   * @example "Q07864165"
   */
  numeroLicencia?: string;
  /**
   * Clase de licencia del conductor
   * @default "A"
   */
  claseLicencia?: "A" | "B";
  /**
   * Categoría de licencia del conductor
   * @default "I"
   */
  categoriaLicencia?:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables?: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @default "activo"
   */
  estado?: "activo" | "inactivo" | "eventual";
}

export interface ConductorDocumentoCreateDto {
  /**
   * ID del conductor
   * @example 1
   */
  conductorId: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo:
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/licencia-A123456.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface ConductorDocumentoUpdateDto {
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo?:
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario";
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/licencia-A123456.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface DashboardStatsDto {
  /**
   * Total de vehículos
   * @example 45
   */
  totalVehiculos: number;
  /**
   * Total de conductores activos
   * @example 38
   */
  conductoresActivos: number;
  /**
   * Total de viajes hoy
   * @example 24
   */
  viajesHoy: number;
  /**
   * Total de clientes
   * @example 156
   */
  totalClientes: number;
  /**
   * Cambio porcentual de vehículos
   * @example 12
   */
  cambioVehiculos: number;
  /**
   * Cambio porcentual de conductores
   * @example 5
   */
  cambioConductores: number;
  /**
   * Cambio porcentual de viajes
   * @example 18
   */
  cambioViajes: number;
  /**
   * Cambio porcentual de clientes
   * @example 8
   */
  cambioClientes: number;
}

export interface VehiculosPorEstadoItemDto {
  /**
   * Estado del vehículo
   * @example "activo"
   */
  estado: string;
  /**
   * Cantidad de vehículos
   * @example 28
   */
  cantidad: number;
  /**
   * Porcentaje del total
   * @example 62
   */
  porcentaje: number;
}

export interface VehiculosPorEstadoDto {
  data: VehiculosPorEstadoItemDto[];
}

export interface ViajeRecienteDto {
  /**
   * ID del viaje
   * @example 1
   */
  id: number;
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa"
   */
  ruta: string;
  /**
   * Nombre del conductor
   * @example "Juan Pérez"
   */
  conductor: string;
  /**
   * Placa del vehículo
   * @example "ABC-123"
   */
  vehiculo: string;
  /**
   * Estado del viaje
   * @example "en_progreso"
   */
  estado: string;
  /**
   * Hora de salida
   * @format date-time
   * @example "2025-12-06T08:30:00Z"
   */
  fechaSalida: string;
}

export interface ViajesRecientesDto {
  data: ViajeRecienteDto[];
}

export interface MantenimientoProximoDto {
  /**
   * Placa del vehículo
   * @example "ABC-123"
   */
  vehiculo: string;
  /**
   * Tipo de mantenimiento
   * @example "Revisión técnica"
   */
  tipo: string;
  /**
   * Fecha programada
   * @example "2025-12-10"
   */
  fecha: string;
  /**
   * Días hasta el mantenimiento
   * @example 4
   */
  dias: number;
  /**
   * Prioridad del mantenimiento
   * @example "alta"
   */
  prioridad: string;
}

export interface MantenimientosProximosDto {
  data: MantenimientoProximoDto[];
}

export interface RutaPopularDto {
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa"
   */
  nombre: string;
  /**
   * Número de viajes
   * @example 45
   */
  viajes: number;
  /**
   * Porcentaje relativo
   * @example 85
   */
  porcentaje: number;
}

export interface RutasPopularesDto {
  data: RutaPopularDto[];
}

export interface IngresoMensualDto {
  /**
   * Mes
   * @example "Jul"
   */
  mes: string;
  /**
   * Monto de ingresos
   * @example 45000
   */
  monto: number;
}

export interface IngresosMensualesDto {
  data: IngresoMensualDto[];
}

export interface VehiculoListDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "00012"
   */
  codigoInterno?: string;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  /**
   * List of owners names
   * @default []
   */
  propietarios_nombres?: string[];
  /**
   * List of suppliers names
   * @default []
   */
  proveedores_nombres?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date
   * @format date-time
   * @example null
   */
  eliminadoEn?: string | null;
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface PaginatedVehiculoResultDto {
  /** Lista de vehículos en la página actual */
  data: VehiculoListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface VehiculoEstadoDocumentosDto {
  /**
   * ID del vehículo
   * @example 1
   */
  id: number;
  /**
   * Placa del vehículo
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Imágenes del vehículo
   * @example ["https://ejemplo.com/imagen1.jpg"]
   */
  imagenes: string[];
  /**
   * Estado del vehículo
   * @example "disponible"
   */
  estado: string;
  /**
   * Estado del documento: activo (existe y vigente), caducado (existe pero vencido), nulo (no existe)
   * @example "activo"
   */
  tarjeta_propiedad: string;
  /** @example "caducado" */
  tarjeta_unica_circulacion: string;
  /** @example "activo" */
  citv: string;
  /** @example "nulo" */
  soat: string;
  /** @example "activo" */
  poliza: string;
  /** @example "nulo" */
  certificado_operatividad_factura: string;
  /** @example "activo" */
  plan_mantenimiento_historico: string;
  /** @example "nulo" */
  certificado_instalacion_gps: string;
  /** @example "activo" */
  certificado_valor_anadido: string;
  /** @example "nulo" */
  constancia_gps: string;
  /** @example "activo" */
  certificado_extintores_hidrostatica: string;
  /** @example "nulo" */
  certificado_extintores_operatividad: string;
  /** @example "activo" */
  certificado_rops: string;
  /** @example "nulo" */
  certificado_radio_frecuencia: string;
  /** @example "activo" */
  certificacion_frenos: string;
  /** @example "activo" */
  certificado_laminados_lunas: string;
  /** @example "nulo" */
  certificado_carroceria: string;
  /** @example "activo" */
  certificado_caracteristicas_tecnicas: string;
  /** @example "nulo" */
  certificado_adas: string;
}

export interface PaginatedVehiculoEstadoDocumentosResultDto {
  /** Lista de vehículos con el estado de sus documentos */
  data: VehiculoEstadoDocumentosDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface VehiculoComentarioDetalleDto {
  /**
   * ID del comentario
   * @example 1
   */
  id: number;
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * ID del usuario que creó el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El vehículo necesita revisión"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @example "observacion"
   */
  tipo: "observacion" | "incidencia" | "novedad" | "general";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
  /**
   * Nombre del usuario
   * @example "Juan Pérez"
   */
  usuarioNombreCompleto: string;
}

export interface PropietarioVehiculoDto {
  /**
   * Owner ID
   * @example 1
   */
  id: number;
  /**
   * Owner Name
   * @example "Juan Perez"
   */
  nombre: string;
}

export interface ProveedorVehiculoDto {
  /**
   * Supplier ID
   * @example 1
   */
  id: number;
  /**
   * Supplier Name
   * @example "Repuestos SAC"
   */
  nombre: string;
}

export interface VehiculoDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * Tipo de documento
   * @example "tarjeta_propiedad"
   */
  tipo:
    | "tarjeta_propiedad"
    | "tarjeta_unica_circulacion"
    | "citv"
    | "soat"
    | "poliza"
    | "certificado_operatividad_factura"
    | "plan_mantenimiento_historico"
    | "certificado_instalacion_gps"
    | "certificado_valor_anadido"
    | "constancia_gps"
    | "certificado_extintores_hidrostatica"
    | "certificado_extintores_operatividad"
    | "certificado_rops"
    | "certificado_radio_frecuencia"
    | "certificacion_frenos"
    | "certificado_laminados_lunas"
    | "certificado_carroceria"
    | "certificado_caracteristicas_tecnicas"
    | "certificado_adas"
    | "revision_gps"
    | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/soat-ABC123.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion: string | null;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
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
  revision_gps: VehiculoDocumentoResultDto[];
  certificado_extintores_hidrostatica: VehiculoDocumentoResultDto[];
  certificado_extintores_operatividad: VehiculoDocumentoResultDto[];
  certificado_rops: VehiculoDocumentoResultDto[];
  certificado_radio_frecuencia: VehiculoDocumentoResultDto[];
  certificacion_frenos: VehiculoDocumentoResultDto[];
  certificado_laminados_lunas: VehiculoDocumentoResultDto[];
  certificado_carroceria: VehiculoDocumentoResultDto[];
  certificado_caracteristicas_tecnicas: VehiculoDocumentoResultDto[];
  certificado_adas: VehiculoDocumentoResultDto[];
  otros: VehiculoDocumentoResultDto[];
}

export interface VehiculoResultDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "0582"
   */
  codigoInterno?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload Kg
   * @example "1500.50"
   */
  cargaUtil?: string;
  /**
   * Gross weight Kg
   * @example "2500.00"
   */
  pesoBruto?: string;
  /**
   * Net weight Kg
   * @example "1000.00"
   */
  pesoNeto?: string;
  /**
   * Seats
   * @example 2
   */
  asientos?: number;
  /**
   * Passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Axles
   * @example 2
   */
  ejes?: number;
  /**
   * Wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  comentarios?: VehiculoComentarioDetalleDto[];
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.90"
   */
  ancho?: string;
  /** List of owners */
  propietarios: PropietarioVehiculoDto[];
  /** List of suppliers */
  proveedores: ProveedorVehiculoDto[];
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
  /** Vehicle documents grouped by type */
  documentos: DocumentosAgrupadosVehiculoDto;
}

export interface VehiculoCreateDto {
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * Vehicle Identification Number
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Vehicle color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload capacity in Kg
   * @example "1500.5"
   */
  cargaUtil?: string;
  /**
   * Gross weight in Kg
   * @example "2500.0"
   */
  pesoBruto?: string;
  /**
   * Net weight in Kg
   * @example "1000.0"
   */
  pesoNeto?: string;
  /**
   * Number of seats
   * @example 2
   */
  asientos?: number;
  /**
   * Number of passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Number of axles
   * @example 2
   */
  ejes?: number;
  /**
   * Number of wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @default "disponible"
   */
  estado?: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.9"
   */
  ancho?: string;
  /**
   * List of owner IDs
   * @example [1,2]
   */
  propietarios?: number[];
  /**
   * List of supplier IDs
   * @example [1,2]
   */
  proveedores?: number[];
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
}

export interface VehiculoUpdateDto {
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa?: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId?: number;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio?: number;
  /**
   * Vehicle Identification Number
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Vehicle color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload capacity in Kg
   * @example "1500.5"
   */
  cargaUtil?: string;
  /**
   * Gross weight in Kg
   * @example "2500.0"
   */
  pesoBruto?: string;
  /**
   * Net weight in Kg
   * @example "1000.0"
   */
  pesoNeto?: string;
  /**
   * Number of seats
   * @example 2
   */
  asientos?: number;
  /**
   * Number of passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Number of axles
   * @example 2
   */
  ejes?: number;
  /**
   * Number of wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje?: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento?: number;
  /**
   * Vehicle status
   * @default "disponible"
   */
  estado?: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.9"
   */
  ancho?: string;
  /**
   * List of owner IDs
   * @example [1,2]
   */
  propietarios?: number[];
  /**
   * List of supplier IDs
   * @example [1,2]
   */
  proveedores?: number[];
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
}

export interface VehiculoDocumentoCreateDto {
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * Tipo de documento
   * @default "tarjeta_propiedad"
   */
  tipo:
    | "tarjeta_propiedad"
    | "tarjeta_unica_circulacion"
    | "citv"
    | "soat"
    | "poliza"
    | "certificado_operatividad_factura"
    | "plan_mantenimiento_historico"
    | "certificado_instalacion_gps"
    | "certificado_valor_anadido"
    | "constancia_gps"
    | "certificado_extintores_hidrostatica"
    | "certificado_extintores_operatividad"
    | "certificado_rops"
    | "certificado_radio_frecuencia"
    | "certificacion_frenos"
    | "certificado_laminados_lunas"
    | "certificado_carroceria"
    | "certificado_caracteristicas_tecnicas"
    | "certificado_adas"
    | "revision_gps"
    | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/soat-ABC123.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface VehiculoDocumentoUpdateDto {
  /**
   * Tipo de documento
   * @default "tarjeta_propiedad"
   */
  tipo?:
    | "tarjeta_propiedad"
    | "tarjeta_unica_circulacion"
    | "citv"
    | "soat"
    | "poliza"
    | "certificado_operatividad_factura"
    | "plan_mantenimiento_historico"
    | "certificado_instalacion_gps"
    | "certificado_valor_anadido"
    | "constancia_gps"
    | "certificado_extintores_hidrostatica"
    | "certificado_extintores_operatividad"
    | "certificado_rops"
    | "certificado_radio_frecuencia"
    | "certificacion_frenos"
    | "certificado_laminados_lunas"
    | "certificado_carroceria"
    | "certificado_caracteristicas_tecnicas"
    | "certificado_adas"
    | "revision_gps"
    | "otros";
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/soat-ABC123.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface VehiculoComentarioResultDto {
  /**
   * ID del comentario
   * @example 1
   */
  id: number;
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * ID del usuario que creó el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El vehículo necesita revisión"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @example "observacion"
   */
  tipo: "observacion" | "incidencia" | "novedad" | "general";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
}

export interface VehiculoComentarioCreateDto {
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * ID del usuario que crea el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El vehículo está en buenas condiciones"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @default "observacion"
   */
  tipo?: "observacion" | "incidencia" | "novedad" | "general";
}

export interface VehiculoComentarioUpdateDto {
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId?: number;
  /**
   * ID del usuario que crea el comentario
   * @example 1
   */
  usuarioId?: number;
  /**
   * Texto del comentario
   * @example "El vehículo está en buenas condiciones"
   */
  comentario?: string;
  /**
   * Tipo de comentario
   * @default "observacion"
   */
  tipo?: "observacion" | "incidencia" | "novedad" | "general";
}

export interface MarcaListDto {
  /**
   * ID de la marca
   * @example 1
   */
  id: number;
  /**
   * Nombre de la marca
   * @example "Toyota"
   */
  nombre: string;
  /**
   * Lista de nombres de modelos de la marca
   * @example ["Corolla","Camry","RAV4"]
   */
  modelos?: string[];
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedMarcaResultDto {
  /** Lista de marcas en la página actual */
  data: MarcaListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface MarcaResultDto {
  /**
   * ID de la marca
   * @example 1
   */
  id: number;
  /**
   * Nombre de la marca
   * @example "Toyota"
   */
  nombre: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface MarcaCreateDto {
  /**
   * Nombre de la marca
   * @example "Toyota"
   */
  nombre: string;
}

export interface MarcaUpdateDto {
  /**
   * Nombre de la marca
   * @example "Toyota"
   */
  nombre?: string;
}

export interface ModeloListDto {
  /**
   * ID del modelo
   * @example 1
   */
  id: number;
  /**
   * Nombre del modelo
   * @example "Corolla"
   */
  nombre: string;
  /**
   * ID de la marca
   * @example 1
   */
  marcaId: number;
  /**
   * Nombre de la marca
   * @example "Toyota"
   */
  marcaNombre?: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedModeloResultDto {
  /** Lista de modelos en la página actual */
  data: ModeloListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface ModeloResultDto {
  /**
   * ID del modelo
   * @example 1
   */
  id: number;
  /**
   * Nombre del modelo
   * @example "Corolla"
   */
  nombre: string;
  /**
   * ID de la marca
   * @example 1
   */
  marcaId: number;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface ModeloCreateDto {
  /**
   * Nombre del modelo
   * @example "Corolla"
   */
  nombre: string;
  /**
   * ID de la marca
   * @example 1
   */
  marcaId: number;
}

export interface ModeloUpdateDto {
  /**
   * Nombre del modelo
   * @example "Corolla"
   */
  nombre?: string;
}

export interface VehiculoChecklistHistoryItemDto {
  /** @example 1 */
  id: number;
  /** @example 1 */
  vehiculoId: number;
  /** @example 1 */
  checklistItemId: number;
  /** @example "v00001_001_..." */
  version: string;
  /** @example true */
  activo: boolean;
  /**
   * @format date-time
   * @example "2024-01-01T12:00:00Z"
   */
  creadoEn: string;
  /** @example 1 */
  viajeId: number | null;
  /** @example "salida" */
  viajeTipo: "salida" | "llegada";
}

export interface PaginatedVehiculoChecklistHistoryResultDto {
  data: VehiculoChecklistHistoryItemDto[];
  meta: PaginationMetaDto;
}

export interface PhotoResultDto {
  /**
   * URL de la imagen
   * @example "https://image-document.jpg"
   */
  url: string;
}

export interface ResultIpercDocumentDto {
  /** Datos de la foto */
  photo: PhotoResultDto;
}

export interface ResultIpercContinuoDto {
  viajeId: number;
  vehiculoId: number;
  /**
   * Código de versión
   * @example "v00001_002_0000000001_salida"
   */
  version: string | null;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultIpercDocumentDto;
}

export interface ResultHojaItemDto {
  /** Etiqueta del item */
  label: string;
  /**
   * Nivel Criticidad: rojo, amarillo, verde
   * @example "rojo"
   */
  color?: string;
  /**
   * Valor del check (SI/NO)
   * @example true
   */
  value: boolean;
}

export interface DeclaracionJuradaItemsDto {
  descansoSuficiente: ResultHojaItemDto;
  condicionesFisicas: ResultHojaItemDto;
  medicamentos: ResultHojaItemDto;
  condicionesEmocionales: ResultHojaItemDto;
  conscienteResponsabilidad: ResultHojaItemDto;
}

export interface DeclaracionJuradaSectionDto {
  /** Título de la sección */
  label: string;
  items: DeclaracionJuradaItemsDto;
}

export interface EstadoGeneralItemsDto {
  farosPrincipales: ResultHojaItemDto;
  lucesDireccionales: ResultHojaItemDto;
  lucesFreno: ResultHojaItemDto;
  luzEstroboscopica: ResultHojaItemDto;
  espejos: ResultHojaItemDto;
  parabrisasVentanas: ResultHojaItemDto;
  plumillas: ResultHojaItemDto;
  neumaticos: ResultHojaItemDto;
  esparragosTuercas: ResultHojaItemDto;
  cartolas: ResultHojaItemDto;
}

export interface EstadoGeneralSectionDto {
  /** Título de la sección */
  label: string;
  items: EstadoGeneralItemsDto;
}

export interface EstadoInternoItemsDto {
  cinturonesEstado: ResultHojaItemDto;
  alarmaRetroceso: ResultHojaItemDto;
  segurosPuertas: ResultHojaItemDto;
  claxon: ResultHojaItemDto;
  documentosVigentes: ResultHojaItemDto;
  kitHerramientas: ResultHojaItemDto;
  gata: ResultHojaItemDto;
  ordenLimpieza: ResultHojaItemDto;
  jaulaAntivuelco: ResultHojaItemDto;
  aireAcondicionado: ResultHojaItemDto;
}

export interface EstadoInternoSectionDto {
  /** Título de la sección */
  label: string;
  items: EstadoInternoItemsDto;
}

export interface ElementosSeguridadItemsDto {
  tacosCunas: ResultHojaItemDto;
  conosSeguridad: ResultHojaItemDto;
  eslingaGrilletes: ResultHojaItemDto;
  picoPala: ResultHojaItemDto;
  cableCorriente: ResultHojaItemDto;
  extintor: ResultHojaItemDto;
  botiquinLinterna: ResultHojaItemDto;
  kitAntiderrame: ResultHojaItemDto;
  sistemaComunicacion: ResultHojaItemDto;
}

export interface ElementosSeguridadSectionDto {
  /** Título de la sección */
  label: string;
  items: ElementosSeguridadItemsDto;
}

export interface EstadoMecanicoItemsDto {
  pruebaFrenoServicio: ResultHojaItemDto;
  frenoEstacionamiento: ResultHojaItemDto;
  direccion: ResultHojaItemDto;
  nivelAceiteMotor: ResultHojaItemDto;
  nivelLiquidoFrenos: ResultHojaItemDto;
  nivelRefrigerante: ResultHojaItemDto;
  nivelAceiteHidraulico: ResultHojaItemDto;
  nivelAguaLimpiaparabrisas: ResultHojaItemDto;
  otrosMecanico: ResultHojaItemDto;
}

export interface EstadoMecanicoSectionDto {
  /** Título de la sección */
  label: string;
  items: EstadoMecanicoItemsDto;
}

export interface SistemasCriticosItemsDto {
  mobiliEye: ResultHojaItemDto;
  sensorFatiga: ResultHojaItemDto;
  frenosABS: ResultHojaItemDto;
  espEsc: ResultHojaItemDto;
}

export interface SistemasCriticosSectionDto {
  /** Título de la sección */
  label: string;
  items: SistemasCriticosItemsDto;
}

export interface CinturonesSeguridadItemsDto {
  cinturonesPilotos: ResultHojaItemDto;
  cinturonesPasajes: ResultHojaItemDto;
}

export interface CinturonesSeguridadSectionDto {
  /** Título de la sección */
  label: string;
  items: CinturonesSeguridadItemsDto;
}

export interface ResultHojaDocumentDto {
  declaracionJurada: DeclaracionJuradaSectionDto;
  estadoGeneral: EstadoGeneralSectionDto;
  estadoInterno: EstadoInternoSectionDto;
  elementosSeguridad: ElementosSeguridadSectionDto;
  estadoMecanico: EstadoMecanicoSectionDto;
  sistemasCriticos: SistemasCriticosSectionDto;
  cinturonesSeguridad: CinturonesSeguridadSectionDto;
}

export interface ResultHojaInspeccionDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultHojaDocumentDto;
}

export interface ResultDocumentoItemDto {
  /** Etiqueta del item */
  label: string;
  /** Si el documento es requerido/habilitado */
  habilitado: boolean;
  /** Observación inicial */
  observacion?: string;
  /** Fecha de Vencimiento Inicial/Por defecto */
  fechaVencimiento?: string;
}

export interface DocumentosVehiculoItemsDto {
  soatVigente: ResultDocumentoItemDto;
  tarjetaPropiedad: ResultDocumentoItemDto;
  tarjetaCirculacion: ResultDocumentoItemDto;
  polizaVigente: ResultDocumentoItemDto;
  ctivVigente: ResultDocumentoItemDto;
  hojasMsdsVehiculo: ResultDocumentoItemDto;
  manualOperacion: ResultDocumentoItemDto;
  otroVehiculo: ResultDocumentoItemDto;
}

export interface DocumentosVehiculoSectionDto {
  /** Título de la sección */
  label: string;
  items: DocumentosVehiculoItemsDto;
}

export interface DocumentosConductorItemsDto {
  licenciaMtc: ResultDocumentoItemDto;
  licenciaInterna: ResultDocumentoItemDto;
  checkListDiario: ResultDocumentoItemDto;
  iperc: ResultDocumentoItemDto;
  pets: ResultDocumentoItemDto;
  hojasMsdsConductor: ResultDocumentoItemDto;
  mapaRiesgos: ResultDocumentoItemDto;
  otroConductor: ResultDocumentoItemDto;
}

export interface DocumentosConductorSectionDto {
  /** Título de la sección */
  label: string;
  items: DocumentosConductorItemsDto;
}

export interface ResultInspeccionDocumentosDocumentDto {
  documentosVehiculo: DocumentosVehiculoSectionDto;
  documentosConductor: DocumentosConductorSectionDto;
}

export interface ResultInspeccionDocumentosDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultInspeccionDocumentosDocumentDto;
}

export interface ResultLucesItemDto {
  /** Etiqueta del item */
  label: string;
  /** Estado del item (Operativo SI/NO) */
  estado: boolean;
  /** Observación o Acción Correctiva */
  observacion?: string;
}

export interface ResultLucesEmergenciaAlarmasDocumentDto {
  alarmaRetroceso: ResultLucesItemDto;
  alarmaCinturon: ResultLucesItemDto;
  claxon: ResultLucesItemDto;
  lucesCabina: ResultLucesItemDto;
  lucesSalon: ResultLucesItemDto;
  lucesAltasDerecho: ResultLucesItemDto;
  lucesAltasIzquierdo: ResultLucesItemDto;
  lucesBajasDerecho: ResultLucesItemDto;
  lucesBajasIzquierdo: ResultLucesItemDto;
  lucesLateralesDerecho: ResultLucesItemDto;
  lucesLateralesIzquierdo: ResultLucesItemDto;
  lucesNeblineros: ResultLucesItemDto;
  lucesEstacionamientoDerecho: ResultLucesItemDto;
  lucesEstacionamientoIzquierdo: ResultLucesItemDto;
  lucesDireccionalesDerecho: ResultLucesItemDto;
  lucesDireccionalesIzquierdo: ResultLucesItemDto;
  luzEstroboscopica: ResultLucesItemDto;
  luzPertiga: ResultLucesItemDto;
  pruebaRadio: ResultLucesItemDto;
  botonPanico: ResultLucesItemDto;
}

export interface ResultLucesEmergenciaAlarmasDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultLucesEmergenciaAlarmasDocumentDto;
}

export interface ResultCinturonItemDto {
  /** Etiqueta del item */
  label: string;
  /** Si el asiento existe/está habilitado */
  habilitado: boolean;
  /** Observación inicial o configuración */
  observacion?: string;
}

export interface ResultCinturonesDocumentDto {
  asientoPiloto: ResultCinturonItemDto;
  asientoCopiloto: ResultCinturonItemDto;
  asiento1: ResultCinturonItemDto;
  asiento2: ResultCinturonItemDto;
  asiento3: ResultCinturonItemDto;
  asiento4: ResultCinturonItemDto;
  asiento5: ResultCinturonItemDto;
  asiento6: ResultCinturonItemDto;
  asiento7: ResultCinturonItemDto;
  asiento8: ResultCinturonItemDto;
  asiento9: ResultCinturonItemDto;
  asiento10: ResultCinturonItemDto;
  asiento11: ResultCinturonItemDto;
  asiento12: ResultCinturonItemDto;
  asiento13: ResultCinturonItemDto;
  asiento14: ResultCinturonItemDto;
  asiento15: ResultCinturonItemDto;
  asiento16: ResultCinturonItemDto;
  asiento17: ResultCinturonItemDto;
  asiento18: ResultCinturonItemDto;
  asiento19: ResultCinturonItemDto;
  asiento20: ResultCinturonItemDto;
  asiento21: ResultCinturonItemDto;
  asiento22: ResultCinturonItemDto;
  asiento23: ResultCinturonItemDto;
  asiento24: ResultCinturonItemDto;
  asiento25: ResultCinturonItemDto;
  asiento26: ResultCinturonItemDto;
  asiento27: ResultCinturonItemDto;
  asiento28: ResultCinturonItemDto;
  asiento29: ResultCinturonItemDto;
  asiento30: ResultCinturonItemDto;
  asiento31: ResultCinturonItemDto;
  asiento32: ResultCinturonItemDto;
  asiento33: ResultCinturonItemDto;
  asiento34: ResultCinturonItemDto;
  asiento35: ResultCinturonItemDto;
  asiento36: ResultCinturonItemDto;
  asiento37: ResultCinturonItemDto;
  asiento38: ResultCinturonItemDto;
  asiento39: ResultCinturonItemDto;
  asiento40: ResultCinturonItemDto;
  asiento41: ResultCinturonItemDto;
  asiento42: ResultCinturonItemDto;
  asiento43: ResultCinturonItemDto;
  asiento44: ResultCinturonItemDto;
  asiento45: ResultCinturonItemDto;
  asiento46: ResultCinturonItemDto;
  asiento47: ResultCinturonItemDto;
  asiento48: ResultCinturonItemDto;
  asiento49: ResultCinturonItemDto;
  asiento50: ResultCinturonItemDto;
  asiento51: ResultCinturonItemDto;
  asiento52: ResultCinturonItemDto;
}

export interface ResultCinturonesSeguridadDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultCinturonesDocumentDto;
}

export interface HerramientasInfoDto {
  /** @example "HERRAMIENTA SIN GRASA IMPREGNADA" */
  criterioA: string;
  /** @example "EMPALME Y CONECCIONES" */
  criterioB: string;
  /** @example "ALMACENAMIENTO ADECUADO" */
  criterioC: string;
  /** @example "GOLPES Y ABOLLADURAS" */
  criterioD: string;
  /** @example "LIMPIA Y ORDENADA" */
  criterioE: string;
  /** @example "OTRO" */
  criterioF: string;
}

export interface ResultHerramientaItemDto {
  /** Etiqueta del item */
  label: string;
  /** Habilitada para uso (SI/NO) */
  estado: boolean;
  /** Stock actual */
  stock?: string;
  /** A: Herramienta sin grasa impregnada */
  criterioA?: boolean;
  /** B: Empalme y conexiones */
  criterioB?: boolean;
  /** C: Almacenamiento adecuado */
  criterioC?: boolean;
  /** D: Golpes y abolladuras */
  criterioD?: boolean;
  /** E: Limpia y ordenada */
  criterioE?: boolean;
  /** F: Otro */
  criterioF?: boolean;
  /** Accion Correctiva */
  accionCorrectiva?: string;
  /** Observación */
  observacion?: string;
}

export interface HerramientasItemsDto {
  llavesMixtas: ResultHerramientaItemDto;
  destornilladorEstrella: ResultHerramientaItemDto;
  destornilladorPlano: ResultHerramientaItemDto;
  alicate: ResultHerramientaItemDto;
  llaveRuedaPalanca: ResultHerramientaItemDto;
  trianguloSeguridad: ResultHerramientaItemDto;
  conosPeligro: ResultHerramientaItemDto;
  cableCorriente: ResultHerramientaItemDto;
  eslinga: ResultHerramientaItemDto;
  grilletes: ResultHerramientaItemDto;
  tacosCunas: ResultHerramientaItemDto;
  linterna: ResultHerramientaItemDto;
  extintor: ResultHerramientaItemDto;
  pico: ResultHerramientaItemDto;
  medidorAire: ResultHerramientaItemDto;
  varasLuminosas: ResultHerramientaItemDto;
  paletaPareSiga: ResultHerramientaItemDto;
  escoba: ResultHerramientaItemDto;
  balde: ResultHerramientaItemDto;
  cuadernoBitacora: ResultHerramientaItemDto;
  gataHidraulica: ResultHerramientaItemDto;
  cajaHerramientas: ResultHerramientaItemDto;
}

export interface ResultInspeccionHerramientasDocumentDto {
  info: HerramientasInfoDto;
  herramientas: HerramientasItemsDto;
}

export interface ResultInspeccionHerramientasDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultInspeccionHerramientasDocumentDto;
}

export interface ResultBotiquinItemDto {
  /** Etiqueta del item */
  label: string;
  /** Habilitado/Existente (SI/NO) */
  habilitado?: boolean;
  /** Fecha de Vencimiento */
  fechaVencimiento?: string;
  /** Fecha de Salida */
  fechaSalida?: string;
  /** Fecha de reposición */
  fechaReposicion?: string;
}

export interface ResultInspeccionBotiquinesDocumentDto {
  alcohol: ResultBotiquinItemDto;
  jabonLiquido: ResultBotiquinItemDto;
  gasaEsterilizada: ResultBotiquinItemDto;
  apositoEsterilizado: ResultBotiquinItemDto;
  esparadrapo: ResultBotiquinItemDto;
  vendaElastica: ResultBotiquinItemDto;
  banditasAdhesivas: ResultBotiquinItemDto;
  tijeraPuntaRoma: ResultBotiquinItemDto;
  guantesQuirurgicos: ResultBotiquinItemDto;
  algodon: ResultBotiquinItemDto;
  maletin: ResultBotiquinItemDto;
  /**
   * Ubicación del Botiquín
   * @example "Cabina del conductor"
   */
  ubicacionBotiquin: string;
}

export interface ResultInspeccionBotiquinesDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultInspeccionBotiquinesDocumentDto;
}

export interface ResultKitItemDto {
  /** Etiqueta del item */
  label: string;
  /** Estado (SI/NO) */
  estado: boolean;
}

export interface ResultKitDocumentDto {
  mazoGoma: ResultKitItemDto;
  setCunas: ResultKitItemDto;
  bandeja: ResultKitItemDto;
  barrerasOleofilicas: ResultKitItemDto;
  cintaRoja: ResultKitItemDto;
  cintaAmarilla: ResultKitItemDto;
  bolsasRojas: ResultKitItemDto;
  panosOleofilicos: ResultKitItemDto;
  recogedorPlastico: ResultKitItemDto;
  manualContingencia: ResultKitItemDto;
  guantesNitrilo: ResultKitItemDto;
  lenteSeguridad: ResultKitItemDto;
  respirador: ResultKitItemDto;
  trajeTyvek: ResultKitItemDto;
  botasPVC: ResultKitItemDto;
  maletin: ResultKitItemDto;
  /**
   * Ubicación del Kit
   * @example "Bodega Lateral"
   */
  ubicacion: string;
}

export interface ResultKitAntiderramesDto {
  /**
   * ID del Viaje (si aplica)
   * @example 1
   */
  viajeId: number | null;
  /**
   * ID del Vehículo
   * @example 10
   */
  vehiculoId: number;
  /**
   * Código de versión del checklist
   * @example "v00001_002_0000000001_salida"
   */
  version: string;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultKitDocumentDto;
}

export interface ResultRevisionDocumentDto {
  /** Datos de la foto */
  photo: PhotoResultDto;
}

export interface ResultRevisionVehiculosDto {
  viajeId: number;
  vehiculoId: number;
  /**
   * Código de versión
   * @example "v00001_002_0000000001_salida"
   */
  version: string | null;
  /**
   * Tipo de viaje
   * @example "salida"
   */
  viajeTipo: "salida" | "llegada" | null;
  document: ResultRevisionDocumentDto;
}

export interface PhotoItemDto {
  /**
   * URL de la imagen/foto
   * @example "https://image-document.jpg"
   */
  url: string;
}

export interface IpercContinuoDto {
  photo: PhotoItemDto;
}

export interface HojaInspeccionDto {
  /**
   * He descansado lo suficiente y me encuentro en condiciones de conducir.
   * @default true
   */
  descansoSuficiente: boolean;
  /**
   * Me siento en buenas condiciones fisicas y no tengo ninguna dolencia o enfermedad.
   * @default true
   */
  condicionesFisicas: boolean;
  /**
   * Estoy tomando medicamentos recetados... no son impedimento para conducir.
   * @default true
   */
  medicamentos: boolean;
  /**
   * Me encuentro emocional y personalmente en buenas condiciones.
   * @default true
   */
  condicionesEmocionales: boolean;
  /**
   * Estoy consciente de la responsabilidad que significa conducir este vehículo.
   * @default true
   */
  conscienteResponsabilidad: boolean;
  /**
   * Faros principales / Faros neblineros / Luces pirata
   * @default true
   */
  farosPrincipales: boolean;
  /**
   * Luces direccionales / de estacionamiento / intermitentes
   * @default true
   */
  lucesDireccionales: boolean;
  /**
   * Luces de freno/ Luces de retroceso
   * @default true
   */
  lucesFreno: boolean;
  /**
   * Luz estroboscópica(Circulina color verde)
   * @default true
   */
  luzEstroboscopica: boolean;
  /**
   * Espejos
   * @default true
   */
  espejos: boolean;
  /**
   * Parabrisa y ventanas (sin rajaduras)
   * @default true
   */
  parabrisasVentanas: boolean;
  /**
   * Plumillas Limpia y lava parabrisas
   * @default true
   */
  plumillas: boolean;
  /**
   * Neumáticos(Incluye repuesto ) tipo AT(Presión, banda de rodamiento)
   * @default true
   */
  neumaticos: boolean;
  /**
   * Esparragos, tuercas(torque según fabricante), seguro de tuercas
   * @default true
   */
  esparragosTuercas: boolean;
  /**
   * Cartolas /Letreros Identificatorios
   * @default true
   */
  cartolas: boolean;
  /**
   * Cinturones de seguridad / Estado
   * @default true
   */
  cinturonesEstado: boolean;
  /**
   * Alarma de Retroceso
   * @default true
   */
  alarmaRetroceso: boolean;
  /**
   * Seguros de puertas
   * @default true
   */
  segurosPuertas: boolean;
  /**
   * Claxon
   * @default true
   */
  claxon: boolean;
  /**
   * Tarjeta de propiedad, SOAT,Revisión Técnica vigente / ATS
   * @default true
   */
  documentosVigentes: boolean;
  /**
   * Kit básico de herramientas * / Llave de rueda tipo cruz
   * @default true
   */
  kitHerramientas: boolean;
  /**
   * Gata(Doble peso bruto vehículo) y sus accesorios
   * @default true
   */
  gata: boolean;
  /**
   * Orden y limpieza
   * @default true
   */
  ordenLimpieza: boolean;
  /**
   * Jaula Interna/Externa Antivuelco
   * @default true
   */
  jaulaAntivuelco: boolean;
  /**
   * Aire Acondicionado
   * @default true
   */
  aireAcondicionado: boolean;
  /**
   * Tacos/cuñas (02)
   * @default true
   */
  tacosCunas: boolean;
  /**
   * Conos de seguridad de 45 cm(03) con cinta reflectiva(8-10cm)
   * @default true
   */
  conosSeguridad: boolean;
  /**
   * Eslinga/Grilletes
   * @default true
   */
  eslingaGrilletes: boolean;
  /**
   * Pico y pala
   * @default true
   */
  picoPala: boolean;
  /**
   * Cable para pasar corriente
   * @default true
   */
  cableCorriente: boolean;
  /**
   * Extintor PQS 6kg (ABC)
   * @default true
   */
  extintor: boolean;
  /**
   * Botiquín * / Linterna
   * @default true
   */
  botiquinLinterna: boolean;
  /**
   * Kit antiderrame
   * @default true
   */
  kitAntiderrame: boolean;
  /**
   * Sistema Comunicación(Teléfono Satelital, Radio Handy, Celular)
   * @default true
   */
  sistemaComunicacion: boolean;
  /**
   * Prueba del freno de servicio
   * @default true
   */
  pruebaFrenoServicio: boolean;
  /**
   * Freno de estacionamiento
   * @default true
   */
  frenoEstacionamiento: boolean;
  /**
   * Dirección
   * @default true
   */
  direccion: boolean;
  /**
   * Nivel de aceite del motor
   * @default true
   */
  nivelAceiteMotor: boolean;
  /**
   * Nivel de liquido de frenos
   * @default true
   */
  nivelLiquidoFrenos: boolean;
  /**
   * Nivel de refrigerante
   * @default true
   */
  nivelRefrigerante: boolean;
  /**
   * Nivel de aceite hidráulico (hidrolina)
   * @default true
   */
  nivelAceiteHidraulico: boolean;
  /**
   * Nivel de agua para limpiaparabrisas
   * @default true
   */
  nivelAguaLimpiaparabrisas: boolean;
  /**
   * Otros (Mecánico)
   * @default false
   */
  otrosMecanico: boolean;
  /**
   * MobiliEye
   * @default true
   */
  mobiliEye: boolean;
  /**
   * Sensor de Fatiga RDT401B (Sonido)
   * @default true
   */
  sensorFatiga: boolean;
  /**
   * Frenos ABS
   * @default true
   */
  frenosABS: boolean;
  /**
   * ESP/ESC
   * @default true
   */
  espEsc: boolean;
  /**
   * Estado de Cinturones Pilotos
   * @default true
   */
  cinturonesPilotos: boolean;
  /**
   * Estado de Cinturones Pasajes
   * @default true
   */
  cinturonesPasajes: boolean;
}

export interface DocumentoItemDto {
  /**
   * Si el documento es requerido/habilitado
   * @default true
   */
  habilitado: boolean;
  /** Observación inicial */
  observacion?: string;
  /**
   * Fecha de Vencimiento Inicial/Por defecto
   * @example "2026-03-27T21:03:47.321Z"
   */
  fechaVencimiento?: string;
}

export interface InspeccionDocumentosDto {
  soatVigente: DocumentoItemDto;
  tarjetaPropiedad: DocumentoItemDto;
  tarjetaCirculacion: DocumentoItemDto;
  polizaVigente: DocumentoItemDto;
  ctivVigente: DocumentoItemDto;
  hojasMsdsVehiculo: DocumentoItemDto;
  manualOperacion: DocumentoItemDto;
  otroVehiculo: DocumentoItemDto;
  licenciaMtc: DocumentoItemDto;
  licenciaInterna: DocumentoItemDto;
  checkListDiario: DocumentoItemDto;
  iperc: DocumentoItemDto;
  pets: DocumentoItemDto;
  hojasMsdsConductor: DocumentoItemDto;
  mapaRiesgos: DocumentoItemDto;
  otroConductor: DocumentoItemDto;
}

export interface LucesItemDto {
  /**
   * Estado del item (Operativo SI/NO)
   * @default true
   */
  estado: boolean;
  /** Observación o Acción Correctiva */
  observacion?: string;
}

export interface LucesEmergenciaAlarmasDto {
  alarmaRetroceso: LucesItemDto;
  alarmaCinturon: LucesItemDto;
  claxon: LucesItemDto;
  lucesCabina: LucesItemDto;
  lucesSalon: LucesItemDto;
  lucesAltasDerecho: LucesItemDto;
  lucesAltasIzquierdo: LucesItemDto;
  lucesBajasDerecho: LucesItemDto;
  lucesBajasIzquierdo: LucesItemDto;
  lucesLateralesDerecho: LucesItemDto;
  lucesLateralesIzquierdo: LucesItemDto;
  lucesNeblineros: LucesItemDto;
  lucesEstacionamientoDerecho: LucesItemDto;
  lucesEstacionamientoIzquierdo: LucesItemDto;
  lucesDireccionalesDerecho: LucesItemDto;
  lucesDireccionalesIzquierdo: LucesItemDto;
  luzEstroboscopica: LucesItemDto;
  luzPertiga: LucesItemDto;
  pruebaRadio: LucesItemDto;
  botonPanico: LucesItemDto;
}

export interface CinturonItemDto {
  /**
   * Si el asiento existe/está habilitado
   * @default true
   */
  habilitado: boolean;
  /** Observación inicial o configuración */
  observacion?: string;
}

export interface CinturonesSeguridadDto {
  asientoPiloto: CinturonItemDto;
  asientoCopiloto: CinturonItemDto;
  asiento1: CinturonItemDto;
  asiento2: CinturonItemDto;
  asiento3: CinturonItemDto;
  asiento4: CinturonItemDto;
  asiento5: CinturonItemDto;
  asiento6: CinturonItemDto;
  asiento7: CinturonItemDto;
  asiento8: CinturonItemDto;
  asiento9: CinturonItemDto;
  asiento10: CinturonItemDto;
  asiento11: CinturonItemDto;
  asiento12: CinturonItemDto;
  asiento13: CinturonItemDto;
  asiento14: CinturonItemDto;
  asiento15: CinturonItemDto;
  asiento16: CinturonItemDto;
  asiento17: CinturonItemDto;
  asiento18: CinturonItemDto;
  asiento19: CinturonItemDto;
  asiento20: CinturonItemDto;
  asiento21: CinturonItemDto;
  asiento22: CinturonItemDto;
  asiento23: CinturonItemDto;
  asiento24: CinturonItemDto;
  asiento25: CinturonItemDto;
  asiento26: CinturonItemDto;
  asiento27: CinturonItemDto;
  asiento28: CinturonItemDto;
  asiento29: CinturonItemDto;
  asiento30: CinturonItemDto;
  asiento31: CinturonItemDto;
  asiento32: CinturonItemDto;
  asiento33: CinturonItemDto;
  asiento34: CinturonItemDto;
  asiento35: CinturonItemDto;
  asiento36: CinturonItemDto;
  asiento37: CinturonItemDto;
  asiento38: CinturonItemDto;
  asiento39: CinturonItemDto;
  asiento40: CinturonItemDto;
  asiento41: CinturonItemDto;
  asiento42: CinturonItemDto;
  asiento43: CinturonItemDto;
  asiento44: CinturonItemDto;
  asiento45: CinturonItemDto;
  asiento46: CinturonItemDto;
  asiento47: CinturonItemDto;
  asiento48: CinturonItemDto;
  asiento49: CinturonItemDto;
  asiento50: CinturonItemDto;
  asiento51: CinturonItemDto;
  asiento52: CinturonItemDto;
}

export interface HerramientaItemDto {
  /**
   * Habilitada para uso (SI/NO)
   * @default true
   */
  estado: boolean;
  /** Stock actual */
  stock?: string;
  /** A: Herramienta sin grasa impregnada */
  criterioA?: boolean;
  /** B: Empalme y conexiones */
  criterioB?: boolean;
  /** C: Almacenamiento adecuado */
  criterioC?: boolean;
  /** D: Golpes y abolladuras */
  criterioD?: boolean;
  /** E: Limpia y ordenada */
  criterioE?: boolean;
  /** F: Otro */
  criterioF?: boolean;
  /** Accion Correctiva */
  accionCorrectiva?: string;
  /** Observación */
  observacion?: string;
}

export interface InspeccionHerramientasDto {
  llavesMixtas: HerramientaItemDto;
  destornilladorEstrella: HerramientaItemDto;
  destornilladorPlano: HerramientaItemDto;
  alicate: HerramientaItemDto;
  llaveRuedaPalanca: HerramientaItemDto;
  trianguloSeguridad: HerramientaItemDto;
  conosPeligro: HerramientaItemDto;
  cableCorriente: HerramientaItemDto;
  eslinga: HerramientaItemDto;
  grilletes: HerramientaItemDto;
  tacosCunas: HerramientaItemDto;
  linterna: HerramientaItemDto;
  extintor: HerramientaItemDto;
  pico: HerramientaItemDto;
  medidorAire: HerramientaItemDto;
  varasLuminosas: HerramientaItemDto;
  paletaPareSiga: HerramientaItemDto;
  escoba: HerramientaItemDto;
  balde: HerramientaItemDto;
  cuadernoBitacora: HerramientaItemDto;
  gataHidraulica: HerramientaItemDto;
  cajaHerramientas: HerramientaItemDto;
}

export interface BotiquinItemDto {
  /**
   * Si el ítem debe estar en el vehículo
   * @default true
   */
  habilitado: boolean;
  /**
   * Fecha de Vencimiento actual
   * @example "2026-03-27T21:03:47.324Z"
   */
  fechaVencimiento?: string;
  /**
   * Fecha de Salida
   * @example "2026-03-27T21:03:47.324Z"
   */
  fechaSalida?: string;
  /**
   * Fecha de Reposición
   * @example "2026-03-27T21:03:47.324Z"
   */
  fechaReposicion?: string;
}

export interface InspeccionBotiquinesDto {
  alcohol: BotiquinItemDto;
  jabonLiquido: BotiquinItemDto;
  gasaEsterilizada: BotiquinItemDto;
  apositoEsterilizado: BotiquinItemDto;
  esparadrapo: BotiquinItemDto;
  vendaElastica: BotiquinItemDto;
  banditasAdhesivas: BotiquinItemDto;
  tijeraPuntaRoma: BotiquinItemDto;
  guantesQuirurgicos: BotiquinItemDto;
  algodon: BotiquinItemDto;
  maletin: BotiquinItemDto;
  /**
   * Ubicación del Botiquín
   * @default "Cabina"
   */
  ubicacionBotiquin: string;
}

export interface KitAntiderramesDto {
  /**
   * Mazo de goma
   * @default true
   */
  mazoGoma: boolean;
  /**
   * Set de cuñas, tarugos, tacos, conos
   * @default true
   */
  setCunas: boolean;
  /**
   * Bandeja
   * @default true
   */
  bandeja: boolean;
  /**
   * Barreras en Tela Oleofilica
   * @default true
   */
  barrerasOleofilicas: boolean;
  /**
   * Cinta de seguridad color rojo
   * @default true
   */
  cintaRoja: boolean;
  /**
   * Cinta de seguridad color amarillo
   * @default true
   */
  cintaAmarilla: boolean;
  /**
   * Bolsas de color rojo de tipo industrial
   * @default true
   */
  bolsasRojas: boolean;
  /**
   * Paños oleofilicos de 40 cm x 50 cm
   * @default true
   */
  panosOleofilicos: boolean;
  /**
   * Recogedor de plástico
   * @default true
   */
  recogedorPlastico: boolean;
  /**
   * Manual de plan de contingencia
   * @default true
   */
  manualContingencia: boolean;
  /**
   * Guantes de nitrilo
   * @default true
   */
  guantesNitrilo: boolean;
  /**
   * Lente de seguridad
   * @default true
   */
  lenteSeguridad: boolean;
  /**
   * Respirador Doble Cartucho
   * @default true
   */
  respirador: boolean;
  /**
   * Traje tyvek resistente a hidrocarburos
   * @default true
   */
  trajeTyvek: boolean;
  /**
   * Botas de PVC con puntera de seguridad
   * @default true
   */
  botasPVC: boolean;
  /**
   * Maletín
   * @default true
   */
  maletin: boolean;
  /** Ubicación */
  ubicacion?: string;
}

export interface RevisionVehiculosDto {
  photo: PhotoItemDto;
}

export interface VehiculoMantenimientoListDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "0582"
   */
  codigoInterno?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload Kg
   * @example "1500.50"
   */
  cargaUtil?: string;
  /**
   * Gross weight Kg
   * @example "2500.00"
   */
  pesoBruto?: string;
  /**
   * Net weight Kg
   * @example "1000.00"
   */
  pesoNeto?: string;
  /**
   * Seats
   * @example 2
   */
  asientos?: number;
  /**
   * Passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Axles
   * @example 2
   */
  ejes?: number;
  /**
   * Wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  comentarios?: VehiculoComentarioDetalleDto[];
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.90"
   */
  ancho?: string;
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
}

export interface SucursalDetalleResDto {
  /** @example 1 */
  id: number;
  /** @example "Miraflores" */
  distrito: string;
  /** @example "Av. Direccion Exacta 123" */
  ubicacionExacta: string;
}

export interface TallerResultDto {
  /**
   * ID del taller
   * @example 1
   */
  id: number;
  /**
   * RUC del taller
   * @example "12345678901"
   */
  ruc: string;
  /**
   * Razón Social
   * @example "Taller Mecánico SAC"
   */
  razonSocial: string;
  /**
   * Nombre Comercial
   * @example "Taller Express"
   */
  nombreComercial: string | null;
  /**
   * Tipo de taller (interno/externo)
   * @example "externo"
   */
  tipo: "interno" | "externo";
  /**
   * Teléfono
   * @example "999888777"
   */
  telefono: string | null;
  /**
   * Email
   * @example "contacto@taller.com"
   */
  email: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * IDs de las sucursales
   * @example [1,2]
   */
  sucursalIds: number[];
  /** Detalle de las sucursales con dirección (solo disponible en findOne) */
  sucursales: SucursalDetalleResDto[];
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2023-01-02T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Fecha de eliminación (si aplica)
   * @format date-time
   * @example null
   */
  eliminadoEn: string | null;
}

export interface MantenimientoListDto {
  /**
   * Maintenance ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle ID
   * @example 1
   */
  vehiculoId: number;
  /** Vehicle details */
  vehiculo: VehiculoMantenimientoListDto;
  /**
   * Workshop ID
   * @example 1
   */
  tallerId: number;
  /** Workshop details */
  taller: TallerResultDto;
  /**
   * Service Order Code
   * @example "ORD-001"
   */
  codigoOrden: string;
  /**
   * Maintenance type
   * @example "preventivo"
   */
  tipo: "preventivo" | "correctivo";
  /**
   * Total Cost
   * @example "150.50"
   */
  costoTotal: string;
  /**
   * Description
   * @example "Cambio de aceite"
   */
  descripcion: string;
  /**
   * Date of entry
   * @format date-time
   * @example "2025-01-15T10:00:00Z"
   */
  fechaIngreso: string;
  /**
   * Date of exit
   * @format date-time
   * @example "2025-01-16T18:00:00Z"
   */
  fechaSalida: string;
  /**
   * Mileage at maintenance
   * @example 55000
   */
  kilometraje: number;
  /**
   * Status
   * @example "pendiente"
   */
  estado: "pendiente" | "en_proceso" | "finalizado";
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-02T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example null
   */
  eliminadoEn: string | null;
}

export interface PaginatedMantenimientoResultDto {
  /** Lista de mantenimientos en la página actual */
  data: MantenimientoListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface VehiculoMantenimientoResultDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "0582"
   */
  codigoInterno?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload Kg
   * @example "1500.50"
   */
  cargaUtil?: string;
  /**
   * Gross weight Kg
   * @example "2500.00"
   */
  pesoBruto?: string;
  /**
   * Net weight Kg
   * @example "1000.00"
   */
  pesoNeto?: string;
  /**
   * Seats
   * @example 2
   */
  asientos?: number;
  /**
   * Passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Axles
   * @example 2
   */
  ejes?: number;
  /**
   * Wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  comentarios?: VehiculoComentarioDetalleDto[];
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.90"
   */
  ancho?: string;
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
}

export interface SucursalResultDto {
  /**
   * ID de la sucursal
   * @example 1
   */
  id: number;
  /**
   * ID del taller al que pertenece
   * @example 1
   */
  tallerId: number;
  /**
   * Distrito
   * @example "Miraflores"
   */
  distrito: string;
  /**
   * Ubicación exacta
   * @example "Av. Larco 123"
   */
  ubicacionExacta: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2023-01-02T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Fecha de eliminación (si aplica)
   * @format date-time
   * @example null
   */
  eliminadoEn: string | null;
}

export interface TareaResultDto {
  /**
   * ID de la tarea
   * @example 1
   */
  id: number;
  /**
   * Código de la tarea
   * @example "T-001"
   */
  codigo: string;
  /**
   * Nombre del trabajo
   * @example "Cambio de aceite"
   */
  nombreTrabajo: string;
  /**
   * Grupo de la tarea
   * @example "Motor"
   */
  grupo: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface MantenimientoTareaResultDto {
  id: number;
  mantenimientoId: number;
  tareaId: number;
  /** Datos de la tarea del catálogo */
  tarea: TareaResultDto;
  responsable: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  completada: boolean;
  observaciones: string | null;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface MantenimientoDocumentoResultDto {
  id: number;
  mantenimientoId: number;
  tipo:
    | "factura"
    | "guia_remision"
    | "informe_tecnico"
    | "cotizacion"
    | "fotos"
    | "cartilla"
    | "otros";
  nombre: string;
  url: string;
  fechaEmision: string | null;
  fechaExpiracion: string | null;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface DocumentosAgrupadosMantenimientoDto {
  factura: MantenimientoDocumentoResultDto[];
  guia_remision: MantenimientoDocumentoResultDto[];
  informe_tecnico: MantenimientoDocumentoResultDto[];
  cotizacion: MantenimientoDocumentoResultDto[];
  fotos: MantenimientoDocumentoResultDto[];
  cartilla: MantenimientoDocumentoResultDto[];
  otros: MantenimientoDocumentoResultDto[];
}

export interface MantenimientoResultDto {
  /**
   * Maintenance ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle ID
   * @example 1
   */
  vehiculoId: number;
  /** Vehicle details */
  vehiculo: VehiculoMantenimientoResultDto;
  /**
   * Workshop ID
   * @example 1
   */
  tallerId: number;
  /** Workshop details */
  taller: TallerResultDto;
  /**
   * Branch ID
   * @example 1
   */
  sucursalId: number | null;
  /** Branch details */
  sucursal?: SucursalResultDto | null;
  /**
   * Service Order Code
   * @example "ORD-001"
   */
  codigoOrden: string;
  /**
   * Maintenance type
   * @example "preventivo"
   */
  tipo: "preventivo" | "correctivo";
  /**
   * Total Cost
   * @example "150.50"
   */
  costoTotal: string;
  /**
   * Description
   * @example "Cambio de aceite"
   */
  descripcion: string;
  /**
   * Date of entry
   * @format date-time
   * @example "2025-01-15T10:00:00Z"
   */
  fechaIngreso: string;
  /**
   * Date of exit
   * @format date-time
   * @example "2025-01-16T18:00:00Z"
   */
  fechaSalida: string;
  /**
   * Mileage at maintenance
   * @example 55000
   */
  kilometraje: number;
  /**
   * Next Maintenance Mileage
   * @example 60000
   */
  kilometrajeProximoMantenimiento: number | null;
  /**
   * Status
   * @example "pendiente"
   */
  estado: "pendiente" | "en_proceso" | "finalizado";
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** List of maintenance tasks */
  tareas: MantenimientoTareaResultDto[];
  /** Maintenance documents grouped by type */
  documentos: DocumentosAgrupadosMantenimientoDto;
}

export interface MantenimientoCreateDto {
  /**
   * Vehicle ID
   * @example 1
   */
  vehiculoId: number;
  /**
   * Workshop ID
   * @example 1
   */
  tallerId?: number;
  /**
   * Branch ID
   * @example 1
   */
  sucursalId?: number;
  /**
   * Maintenance type
   * @default "preventivo"
   */
  tipo: "preventivo" | "correctivo";
  /**
   * Total Cost
   * @example "150.50"
   */
  costoTotal: string;
  /**
   * Description
   * @example "Cambio de aceite"
   */
  descripcion: string;
  /**
   * Date of entry
   * @format date-time
   * @example "2025-01-15T10:00:00Z"
   */
  fechaIngreso: string;
  /**
   * Date of exit
   * @format date-time
   * @example "2025-01-16T18:00:00Z"
   */
  fechaSalida: string;
  /**
   * Mileage at maintenance
   * @example 55000
   */
  kilometraje: number;
  /**
   * Next maintenance mileage
   * @example 60000
   */
  kilometrajeProximoMantenimiento: number;
  /**
   * Status
   * @default "pendiente"
   */
  estado: "pendiente" | "en_proceso" | "finalizado";
  /** Si es true, el vehículo cambiará su estado a taller. */
  marcarEnTaller?: boolean;
}

export interface MantenimientoUpdateDto {
  /**
   * Vehicle ID
   * @example 1
   */
  vehiculoId?: number;
  /**
   * Workshop ID
   * @example 1
   */
  tallerId?: number;
  /**
   * Branch ID
   * @example 1
   */
  sucursalId?: number;
  /**
   * Maintenance type
   * @default "preventivo"
   */
  tipo?: "preventivo" | "correctivo";
  /**
   * Total Cost
   * @example "150.50"
   */
  costoTotal?: string;
  /**
   * Description
   * @example "Cambio de aceite"
   */
  descripcion?: string;
  /**
   * Date of entry
   * @format date-time
   * @example "2025-01-15T10:00:00Z"
   */
  fechaIngreso?: string;
  /**
   * Date of exit
   * @format date-time
   * @example "2025-01-16T18:00:00Z"
   */
  fechaSalida?: string;
  /**
   * Mileage at maintenance
   * @example 55000
   */
  kilometraje?: number;
  /**
   * Next maintenance mileage
   * @example 60000
   */
  kilometrajeProximoMantenimiento?: number;
  /**
   * Status
   * @default "pendiente"
   */
  estado?: "pendiente" | "en_proceso" | "finalizado";
  /** Si es true, el vehículo cambiará su estado a taller. */
  marcarEnTaller?: boolean;
}

export interface MantenimientoTareaCreateDto {
  /**
   * ID del mantenimiento
   * @example 1
   */
  mantenimientoId: number;
  /**
   * ID de la tarea del catálogo
   * @example 1
   */
  tareaId: number;
  /**
   * Responsable de la ejecución
   * @example "Juan Perez"
   */
  responsable?: string;
  /**
   * Hora de inicio
   * @example "08:00"
   */
  horaInicio?: string;
  /**
   * Hora de fin
   * @example "10:00"
   */
  horaFin?: string;
  /**
   * Si la tarea está completada
   * @example false
   */
  completada?: boolean;
  /**
   * Observaciones
   * @example "Ninguna"
   */
  observaciones?: string;
}

export interface MantenimientoTareaUpdateDto {
  /**
   * ID del mantenimiento
   * @example 1
   */
  mantenimientoId?: number;
  /**
   * ID de la tarea del catálogo
   * @example 1
   */
  tareaId?: number;
  /**
   * Responsable de la ejecución
   * @example "Juan Perez"
   */
  responsable?: string;
  /**
   * Hora de inicio
   * @example "08:00"
   */
  horaInicio?: string;
  /**
   * Hora de fin
   * @example "10:00"
   */
  horaFin?: string;
  /**
   * Si la tarea está completada
   * @example false
   */
  completada?: boolean;
  /**
   * Observaciones
   * @example "Ninguna"
   */
  observaciones?: string;
}

export interface TareaListDto {
  /**
   * ID de la tarea
   * @example 1
   */
  id: number;
  /**
   * Código de la tarea
   * @example "T-001"
   */
  codigo: string;
  /**
   * Nombre del trabajo
   * @example "Cambio de aceite"
   */
  nombreTrabajo: string;
  /**
   * Grupo de la tarea
   * @example "Motor"
   */
  grupo: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedTareaResultDto {
  /** Lista de tareas en la página actual */
  data: TareaListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface TareaCreateDto {
  /**
   * Código de la tarea
   * @example "T-001"
   */
  codigo: string;
  /**
   * Nombre del trabajo
   * @example "Cambio de aceite"
   */
  nombreTrabajo: string;
  /**
   * Grupo de la tarea
   * @example "Motor"
   */
  grupo: string;
}

export interface TareaUpdateDto {
  /**
   * Código de la tarea
   * @example "T-001"
   */
  codigo?: string;
  /**
   * Nombre del trabajo
   * @example "Cambio de aceite"
   */
  nombreTrabajo?: string;
  /**
   * Grupo de la tarea
   * @example "Motor"
   */
  grupo?: string;
}

export interface MantenimientoDocumentoCreateDto {
  /**
   * ID del mantenimiento
   * @example 1
   */
  mantenimientoId: number;
  /**
   * Tipo de documento
   * @example "factura"
   */
  tipo:
    | "factura"
    | "guia_remision"
    | "informe_tecnico"
    | "cotizacion"
    | "fotos"
    | "cartilla"
    | "otros";
  /**
   * Nombre del documento
   * @example "Factura 001"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://example.com/doc.pdf"
   */
  url: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
}

export interface MantenimientoDocumentoUpdateDto {
  /**
   * ID del mantenimiento
   * @example 1
   */
  mantenimientoId?: number;
  /**
   * Tipo de documento
   * @example "factura"
   */
  tipo?:
    | "factura"
    | "guia_remision"
    | "informe_tecnico"
    | "cotizacion"
    | "fotos"
    | "cartilla"
    | "otros";
  /**
   * Nombre del documento
   * @example "Factura 001"
   */
  nombre?: string;
  /**
   * URL del documento
   * @example "https://example.com/doc.pdf"
   */
  url?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
}

export interface MantenimientoReporteEstadoDto {
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * Placa del vehículo
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Código interno del vehículo
   * @example "V-001"
   */
  codigoInterno: string | null;
  /**
   * Imágenes del vehículo
   * @example ["url1","url2"]
   */
  imagenes: string[] | null;
  /**
   * Kilometraje actual del vehículo
   * @example 50000
   */
  kilometrajeActual: number;
  /**
   * Fecha del último mantenimiento
   * @format date-time
   * @example "2025-01-01"
   */
  ultimoMantenimientoFecha: string | null;
  /**
   * Kilometraje en el último mantenimiento
   * @example 45000
   */
  ultimoMantenimientoKm: number | null;
  /**
   * Kilometraje programado para el próximo mantenimiento
   * @example 55000
   */
  proxMantenimientoKm: number | null;
  /**
   * Kilómetros restantes para el próximo mantenimiento
   * @example 5000
   */
  restante: number | null;
  /**
   * Kilómetros restantes para el próximo mantenimiento (alias)
   * @example 5000
   */
  kilometrajeRestante: number | null;
  /**
   * Estado del mantenimiento (verde, amarillo, rojo)
   * @example "verde"
   */
  estado: "verde" | "amarillo" | "rojo" | "n/a";
}

export interface PaginatedReporteEstadoResultDto {
  data: MantenimientoReporteEstadoDto[];
  meta: PaginationMetaDto;
}

export interface NotificacionListDto {
  id: number;
  titulo: string;
  mensaje: string;
  /** @default "info" */
  tipo?: "info" | "warning" | "error" | "success";
  /** @format date-time */
  creadoEn: string;
  leido: boolean;
  metadata?: object;
}

export interface PaginatedNotificacionResultDto {
  /** Lista de notificaciones */
  data: NotificacionListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface NotificacionCreateDto {
  titulo: string;
  mensaje: string;
  /** @default "info" */
  tipo?: "info" | "warning" | "error" | "success";
  metadata?: object;
}

export interface NotificacionResultDto {
  /** @example 1 */
  id: number;
  /** @example "Título de la notificación" */
  titulo: string;
  /** @example "Cuerpo del mensaje de la notificación" */
  mensaje: string;
  /** @example "info" */
  tipo: "info" | "warning" | "error" | "success";
  /**
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /** @example false */
  leido: boolean;
  metadata?: object;
}

export interface VencimientoResumenDto {
  /** @example 5 */
  clientes: number;
  /** @example 3 */
  conductores: number;
  /** @example 2 */
  vehiculos: number;
  /** @example 1 */
  usuarios: number;
  /** @example 2 */
  vencidos: number;
  /** @example 9 */
  porVencer: number;
}

export interface NotificacionPreviewDto {
  /** @example "DNI próximo a vencer" */
  titulo: string;
  /** @example "El documento DNI de Cliente Juan Pérez vencerá en 5 días" */
  mensaje: string;
  /** @example "warning" */
  tipo: "info" | "warning" | "error" | "success";
  /** @example "cliente" */
  entidad: "cliente" | "conductor" | "vehiculo" | "usuario";
  /** @example 1 */
  entidadId: number;
  /** @example "Juan Pérez" */
  entidadNombre: string;
  /** @example "dni" */
  tipoDocumento: string;
  /** @example 5 */
  diasRestantes: number;
}

export interface PreviewVencimientosResultDto {
  /** @example {"fechaReferencia":"2025-12-18","diasAnticipacion":7,"fechaLimite":"2025-12-25"} */
  parametros: object;
  /** @example 11 */
  totalDocumentosEncontrados: number;
  resumen: VencimientoResumenDto;
  notificaciones: NotificacionPreviewDto[];
}

export interface GenerarVencimientosResultDto {
  /** @example "Se crearon 5 notificaciones" */
  message: string;
  /** @example 5 */
  created: number;
  notifications?: NotificacionResultDto[];
  previews: NotificacionPreviewDto[];
  /** @example {"fechaReferencia":"2025-12-18","diasAnticipacion":7} */
  parametros: object;
}

export interface SendEmailDto {
  /**
   * Correo del destinatario
   * @example "example@gmail.com"
   */
  to: string;
  /**
   * Asunto
   * @example "Asunto del correo"
   */
  subject: string;
  /**
   * Cuerpo del mensaje en texto plano
   * @example "Contenido del correo"
   */
  text: string;
  /**
   * Cuerpo del mensaje en HTML
   * @example "<h1>Hola</h1>"
   */
  html?: string;
}

export interface RutaResultDto {
  /**
   * Route ID
   * @example 1
   */
  id: number;
  /**
   * Origin city
   * @example "Lima"
   */
  origen: string;
  /**
   * Destination city
   * @example "Ica"
   */
  destino: string;
  /**
   * Origin latitude
   * @example "-12.0464"
   */
  origenLat: string;
  /**
   * Origin longitude
   * @example "-77.0428"
   */
  origenLng: string;
  /**
   * Destination latitude
   * @example "-14.0678"
   */
  destinoLat: string;
  /**
   * Destination longitude
   * @example "-75.7286"
   */
  destinoLng: string;
  /**
   * Distance in km
   * @example "300.5"
   */
  distancia: string;
  /**
   * Tiempo estimado de viaje en minutos
   * @example 210
   */
  tiempoEstimado: number;
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedRutaResultDto {
  /** Lista de rutas en la página actual */
  data: RutaResultDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface RutaCircuitoResultDto {
  /**
   * ID del circuito
   * @example 1
   */
  id: number;
  /**
   * Nombre del circuito
   * @example "Lima - Ica"
   */
  nombre: string;
  /** Ruta de ida */
  rutaIda: RutaResultDto;
  /** Ruta de vuelta */
  rutaVuelta: RutaResultDto;
  /**
   * Indica si la ruta de ida y vuelta son la misma
   * @example true
   */
  esIgual: boolean;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedRutaCircuitoResultDto {
  /** Lista de circuitos en la página actual */
  data: RutaCircuitoResultDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface RutaParadaCreateDto {
  /**
   * Nombre de la parada
   * @example "Parada 1"
   */
  nombre: string;
  /**
   * Latitud de la parada
   * @example "-12.0464"
   */
  ubicacionLat: string;
  /**
   * Longitud de la parada
   * @example "-77.0428"
   */
  ubicacionLng: string;
  /**
   * Orden de la parada
   * @example 1
   */
  orden?: number;
  /**
   * Distancia desde la parada previa
   * @example "10.5"
   */
  distanciaPreviaParada?: string;
  /**
   * Tiempo estimado desde la parada previa en minutos
   * @example 15
   */
  tiempoEstimado?: number;
}

export interface RutaCircuitoDetalleDto {
  /**
   * Ciudad de origen
   * @example "Lima"
   */
  origen: string;
  /**
   * Ciudad de destino
   * @example "Ica"
   */
  destino?: string;
  /**
   * Latitud del origen
   * @example "-12.0464"
   */
  origenLat: string;
  /**
   * Longitud del origen
   * @example "-77.0428"
   */
  origenLng: string;
  /**
   * Latitud del destino
   * @example "-14.0678"
   */
  destinoLat?: string;
  /**
   * Longitud del destino
   * @example "-75.7286"
   */
  destinoLng?: string;
  /**
   * Distancia en km
   * @example "300.5"
   */
  distancia: string;
  /**
   * Tiempo estimado de viaje en minutos
   * @example 210
   */
  tiempoEstimado: number;
  /** Paradas intermedias de la ruta */
  paradas?: RutaParadaCreateDto[];
}

export interface RutaCircuitoCreateDto {
  /**
   * Nombre del circuito
   * @example "Lima - Ica"
   */
  nombre: string;
  /**
   * Indica si la ruta de vuelta es espejo de la ida
   * @example false
   */
  esIgual: boolean;
  /** Detalle de la ruta de ida */
  ida?: RutaCircuitoDetalleDto;
  /** Detalle de la ruta de vuelta (opcional) */
  vuelta?: RutaCircuitoDetalleDto;
}

export interface RutaCircuitoUpdateDto {
  /**
   * Nombre del circuito
   * @example "Lima - Ica"
   */
  nombre?: string;
  /**
   * Indica si la ruta de vuelta es espejo de la ida
   * @example false
   */
  esIgual?: boolean;
  /** Detalle de la ruta de ida */
  ida?: RutaCircuitoDetalleDto;
  /** Detalle de la ruta de vuelta (opcional) */
  vuelta?: RutaCircuitoDetalleDto;
}

export interface ConductorViajeDto {
  /**
   * Driver ID
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento de identidad
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Driver DNI
   * @example "12345678"
   */
  dni: string;
  /**
   * Driver first names
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Driver last names
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Driver full name
   * @example "Juan Carlos Perez Garcia"
   */
  nombreCompleto: string;
  /**
   * Driver email
   * @example "juan@example.com"
   */
  email?: string;
  /**
   * Driver phone number
   * @example "987654321"
   */
  celular?: string;
  /**
   * Driver license number
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Driver license class
   * @example "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Driver license category
   * @example "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: "activo" | "inactivo" | "eventual";
}

export interface VehiculoViajeDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "0582"
   */
  codigoInterno?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload Kg
   * @example "1500.50"
   */
  cargaUtil?: string;
  /**
   * Gross weight Kg
   * @example "2500.00"
   */
  pesoBruto?: string;
  /**
   * Net weight Kg
   * @example "1000.00"
   */
  pesoNeto?: string;
  /**
   * Seats
   * @example 2
   */
  asientos?: number;
  /**
   * Passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Axles
   * @example 2
   */
  ejes?: number;
  /**
   * Wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  comentarios?: VehiculoComentarioDetalleDto[];
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.90"
   */
  ancho?: string;
  /** List of owners */
  propietarios: PropietarioVehiculoDto[];
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
}

export interface ClienteViajeDto {
  /**
   * ID del cliente
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @example "personal"
   */
  tipo: "personal" | "corporativo";
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni: string;
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial: string;
  /**
   * Nombre completo del cliente
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface EntidadResultDto {
  /** @example 1 */
  id: number;
  /** @example 1 */
  clienteId: number;
  /** @example "Minera Cerro Verde" */
  nombreServicio: string;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface EncargadoResultDto {
  /** @example 1 */
  id: number;
  /** @example 1 */
  clienteId: number;
  /** @example "12345678" */
  dni: string;
  /** @example "Juan" */
  nombres: string;
  /** @example "Pérez" */
  apellidos: string;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface ViajeListDto {
  /**
   * Trip ID
   * @example 1
   */
  id: number;
  /**
   * ID de la ruta programada
   * @example 1
   */
  rutaId?: number;
  /**
   * Descripción de ruta ocasional
   * @example "Lima - Arequipa (Ocasional)"
   */
  rutaOcasional?: string;
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa Especial"
   */
  nombreRuta?: string;
  /**
   * Tipo de ruta
   * @example "ocasional"
   */
  tipoRuta: "ocasional" | "fija";
  /**
   * Distancia estimada del viaje en km
   * @example "450.00"
   */
  distanciaEstimada?: string;
  /**
   * Distancia real al final del viaje en km
   * @example "455.50"
   */
  distanciaFinal?: string;
  /**
   * ID del cliente
   * @example 1
   */
  clienteId: number;
  /**
   * ID de la entidad
   * @example 1
   */
  entidadId?: number;
  /**
   * ID del encargado
   * @example 1
   */
  encargadoId?: number;
  /**
   * Modalidad de servicio
   * @example "regular"
   */
  modalidadServicio:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /**
   * Trip status
   * @example "programado"
   */
  estado: "programado" | "en_progreso" | "completado" | "cancelado";
  /**
   * Turno del viaje (día o noche)
   * @example "dia"
   */
  turno?: "dia" | "noche";
  /**
   * Sentido del viaje (ida o vuelta)
   * @example "ida"
   */
  sentido: "ida" | "vuelta" | "circuito";
  /**
   * Scheduled departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalidaProgramada: string;
  /**
   * Scheduled arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegadaProgramada?: string;
  /**
   * Real Departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalida?: string;
  /**
   * Real Arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegada?: string;
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  conductorPrincipal?: ConductorViajeDto;
  vehiculoPrincipal?: VehiculoViajeDto;
  cliente?: ClienteViajeDto;
  entidad?: EntidadResultDto;
  encargado?: EncargadoResultDto;
  ruta?: RutaResultDto;
}

export interface ViajeCircuitoResultDto {
  /**
   * ID del circuito de viaje
   * @example 1
   */
  id: number;
  /** Viaje de ida */
  ida?: ViajeListDto;
  /** Viaje de vuelta */
  vuelta?: ViajeListDto;
  /** Viaje de circuito completo */
  circuito?: ViajeListDto;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  creadoEn: string;
}

export interface PaginatedViajeResultDto {
  /** Lista de circuitos de viajes en la página actual */
  data: ViajeCircuitoResultDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface ViajeLightResultDto {
  /**
   * ID del viaje
   * @example 1
   */
  id: number;
  /**
   * Nombre de la ruta
   * @example "Lima - Ica"
   */
  rutaNombre: string;
  /**
   * Estado del viaje
   * @example "programado"
   */
  estado: "programado" | "en_progreso" | "completado" | "cancelado";
  /**
   * Fecha de salida
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fecha: string;
  /**
   * Checklist de salida validado
   * @example true
   */
  checkInSalida: boolean;
  /**
   * Checklist de llegada validado
   * @example false
   */
  checkInLlegada: boolean;
}

export interface ViajeCircuitoLightResultDto {
  /**
   * ID del circuito de viaje
   * @example 1
   */
  id: number;
  /** Viaje de ida (ligero) */
  ida?: ViajeLightResultDto;
  /** Viaje de vuelta (ligero) */
  vuelta?: ViajeLightResultDto;
  /** Viaje de circuito completo (ligero) */
  circuito?: ViajeLightResultDto;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  creadoEn: string;
}

export interface PaginatedViajeLightResultDto {
  /** Lista de circuitos de viajes (formato ligero) */
  data: ViajeCircuitoLightResultDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface ValidacionResultDto {
  /**
   * Indica si la entidad (vehículo o conductor) está habilitada y disponible
   * @example true
   */
  status: boolean;
  /**
   * Mensaje detallando el resultado de la validación
   * @example "El vehículo está disponible para este viaje."
   */
  message: string;
}

export interface ViajeConductorDetalleDto {
  /**
   * Driver ID
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento de identidad
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "CE" | "PTP" | "PASAPORTE" | "OTRO";
  /**
   * Nacionalidad del conductor
   * @example "Peruana"
   */
  nacionalidad?: string;
  /**
   * Driver DNI
   * @example "12345678"
   */
  dni: string;
  /**
   * Driver first names
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Driver last names
   * @example "Perez Garcia"
   */
  apellidos: string;
  /**
   * Driver full name
   * @example "Juan Carlos Perez Garcia"
   */
  nombreCompleto: string;
  /**
   * Driver email
   * @example "juan@example.com"
   */
  email?: string;
  /**
   * Driver phone number
   * @example "987654321"
   */
  celular?: string;
  /**
   * Driver license number
   * @example "Q07864165"
   */
  numeroLicencia: string;
  /**
   * Driver license class
   * @example "A"
   */
  claseLicencia: "A" | "B";
  /**
   * Driver license category
   * @example "I"
   */
  categoriaLicencia:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Lista de URLs de fotochecks del conductor
   * @example ["https://res.cloudinary.com/xxx/fotocheck.jpg"]
   */
  fotocheck?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Deletion date (if applicable)
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn: string | null;
  /** Documentos que no aplican para el conductor */
  documentosNoAplicables: (
    | "dni"
    | "licencia_mtc"
    | "seguro_vida_ley"
    | "sctr"
    | "examen_medico"
    | "psicosensometrico"
    | "induccion_general"
    | "manejo_defensivo"
    | "licencia_interna"
    | "autoriza_ssgg"
    | "curso_seguridad_portuaria"
    | "curso_mercancias_peligrosas"
    | "curso_basico_pbip"
    | "examen_medico_temporal"
    | "induccion_visita"
    | "em_visita"
    | "pase_conduc"
    | "foto_funcionario"
  )[];
  /**
   * Estado del conductor
   * @example "activo"
   */
  estado: "activo" | "inactivo" | "eventual";
  /**
   * Es conductor principal
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del conductor
   * @example "conductor"
   */
  rol: "conductor" | "copiloto" | "auxiliar";
}

export interface ViajeVehiculoDetalleDto {
  /**
   * Vehicle ID
   * @example 1
   */
  id: number;
  /**
   * Vehicle license plate
   * @example "ABC-123"
   */
  placa: string;
  /**
   * Previous license plate
   * @example "XYZ-789"
   */
  placaAnterior?: string;
  /**
   * Internal vehicle code
   * @example "0582"
   */
  codigoInterno?: string;
  /**
   * Vehicle model ID
   * @example 1
   */
  modeloId: number;
  /**
   * Vehicle brand
   * @example "Toyota"
   */
  marca: string;
  /**
   * Vehicle model
   * @example "Corolla"
   */
  modelo: string;
  /**
   * Manufacturing year
   * @example 2020
   */
  anio: number;
  /**
   * VIN
   * @example "VIN1234567890ABCD"
   */
  vin?: string;
  /**
   * Engine number
   * @example "MOTOR123"
   */
  numeroMotor?: string;
  /**
   * Series number
   * @example "SERIE123"
   */
  numeroSerie?: string;
  /**
   * Color
   * @example "Blanco"
   */
  color?: string;
  /** Fuel type */
  combustible?: "gasolina" | "diesel" | "gnv" | "glp" | "electrico" | "hibrido";
  /**
   * Bodywork type
   * @example "PICK UP"
   */
  carroceria?: string;
  /**
   * Vehicle category
   * @example "N1"
   */
  categoria?: string;
  /**
   * Payload Kg
   * @example "1500.50"
   */
  cargaUtil?: string;
  /**
   * Gross weight Kg
   * @example "2500.00"
   */
  pesoBruto?: string;
  /**
   * Net weight Kg
   * @example "1000.00"
   */
  pesoNeto?: string;
  /**
   * Seats
   * @example 2
   */
  asientos?: number;
  /**
   * Passengers
   * @example 4
   */
  pasajeros?: number;
  /**
   * Axles
   * @example 2
   */
  ejes?: number;
  /**
   * Wheels
   * @example 4
   */
  ruedas?: number;
  /**
   * Current mileage
   * @example 50000
   */
  kilometraje: number;
  /**
   * Maintenance mileage
   * @example 50000
   */
  kilometrajeMantenimiento: number;
  /**
   * Vehicle status
   * @example "disponible"
   */
  estado: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  comentarios?: VehiculoComentarioDetalleDto[];
  /**
   * Headquarters
   * @example "Lima"
   */
  sede?: string;
  /**
   * Power
   * @example "110@3400"
   */
  potencia?: string;
  /**
   * Rolling formula
   * @example "4x4"
   */
  formulaRodante?: string;
  /**
   * Version
   * @example "DX"
   */
  version?: string;
  /**
   * Cylinders
   * @example 4
   */
  cilindros?: number;
  /**
   * Displacement
   * @example "2.776"
   */
  cilindrada?: string;
  /**
   * Length
   * @example "5.365"
   */
  longitud?: string;
  /**
   * Height
   * @example "1.809"
   */
  altura?: string;
  /**
   * Width
   * @example "1.90"
   */
  ancho?: string;
  /** List of owners */
  propietarios: PropietarioVehiculoDto[];
  /**
   * Lista de URLs de imágenes del vehículo
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Lista de tipos de documentos que no aplican a este vehículo
   * @example ["tarjeta_propiedad"]
   */
  documentosNoAplicables?: string[];
  /**
   * Es vehículo principal
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del vehículo
   * @example "principal"
   */
  rol: "principal" | "apoyo" | "emergencia";
}

export interface ViajeComentarioDetalleDto {
  /**
   * ID del comentario
   * @example 1
   */
  id: number;
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del usuario que creó el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El viaje se completó sin inconvenientes"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @example "observacion"
   */
  tipo: "observacion" | "incidencia" | "novedad" | "general";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
  /**
   * Nombre del usuario
   * @example "Juan Pérez"
   */
  usuarioNombreCompleto: string;
}

export interface ClienteViajeResultDto {
  /**
   * ID del cliente
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @example "personal"
   */
  tipo: "personal" | "corporativo";
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni: string;
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial: string;
  /**
   * Nombre completo del cliente
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface ViajeResultDto {
  /**
   * Trip ID
   * @example 1
   */
  id: number;
  /**
   * ID de la ruta programada
   * @example 1
   */
  rutaId?: number;
  /**
   * Descripción de ruta ocasional
   * @example "Lima - Arequipa (Ocasional)"
   */
  rutaOcasional?: string;
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa Especial"
   */
  nombreRuta?: string;
  /**
   * Tipo de ruta
   * @example "ocasional"
   */
  tipoRuta: "ocasional" | "fija";
  /**
   * Distancia estimada del viaje en km
   * @example "450.00"
   */
  distanciaEstimada?: string;
  /**
   * Distancia real al final del viaje en km
   * @example "455.50"
   */
  distanciaFinal?: string;
  /**
   * ID del cliente
   * @example 1
   */
  clienteId: number;
  /**
   * ID de la entidad
   * @example 1
   */
  entidadId?: number;
  /**
   * ID del encargado
   * @example 1
   */
  encargadoId?: number;
  /**
   * Modalidad de servicio
   * @example "regular"
   */
  modalidadServicio:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /**
   * Horas contratadas
   * @example "8.00"
   */
  horasContrato: string;
  /**
   * Estado del viaje
   * @example "programado"
   */
  estado: "programado" | "en_progreso" | "completado" | "cancelado";
  /**
   * Turno del viaje (día o noche)
   * @example "dia"
   */
  turno?: "dia" | "noche";
  /**
   * Sentido del viaje (ida o vuelta)
   * @example "ida"
   */
  sentido: "ida" | "vuelta" | "circuito";
  /**
   * Número de vale de combustible
   * @example "242155"
   */
  numeroVale?: string;
  /**
   * Scheduled departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalidaProgramada: string;
  /**
   * Scheduled arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegadaProgramada?: string;
  /**
   * Real Departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalida?: string;
  /**
   * Real Arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegada?: string;
  /** Datos adicionales del viaje (metadata) */
  metadata?: object;
  /**
   * Creation date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Update date
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  conductores?: ViajeConductorDetalleDto[];
  vehiculos?: ViajeVehiculoDetalleDto[];
  comentarios?: ViajeComentarioDetalleDto[];
  cliente?: ClienteViajeResultDto;
  entidad?: EntidadResultDto;
  encargado?: EncargadoResultDto;
  ruta?: RutaResultDto;
  /**
   * Indica si el checklist de salida fue validado
   * @example false
   */
  checkInSalida: boolean;
  /**
   * Indica si el checklist de llegada fue validado
   * @example false
   */
  checkInLlegada: boolean;
}

export interface ViajePuntoTrayectoDto {
  /**
   * Nombre del punto
   * @example "Lima"
   */
  nombre: string;
  /**
   * Latitud
   * @example -12.04318
   */
  latitud: number | null;
  /**
   * Longitud
   * @example -77.02824
   */
  longitud: number | null;
  /** Tipo de punto (origen, punto, parada, destino) */
  tipo: "origen" | "punto" | "parada" | "destino";
  /**
   * Orden cronológico/secuencial
   * @example 1
   */
  orden: number;
  /**
   * Indica si el conductor ya pasó por este punto
   * @example true
   */
  completado: boolean;
  /** ID del punto de la ruta fija, si aplica */
  rutaParadaId: number | null;
}

export interface ViajeTrayectoResultDto {
  /** Puntos del trayecto en orden secuencial */
  puntos: ViajePuntoTrayectoDto[];
}

export interface ViajeDetalleCreateDto {
  /**
   * ID de la ruta programada
   * @example 1
   */
  rutaId?: number;
  /**
   * Punto de partida para rutas ocasionales
   * @example "Lima"
   */
  rutaOcasional?: string;
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa Especial"
   */
  nombreRuta?: string;
  /**
   * Distancia estimada del viaje en km
   * @example "450.00"
   */
  distanciaEstimada?: string;
  /**
   * Distancia real al final del viaje en km
   * @example "455.50"
   */
  distanciaFinal?: string;
  /**
   * Tipo de ruta (fija, ocasional)
   * @default "fija"
   */
  tipoRuta?: "ocasional" | "fija";
  /**
   * ID del cliente
   * @example 1
   */
  clienteId: number;
  /**
   * ID de la entidad (opcional)
   * @example 1
   */
  entidadId?: number;
  /**
   * ID del encargado (opcional)
   * @example 1
   */
  encargadoId?: number;
  /**
   * Modalidad de servicio
   * @default "regular"
   */
  modalidadServicio?:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /**
   * Horas contratadas (si no se especifica, se toma del cliente)
   * @example "8.00"
   */
  horasContrato?: string;
  /**
   * Scheduled departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalidaProgramada: string;
  /**
   * Scheduled arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegadaProgramada?: string;
  /**
   * Estado del viaje
   * @default "programado"
   */
  estado?: "programado" | "en_progreso" | "completado" | "cancelado";
  /**
   * Turno del viaje (día o noche)
   * @example "dia"
   */
  turno?: "dia" | "noche";
  /**
   * Sentido del viaje (ida o vuelta)
   * @default "ida"
   */
  sentido?: "ida" | "vuelta" | "circuito";
  /**
   * Número de vale de combustible
   * @example "242155"
   */
  numeroVale?: string;
  /**
   * ID del conductor principal
   * @example 1
   */
  conductorId?: number;
  /**
   * ID del vehículo principal
   * @example 1
   */
  vehiculoId?: number;
  /** Datos adicionales del viaje (metadata) */
  metadata?: object;
}

export interface ViajeCreateDto {
  /** Viaje de ida */
  ida?: ViajeDetalleCreateDto;
  /** Viaje de vuelta */
  vuelta?: ViajeDetalleCreateDto;
}

export interface ViajeUpdateDto {
  /**
   * ID de la ruta programada
   * @example 1
   */
  rutaId?: number;
  /**
   * Punto de partida para rutas ocasionales
   * @example "Lima"
   */
  rutaOcasional?: string;
  /**
   * Nombre de la ruta
   * @example "Lima - Arequipa Especial"
   */
  nombreRuta?: string;
  /**
   * Distancia estimada del viaje en km
   * @example "450.00"
   */
  distanciaEstimada?: string;
  /**
   * Distancia real al final del viaje en km
   * @example "455.50"
   */
  distanciaFinal?: string;
  /**
   * Tipo de ruta (fija, ocasional)
   * @default "fija"
   */
  tipoRuta?: "ocasional" | "fija";
  /**
   * ID del cliente
   * @example 1
   */
  clienteId?: number;
  /**
   * ID de la entidad (opcional)
   * @example 1
   */
  entidadId?: number;
  /**
   * ID del encargado (opcional)
   * @example 1
   */
  encargadoId?: number;
  /**
   * Modalidad de servicio
   * @default "regular"
   */
  modalidadServicio?:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /**
   * Horas contratadas (si no se especifica, se toma del cliente)
   * @example "8.00"
   */
  horasContrato?: string;
  /**
   * Scheduled departure date
   * @format date-time
   * @example "2025-01-01T10:00:00Z"
   */
  fechaSalidaProgramada?: string;
  /**
   * Scheduled arrival date
   * @format date-time
   * @example "2025-01-01T18:00:00Z"
   */
  fechaLlegadaProgramada?: string;
  /**
   * Estado del viaje
   * @default "programado"
   */
  estado?: "programado" | "en_progreso" | "completado" | "cancelado";
  /**
   * Turno del viaje (día o noche)
   * @example "dia"
   */
  turno?: "dia" | "noche";
  /**
   * Sentido del viaje (ida o vuelta)
   * @default "ida"
   */
  sentido?: "ida" | "vuelta" | "circuito";
  /**
   * Número de vale de combustible
   * @example "242155"
   */
  numeroVale?: string;
  /**
   * ID del conductor principal
   * @example 1
   */
  conductorId?: number;
  /**
   * ID del vehículo principal
   * @example 1
   */
  vehiculoId?: number;
  /** Datos adicionales del viaje (metadata) */
  metadata?: object;
}

export interface ViajeConductorResultDto {
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del conductor
   * @example 1
   */
  conductorId: number;
  /**
   * Indica si es el conductor principal
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del conductor en el viaje
   * @example "conductor"
   */
  rol: "conductor" | "copiloto" | "auxiliar";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
}

export interface ViajeConductorCreateDto {
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del conductor
   * @example 1
   */
  conductorId: number;
  /**
   * Indica si es el conductor principal
   * @default false
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del conductor en el viaje
   * @default "conductor"
   */
  rol?: "conductor" | "copiloto" | "auxiliar";
}

export interface ViajeConductorUpdateDto {
  /**
   * Indica si es el conductor principal
   * @example true
   */
  esPrincipal?: boolean;
  /**
   * Rol del conductor en el viaje
   * @default "conductor"
   */
  rol?: "conductor" | "copiloto" | "auxiliar";
}

export interface ViajeVehiculoResultDto {
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * Indica si es el vehículo principal
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del vehículo en el viaje
   * @example "principal"
   */
  rol: "principal" | "apoyo" | "emergencia";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
}

export interface ViajeVehiculoCreateDto {
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del vehículo
   * @example 1
   */
  vehiculoId: number;
  /**
   * Indica si es el vehículo principal
   * @default false
   * @example true
   */
  esPrincipal: boolean;
  /**
   * Rol del vehículo en el viaje
   * @default "principal"
   */
  rol?: "principal" | "apoyo" | "emergencia";
}

export interface ViajeVehiculoUpdateDto {
  /**
   * Indica si es el vehículo principal
   * @example true
   */
  esPrincipal?: boolean;
  /**
   * Rol del vehículo en el viaje
   * @default "principal"
   */
  rol?: "principal" | "apoyo" | "emergencia";
}

export interface ViajeComentarioResultDto {
  /**
   * ID del comentario
   * @example 1
   */
  id: number;
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del usuario que creó el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El viaje se completó sin inconvenientes"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @example "observacion"
   */
  tipo: "observacion" | "incidencia" | "novedad" | "general";
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  actualizadoEn: string;
}

export interface ViajeComentarioCreateDto {
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del usuario que crea el comentario
   * @example 1
   */
  usuarioId: number;
  /**
   * Texto del comentario
   * @example "El viaje se completó sin inconvenientes"
   */
  comentario: string;
  /**
   * Tipo de comentario
   * @default "observacion"
   */
  tipo?: "observacion" | "incidencia" | "novedad" | "general";
}

export interface ViajeComentarioUpdateDto {
  /**
   * Texto del comentario
   * @example "El viaje se completó sin inconvenientes"
   */
  comentario?: string;
  /**
   * Tipo de comentario
   * @default "observacion"
   */
  tipo: "observacion" | "incidencia" | "novedad" | "general";
}

export interface ViajeTramoResultDto {
  id: number;
  viajeId: number;
  tipo: "origen" | "punto" | "parada" | "descanso" | "destino";
  longitud?: number;
  latitud?: number;
  nombreLugar?: string;
  /** @format date-time */
  horaFinal?: string;
  kilometrajeFinal?: number;
  numeroPasajeros?: number;
  rutaParadaId?: number;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface ViajeItemHojaRutaDto {
  /**
   * Hora de salida del tramo
   * @example "10:00 AM"
   */
  horaSalida: string;
  /**
   * Kilometraje al inicio del tramo
   * @example "29,159 KM"
   */
  kmInicial: string;
  /**
   * Punto de partida
   * @example "Villa El Salvador"
   */
  puntoPartida: string;
  /**
   * Punto de llegada
   * @example "Parada 1"
   */
  puntoLlegada: string;
  /**
   * Número de pasajeros
   * @example 12
   */
  numeroPasajeros?: number;
  /**
   * Hora de término del tramo
   * @example "10:20 AM"
   */
  horaTermino: string;
  /**
   * Kilometraje al final del tramo
   * @example "29,200 KM"
   */
  kmFinal: string;
  /**
   * Tiempo de recorrido en formato legible
   * @example "20 min"
   */
  tiempoRecorrido: string;
  /**
   * Kilometraje recorrido en el tramo
   * @example "41 KM"
   */
  kilometrajeRecorrido: string;
  /**
   * Tipo de tramo del punto de llegada
   * @example "punto"
   */
  tipoDestino?: "origen" | "punto" | "parada" | "descanso" | "destino";
}

export interface ViajeHojaRutaResultDto {
  /** Lista de tramos del viaje */
  tramos: ViajeItemHojaRutaDto[];
  /**
   * Resumen total de tiempo de viaje
   * @example "1h 30min"
   */
  tiempoTotal: string;
  /**
   * Resumen total de kilometraje recorrido
   * @example "120 KM"
   */
  kilometrajeTotal: string;
}

export interface ViajeRegistrarDescansoDto {
  /**
   * Longitud de la ubicación actual
   * @example -77.0282
   */
  longitud?: number;
  /**
   * Latitud de la ubicación actual
   * @example -12.0432
   */
  latitud?: number;
  /**
   * Hora actual del registro
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaActual: string;
  /**
   * Nombre del lugar o parada
   * @example "Descanso"
   */
  nombreLugar?: string;
  /**
   * Kilometraje actual del odómetro
   * @example 94891
   */
  kilometrajeActual?: number;
  /**
   * Cantidad de pasajeros
   * @example 0
   */
  cantidadPasajeros?: number;
}

export interface ViajeRegistrarSalidaDto {
  /**
   * Longitud de la ubicación actual
   * @example -77.0282
   */
  longitud: number;
  /**
   * Latitud de la ubicación actual
   * @example -12.0432
   */
  latitud: number;
  /**
   * Cantidad de pasajeros
   * @example 12
   */
  cantidadPasajeros: number;
  /**
   * Hora actual del registro
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaActual: string;
  /**
   * Kilometraje actual del odómetro
   * @example 94891
   */
  kilometrajeActual: number;
  /**
   * Nombre del lugar o parada (opcional)
   * @example "Terminal Terrestre"
   */
  nombreLugar?: string;
  /**
   * ID de la parada de ruta asociada (opcional)
   * @example 1
   */
  rutaParadaId?: number;
}

export interface ViajeRegistrarLlegadaDto {
  /**
   * Longitud de la ubicación actual
   * @example -77.0282
   */
  longitud: number;
  /**
   * Latitud de la ubicación actual
   * @example -12.0432
   */
  latitud: number;
  /**
   * Cantidad de pasajeros
   * @example 12
   */
  cantidadPasajeros: number;
  /**
   * Hora actual del registro
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaActual: string;
  /**
   * Kilometraje actual del odómetro
   * @example 94891
   */
  kilometrajeActual: number;
  /**
   * Nombre del lugar o parada (opcional)
   * @example "Terminal Terrestre"
   */
  nombreLugar?: string;
  /**
   * ID de la parada de ruta asociada (opcional)
   * @example 1
   */
  rutaParadaId?: number;
}

export interface ViajeRegistrarPuntoDto {
  /**
   * Longitud de la ubicación actual
   * @example -77.0282
   */
  longitud: number;
  /**
   * Latitud de la ubicación actual
   * @example -12.0432
   */
  latitud: number;
  /**
   * Cantidad de pasajeros
   * @example 12
   */
  cantidadPasajeros: number;
  /**
   * Hora actual del registro
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaActual: string;
  /**
   * Kilometraje actual del odómetro
   * @example 94891
   */
  kilometrajeActual: number;
  /**
   * Nombre del lugar o parada (opcional)
   * @example "Terminal Terrestre"
   */
  nombreLugar?: string;
  /**
   * ID de la parada de ruta asociada (opcional)
   * @example 1
   */
  rutaParadaId?: number;
}

export interface ViajeRegistrarParadaDto {
  /**
   * Longitud de la ubicación actual
   * @example -77.0282
   */
  longitud: number;
  /**
   * Latitud de la ubicación actual
   * @example -12.0432
   */
  latitud: number;
  /**
   * Cantidad de pasajeros
   * @example 12
   */
  cantidadPasajeros: number;
  /**
   * Hora actual del registro
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaActual: string;
  /**
   * Kilometraje actual del odómetro
   * @example 94891
   */
  kilometrajeActual: number;
  /**
   * Nombre del lugar o parada (opcional)
   * @example "Terminal Terrestre"
   */
  nombreLugar?: string;
  /**
   * ID de la parada de ruta asociada (opcional)
   * @example 1
   */
  rutaParadaId?: number;
}

export interface ViajeProximoTramoResultDto {
  /** Tipo sugerido: punto, parada, descanso */
  tipo: "origen" | "punto" | "parada" | "descanso" | "destino";
  /** Nombre del lugar sugerido */
  nombreLugar: string | null;
  /** Latitud del lugar sugerido */
  latitud: string | null;
  /** Longitud del lugar sugerido */
  longitud: string | null;
  /** Último kilometraje registrado */
  ultimoKilometraje: number;
  /**
   * Última hora registrada
   * @format date-time
   */
  ultimaHora: string;
  /** Última cantidad de pasajeros registrada */
  ultimosPasajeros: number;
  /** Indica si es un punto fijo de la ruta */
  esPuntoFijo?: boolean;
  /** ID de la parada de la ruta sugerida */
  rutaParadaId?: number | null;
  /** Indica si aún faltan puntos fijos por registrar */
  faltanPuntosFijos: boolean;
}

export interface ViajeTramoUpdateDto {
  tipo?: "origen" | "punto" | "parada" | "descanso" | "destino";
  longitud?: number;
  latitud?: number;
  nombreLugar?: string;
  /**
   * @format date-time
   * @example "2024-03-24T10:30:00Z"
   */
  horaFinal?: string;
  kilometrajeFinal?: number;
  numeroPasajeros?: number;
}

export interface ViajePasajeroResultDto {
  /**
   * ID del registro
   * @example 1
   */
  id: number;
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /**
   * ID del pasajero
   * @example 1
   */
  pasajeroId?: number;
  /**
   * DNI del pasajero
   * @example "12345678"
   */
  dni?: string;
  /**
   * Nombres del pasajero
   * @example "Juan"
   */
  nombres?: string;
  /**
   * Apellidos del pasajero
   * @example "Pérez"
   */
  apellidos?: string;
  /**
   * Asistencia del pasajero en la parada consultada
   * @example false
   */
  asistencia: boolean;
  /**
   * ID de la parada donde el pasajero ya tiene asistencia (si abordó en otra parada)
   * @example 5
   */
  paradaAsistenciaId?: number | null;
  /**
   * Nombre de la parada donde el pasajero ya tiene asistencia
   * @example "Parada Central"
   */
  paradaAsistenciaNombre?: string | null;
  /**
   * Indica si la asistencia del pasajero coincide con el tramo consultado
   * @example true
   */
  esAsistenciaTramoActual?: boolean | null;
  /**
   * ID de la parada donde el pasajero bajó (si tiene salida registrada)
   * @example 5
   */
  paradaSalidaId?: number | null;
  /**
   * Nombre de la parada donde el pasajero bajó
   * @example "Parada Central"
   */
  paradaSalidaNombre?: string | null;
  /**
   * Indica si la salida del pasajero coincide con el tramo consultado
   * @example true
   */
  esSalidaTramoActual?: boolean | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export type PasajeroItemDto = object;

export interface ViajePasajeroFillDto {
  /**
   * Lista de pasajeros con su estado de asistencia
   * @example [{"pasajeroId":1,"asistencia":true},{"pasajeroId":2,"asistencia":false}]
   */
  pasajeros: PasajeroItemDto[];
}

export interface ViajeEscanearDnisDto {
  /**
   * Array de URLs de las imágenes de los DNIs (formato jpg, png)
   * @example ["https://ejemplo.com/dni1.jpg"]
   */
  urls: string[];
}

export interface ScanDniResultItem {
  /**
   * Número de DNI extraído
   * @example "72750623"
   */
  dni: string;
  /**
   * Nombres extraídos
   * @example "ERICK STIP"
   */
  nombres: string;
  /**
   * Apellidos extraídos
   * @example "FLORES SANTOS"
   */
  apellidos: string;
  /**
   * Indica si se pudo procesar la imagen
   * @example true
   */
  matched: boolean;
  /**
   * Estado final del procesamiento
   * @example "CREADO_AD_HOC"
   */
  status: string;
  /**
   * URL procesada si hubo error
   * @example "https://ejemplo.com/dni.jpg"
   */
  url?: string;
  /**
   * Mensaje de error
   * @example "No se pudo extraer información"
   */
  error?: string;
  /**
   * ID del tramo en el que abordó el pasajero
   * @example 123
   */
  viajeTramoId: number | null;
}

export interface ViajeEscanearDnisResultDto {
  /** @example true */
  exito: boolean;
  /** @example "Procesamiento de DNIs completado" */
  mensaje: string;
  resultados: ScanDniResultItem[];
  pasajerosActualizados: ViajePasajeroResultDto[];
}

export interface ViajePasajeroAbordarPasajerosDto {
  /**
   * IDs de los registros de pasajeros en el viaje (viaje_pasajeros)
   * @example [1,2,3]
   */
  viajePasajeroIds: number[];
}

export interface ViajePasajeroAbordarDnisDto {
  /**
   * DNIs de los pasajeros a abordar en el tramo
   * @example ["72750623","48485858"]
   */
  dnis: string[];
}

export interface ViajePasajeroDesabordarPasajerosDto {
  /**
   * IDs de los registros de pasajeros en el viaje (viaje_pasajeros) que bajan del vehículo
   * @example [1,2,3]
   */
  viajePasajeroIds: number[];
}

export interface ChecklistItemResultDto {
  /**
   * ID del item
   * @example 1
   */
  id: number;
  /**
   * Nombre del item
   * @example "Reporte diario"
   */
  nombre: string;
  /**
   * Descripción
   * @example "Bitácora actualizada"
   */
  descripcion?: string;
  /**
   * Orden de visualización
   * @example 1
   */
  orden: number;
  /**
   * Fecha creación
   * @format date-time
   */
  creadoEn: string;
  /**
   * Fecha actualización
   * @format date-time
   */
  actualizadoEn: string;
  /**
   * Fecha eliminación
   * @format date-time
   */
  eliminadoEn: string;
}

export interface ChecklistItemCreateDto {
  /**
   * Nombre del item
   * @example "Reporte diario"
   */
  nombre: string;
  /**
   * Descripción del item
   * @example "Bitácora actualizada"
   */
  descripcion?: string;
  /**
   * Orden de visualización
   * @example 1
   */
  orden?: number;
}

export interface ChecklistItemUpdateDto {
  /**
   * Nombre del item
   * @example "Reporte diario"
   */
  nombre?: string;
  /**
   * Descripción del item
   * @example "Bitácora actualizada"
   */
  descripcion?: string;
  /**
   * Orden de visualización
   * @example 1
   */
  orden?: number;
}

export interface ViajeChecklistItemDetalleDto {
  /**
   * ID del item del catálogo
   * @example 1
   */
  checklistItemId: number;
  /**
   * ID del documento de configuración, null si no tiene
   * @example 10
   */
  vehiculoChecklistDocumentId: number;
  /**
   * Observación del item
   * @example "Sin novedad"
   */
  observacion?: string;
  /**
   * Fecha creación
   * @format date-time
   */
  creadoEn: string | null;
  /**
   * Fecha actualización
   * @format date-time
   */
  actualizadoEn: string | null;
  /**
   * Nombre del item (Catálogo)
   * @example "Llantas"
   */
  nombre: string;
  /**
   * Descripción del item (Catálogo)
   * @example "Revisión estado"
   */
  descripcion?: string;
  /**
   * Orden
   * @example 1
   */
  orden: number;
  /**
   * Indica si es una actualización de un documento existente para este viaje
   * @default false
   * @example true
   */
  isUpdate?: boolean;
}

export interface ViajeChecklistResultDto {
  /**
   * ID del checklist
   * @example 1
   */
  id: number | null;
  /**
   * ID del viaje
   * @example 1
   */
  viajeId: number;
  /** Tipo */
  tipo: "salida" | "llegada";
  /**
   * ID de quien validó
   * @example 1
   */
  validadoPor?: number;
  /**
   * Fecha de validación
   * @format date-time
   */
  validadoEn?: string;
  /**
   * Observaciones
   * @example "Sin observaciones"
   */
  observaciones?: string;
  /**
   * Fecha creación
   * @format date-time
   */
  creadoEn: string | null;
  /**
   * Fecha actualización
   * @format date-time
   */
  actualizadoEn: string | null;
  /** Items del checklist */
  items?: ViajeChecklistItemDetalleDto[];
  /**
   * Mensaje de estado de notificación
   * @example "Notificación enviada por items faltantes."
   */
  message?: string;
}

export interface ClienteListDto {
  /**
   * ID del cliente
   * @example 1
   */
  id: number;
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni: string;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @example "personal"
   */
  tipo: "personal" | "corporativo";
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Nombre completo del cliente
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Fecha de eliminación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn?: string;
}

export interface PaginatedClienteResultDto {
  /** Lista de clientes en la página actual */
  data: ClienteListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface ClienteDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del cliente
   * @example 1
   */
  clienteId: number;
  /**
   * Tipo de documento
   * @example "dni"
   */
  tipo: "dni" | "ruc" | "contrato" | "carta_compromiso" | "ficha_ruc" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion: string | null;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
  creadoEn: string;
  /**
   * Fecha de última actualización
   * @format date-time
   * @example "2024-01-15T10:30:00Z"
   */
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

export interface ClienteResultDto {
  /**
   * ID del cliente
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @example "personal"
   */
  tipo: "personal" | "corporativo";
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni: string;
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial: string;
  /**
   * Nombre completo del cliente
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /** Client documents grouped by type */
  documentos: DocumentosAgrupadosClienteDto;
}

export interface ClienteCreateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @default "personal"
   */
  tipo: "personal" | "corporativo";
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface ClienteUpdateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento?: "DNI" | "RUC";
  /**
   * Tipo de cliente
   * @default "personal"
   */
  tipo?: "personal" | "corporativo";
  /**
   * DNI del cliente
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del cliente
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del cliente
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del cliente
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del cliente
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del cliente
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del cliente
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del cliente
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Horas de contrato del cliente
   * @example "8.50"
   */
  horasContrato?: string;
  /**
   * Lista de URLs de imágenes del cliente
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface ClienteDocumentoCreateDto {
  /**
   * ID del cliente
   * @example 1
   */
  clienteId: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo: "dni" | "ruc" | "contrato" | "carta_compromiso" | "ficha_ruc" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface ClienteDocumentoUpdateDto {
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo?:
    | "dni"
    | "ruc"
    | "contrato"
    | "carta_compromiso"
    | "ficha_ruc"
    | "otros";
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface PasajeroResultDto {
  /** @example 1 */
  id: number;
  /** @example 1 */
  clienteId: number;
  /** @example "12345678" */
  dni: string;
  /** @example "Juan" */
  nombres: string;
  /** @example "Pérez" */
  apellidos: string;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface PaginatedPasajeroResultDto {
  data: PasajeroResultDto[];
  meta: object;
}

export interface PasajeroCreateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId: number;
  /**
   * DNI del pasajero
   * @example "12345678"
   */
  dni: string;
  /**
   * Nombres del pasajero
   * @example "Juan"
   */
  nombres: string;
  /**
   * Apellidos del pasajero
   * @example "Pérez"
   */
  apellidos: string;
}

export interface PasajeroUpdateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId?: number;
  /**
   * DNI del pasajero
   * @example "12345678"
   */
  dni?: string;
  /**
   * Nombres del pasajero
   * @example "Juan"
   */
  nombres?: string;
  /**
   * Apellidos del pasajero
   * @example "Pérez"
   */
  apellidos?: string;
}

export interface PaginatedEncargadoResultDto {
  data: EncargadoResultDto[];
  meta: object;
}

export interface EncargadoCreateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId: number;
  /**
   * DNI del encargado
   * @example "12345678"
   */
  dni: string;
  /**
   * Nombres del encargado
   * @example "Juan"
   */
  nombres: string;
  /**
   * Apellidos del encargado
   * @example "Pérez"
   */
  apellidos: string;
}

export interface EncargadoUpdateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId?: number;
  /**
   * DNI del encargado
   * @example "12345678"
   */
  dni?: string;
  /**
   * Nombres del encargado
   * @example "Juan"
   */
  nombres?: string;
  /**
   * Apellidos del encargado
   * @example "Pérez"
   */
  apellidos?: string;
}

export interface PaginatedEntidadResultDto {
  data: EntidadResultDto[];
  meta: object;
}

export interface EntidadCreateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId: number;
  /**
   * Nombre del servicio o entidad
   * @example "Minera Cerro Verde"
   */
  nombreServicio: string;
}

export interface EntidadUpdateDto {
  /**
   * ID del cliente propietario
   * @example 1
   */
  clienteId?: number;
  /**
   * Nombre del servicio o entidad
   * @example "Minera Cerro Verde"
   */
  nombreServicio?: string;
}

export interface TallerSucursalNestedDto {
  /**
   * Distrito de la sucursal
   * @example "San Isidro"
   */
  distrito: string;
  /**
   * Ubicación exacta de la sucursal
   * @example "Av. Juan de Arona 123"
   */
  ubicacionExacta: string;
}

export interface TallerCreateDto {
  /**
   * RUC del taller
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Razón Social del taller
   * @example "Taller Mecánico SAC"
   */
  razonSocial: string;
  /**
   * Nombre Comercial del taller
   * @example "Taller Express"
   */
  nombreComercial?: string;
  /**
   * Tipo de taller (interno, externo)
   * @default "interno"
   */
  tipo: "interno" | "externo";
  /**
   * Teléfono del taller
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Email del taller
   * @example "contacto@taller.com"
   */
  email?: string;
  /** Lista de sucursales del taller */
  sucursales?: TallerSucursalNestedDto[];
}

export interface TallerListDto {
  /**
   * ID del taller
   * @example 1
   */
  id: number;
  /**
   * RUC del taller
   * @example "12345678901"
   */
  ruc: string;
  /**
   * Razón Social
   * @example "Taller Mecánico SAC"
   */
  razonSocial: string;
  /**
   * Nombre Comercial
   * @example "Taller Express"
   */
  nombreComercial: string | null;
  /**
   * Tipo de taller (interno/externo)
   * @example "externo"
   */
  tipo: "interno" | "externo";
  /**
   * Teléfono
   * @example "999888777"
   */
  telefono: string | null;
  /**
   * Email
   * @example "contacto@taller.com"
   */
  email: string | null;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * IDs de las sucursales
   * @example [1,2]
   */
  sucursalIds: number[];
  /** Detalle de las sucursales con dirección (solo disponible en findOne) */
  sucursales: SucursalDetalleResDto[];
}

export interface PaginatedTallerResultDto {
  /** Lista de talleres en la página actual */
  data: TallerListDto[];
  /** Metadatos de la paginación */
  meta: PaginationMetaDto;
}

export interface TallerUpdateDto {
  /**
   * RUC del taller
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Razón Social del taller
   * @example "Taller Mecánico SAC"
   */
  razonSocial?: string;
  /**
   * Nombre Comercial del taller
   * @example "Taller Express"
   */
  nombreComercial?: string;
  /**
   * Tipo de taller (interno, externo)
   * @default "interno"
   */
  tipo?: "interno" | "externo";
  /**
   * Teléfono del taller
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Email del taller
   * @example "contacto@taller.com"
   */
  email?: string;
  /** Lista de sucursales del taller */
  sucursales?: TallerSucursalNestedDto[];
}

export interface SucursalCreateDto {
  /**
   * ID del taller al que pertenece la sucursal
   * @example 1
   */
  tallerId: number;
  /**
   * Distrito de la sucursal
   * @example "San Isidro"
   */
  distrito: string;
  /**
   * Ubicación exacta / dirección de la sucursal
   * @example "Av. Juan de Arona 123"
   */
  ubicacionExacta: string;
}

export interface SucursalListDto {
  /**
   * ID de la sucursal
   * @example 1
   */
  id: number;
  /**
   * ID del taller al que pertenece
   * @example 1
   */
  tallerId: number;
  /**
   * Distrito
   * @example "Miraflores"
   */
  distrito: string;
  /**
   * Ubicación exacta
   * @example "Av. Larco 123"
   */
  ubicacionExacta: string;
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
}

export interface PaginatedSucursalResultDto {
  data: SucursalListDto[];
  meta: PaginationMetaDto;
}

export interface SucursalUpdateDto {
  /**
   * ID del taller al que pertenece la sucursal
   * @example 1
   */
  tallerId?: number;
  /**
   * Distrito de la sucursal
   * @example "San Isidro"
   */
  distrito?: string;
  /**
   * Ubicación exacta / dirección de la sucursal
   * @example "Av. Juan de Arona 123"
   */
  ubicacionExacta?: string;
}

export interface ViajeDetalladoDto {
  id: number;
  tipoRuta: string;
  rutaOcasional: string | null;
  rutaOrigen: string | null;
  rutaDestino: string | null;
  /** Distancia estimada del viaje en km */
  distanciaEstimada: string | null;
  /** Distancia real al final del viaje en km */
  distanciaFinal: string | null;
  /** Diferencia entre distancia final y estimada (0 si no hay valores) */
  diferencia: number;
  /** Horas contratadas para este viaje */
  horasContrato: string;
  /** Horas totales de duración del viaje */
  horasTotales: number;
  /** Horas excedidas sobre el contrato */
  horasExcedidas: number;
  estado: string;
  modalidadServicio: string;
  /** Turno del viaje: día o noche */
  turno: string | null;
  /** Número de vale de combustible */
  numeroVale: string | null;
  /** @format date-time */
  fechaSalidaProgramada: string;
  /** @format date-time */
  fechaLlegadaProgramada: string | null;
  /** @format date-time */
  fechaSalida: string | null;
  /** @format date-time */
  fechaLlegada: string | null;
  /** ID del circuito al que pertenece este viaje */
  circuitoId: number | null;
  /** Sentido del viaje */
  sentido: string;
  /** Placa del vehículo principal */
  vehiculoPlaca: string | null;
  /** Marca del vehículo principal */
  vehiculoMarca: string | null;
  /** Modelo del vehículo principal */
  vehiculoModelo: string | null;
  /** Nombre completo del conductor principal */
  conductorNombre: string | null;
  /** DNI del conductor principal */
  conductorDni: string | null;
  /** Nombre del cliente */
  clienteNombre: string;
  /** Documento del cliente (RUC o DNI) */
  clienteDocumento: string | null;
  /** Nombre del servicio/entidad */
  entidadNombre: string | null;
}

export interface MantenimientoDetalladoVehiculoDto {
  id: number;
  codigoOrden: string | null;
  tipo: string;
  estado: string;
  descripcion: string;
  kilometraje: number;
  costoTotal: string;
  /** @format date-time */
  fechaIngreso: string;
  /** @format date-time */
  fechaSalida: string | null;
  tallerNombre: string;
  tallerTipo: string;
}

export interface MantenimientoDetalladoTallerDto {
  id: number;
  codigoOrden: string | null;
  tipo: string;
  estado: string;
  descripcion: string;
  kilometraje: number;
  costoTotal: string;
  /** @format date-time */
  fechaIngreso: string;
  /** @format date-time */
  fechaSalida: string | null;
  vehiculoPlaca: string;
  vehiculoMarca: string;
  vehiculoModelo: string;
}

export interface ReporteConductorDto {
  /**
   * ID del conductor
   * @example 1
   */
  id: number;
  /**
   * RUC de la empresa (Hardcoded)
   * @example "2043893327"
   */
  rucEmpresa: string;
  /**
   * OST (Hardcoded)
   * @example "2.MAY.3298"
   */
  ost: string;
  /**
   * DNI del conductor
   * @example "12345678"
   */
  dni: string;
  /**
   * Nombres del conductor
   * @example "JUAN"
   */
  nombres: string;
  /**
   * Apellidos del conductor
   * @example "PEREZ"
   */
  apellidos: string;
  /**
   * Induccion - Anexo 4
   * @example "SI"
   */
  induccionAnexo4: string;
  /**
   * Fec.Emision Induccion
   * @example "NA"
   */
  fecEmisionInduccion: string;
  /**
   * Manejo defensivo AAQ
   * @example "SI"
   */
  manejoDefensivoAaq: string;
  /**
   * Fec.Vence Manejo Def
   * @example "29-01-2026"
   */
  fecVenceManejoDef: string;
  /**
   * SCTR
   * @example "SI"
   */
  sctr: string;
  /**
   * Vencimiento SCTR
   * @example "31-12-2025"
   */
  vencimientoSctr: string;
  /**
   * Seguro vida Ley
   * @example "SI"
   */
  seguroVidaLey: string;
  /**
   * Fec. Vence Seg Vida Ley
   * @example "01-01-2026"
   */
  fecVenceSegVidaLey: string;
  /**
   * Documento de Identidad
   * @example "SI"
   */
  documentoIdentidad: string;
  /**
   * AUTORIZA_SSGG
   * @example "NO"
   */
  autorizaSsgg: string;
  /**
   * Curso Seguridad Portuaria
   * @example "NO"
   */
  cursoSeguridadPortuaria: string;
  /**
   * Foto Funcionario
   * @example "SI"
   */
  fotoFuncionario: string;
  /**
   * Curso Mercancias Peligrosas
   * @example "NO"
   */
  cursoMercanciasPeligrosas: string;
  /**
   * Curso Basico PBIP
   * @example "NO"
   */
  cursoBasicoPbip: string;
  /**
   * F. Venc. Examen Medico Temporal
   * @example "NA"
   */
  fVencExamenMedicoTemporal: string;
  /**
   * F. Vence examen medico
   * @example "29-05-2026"
   */
  fVenceExamenMedico: string;
  /**
   * Vence Examen Psicosensometrico
   * @example "29-05-2026"
   */
  venceExamenPsicosensometrico: string;
  /**
   * Fecha induccion temporal
   * @example "NA"
   */
  fechaInduccionTemporal: string;
  /**
   * Vence Induccion Visita
   * @example "NA"
   */
  venceInduccionVisita: string;
  /**
   * Vence EM Visita
   * @example "NA"
   */
  venceEmVisita: string;
  /**
   * Fecha Vencimiento Licencia
   * @example "06-01-2027"
   */
  fechaVencimientoLicencia: string;
  /**
   * PASECONDUC
   * @example "NO"
   */
  paseconduc: string;
}

export interface PropietarioListDto {
  /**
   * ID del propietario
   * @example 1
   */
  id: number;
  /**
   * DNI del propietario
   * @example "12345678"
   */
  dni: string;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * RUC del propietario
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Razón Social del propietario
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Nombres del propietario
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del propietario
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Nombre completo del propietario
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del propietario
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del propietario
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del propietario
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del propietario
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /**
   * Fecha de eliminación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  eliminadoEn?: string;
}

export interface PaginatedPropietarioResultDto {
  data: PropietarioListDto[];
  meta: PaginationMetaDto;
}

export interface PropietarioDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del propietario
   * @example 1
   */
  propietarioId: number;
  /**
   * Tipo de documento
   * @example "contrato"
   */
  tipo: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Contrato de Propietario"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://res.cloudinary.com/xxx/doc.pdf"
   */
  url: string;
  /**
   * Fecha de expiración (YYYY-MM-DD)
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión (YYYY-MM-DD)
   * @example "2023-01-01"
   */
  fechaEmision?: string;
  /**
   * Fecha de creación
   * @format date-time
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   */
  actualizadoEn: string;
}

export interface DocumentosAgrupadosPropietarioDto {
  dni: PropietarioDocumentoResultDto[];
  ruc: PropietarioDocumentoResultDto[];
  contrato: PropietarioDocumentoResultDto[];
  otros: PropietarioDocumentoResultDto[];
}

export interface PropietarioResultDto {
  /**
   * ID del propietario
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * DNI del propietario
   * @example "12345678"
   */
  dni: string;
  /**
   * RUC del propietario
   * @example "20123456789"
   */
  ruc: string;
  /**
   * Nombres del propietario
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del propietario
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Razón Social del propietario
   * @example "Empresa SAC"
   */
  razonSocial: string;
  /**
   * Nombre completo del propietario
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del propietario
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del propietario
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del propietario
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del propietario
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /** Propietario documents grouped by type */
  documentos: DocumentosAgrupadosPropietarioDto;
}

export interface PropietarioCreateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * DNI del propietario
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del propietario
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del propietario
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del propietario
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del propietario
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del propietario
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del propietario
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del propietario
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del propietario
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface PropietarioUpdateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento?: "DNI" | "RUC";
  /**
   * DNI del propietario
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del propietario
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del propietario
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del propietario
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del propietario
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del propietario
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del propietario
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del propietario
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del propietario
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface PropietarioDocumentoCreateDto {
  /**
   * ID del propietario
   * @example 1
   */
  propietarioId: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface PropietarioDocumentoUpdateDto {
  /**
   * ID del propietario
   * @example 1
   */
  propietarioId?: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo?: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre?: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface ProveedorListDto {
  /**
   * ID del proveedor
   * @example 1
   */
  id: number;
  /**
   * DNI del proveedor
   * @example "12345678"
   */
  dni: string;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * RUC del proveedor
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Razón Social del proveedor
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Nombres del proveedor
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del proveedor
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Nombre completo del proveedor
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del proveedor
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del proveedor
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del proveedor
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del proveedor
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
}

export interface PaginatedProveedorResultDto {
  data: ProveedorListDto[];
  meta: PaginationMetaDto;
}

export interface ProveedorDocumentoResultDto {
  /**
   * ID del documento
   * @example 1
   */
  id: number;
  /**
   * ID del proveedor
   * @example 1
   */
  proveedorId: number;
  /**
   * Tipo de documento
   * @example "contrato"
   */
  tipo: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Contrato de Proveedor"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://res.cloudinary.com/xxx/doc.pdf"
   */
  url: string;
  /**
   * Fecha de expiración (YYYY-MM-DD)
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión (YYYY-MM-DD)
   * @example "2023-01-01"
   */
  fechaEmision?: string;
  /**
   * Fecha de creación
   * @format date-time
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   */
  actualizadoEn: string;
}

export interface DocumentosAgrupadosProveedorDto {
  dni: ProveedorDocumentoResultDto[];
  ruc: ProveedorDocumentoResultDto[];
  contrato: ProveedorDocumentoResultDto[];
  otros: ProveedorDocumentoResultDto[];
}

export interface ProveedorResultDto {
  /**
   * ID del proveedor
   * @example 1
   */
  id: number;
  /**
   * Tipo de documento
   * @example "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * DNI del proveedor
   * @example "12345678"
   */
  dni: string;
  /**
   * RUC del proveedor
   * @example "20123456789"
   */
  ruc: string;
  /**
   * Nombres del proveedor
   * @example "Juan Carlos"
   */
  nombres: string;
  /**
   * Apellidos del proveedor
   * @example "Pérez García"
   */
  apellidos: string;
  /**
   * Razón Social del proveedor
   * @example "Empresa SAC"
   */
  razonSocial: string;
  /**
   * Nombre completo del proveedor
   * @example "Juan Carlos Pérez García"
   */
  nombreCompleto: string;
  /**
   * Email del proveedor
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del proveedor
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del proveedor
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del proveedor
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes: string[];
  /**
   * Fecha de creación
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  creadoEn: string;
  /**
   * Fecha de actualización
   * @format date-time
   * @example "2023-01-01T00:00:00.000Z"
   */
  actualizadoEn: string;
  /** Proveedor documents grouped by type */
  documentos: DocumentosAgrupadosProveedorDto;
}

export interface ProveedorCreateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento: "DNI" | "RUC";
  /**
   * DNI del proveedor
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del proveedor
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del proveedor
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del proveedor
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del proveedor
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del proveedor
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del proveedor
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del proveedor
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del proveedor
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface ProveedorUpdateDto {
  /**
   * Tipo de documento
   * @default "DNI"
   */
  tipoDocumento?: "DNI" | "RUC";
  /**
   * DNI del proveedor
   * @example "12345678"
   */
  dni?: string;
  /**
   * RUC del proveedor
   * @example "20123456789"
   */
  ruc?: string;
  /**
   * Nombres del proveedor
   * @example "Juan Carlos"
   */
  nombres?: string;
  /**
   * Apellidos del proveedor
   * @example "Pérez García"
   */
  apellidos?: string;
  /**
   * Razón Social del proveedor
   * @example "Empresa SAC"
   */
  razonSocial?: string;
  /**
   * Email del proveedor
   * @example "juan.perez@example.com"
   */
  email?: string;
  /**
   * Teléfono del proveedor
   * @example "987654321"
   */
  telefono?: string;
  /**
   * Dirección del proveedor
   * @example "Av. Principal 123"
   */
  direccion?: string;
  /**
   * Lista de URLs de imágenes del proveedor
   * @example ["https://res.cloudinary.com/xxx/image.jpg"]
   */
  imagenes?: string[];
}

export interface ProveedorDocumentoCreateDto {
  /**
   * ID del proveedor
   * @example 1
   */
  proveedorId: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface ProveedorDocumentoUpdateDto {
  /**
   * ID del proveedor
   * @example 1
   */
  proveedorId?: number;
  /**
   * Tipo de documento
   * @default "dni"
   */
  tipo?: "dni" | "ruc" | "contrato" | "otros";
  /**
   * Nombre del documento
   * @example "Documento 1"
   */
  nombre?: string;
  /**
   * URL del documento
   * @example "https://storage.example.com/documentos/dni-12345678.pdf"
   */
  url?: string;
  /**
   * Fecha de expiración del documento
   * @example "2025-12-31"
   */
  fechaExpiracion?: string;
  /**
   * Fecha de emisión del documento
   * @example "2023-01-15"
   */
  fechaEmision?: string;
}

export interface AlquilerClienteDto {
  id: number;
  nombreCompleto: string;
}

export interface AlquilerVehiculoDto {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  foto?: string;
}

export interface AlquilerConductorDto {
  id: number;
  nombreCompleto: string;
  dni?: string;
}

export interface AlquilerDetalleResultDto {
  id: number;
  alquilerId: number;
  vehiculoId: number;
  conductorId?: number;
  tipo: "maquina_seca" | "maquina_operada";
  kilometrajeInicial: number;
  kilometrajeFinal?: number;
  vehiculo?: AlquilerVehiculoDto;
  conductor?: AlquilerConductorDto;
}

export interface AlquilerHistorialResultDto {
  id: number;
  alquilerId: number;
  vehiculoId?: number;
  tipoAccion: string;
  montoAnterior?: number;
  montoNuevo?: number;
  motivo?: string;
  /** @format date-time */
  fechaAccion: string;
  vehiculo?: AlquilerVehiculoDto;
}

export interface AlquilerDocumentoResultDto {
  id: number;
  alquilerId: number;
  tipo:
    | "contrato"
    | "guia_remision"
    | "acta_entrega"
    | "acta_devolucion"
    | "comprobante_pago"
    | "otros";
  nombre: string;
  url: string;
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
}

export interface AlquilerItemDto {
  id: number;
  clienteId: number;
  montoPorDia: number;
  montoTotalFinal?: number;
  razon?: string;
  /** @format date-time */
  fechaInicio: string;
  /** @format date-time */
  fechaFin?: string;
  esIndefinido: boolean;
  observaciones?: string;
  estado: "activo" | "finalizado" | "cancelado";
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
  cliente?: AlquilerClienteDto;
  detalles?: AlquilerDetalleResultDto[];
  historial?: AlquilerHistorialResultDto[];
  documentos?: AlquilerDocumentoResultDto[];
}

export interface AlquilerPaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AlquilerListDto {
  data: AlquilerItemDto[];
  meta: AlquilerPaginationMetaDto;
}

export interface ValidacionAlquilerResultDto {
  /**
   * Indica si el vehículo está habilitado y disponible para alquiler
   * @example true
   */
  status: boolean;
  /**
   * Mensaje detallando el resultado de la validación
   * @example "El vehículo está disponible para este alquiler."
   */
  message: string;
}

export interface AlquilerResultDto {
  id: number;
  clienteId: number;
  montoPorDia: number;
  montoTotalFinal?: number;
  razon?: string;
  /** @format date-time */
  fechaInicio: string;
  /** @format date-time */
  fechaFin?: string;
  esIndefinido: boolean;
  observaciones?: string;
  estado: "activo" | "finalizado" | "cancelado";
  /** @format date-time */
  creadoEn: string;
  /** @format date-time */
  actualizadoEn: string;
  cliente?: AlquilerClienteDto;
  detalles?: AlquilerDetalleResultDto[];
  historial?: AlquilerHistorialResultDto[];
  documentos?: AlquilerDocumentoResultDto[];
}

export interface AlquilerVehiculoDetalleDto {
  vehiculoId: number;
  /** @example "maquina_seca" */
  tipo: "maquina_seca" | "maquina_operada";
  /** Conductor requerido cuando el tipo es maquina_operada */
  conductorId?: number;
  /** @example 15234.5 */
  kilometrajeInicial: number;
}

export interface AlquilerCreateDto {
  clienteId: number;
  /** @example 450 */
  montoPorDia: number;
  /** Razón o motivo del alquiler */
  razon?: string;
  /** @format date-time */
  fechaInicio: string;
  /** @format date-time */
  fechaFin?: string;
  /** @default false */
  esIndefinido: boolean;
  observaciones?: string;
  vehiculos: AlquilerVehiculoDetalleDto[];
  /** Si es true, los vehículos cambiarán su estado a alquilado. */
  marcarComoAlquilado?: boolean;
}

export interface AlquilerUpdateDto {
  clienteId?: number;
  /** @example 450 */
  montoPorDia?: number;
  /** Razón o motivo del alquiler */
  razon?: string;
  /** @format date-time */
  fechaInicio?: string;
  /** @format date-time */
  fechaFin?: string;
  /** @default false */
  esIndefinido?: boolean;
  observaciones?: string;
  vehiculos?: AlquilerVehiculoDetalleDto[];
  /** Si es true, los vehículos cambiarán su estado a alquilado. */
  marcarComoAlquilado?: boolean;
  estado?: "activo" | "finalizado" | "cancelado";
  kilometrajeFinal?: number;
  montoTotalFinal?: number;
}

export interface AlquilerTerminarDto {
  /** ID del detalle del alquiler a finalizar. Si no se envía se finaliza todo el contrato (maestro). */
  detalleId?: number;
  /** @format date-time */
  fechaFin: string;
  /** @example 15820.5 */
  kilometrajeFinal?: number;
  /** @example 2500 */
  montoTotalFinal: number;
  /** Observaciones finales del cierre del alquiler */
  observaciones?: string;
}

export interface AlquilerDocumentoCreateDto {
  /** @example 1 */
  alquilerId: number;
  /** @example "contrato" */
  tipo?:
    | "contrato"
    | "guia_remision"
    | "acta_entrega"
    | "acta_devolucion"
    | "comprobante_pago"
    | "otros";
  /** @example "Contrato de alquiler" */
  nombre: string;
  /** @example "https://cdn.midominio.com/docs/contrato.pdf" */
  url: string;
}

export interface AlquilerDocumentoUpdateDto {
  /** @example 1 */
  alquilerId?: number;
  /** @example "contrato" */
  tipo?:
    | "contrato"
    | "guia_remision"
    | "acta_entrega"
    | "acta_devolucion"
    | "comprobante_pago"
    | "otros";
  /** @example "Contrato de alquiler" */
  nombre?: string;
  /** @example "https://cdn.midominio.com/docs/contrato.pdf" */
  url?: string;
}

export interface StorageResultDto {
  /**
   * Public ID del archivo en Cloudinary
   * @example "images/abc123"
   */
  publicId: string;
  /**
   * URL del archivo
   * @example "https://res.cloudinary.com/..."
   */
  url: string;
  /**
   * URL segura del archivo
   * @example "https://res.cloudinary.com/..."
   */
  secureUrl: string;
  /**
   * Formato del archivo
   * @example "jpg"
   */
  format: string;
  /**
   * Ancho de la imagen (solo para imágenes)
   * @example 1024
   */
  width: number;
  /**
   * Alto de la imagen (solo para imágenes)
   * @example 768
   */
  height: number;
  /**
   * Tamaño del archivo en bytes
   * @example 102400
   */
  bytes: number;
  /**
   * Tipo de recurso
   * @example "image"
   */
  resourceType: string;
  /**
   * Fecha de creación
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
}

export type AppGetHelloData = any;

export type AppTestErrorData = any;

export type AuthLoginData = LoginResultDto;

export type AuthLoginConductorData = ConductorLoginResultDto;

export interface UsuariosFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre, apellido o email del usuario */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por rol de usuario
   * @example "empleado"
   */
  rol?: "empleado" | "admin";
}

export type UsuariosFindAllData = PaginatedUsuarioResultDto;

export interface UsuariosFindOneParams {
  /** User ID */
  id: number;
}

export type UsuariosFindOneData = UsuarioResultDto;

export type UsuariosCreateData = UsuarioResultDto;

export interface UsuariosUpdateParams {
  /** User ID */
  id: number;
}

export type UsuariosUpdateData = UsuarioResultDto;

export interface UsuariosRemoveParams {
  /** User ID */
  id: number;
}

export type UsuariosRemoveData = UsuarioResultDto;

export interface UsuariosFindFirmasParams {
  /** User ID */
  id: number;
}

export type UsuariosFindFirmasData = UsuarioDocumentoResultDto[];

export interface UsuariosFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type UsuariosFindDocumentoData = UsuarioDocumentoResultDto;

export type UsuariosCreateDocumentoData = UsuarioDocumentoResultDto;

export interface UsuariosUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type UsuariosUpdateDocumentoData = UsuarioDocumentoResultDto;

export interface UsuariosDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type UsuariosDeleteDocumentoData = UsuarioDocumentoResultDto;

export interface ConductoresFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre, DNI o número de licencia del conductor */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por clase de licencia
   * @example "A"
   */
  claseLicencia?: "A" | "B";
  /**
   * Filtrar por categoría de licencia
   * @example "I"
   */
  categoriaLicencia?:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /**
   * Filtrar por estado del conductor
   * @example "activo"
   */
  estado?: "activo" | "inactivo" | "eventual";
}

export type ConductoresFindAllData = PaginatedConductorResultDto;

export interface ConductoresFindAllEstadoDocumentosParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Filtrar por estado de documentos
   * @example "incompleto"
   */
  filtro?: "completo" | "incompleto";
  /** Búsqueda por nombre, DNI o número de licencia */
  search?: string;
  /** Filtrar por clase de licencia */
  claseLicencia?: "A" | "B";
  /** Filtrar por categoría de licencia */
  categoriaLicencia?:
    | "I"
    | "II-a"
    | "II-b"
    | "II-c"
    | "III-a"
    | "III-b"
    | "III-c";
  /** Filtrar por estado del conductor */
  estado?: "activo" | "inactivo" | "eventual";
}

export type ConductoresFindAllEstadoDocumentosData =
  PaginatedConductorEstadoDocumentosResultDto;

export interface ConductoresFindOneParams {
  /** Driver ID */
  id: number;
}

export type ConductoresFindOneData = ConductorResultDto;

export type ConductoresCreateData = ConductorResultDto;

export interface ConductoresUpdateParams {
  /** Driver ID */
  id: number;
}

export type ConductoresUpdateData = ConductorResultDto;

export interface ConductoresRemoveParams {
  /** Driver ID */
  id: number;
}

export type ConductoresRemoveData = ConductorResultDto;

export interface ConductoresFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ConductoresFindDocumentoData = ConductorDocumentoResultDto;

export type ConductoresCreateDocumentoData = ConductorDocumentoResultDto;

export interface ConductoresUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ConductoresUpdateDocumentoData = ConductorDocumentoResultDto;

export interface ConductoresDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ConductoresDeleteDocumentoData = ConductorDocumentoResultDto;

export interface ConductoresDownloadParams {
  /** ID del conductor */
  id: number;
}

export type ConductoresDownloadData = any;

export type DashboardGetStatsData = DashboardStatsDto;

export type DashboardGetVehiculosPorEstadoData = VehiculosPorEstadoDto;

export type DashboardGetViajesRecientesData = ViajesRecientesDto;

export type DashboardGetMantenimientosProximosData = MantenimientosProximosDto;

export type DashboardGetRutasPopularesData = RutasPopularesDto;

export type DashboardGetIngresosMensualesData = IngresosMensualesDto;

export interface VehiculosFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por placa, marca o modelo del vehículo */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por estado del vehículo
   * @example "disponible"
   */
  estado?: "disponible" | "circulacion" | "taller" | "retirado" | "alquilado";
  /** Filtrar por ID de marca */
  marcaId?: number;
  /** Filtrar por ID de propietario */
  propietarioId?: number;
}

export type VehiculosFindAllData = PaginatedVehiculoResultDto;

export interface VehiculosFindAllEstadoDocumentosParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * Filtrar por estado de documentos
   * @example "incompleto"
   */
  filtro?: "completo" | "incompleto";
  /**
   * Filtrar por estado del vehículo
   * @example "alquilado"
   */
  estado?: string;
  /**
   * ID de la marca para filtrar
   * @example 1
   */
  marcaId?: number;
  /**
   * Placa del vehículo para filtrar
   * @example "ABC-123"
   */
  placa?: string;
}

export type VehiculosFindAllEstadoDocumentosData =
  PaginatedVehiculoEstadoDocumentosResultDto;

export interface VehiculosDownloadParams {
  /** ID del Vehículo */
  id: number;
}

export type VehiculosDownloadData = any;

export interface VehiculosFindOneParams {
  /** Vehicle ID */
  id: number;
}

export type VehiculosFindOneData = VehiculoResultDto;

export type VehiculosCreateData = VehiculoResultDto;

export interface VehiculosUpdateParams {
  /** Vehicle ID */
  id: number;
}

export type VehiculosUpdateData = VehiculoResultDto;

export interface VehiculosRemoveParams {
  /** Vehicle ID */
  id: number;
}

export type VehiculosRemoveData = VehiculoResultDto;

export interface VehiculosFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type VehiculosFindDocumentoData = VehiculoDocumentoResultDto;

export type VehiculosCreateDocumentoData = VehiculoDocumentoResultDto;

export interface VehiculosUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type VehiculosUpdateDocumentoData = VehiculoDocumentoResultDto;

export interface VehiculosDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type VehiculosDeleteDocumentoData = VehiculoDocumentoResultDto;

export interface VehiculosFindComentariosByVehiculoParams {
  /** ID del vehículo */
  id: number;
}

export type VehiculosFindComentariosByVehiculoData =
  VehiculoComentarioResultDto[];

export interface VehiculosFindOneComentarioParams {
  /** ID del comentario */
  id: number;
}

export type VehiculosFindOneComentarioData = VehiculoComentarioResultDto;

export type VehiculosCreateComentarioData = VehiculoComentarioResultDto;

export interface VehiculosUpdateComentarioParams {
  /** ID del comentario */
  id: number;
}

export type VehiculosUpdateComentarioData = VehiculoComentarioResultDto;

export interface VehiculosDeleteComentarioParams {
  /** ID del comentario */
  id: number;
}

export type VehiculosDeleteComentarioData = VehiculoComentarioResultDto;

export interface VehiculosFindAllMarcasParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre de marca */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
}

export type VehiculosFindAllMarcasData = PaginatedMarcaResultDto;

export interface VehiculosFindOneMarcaParams {
  /** ID de la marca */
  id: number;
}

export type VehiculosFindOneMarcaData = MarcaResultDto;

export type VehiculosCreateMarcaData = MarcaResultDto;

export interface VehiculosUpdateMarcaParams {
  /** ID de la marca */
  id: number;
}

export type VehiculosUpdateMarcaData = MarcaResultDto;

export interface VehiculosDeleteMarcaParams {
  /** ID de la marca */
  id: number;
}

export type VehiculosDeleteMarcaData = MarcaResultDto;

export interface VehiculosFindAllModelosParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre de modelo */
  search?: string;
  /** Filtrar por ID de marca */
  marcaId?: number;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
}

export type VehiculosFindAllModelosData = PaginatedModeloResultDto;

export interface VehiculosFindOneModeloParams {
  /** ID del modelo */
  id: number;
}

export type VehiculosFindOneModeloData = ModeloResultDto;

export type VehiculosCreateModeloData = ModeloResultDto;

export interface VehiculosUpdateModeloParams {
  /** ID del modelo */
  id: number;
}

export type VehiculosUpdateModeloData = ModeloResultDto;

export interface VehiculosDeleteModeloParams {
  /** ID del modelo */
  id: number;
}

export type VehiculosDeleteModeloData = ModeloResultDto;

export interface VehiculosFindChecklistHistoryParams {
  /**
   * ID del ChecklistItem (Tipo de documento)
   * @example 1
   */
  checklistItemId: number;
  /**
   * Página/Offset
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Límite por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindChecklistHistoryData =
  PaginatedVehiculoChecklistHistoryResultDto;

export interface VehiculosFindIpercContinuoParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindIpercContinuoData = ResultIpercContinuoDto;

export interface VehiculosFindHojaInspeccionParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindHojaInspeccionData = ResultHojaInspeccionDto;

export interface VehiculosFindInspeccionDocumentosParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindInspeccionDocumentosData =
  ResultInspeccionDocumentosDto;

export interface VehiculosFindLucesParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindLucesData = ResultLucesEmergenciaAlarmasDto;

export interface VehiculosFindCinturonesParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindCinturonesData = ResultCinturonesSeguridadDto;

export interface VehiculosFindHerramientasParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindHerramientasData = ResultInspeccionHerramientasDto;

export interface VehiculosFindBotiquinesParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindBotiquinesData = ResultInspeccionBotiquinesDto;

export interface VehiculosFindKitAntiderramesParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindKitAntiderramesData = ResultKitAntiderramesDto;

export interface VehiculosFindRevisionVehiculosParams {
  /** ID específico del documento (opcional) */
  documentId?: number;
  /** ID del Vehículo */
  id: number;
}

export type VehiculosFindRevisionVehiculosData = ResultRevisionVehiculosDto;

export interface VehiculosUpsertIpercContinuoParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertIpercContinuoData = ResultIpercContinuoDto;

export interface VehiculosUpsertHojaInspeccionParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertHojaInspeccionData = ResultHojaInspeccionDto;

export interface VehiculosUpsertInspeccionDocumentosParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertInspeccionDocumentosData =
  ResultInspeccionDocumentosDto;

export interface VehiculosUpsertLucesParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertLucesData = ResultLucesEmergenciaAlarmasDto;

export interface VehiculosUpsertCinturonesParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertCinturonesData = ResultCinturonesSeguridadDto;

export interface VehiculosUpsertHerramientasParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertHerramientasData = ResultInspeccionHerramientasDto;

export interface VehiculosUpsertBotiquinesParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertBotiquinesData = ResultInspeccionBotiquinesDto;

export interface VehiculosUpsertKitAntiderramesParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertKitAntiderramesData = ResultKitAntiderramesDto;

export interface VehiculosUpsertRevisionVehiculosParams {
  /**
   * Tipo de viaje (salida/llegada)
   * @default "salida"
   */
  tipo?: "salida" | "llegada";
  /** ID del Vehículo */
  id: number;
  /** ID del Viaje */
  viajeId: number;
}

export type VehiculosUpsertRevisionVehiculosData = ResultRevisionVehiculosDto;

export interface MantenimientosFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por código de orden o ID exacto del mantenimiento */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por tipo de mantenimiento
   * @example "preventivo"
   */
  tipo?: "preventivo" | "correctivo";
  /**
   * Filtrar por estado del mantenimiento
   * @example "pendiente"
   */
  estado?: "pendiente" | "en_proceso" | "finalizado";
  /** Filtrar por taller */
  tallerId?: number;
  /** Filtrar por vehículo */
  vehiculoId?: number;
}

export type MantenimientosFindAllData = PaginatedMantenimientoResultDto;

export interface MantenimientosFindOneParams {
  /** Maintenance ID */
  id: number;
}

export type MantenimientosFindOneData = MantenimientoResultDto;

export type MantenimientosCreateData = MantenimientoResultDto;

export interface MantenimientosUpdateParams {
  /** Maintenance ID */
  id: number;
}

export type MantenimientosUpdateData = MantenimientoResultDto;

export interface MantenimientosRemoveParams {
  /** Maintenance ID */
  id: number;
}

export type MantenimientosRemoveData = MantenimientoResultDto;

export type MantenimientosCreateMantenimientoTareaData =
  MantenimientoTareaResultDto;

export interface MantenimientosUpdateMantenimientoTareaParams {
  /** ID de la relación tarea-mantenimiento */
  id: number;
}

export type MantenimientosUpdateMantenimientoTareaData =
  MantenimientoTareaResultDto;

export interface MantenimientosDeleteMantenimientoTareaParams {
  /** ID de la relación tarea-mantenimiento */
  id: number;
}

export type MantenimientosDeleteMantenimientoTareaData =
  MantenimientoTareaResultDto;

export interface MantenimientosFindAllTareasParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por código o descripción */
  search?: string;
}

export type MantenimientosFindAllTareasData = PaginatedTareaResultDto;

export interface MantenimientosFindOneTareaParams {
  /** ID de la tarea */
  id: number;
}

export type MantenimientosFindOneTareaData = TareaResultDto;

export type MantenimientosCreateTareaData = TareaResultDto;

export interface MantenimientosUpdateTareaParams {
  /** ID de la tarea */
  id: number;
}

export type MantenimientosUpdateTareaData = TareaResultDto;

export interface MantenimientosDeleteTareaParams {
  /** ID de la tarea */
  id: number;
}

export type MantenimientosDeleteTareaData = TareaResultDto;

export interface MantenimientosFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type MantenimientosFindDocumentoData = MantenimientoDocumentoResultDto;

export type MantenimientosCreateDocumentoData = MantenimientoDocumentoResultDto;

export interface MantenimientosUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type MantenimientosUpdateDocumentoData = MantenimientoDocumentoResultDto;

export interface MantenimientosDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type MantenimientosDeleteDocumentoData = MantenimientoDocumentoResultDto;

export interface MantenimientosGetReporteEstadoVehiculosParams {
  /**
   * Número de página
   * @min 1
   * @default 1
   */
  page?: number;
  /**
   * Elementos por página
   * @min 1
   * @default 10
   */
  limit?: number;
  /**
   * Ordenamiento: proximos (menor kilometraje restante) o ultimos (mayor fecha de mantenimiento)
   * @default "proximos"
   */
  sort?: "proximos" | "ultimos";
  /** ID del vehículo para filtrar */
  vehiculoId?: number;
}

export type MantenimientosGetReporteEstadoVehiculosData =
  PaginatedReporteEstadoResultDto;

export interface NotificacionesFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /**
   * ID del usuario
   * @example 1
   */
  userId: number;
  /**
   * Filtrar por destino del usuario
   * @example "sistema"
   */
  destino?: "sistema" | "clientes" | "usuarios" | "conductor";
}

export type NotificacionesFindAllData = PaginatedNotificacionResultDto;

export type NotificacionesCreateData = NotificacionResultDto;

export interface NotificacionesMarkAsReadParams {
  userId: number;
  id: number;
}

export type NotificacionesMarkAsReadData = NotificacionResultDto;

export interface NotificacionesMarkAsDismissedParams {
  userId: number;
  id: number;
}

export type NotificacionesMarkAsDismissedData = NotificacionResultDto;

export interface NotificacionesCreateForConductorParams {
  conductorId: number;
}

export type NotificacionesCreateForConductorData = NotificacionResultDto;

export interface NotificacionesFindAllByConductorParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  conductorId: number;
}

export type NotificacionesFindAllByConductorData =
  PaginatedNotificacionResultDto;

export interface NotificacionesMarkAsReadByConductorParams {
  conductorId: number;
  id: number;
}

export type NotificacionesMarkAsReadByConductorData = NotificacionResultDto;

export interface NotificacionesMarkAsDismissedByConductorParams {
  conductorId: number;
  id: number;
}

export type NotificacionesMarkAsDismissedByConductorData =
  NotificacionResultDto;

export interface NotificacionesPreviewVencimientosParams {
  /**
   * Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.
   * @example "2025-12-18"
   */
  fecha: string;
  /**
   * Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.
   * @default 7
   * @example 7
   */
  diasAnticipacion?: number;
}

export type NotificacionesPreviewVencimientosData =
  PreviewVencimientosResultDto;

export interface NotificacionesGenerarVencimientosParams {
  /**
   * Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.
   * @example "2025-12-18"
   */
  fecha: string;
  /**
   * Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.
   * @default 7
   * @example 7
   */
  diasAnticipacion?: number;
}

export type NotificacionesGenerarVencimientosData =
  GenerarVencimientosResultDto;

export type NotificacionesSendEmailData = any;

export interface NotificacionesNotifyEachAdminParams {
  diasAnticipacion: number;
}

export type NotificacionesNotifyEachAdminData = any;

export interface NotificacionesNotifyEachConductorParams {
  diasAnticipacion: number;
}

export type NotificacionesNotifyEachConductorData = any;

export interface RutasFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por origen o destino de la ruta */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
}

export type RutasFindAllData = PaginatedRutaResultDto;

export interface RutasFindOneParams {
  /** ID de la ruta */
  id: number;
}

export type RutasFindOneData = RutaResultDto;

export interface RutasFindAllCircuitosParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre del circuito */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
}

export type RutasFindAllCircuitosData = PaginatedRutaCircuitoResultDto;

export interface RutasFindOneCircuitoParams {
  /** ID del circuito */
  id: number;
}

export type RutasFindOneCircuitoData = RutaCircuitoResultDto;

export type RutasCreateCircuitoData = RutaCircuitoResultDto;

export interface RutasUpdateCircuitoParams {
  /** ID del circuito */
  id: number;
}

export type RutasUpdateCircuitoData = RutaCircuitoResultDto;

export interface RutasRemoveCircuitoParams {
  /** ID del circuito */
  id: number;
}

export type RutasRemoveCircuitoData = any;

export interface ViajesFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por ruta ocasional */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /** Filtrar por modalidad de servicio */
  modalidadServicio?:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /** Filtrar por tipo de ruta (ocasional, fija) */
  tipoRuta?: "ocasional" | "fija";
  /** Filtrar por estado del viaje */
  estado?: "programado" | "en_progreso" | "completado" | "cancelado";
  /** Filtrar por IDs de conductores (separados por coma) */
  conductoresId?: string[];
  /** Filtrar por ID de cliente */
  clienteId?: number;
  /** Filtrar por ID de ruta */
  rutaId?: number;
  /** Filtrar por IDs de vehículos (separados por coma) */
  vehiculosId?: string[];
  /** Filtrar por sentido del viaje */
  sentido?: "ida" | "vuelta" | "circuito";
  /** Filtrar por turno del viaje */
  turno?: "dia" | "noche";
}

export type ViajesFindAllData = PaginatedViajeResultDto;

export interface ViajesFindAllLightParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por ruta ocasional */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /** Filtrar por modalidad de servicio */
  modalidadServicio?:
    | "regular"
    | "expreso"
    | "ejecutivo"
    | "especial"
    | "turismo"
    | "corporativo";
  /** Filtrar por tipo de ruta (ocasional, fija) */
  tipoRuta?: "ocasional" | "fija";
  /** Filtrar por estado del viaje */
  estado?: "programado" | "en_progreso" | "completado" | "cancelado";
  /** Filtrar por IDs de conductores (separados por coma) */
  conductoresId?: string[];
  /** Filtrar por ID de cliente */
  clienteId?: number;
  /** Filtrar por ID de ruta */
  rutaId?: number;
  /** Filtrar por IDs de vehículos (separados por coma) */
  vehiculosId?: string[];
  /** Filtrar por sentido del viaje */
  sentido?: "ida" | "vuelta" | "circuito";
  /** Filtrar por turno del viaje */
  turno?: "dia" | "noche";
}

export type ViajesFindAllLightData = PaginatedViajeLightResultDto;

export interface ViajesValidarVehiculoParams {
  /** ID del vehículo a validar */
  vehiculoId: number;
  /**
   * Fecha de salida programada
   * @format date-time
   */
  fechaSalida: string;
  /**
   * Fecha de llegada programada
   * @format date-time
   */
  fechaLlegada: string;
  /** ID del viaje actual (para excluirlo de la validación de cruces) */
  viajeId?: number;
}

export type ViajesValidarVehiculoData = ValidacionResultDto;

export interface ViajesValidarConductorParams {
  /** ID del conductor a validar */
  conductorId: number;
  /**
   * Fecha de salida programada
   * @format date-time
   */
  fechaSalida: string;
  /**
   * Fecha de llegada programada
   * @format date-time
   */
  fechaLlegada: string;
  /** ID del viaje actual (para excluirlo de la validación de cruces) */
  viajeId?: number;
}

export type ViajesValidarConductorData = ValidacionResultDto;

export interface ViajesFindOneParams {
  /** ID del viaje */
  id: number;
}

export type ViajesFindOneData = ViajeResultDto;

export interface ViajesFindTrayectoParams {
  /** ID del viaje */
  id: number;
}

export type ViajesFindTrayectoData = ViajeTrayectoResultDto;

export type ViajesCreateData = any;

export interface ViajesUpdateParams {
  /** ID del viaje */
  id: number;
}

export type ViajesUpdateData = ViajeResultDto;

export interface ViajesRemoveParams {
  /** ID del viaje */
  id: number;
}

export type ViajesRemoveData = ViajeResultDto;

export interface ViajesFindConductoresParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindConductoresData = ViajeConductorResultDto[];

export interface ViajesFindConductorParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del conductor */
  conductorId: number;
}

export type ViajesFindConductorData = ViajeConductorResultDto;

export interface ViajesUpdateConductorParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del conductor */
  conductorId: number;
}

export type ViajesUpdateConductorData = ViajeConductorResultDto;

export interface ViajesRemoveConductorParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del conductor */
  conductorId: number;
}

export type ViajesRemoveConductorData = ViajeConductorResultDto;

export type ViajesAssignConductorData = ViajeConductorResultDto;

export interface ViajesFindVehiculosParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindVehiculosData = ViajeVehiculoResultDto[];

export interface ViajesFindVehiculoParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del vehículo */
  vehiculoId: number;
}

export type ViajesFindVehiculoData = ViajeVehiculoResultDto;

export interface ViajesUpdateVehiculoParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del vehículo */
  vehiculoId: number;
}

export type ViajesUpdateVehiculoData = ViajeVehiculoResultDto;

export interface ViajesRemoveVehiculoParams {
  /** ID del viaje */
  viajeId: number;
  /** ID del vehículo */
  vehiculoId: number;
}

export type ViajesRemoveVehiculoData = ViajeVehiculoResultDto;

export type ViajesAssignVehiculoData = ViajeVehiculoResultDto;

export interface ViajesFindComentariosParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindComentariosData = ViajeComentarioResultDto[];

export interface ViajesFindComentarioParams {
  /** ID del comentario */
  id: number;
}

export type ViajesFindComentarioData = ViajeComentarioResultDto;

export type ViajesCreateComentarioData = ViajeComentarioResultDto;

export interface ViajesUpdateComentarioParams {
  /** ID del comentario */
  id: number;
}

export type ViajesUpdateComentarioData = ViajeComentarioResultDto;

export interface ViajesDeleteComentarioParams {
  /** ID del comentario */
  id: number;
}

export type ViajesDeleteComentarioData = ViajeComentarioResultDto;

export interface ViajesFindTramosParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindTramosData = ViajeTramoResultDto[];

export interface ViajesGetHojaRutaParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesGetHojaRutaData = ViajeHojaRutaResultDto;

export interface ViajesRegistrarDescansoParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesRegistrarDescansoData = ViajeTramoResultDto;

export interface ViajesRegistrarSalidaParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesRegistrarSalidaData = ViajeTramoResultDto;

export interface ViajesRegistrarLlegadaParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesRegistrarLlegadaData = ViajeTramoResultDto;

export interface ViajesRegistrarPuntoParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesRegistrarPuntoData = ViajeTramoResultDto;

export interface ViajesRegistrarParadaParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesRegistrarParadaData = ViajeTramoResultDto;

export interface ViajesGetProximoTramoParams {
  /** Tipo de tramo para el que se solicita sugerencia (origen, punto, parada, descanso, destino) */
  tipo?: "origen" | "punto" | "parada" | "descanso" | "destino";
  /** ID del viaje */
  viajeId: number;
}

export type ViajesGetProximoTramoData = ViajeProximoTramoResultDto;

export interface ViajesUpdateTramoParams {
  /** ID del tramo */
  id: number;
}

export type ViajesUpdateTramoData = ViajeTramoResultDto;

export interface ViajesDeleteTramoParams {
  /** ID del tramo */
  id: number;
}

export type ViajesDeleteTramoData = ViajeTramoResultDto;

export interface ViajesFindPasajerosParams {
  /**
   * ID del tramo en el que suben los pasajeros (viaje_tramos)
   * @example 123
   */
  viajeTramoId?: number;
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindPasajerosData = ViajePasajeroResultDto[];

export interface ViajesUpsertPasajerosParams {
  /** ID del viaje */
  viajeId: number;
}

export type ViajesUpsertPasajerosData = ViajePasajeroResultDto[];

export interface ViajesEscanearDnisParams {
  /**
   * ID del tramo en el que suben los pasajeros (viaje_tramos)
   * @example 123
   */
  viajeTramoId?: number;
  /** ID del viaje */
  viajeId: number;
}

export type ViajesEscanearDnisData = ViajeEscanearDnisResultDto;

export interface ViajesAbordarPasajerosParams {
  /**
   * ID del tramo en el que suben los pasajeros (viaje_tramos)
   * @example 123
   */
  viajeTramoId?: number;
  /** ID del viaje */
  viajeId: number;
}

export type ViajesAbordarPasajerosData = ViajePasajeroResultDto[];

export interface ViajesAbordarPasajerosPorDniParams {
  /**
   * ID del tramo en el que suben los pasajeros (viaje_tramos)
   * @example 123
   */
  viajeTramoId?: number;
  /** ID del viaje */
  viajeId: number;
}

export type ViajesAbordarPasajerosPorDniData = ViajePasajeroResultDto[];

export interface ViajesDesabordarPasajerosParams {
  /**
   * ID del tramo en el que suben los pasajeros (viaje_tramos)
   * @example 123
   */
  viajeTramoId?: number;
  /** ID del viaje */
  viajeId: number;
}

export type ViajesDesabordarPasajerosData = ViajePasajeroResultDto[];

export type ViajesFindAllChecklistItemsData = ChecklistItemResultDto[];

export interface ViajesFindChecklistItemParams {
  /** ID del item */
  id: number;
}

export type ViajesFindChecklistItemData = ChecklistItemResultDto;

export type ViajesCreateChecklistItemData = ChecklistItemResultDto;

export interface ViajesUpdateChecklistItemParams {
  /** ID del item */
  id: number;
}

export type ViajesUpdateChecklistItemData = ChecklistItemResultDto;

export interface ViajesDeleteChecklistItemParams {
  /** ID del item */
  id: number;
}

export type ViajesDeleteChecklistItemData = ChecklistItemResultDto;

export interface ViajesFindChecklistByTipoParams {
  /**
   * Tipo de checklist (salida o llegada)
   * @example "salida"
   */
  tipo: "salida" | "llegada";
  /** ID del viaje */
  viajeId: number;
}

export type ViajesFindChecklistByTipoData = ViajeChecklistResultDto;

export interface ViajesVerifyChecklistParams {
  /**
   * Tipo de checklist (salida o llegada)
   * @example "salida"
   */
  tipo: "salida" | "llegada";
  /** ID del viaje */
  viajeId: number;
}

export type ViajesVerifyChecklistData = ViajeChecklistResultDto;

export interface ViajesDeleteChecklistParams {
  /** ID del checklist */
  id: number;
}

export type ViajesDeleteChecklistData = ViajeChecklistResultDto;

export interface ClientesFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por nombre, DNI, teléfono o email del cliente */
  search?: string;
  /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por tipo de documento
   * @example "DNI"
   */
  tipoDocumento?: "DNI" | "RUC";
  /**
   * Filtrar por tipo de cliente
   * @example "personal"
   */
  tipo?: "personal" | "corporativo";
}

export type ClientesFindAllData = PaginatedClienteResultDto;

export interface ClientesFindOneParams {
  /** ID del cliente */
  id: number;
}

export type ClientesFindOneData = ClienteResultDto;

export type ClientesCreateData = ClienteResultDto;

export interface ClientesUpdateParams {
  /** ID del cliente */
  id: number;
}

export type ClientesUpdateData = ClienteResultDto;

export interface ClientesRemoveParams {
  /** ID del cliente */
  id: number;
}

export type ClientesRemoveData = ClienteResultDto;

export interface ClientesFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ClientesFindDocumentoData = ClienteDocumentoResultDto;

export type ClientesCreateDocumentoData = ClienteDocumentoResultDto;

export interface ClientesUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ClientesUpdateDocumentoData = ClienteDocumentoResultDto;

export interface ClientesDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ClientesDeleteDocumentoData = ClienteDocumentoResultDto;

export interface ClientesFindAllPasajerosParams {
  /**
   * Número de página
   * @example 1
   */
  page?: number;
  /**
   * Límite de items por página
   * @example 10
   */
  limit?: number;
  /** Término de búsqueda (DNI, nombres, apellidos) */
  search?: string;
  /**
   * ID del cliente para filtrar
   * @example 1
   */
  clienteId?: number;
}

export type ClientesFindAllPasajerosData = PaginatedPasajeroResultDto;

export interface ClientesFindPasajeroParams {
  /** ID del pasajero */
  id: number;
}

export type ClientesFindPasajeroData = PasajeroResultDto;

export type ClientesCreatePasajeroData = PasajeroResultDto;

export interface ClientesUpdatePasajeroParams {
  /** ID del pasajero */
  id: number;
}

export type ClientesUpdatePasajeroData = PasajeroResultDto;

export interface ClientesDeletePasajeroParams {
  /** ID del pasajero */
  id: number;
}

export type ClientesDeletePasajeroData = PasajeroResultDto;

export interface ClientesFindAllEncargadosParams {
  /**
   * Número de página
   * @example 1
   */
  page?: number;
  /**
   * Límite de items por página
   * @example 10
   */
  limit?: number;
  /** Término de búsqueda (DNI, nombres, apellidos) */
  search?: string;
  /**
   * ID del cliente para filtrar
   * @example 1
   */
  clienteId?: number;
}

export type ClientesFindAllEncargadosData = PaginatedEncargadoResultDto;

export interface ClientesFindEncargadoParams {
  /** ID del encargado */
  id: number;
}

export type ClientesFindEncargadoData = EncargadoResultDto;

export type ClientesCreateEncargadoData = EncargadoResultDto;

export interface ClientesUpdateEncargadoParams {
  /** ID del encargado */
  id: number;
}

export type ClientesUpdateEncargadoData = EncargadoResultDto;

export interface ClientesDeleteEncargadoParams {
  /** ID del encargado */
  id: number;
}

export type ClientesDeleteEncargadoData = EncargadoResultDto;

export interface ClientesFindAllEntidadesParams {
  /**
   * Número de página
   * @example 1
   */
  page?: number;
  /**
   * Límite de items por página
   * @example 10
   */
  limit?: number;
  /** Término de búsqueda (nombre del servicio) */
  search?: string;
  /**
   * ID del cliente para filtrar
   * @example 1
   */
  clienteId?: number;
}

export type ClientesFindAllEntidadesData = PaginatedEntidadResultDto;

export interface ClientesFindEntidadParams {
  /** ID de la entidad */
  id: number;
}

export type ClientesFindEntidadData = EntidadResultDto;

export type ClientesCreateEntidadData = EntidadResultDto;

export interface ClientesUpdateEntidadParams {
  /** ID de la entidad */
  id: number;
}

export type ClientesUpdateEntidadData = EntidadResultDto;

export interface ClientesDeleteEntidadParams {
  /** ID de la entidad */
  id: number;
}

export type ClientesDeleteEntidadData = EntidadResultDto;

export type TalleresCreateData = any;

export interface TalleresFindAllParams {
  /**
   * Número de página (comienza en 1)
   * @default 1
   * @example 1
   */
  page?: number;
  /**
   * Cantidad de elementos por página
   * @default 10
   * @example 10
   */
  limit?: number;
  /** Búsqueda por razón social, nombre comercial, RUC, teléfono o email */
  search?: string;
  /** Fecha de inicio para filtrar por fecha de creación (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin para filtrar por fecha de creación (YYYY-MM-DD) */
  fechaFin?: string;
  /**
   * Filtrar por tipo de taller
   * @example "interno"
   */
  tipo?: "interno" | "externo";
}

export type TalleresFindAllData = PaginatedTallerResultDto;

export interface TalleresFindOneParams {
  id: number;
}

export type TalleresFindOneData = TallerResultDto;

export interface TalleresFindSucursalesByTallerParams {
  id: number;
}

export type TalleresFindSucursalesByTallerData = SucursalResultDto[];

export interface TalleresUpdateParams {
  id: number;
}

export type TalleresUpdateData = any;

export interface TalleresRemoveParams {
  id: number;
}

export type TalleresRemoveData = any;

export type TalleresCreateSucursalData = any;

export interface TalleresFindAllSucursalesPaginatedParams {
  /** @default 1 */
  page?: number;
  /** @default 10 */
  limit?: number;
  /** Buscar por nombre o dirección */
  search?: string;
  /** Fecha de inicio (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin (YYYY-MM-DD) */
  fechaFin?: string;
}

export type TalleresFindAllSucursalesPaginatedData = PaginatedSucursalResultDto;

export type TalleresFindAllSucursalesData = any;

export interface TalleresFindOneSucursalParams {
  id: number;
}

export type TalleresFindOneSucursalData = SucursalResultDto;

export interface TalleresUpdateSucursalParams {
  id: number;
}

export type TalleresUpdateSucursalData = any;

export interface TalleresRemoveSucursalParams {
  id: number;
}

export type TalleresRemoveSucursalData = any;

export interface ReportesGetViajesDetalladosPorVehiculoParams {
  /** Fecha de inicio del reporte (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin del reporte (YYYY-MM-DD) */
  fechaFin?: string;
  /** ID del vehículo */
  id: number;
}

export type ReportesGetViajesDetalladosPorVehiculoData = ViajeDetalladoDto[];

export interface ReportesGetViajesDetalladosPorConductorParams {
  /** Fecha de inicio del reporte (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin del reporte (YYYY-MM-DD) */
  fechaFin?: string;
  /** ID del conductor */
  id: number;
}

export type ReportesGetViajesDetalladosPorConductorData = ViajeDetalladoDto[];

export interface ReportesGetViajesDetalladosPorClienteParams {
  /** Fecha de inicio del reporte (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin del reporte (YYYY-MM-DD) */
  fechaFin?: string;
  /** ID del cliente */
  id: number;
}

export type ReportesGetViajesDetalladosPorClienteData = ViajeDetalladoDto[];

export interface ReportesGetMantenimientosDetalladosPorVehiculoParams {
  /** Fecha de inicio del reporte (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin del reporte (YYYY-MM-DD) */
  fechaFin?: string;
  /** ID del vehículo */
  id: number;
}

export type ReportesGetMantenimientosDetalladosPorVehiculoData =
  MantenimientoDetalladoVehiculoDto[];

export interface ReportesGetMantenimientosDetalladosPorTallerParams {
  /** Fecha de inicio del reporte (YYYY-MM-DD) */
  fechaInicio?: string;
  /** Fecha de fin del reporte (YYYY-MM-DD) */
  fechaFin?: string;
  /** ID del taller */
  id: number;
}

export type ReportesGetMantenimientosDetalladosPorTallerData =
  MantenimientoDetalladoTallerDto[];

export type ReportesGetReporteConductoresData = ReporteConductorDto[];

export interface PropietariosFindAllParams {
  /**
   * Número de página
   * @example 1
   */
  page?: number;
  /**
   * Registros por página
   * @example 10
   */
  limit?: number;
  /**
   * Búsqueda por nombre, dni, ruc, email, teléfono
   * @example "Juan"
   */
  search?: string;
  /**
   * Fecha inicio
   * @example "2023-01-01"
   */
  fechaInicio?: string;
  /**
   * Fecha fin
   * @example "2023-12-31"
   */
  fechaFin?: string;
  /** Filtrar por tipo de documento */
  tipoDocumento?: "DNI" | "RUC";
}

export type PropietariosFindAllData = PaginatedPropietarioResultDto;

export interface PropietariosFindOneParams {
  /** ID del propietario */
  id: number;
}

export type PropietariosFindOneData = PropietarioResultDto;

export type PropietariosCreateData = PropietarioResultDto;

export interface PropietariosUpdateParams {
  /** ID del propietario */
  id: number;
}

export type PropietariosUpdateData = PropietarioResultDto;

export interface PropietariosRemoveParams {
  /** ID del propietario */
  id: number;
}

export type PropietariosRemoveData = PropietarioResultDto;

export interface PropietariosFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type PropietariosFindDocumentoData = PropietarioDocumentoResultDto;

export type PropietariosCreateDocumentoData = PropietarioDocumentoResultDto;

export interface PropietariosUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type PropietariosUpdateDocumentoData = PropietarioDocumentoResultDto;

export interface PropietariosDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type PropietariosDeleteDocumentoData = PropietarioDocumentoResultDto;

export interface ProveedoresFindAllParams {
  /**
   * Número de página
   * @example 1
   */
  page?: number;
  /**
   * Registros por página
   * @example 10
   */
  limit?: number;
  /**
   * Búsqueda por nombre, dni, ruc, email, teléfono
   * @example "Juan"
   */
  search?: string;
  /**
   * Fecha inicio
   * @example "2023-01-01"
   */
  fechaInicio?: string;
  /**
   * Fecha fin
   * @example "2023-12-31"
   */
  fechaFin?: string;
  /** Filtrar por tipo de documento */
  tipoDocumento?: "DNI" | "RUC";
}

export type ProveedoresFindAllData = PaginatedProveedorResultDto;

export interface ProveedoresFindOneParams {
  /** ID del proveedor */
  id: number;
}

export type ProveedoresFindOneData = ProveedorResultDto;

export type ProveedoresCreateData = ProveedorResultDto;

export interface ProveedoresUpdateParams {
  /** ID del proveedor */
  id: number;
}

export type ProveedoresUpdateData = ProveedorResultDto;

export interface ProveedoresRemoveParams {
  /** ID del proveedor */
  id: number;
}

export type ProveedoresRemoveData = ProveedorResultDto;

export interface ProveedoresFindDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ProveedoresFindDocumentoData = ProveedorDocumentoResultDto;

export type ProveedoresCreateDocumentoData = ProveedorDocumentoResultDto;

export interface ProveedoresUpdateDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ProveedoresUpdateDocumentoData = ProveedorDocumentoResultDto;

export interface ProveedoresDeleteDocumentoParams {
  /** ID del documento */
  id: number;
}

export type ProveedoresDeleteDocumentoData = ProveedorDocumentoResultDto;

export interface AlquileresFindAllParams {
  search?: string;
  /** Filtrar por estado */
  estado?: "activo" | "finalizado" | "cancelado";
  clienteId?: number;
  /** Filtrar por tipo */
  tipo?: "maquina_seca" | "maquina_operada";
  conductorId?: number;
  vehiculoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
  /** @default 1 */
  page?: number;
  /** @default 10 */
  limit?: number;
}

export type AlquileresFindAllData = AlquilerListDto;

export type AlquileresCreateData = AlquilerResultDto;

export interface AlquileresValidarVehiculoParams {
  /** ID del vehículo a validar */
  vehiculoId: number;
  /**
   * Fecha de inicio del alquiler
   * @format date-time
   */
  fechaInicio: string;
  /**
   * Fecha de fin del alquiler
   * @format date-time
   */
  fechaFin?: string;
  /** ID del alquiler actual (para excluirlo de la validación de cruces) */
  alquilerId?: number;
}

export type AlquileresValidarVehiculoData = ValidacionAlquilerResultDto;

export interface AlquileresFindOneParams {
  id: number;
}

export type AlquileresFindOneData = AlquilerResultDto;

export interface AlquileresUpdateParams {
  id: number;
}

export type AlquileresUpdateData = AlquilerResultDto;

export interface AlquileresDeleteParams {
  id: number;
}

export type AlquileresDeleteData = any;

export interface AlquileresTerminarParams {
  id: number;
}

export type AlquileresTerminarData = AlquilerResultDto;

export interface AlquileresFindDocumentoParams {
  id: number;
}

export type AlquileresFindDocumentoData = AlquilerDocumentoResultDto;

export type AlquileresCreateDocumentoData = AlquilerDocumentoResultDto;

export interface AlquileresUpdateDocumentoParams {
  id: number;
}

export type AlquileresUpdateDocumentoData = AlquilerDocumentoResultDto;

export interface AlquileresDeleteDocumentoParams {
  id: number;
}

export type AlquileresDeleteDocumentoData = AlquilerDocumentoResultDto;

export interface StorageUploadPayload {
  /** @format binary */
  file?: File;
}

export interface StorageUploadParams {
  folder: string;
}

export type StorageUploadData = StorageResultDto;

export interface StorageDeleteParams {
  publicId: string;
}

export type StorageDeleteData = any;

export interface StorageDownloadParams {
  path: string;
}

export type StorageDownloadData = any;

export namespace App {
  /**
   * No description
   * @tags App
   * @name AppGetHello
   * @request GET:/
   * @response `200` `AppGetHelloData`
   */
  export namespace AppGetHello {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AppGetHelloData;
  }

  /**
   * No description
   * @tags App
   * @name AppTestError
   * @request GET:/test-error
   * @response `200` `AppTestErrorData`
   */
  export namespace AppTestError {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AppTestErrorData;
  }
}

export namespace Auth {
  /**
   * No description
   * @tags auth
   * @name AuthLogin
   * @summary Login de usuario
   * @request POST:/auth/login
   * @response `200` `AuthLoginData`
   * @response `401` `void` Credenciales inválidas
   */
  export namespace AuthLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthLoginData;
  }

  /**
   * No description
   * @tags auth
   * @name AuthLoginConductor
   * @summary Login de conductor
   * @request POST:/auth/conductor/login
   * @response `200` `AuthLoginConductorData`
   * @response `401` `void` Credenciales inválidas
   */
  export namespace AuthLoginConductor {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConductorLoginDto;
    export type RequestHeaders = {};
    export type ResponseBody = AuthLoginConductorData;
  }
}

export namespace Usuarios {
  /**
   * @description Busca por nombre, apellido o email. Filtra por rango de fechas.
   * @tags usuarios
   * @name UsuariosFindAll
   * @summary Obtener usuarios con./dto/usuario/usuario-result.dtofiltros
   * @request GET:/usuario/find-all
   * @secure
   * @response `200` `UsuariosFindAllData`
   */
  export namespace UsuariosFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre, apellido o email del usuario */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por rol de usuario
       * @example "empleado"
       */
      rol?: "empleado" | "admin";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosFindAllData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosFindOne
   * @summary Get a user by ID
   * @request GET:/usuario/find-one/{id}
   * @secure
   * @response `200` `UsuariosFindOneData`
   */
  export namespace UsuariosFindOne {
    export type RequestParams = {
      /** User ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosFindOneData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosCreate
   * @summary Create a new user
   * @request POST:/usuario/create
   * @secure
   * @response `200` `UsuariosCreateData`
   */
  export namespace UsuariosCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UsuarioCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosCreateData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosUpdate
   * @summary Update a user
   * @request PATCH:/usuario/update/{id}
   * @secure
   * @response `200` `UsuariosUpdateData`
   */
  export namespace UsuariosUpdate {
    export type RequestParams = {
      /** User ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UsuarioUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosUpdateData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosRemove
   * @summary Delete a user
   * @request DELETE:/usuario/delete/{id}
   * @secure
   * @response `200` `UsuariosRemoveData`
   */
  export namespace UsuariosRemove {
    export type RequestParams = {
      /** User ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosRemoveData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosFindFirmas
   * @summary Obtener las firmas de un usuario
   * @request GET:/usuario/find-firmas/{id}
   * @secure
   * @response `200` `UsuariosFindFirmasData`
   */
  export namespace UsuariosFindFirmas {
    export type RequestParams = {
      /** User ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosFindFirmasData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/usuario/documento/{id}
   * @secure
   * @response `200` `UsuariosFindDocumentoData`
   */
  export namespace UsuariosFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosFindDocumentoData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosCreateDocumento
   * @summary Crear un nuevo documento de usuario
   * @request POST:/usuario/documento/create
   * @secure
   * @response `201` `UsuariosCreateDocumentoData`
   */
  export namespace UsuariosCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UsuarioDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosCreateDocumentoData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosUpdateDocumento
   * @summary Actualizar un documento de usuario
   * @request PATCH:/usuario/documento/update/{id}
   * @secure
   * @response `200` `UsuariosUpdateDocumentoData`
   */
  export namespace UsuariosUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = UsuarioDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosUpdateDocumentoData;
  }

  /**
   * No description
   * @tags usuarios
   * @name UsuariosDeleteDocumento
   * @summary Eliminar un documento de usuario
   * @request DELETE:/usuario/documento/delete/{id}
   * @secure
   * @response `200` `UsuariosDeleteDocumentoData`
   */
  export namespace UsuariosDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = UsuariosDeleteDocumentoData;
  }
}

export namespace Conductores {
  /**
   * @description Busca por nombre, DNI o número de licencia. Filtra por rango de fechas.
   * @tags conductores
   * @name ConductoresFindAll
   * @summary Obtener conductores con paginación, búsqueda y filtros
   * @request GET:/conductor/find-all
   * @secure
   * @response `200` `ConductoresFindAllData`
   */
  export namespace ConductoresFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre, DNI o número de licencia del conductor */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por clase de licencia
       * @example "A"
       */
      claseLicencia?: "A" | "B";
      /**
       * Filtrar por categoría de licencia
       * @example "I"
       */
      categoriaLicencia?:
        | "I"
        | "II-a"
        | "II-b"
        | "II-c"
        | "III-a"
        | "III-b"
        | "III-c";
      /**
       * Filtrar por estado del conductor
       * @example "activo"
       */
      estado?: "activo" | "inactivo" | "eventual";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresFindAllData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresFindAllEstadoDocumentos
   * @summary Obtener estado de documentos de conductores (activo/caducado/nulo)
   * @request GET:/conductor/estado-documentos
   * @secure
   * @response `200` `ConductoresFindAllEstadoDocumentosData`
   */
  export namespace ConductoresFindAllEstadoDocumentos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * Filtrar por estado de documentos
       * @example "incompleto"
       */
      filtro?: "completo" | "incompleto";
      /** Búsqueda por nombre, DNI o número de licencia */
      search?: string;
      /** Filtrar por clase de licencia */
      claseLicencia?: "A" | "B";
      /** Filtrar por categoría de licencia */
      categoriaLicencia?:
        | "I"
        | "II-a"
        | "II-b"
        | "II-c"
        | "III-a"
        | "III-b"
        | "III-c";
      /** Filtrar por estado del conductor */
      estado?: "activo" | "inactivo" | "eventual";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresFindAllEstadoDocumentosData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresFindOne
   * @summary Get a driver by ID
   * @request GET:/conductor/find-one/{id}
   * @secure
   * @response `200` `ConductoresFindOneData`
   */
  export namespace ConductoresFindOne {
    export type RequestParams = {
      /** Driver ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresFindOneData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresCreate
   * @summary Create a new driver
   * @request POST:/conductor/create
   * @secure
   * @response `200` `ConductoresCreateData`
   */
  export namespace ConductoresCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConductorCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresCreateData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresUpdate
   * @summary Update a driver
   * @request PATCH:/conductor/update/{id}
   * @secure
   * @response `200` `ConductoresUpdateData`
   */
  export namespace ConductoresUpdate {
    export type RequestParams = {
      /** Driver ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConductorUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresUpdateData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresRemove
   * @summary Delete a driver
   * @request DELETE:/conductor/delete/{id}
   * @secure
   * @response `200` `ConductoresRemoveData`
   */
  export namespace ConductoresRemove {
    export type RequestParams = {
      /** Driver ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresRemoveData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/conductor/documento/{id}
   * @secure
   * @response `200` `ConductoresFindDocumentoData`
   */
  export namespace ConductoresFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresFindDocumentoData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresCreateDocumento
   * @summary Crear un nuevo documento de conductor
   * @request POST:/conductor/documento/create
   * @secure
   * @response `201` `ConductoresCreateDocumentoData`
   */
  export namespace ConductoresCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ConductorDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresCreateDocumentoData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresUpdateDocumento
   * @summary Actualizar un documento de conductor
   * @request PATCH:/conductor/documento/update/{id}
   * @secure
   * @response `200` `ConductoresUpdateDocumentoData`
   */
  export namespace ConductoresUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ConductorDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresUpdateDocumentoData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresDeleteDocumento
   * @summary Eliminar un documento de conductor
   * @request DELETE:/conductor/documento/delete/{id}
   * @secure
   * @response `200` `ConductoresDeleteDocumentoData`
   */
  export namespace ConductoresDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresDeleteDocumentoData;
  }

  /**
   * No description
   * @tags conductores
   * @name ConductoresDownload
   * @summary Descargar documentos del conductor en ZIP
   * @request GET:/conductor/download/{id}
   * @secure
   * @response `200` `ConductoresDownloadData`
   */
  export namespace ConductoresDownload {
    export type RequestParams = {
      /** ID del conductor */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ConductoresDownloadData;
  }
}

export namespace Dashboard {
  /**
   * No description
   * @tags dashboard
   * @name DashboardGetStats
   * @summary Obtener estadísticas generales del dashboard
   * @request GET:/dashboard/stats
   * @secure
   * @response `200` `DashboardGetStatsData`
   */
  export namespace DashboardGetStats {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetStatsData;
  }

  /**
   * No description
   * @tags dashboard
   * @name DashboardGetVehiculosPorEstado
   * @summary Obtener vehículos agrupados por estado
   * @request GET:/dashboard/vehiculos-estado
   * @secure
   * @response `200` `DashboardGetVehiculosPorEstadoData`
   */
  export namespace DashboardGetVehiculosPorEstado {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetVehiculosPorEstadoData;
  }

  /**
   * No description
   * @tags dashboard
   * @name DashboardGetViajesRecientes
   * @summary Obtener los últimos 5 viajes
   * @request GET:/dashboard/viajes-recientes
   * @secure
   * @response `200` `DashboardGetViajesRecientesData`
   */
  export namespace DashboardGetViajesRecientes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetViajesRecientesData;
  }

  /**
   * No description
   * @tags dashboard
   * @name DashboardGetMantenimientosProximos
   * @summary Obtener mantenimientos programados próximos
   * @request GET:/dashboard/mantenimientos-proximos
   * @secure
   * @response `200` `DashboardGetMantenimientosProximosData`
   */
  export namespace DashboardGetMantenimientosProximos {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetMantenimientosProximosData;
  }

  /**
   * No description
   * @tags dashboard
   * @name DashboardGetRutasPopulares
   * @summary Obtener las 5 rutas más utilizadas
   * @request GET:/dashboard/rutas-populares
   * @secure
   * @response `200` `DashboardGetRutasPopularesData`
   */
  export namespace DashboardGetRutasPopulares {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetRutasPopularesData;
  }

  /**
   * No description
   * @tags dashboard
   * @name DashboardGetIngresosMensuales
   * @summary Obtener kilometraje de los últimos 6 meses (alias para compatibilidad)
   * @request GET:/dashboard/ingresos-mensuales
   * @secure
   * @response `200` `DashboardGetIngresosMensualesData`
   */
  export namespace DashboardGetIngresosMensuales {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DashboardGetIngresosMensualesData;
  }
}

export namespace Vehiculos {
  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindAll
   * @summary Obtener vehículos con paginación, búsqueda y filtros
   * @request GET:/vehiculo/find-all
   * @secure
   * @response `200` `VehiculosFindAllData`
   */
  export namespace VehiculosFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por placa, marca o modelo del vehículo */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por estado del vehículo
       * @example "disponible"
       */
      estado?:
        | "disponible"
        | "circulacion"
        | "taller"
        | "retirado"
        | "alquilado";
      /** Filtrar por ID de marca */
      marcaId?: number;
      /** Filtrar por ID de propietario */
      propietarioId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindAllData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindAllEstadoDocumentos
   * @summary Obtener estado de documentos de vehículos (activo/caducado/nulo)
   * @request GET:/vehiculo/estado-documentos
   * @secure
   * @response `200` `VehiculosFindAllEstadoDocumentosData`
   */
  export namespace VehiculosFindAllEstadoDocumentos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * Filtrar por estado de documentos
       * @example "incompleto"
       */
      filtro?: "completo" | "incompleto";
      /**
       * Filtrar por estado del vehículo
       * @example "alquilado"
       */
      estado?: string;
      /**
       * ID de la marca para filtrar
       * @example 1
       */
      marcaId?: number;
      /**
       * Placa del vehículo para filtrar
       * @example "ABC-123"
       */
      placa?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindAllEstadoDocumentosData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosDownload
   * @summary Descargar información y documentos del vehículo (ZIP)
   * @request GET:/vehiculo/download/{id}
   * @secure
   * @response `200` `VehiculosDownloadData`
   */
  export namespace VehiculosDownload {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosDownloadData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindOne
   * @summary Get a vehicle by ID
   * @request GET:/vehiculo/find-one/{id}
   * @secure
   * @response `200` `VehiculosFindOneData`
   */
  export namespace VehiculosFindOne {
    export type RequestParams = {
      /** Vehicle ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindOneData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosCreate
   * @summary Create a new vehicle
   * @request POST:/vehiculo/create
   * @secure
   * @response `200` `VehiculosCreateData`
   */
  export namespace VehiculosCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VehiculoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosCreateData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpdate
   * @summary Update a vehicle
   * @request PATCH:/vehiculo/update/{id}
   * @secure
   * @response `200` `VehiculosUpdateData`
   */
  export namespace VehiculosUpdate {
    export type RequestParams = {
      /** Vehicle ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = VehiculoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpdateData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosRemove
   * @summary Delete a vehicle
   * @request DELETE:/vehiculo/delete/{id}
   * @secure
   * @response `200` `VehiculosRemoveData`
   */
  export namespace VehiculosRemove {
    export type RequestParams = {
      /** Vehicle ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosRemoveData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/vehiculo/documento/{id}
   * @secure
   * @response `200` `VehiculosFindDocumentoData`
   */
  export namespace VehiculosFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindDocumentoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosCreateDocumento
   * @summary Crear un nuevo documento de vehículo
   * @request POST:/vehiculo/documento/create
   * @secure
   * @response `201` `VehiculosCreateDocumentoData`
   */
  export namespace VehiculosCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VehiculoDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosCreateDocumentoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpdateDocumento
   * @summary Actualizar un documento de vehículo
   * @request PATCH:/vehiculo/documento/update/{id}
   * @secure
   * @response `200` `VehiculosUpdateDocumentoData`
   */
  export namespace VehiculosUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = VehiculoDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpdateDocumentoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosDeleteDocumento
   * @summary Eliminar un documento de vehículo
   * @request DELETE:/vehiculo/documento/delete/{id}
   * @secure
   * @response `200` `VehiculosDeleteDocumentoData`
   */
  export namespace VehiculosDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosDeleteDocumentoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindComentariosByVehiculo
   * @summary Obtener todos los comentarios de un vehículo
   * @request GET:/vehiculo/{id}/comentario/find-all
   * @secure
   * @response `200` `VehiculosFindComentariosByVehiculoData`
   */
  export namespace VehiculosFindComentariosByVehiculo {
    export type RequestParams = {
      /** ID del vehículo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindComentariosByVehiculoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindOneComentario
   * @summary Obtener un comentario por ID
   * @request GET:/vehiculo/comentario/find-one/{id}
   * @secure
   * @response `200` `VehiculosFindOneComentarioData`
   */
  export namespace VehiculosFindOneComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindOneComentarioData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosCreateComentario
   * @summary Crear un nuevo comentario para un vehículo
   * @request POST:/vehiculo/comentario/create
   * @secure
   * @response `201` `VehiculosCreateComentarioData`
   */
  export namespace VehiculosCreateComentario {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VehiculoComentarioCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosCreateComentarioData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpdateComentario
   * @summary Actualizar un comentario
   * @request PATCH:/vehiculo/comentario/update/{id}
   * @secure
   * @response `200` `VehiculosUpdateComentarioData`
   */
  export namespace VehiculosUpdateComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = VehiculoComentarioUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpdateComentarioData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosDeleteComentario
   * @summary Eliminar un comentario
   * @request DELETE:/vehiculo/comentario/delete/{id}
   * @secure
   * @response `200` `VehiculosDeleteComentarioData`
   */
  export namespace VehiculosDeleteComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosDeleteComentarioData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindAllMarcas
   * @summary Obtener marcas con paginación, búsqueda y filtros
   * @request GET:/vehiculo/marca/find-all
   * @secure
   * @response `200` `VehiculosFindAllMarcasData`
   */
  export namespace VehiculosFindAllMarcas {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre de marca */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindAllMarcasData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindOneMarca
   * @summary Obtener una marca por ID
   * @request GET:/vehiculo/marca/find-one/{id}
   * @secure
   * @response `200` `VehiculosFindOneMarcaData`
   */
  export namespace VehiculosFindOneMarca {
    export type RequestParams = {
      /** ID de la marca */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindOneMarcaData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosCreateMarca
   * @summary Crear una nueva marca
   * @request POST:/vehiculo/marca/create
   * @secure
   * @response `201` `VehiculosCreateMarcaData`
   */
  export namespace VehiculosCreateMarca {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MarcaCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosCreateMarcaData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpdateMarca
   * @summary Actualizar una marca
   * @request PATCH:/vehiculo/marca/update/{id}
   * @secure
   * @response `200` `VehiculosUpdateMarcaData`
   */
  export namespace VehiculosUpdateMarca {
    export type RequestParams = {
      /** ID de la marca */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MarcaUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpdateMarcaData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosDeleteMarca
   * @summary Eliminar una marca
   * @request DELETE:/vehiculo/marca/delete/{id}
   * @secure
   * @response `200` `VehiculosDeleteMarcaData`
   */
  export namespace VehiculosDeleteMarca {
    export type RequestParams = {
      /** ID de la marca */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosDeleteMarcaData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindAllModelos
   * @summary Obtener modelos con paginación, búsqueda y filtros
   * @request GET:/vehiculo/modelo/find-all
   * @secure
   * @response `200` `VehiculosFindAllModelosData`
   */
  export namespace VehiculosFindAllModelos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre de modelo */
      search?: string;
      /** Filtrar por ID de marca */
      marcaId?: number;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindAllModelosData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindOneModelo
   * @summary Obtener un modelo por ID
   * @request GET:/vehiculo/modelo/find-one/{id}
   * @secure
   * @response `200` `VehiculosFindOneModeloData`
   */
  export namespace VehiculosFindOneModelo {
    export type RequestParams = {
      /** ID del modelo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindOneModeloData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosCreateModelo
   * @summary Crear un nuevo modelo
   * @request POST:/vehiculo/modelo/create
   * @secure
   * @response `201` `VehiculosCreateModeloData`
   */
  export namespace VehiculosCreateModelo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ModeloCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosCreateModeloData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpdateModelo
   * @summary Actualizar un modelo
   * @request PATCH:/vehiculo/modelo/update/{id}
   * @secure
   * @response `200` `VehiculosUpdateModeloData`
   */
  export namespace VehiculosUpdateModelo {
    export type RequestParams = {
      /** ID del modelo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ModeloUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpdateModeloData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosDeleteModelo
   * @summary Eliminar un modelo
   * @request DELETE:/vehiculo/modelo/delete/{id}
   * @secure
   * @response `200` `VehiculosDeleteModeloData`
   */
  export namespace VehiculosDeleteModelo {
    export type RequestParams = {
      /** ID del modelo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosDeleteModeloData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindChecklistHistory
   * @summary Obtener historial de documentos de checklist
   * @request GET:/vehiculo/{id}/checklist-document/history
   * @secure
   * @response `200` `VehiculosFindChecklistHistoryData`
   */
  export namespace VehiculosFindChecklistHistory {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /**
       * ID del ChecklistItem (Tipo de documento)
       * @example 1
       */
      checklistItemId: number;
      /**
       * Página/Offset
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Límite por página
       * @default 10
       * @example 10
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindChecklistHistoryData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindIpercContinuo
   * @summary Obtener configuración: IPERC continuo
   * @request GET:/vehiculo/{id}/checklist-document/iperc-continuo/find
   * @secure
   * @response `200` `VehiculosFindIpercContinuoData`
   */
  export namespace VehiculosFindIpercContinuo {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindIpercContinuoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindHojaInspeccion
   * @summary Obtener configuración: Hoja de Inspección
   * @request GET:/vehiculo/{id}/checklist-document/hoja-inspeccion/find
   * @secure
   * @response `200` `VehiculosFindHojaInspeccionData`
   */
  export namespace VehiculosFindHojaInspeccion {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindHojaInspeccionData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindInspeccionDocumentos
   * @summary Obtener configuración: Inspección de Documentos
   * @request GET:/vehiculo/{id}/checklist-document/inspeccion-documentos/find
   * @secure
   * @response `200` `VehiculosFindInspeccionDocumentosData`
   */
  export namespace VehiculosFindInspeccionDocumentos {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindInspeccionDocumentosData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindLuces
   * @summary Obtener configuración: Luces de Emergencia y Alarmas
   * @request GET:/vehiculo/{id}/checklist-document/luces-emergencia-alarmas/find
   * @secure
   * @response `200` `VehiculosFindLucesData`
   */
  export namespace VehiculosFindLuces {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindLucesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindCinturones
   * @summary Obtener configuración: Cinturones de Seguridad
   * @request GET:/vehiculo/{id}/checklist-document/cinturones-seguridad/find
   * @secure
   * @response `200` `VehiculosFindCinturonesData`
   */
  export namespace VehiculosFindCinturones {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindCinturonesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindHerramientas
   * @summary Obtener configuración: Inspección de Herramientas
   * @request GET:/vehiculo/{id}/checklist-document/inspeccion-herramientas/find
   * @secure
   * @response `200` `VehiculosFindHerramientasData`
   */
  export namespace VehiculosFindHerramientas {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindHerramientasData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindBotiquines
   * @summary Obtener configuración: Inspección de Botiquines
   * @request GET:/vehiculo/{id}/checklist-document/inspeccion-botiquines/find
   * @secure
   * @response `200` `VehiculosFindBotiquinesData`
   */
  export namespace VehiculosFindBotiquines {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindBotiquinesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindKitAntiderrames
   * @summary Obtener configuración: Kit Antiderrames
   * @request GET:/vehiculo/{id}/checklist-document/kit-antiderrames/find
   * @secure
   * @response `200` `VehiculosFindKitAntiderramesData`
   */
  export namespace VehiculosFindKitAntiderrames {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindKitAntiderramesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosFindRevisionVehiculos
   * @summary Obtener configuración: Revisión de Vehículos
   * @request GET:/vehiculo/{id}/checklist-document/revision-vehiculos/find
   * @secure
   * @response `200` `VehiculosFindRevisionVehiculosData`
   */
  export namespace VehiculosFindRevisionVehiculos {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** ID específico del documento (opcional) */
      documentId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosFindRevisionVehiculosData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertIpercContinuo
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/iperc-continuo/upsert
   * @secure
   * @response `201` `VehiculosUpsertIpercContinuoData`
   */
  export namespace VehiculosUpsertIpercContinuo {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = IpercContinuoDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertIpercContinuoData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertHojaInspeccion
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/hoja-inspeccion/upsert
   * @secure
   * @response `201` `VehiculosUpsertHojaInspeccionData`
   */
  export namespace VehiculosUpsertHojaInspeccion {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = HojaInspeccionDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertHojaInspeccionData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertInspeccionDocumentos
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-documentos/upsert
   * @secure
   * @response `201` `VehiculosUpsertInspeccionDocumentosData`
   */
  export namespace VehiculosUpsertInspeccionDocumentos {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = InspeccionDocumentosDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertInspeccionDocumentosData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertLuces
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/luces-emergencia-alarmas/upsert
   * @secure
   * @response `201` `VehiculosUpsertLucesData`
   */
  export namespace VehiculosUpsertLuces {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = LucesEmergenciaAlarmasDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertLucesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertCinturones
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/cinturones-seguridad/upsert
   * @secure
   * @response `201` `VehiculosUpsertCinturonesData`
   */
  export namespace VehiculosUpsertCinturones {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = CinturonesSeguridadDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertCinturonesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertHerramientas
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-herramientas/upsert
   * @secure
   * @response `201` `VehiculosUpsertHerramientasData`
   */
  export namespace VehiculosUpsertHerramientas {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = InspeccionHerramientasDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertHerramientasData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertBotiquines
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-botiquines/upsert
   * @secure
   * @response `201` `VehiculosUpsertBotiquinesData`
   */
  export namespace VehiculosUpsertBotiquines {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = InspeccionBotiquinesDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertBotiquinesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertKitAntiderrames
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/kit-antiderrames/upsert
   * @secure
   * @response `201` `VehiculosUpsertKitAntiderramesData`
   */
  export namespace VehiculosUpsertKitAntiderrames {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = KitAntiderramesDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertKitAntiderramesData;
  }

  /**
   * No description
   * @tags vehiculos
   * @name VehiculosUpsertRevisionVehiculos
   * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/revision-vehiculos/upsert
   * @secure
   * @response `201` `VehiculosUpsertRevisionVehiculosData`
   */
  export namespace VehiculosUpsertRevisionVehiculos {
    export type RequestParams = {
      /** ID del Vehículo */
      id: number;
      /** ID del Viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de viaje (salida/llegada)
       * @default "salida"
       */
      tipo?: "salida" | "llegada";
    };
    export type RequestBody = RevisionVehiculosDto;
    export type RequestHeaders = {};
    export type ResponseBody = VehiculosUpsertRevisionVehiculosData;
  }
}

export namespace Mantenimientos {
  /**
   * @description Busca por código de orden o ID. Filtra por fechas, tipo, estado, taller y vehículo.
   * @tags mantenimientos
   * @name MantenimientosFindAll
   * @summary Obtener mantenimientos con paginación, búsqueda y filtros
   * @request GET:/mantenimiento/find-all
   * @secure
   * @response `200` `MantenimientosFindAllData`
   */
  export namespace MantenimientosFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por código de orden o ID exacto del mantenimiento */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por tipo de mantenimiento
       * @example "preventivo"
       */
      tipo?: "preventivo" | "correctivo";
      /**
       * Filtrar por estado del mantenimiento
       * @example "pendiente"
       */
      estado?: "pendiente" | "en_proceso" | "finalizado";
      /** Filtrar por taller */
      tallerId?: number;
      /** Filtrar por vehículo */
      vehiculoId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosFindAllData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosFindOne
   * @summary Get a maintenance record by ID
   * @request GET:/mantenimiento/find-one/{id}
   * @secure
   * @response `200` `MantenimientosFindOneData`
   */
  export namespace MantenimientosFindOne {
    export type RequestParams = {
      /** Maintenance ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosFindOneData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosCreate
   * @summary Create a new maintenance record
   * @request POST:/mantenimiento/create
   * @secure
   * @response `200` `MantenimientosCreateData`
   */
  export namespace MantenimientosCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MantenimientoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosCreateData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosUpdate
   * @summary Update a maintenance record
   * @request PATCH:/mantenimiento/update/{id}
   * @secure
   * @response `200` `MantenimientosUpdateData`
   */
  export namespace MantenimientosUpdate {
    export type RequestParams = {
      /** Maintenance ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MantenimientoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosUpdateData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosRemove
   * @summary Delete a maintenance record
   * @request DELETE:/mantenimiento/delete/{id}
   * @secure
   * @response `200` `MantenimientosRemoveData`
   */
  export namespace MantenimientosRemove {
    export type RequestParams = {
      /** Maintenance ID */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosRemoveData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosCreateMantenimientoTarea
   * @summary Agregar una tarea a un mantenimiento
   * @request POST:/mantenimiento/mantenimiento-tarea/create
   * @secure
   * @response `201` `MantenimientosCreateMantenimientoTareaData`
   */
  export namespace MantenimientosCreateMantenimientoTarea {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MantenimientoTareaCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosCreateMantenimientoTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosUpdateMantenimientoTarea
   * @summary Actualizar una tarea de mantenimiento
   * @request PATCH:/mantenimiento/mantenimiento-tarea/update/{id}
   * @secure
   * @response `200` `MantenimientosUpdateMantenimientoTareaData`
   */
  export namespace MantenimientosUpdateMantenimientoTarea {
    export type RequestParams = {
      /** ID de la relación tarea-mantenimiento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MantenimientoTareaUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosUpdateMantenimientoTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosDeleteMantenimientoTarea
   * @summary Eliminar una tarea de mantenimiento
   * @request DELETE:/mantenimiento/mantenimiento-tarea/delete/{id}
   * @secure
   * @response `200` `MantenimientosDeleteMantenimientoTareaData`
   */
  export namespace MantenimientosDeleteMantenimientoTarea {
    export type RequestParams = {
      /** ID de la relación tarea-mantenimiento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosDeleteMantenimientoTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosFindAllTareas
   * @summary Obtener tareas del catálogo con paginación y filtros
   * @request GET:/mantenimiento/tarea/find-all
   * @secure
   * @response `200` `MantenimientosFindAllTareasData`
   */
  export namespace MantenimientosFindAllTareas {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por código o descripción */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosFindAllTareasData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosFindOneTarea
   * @summary Obtener una tarea del catálogo por ID
   * @request GET:/mantenimiento/tarea/find-one/{id}
   * @secure
   * @response `200` `MantenimientosFindOneTareaData`
   */
  export namespace MantenimientosFindOneTarea {
    export type RequestParams = {
      /** ID de la tarea */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosFindOneTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosCreateTarea
   * @summary Crear una nueva tarea en el catálogo
   * @request POST:/mantenimiento/tarea/create
   * @secure
   * @response `201` `MantenimientosCreateTareaData`
   */
  export namespace MantenimientosCreateTarea {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TareaCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosCreateTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosUpdateTarea
   * @summary Actualizar una tarea del catálogo
   * @request PATCH:/mantenimiento/tarea/update/{id}
   * @secure
   * @response `200` `MantenimientosUpdateTareaData`
   */
  export namespace MantenimientosUpdateTarea {
    export type RequestParams = {
      /** ID de la tarea */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = TareaUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosUpdateTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosDeleteTarea
   * @summary Eliminar una tarea del catálogo
   * @request DELETE:/mantenimiento/tarea/delete/{id}
   * @secure
   * @response `200` `MantenimientosDeleteTareaData`
   */
  export namespace MantenimientosDeleteTarea {
    export type RequestParams = {
      /** ID de la tarea */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosDeleteTareaData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/mantenimiento/documento/{id}
   * @secure
   * @response `200` `MantenimientosFindDocumentoData`
   */
  export namespace MantenimientosFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosFindDocumentoData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosCreateDocumento
   * @summary Agregar un documento a un mantenimiento
   * @request POST:/mantenimiento/documento/create
   * @secure
   * @response `201` `MantenimientosCreateDocumentoData`
   */
  export namespace MantenimientosCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = MantenimientoDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosCreateDocumentoData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosUpdateDocumento
   * @summary Actualizar un documento de mantenimiento
   * @request PATCH:/mantenimiento/documento/update/{id}
   * @secure
   * @response `200` `MantenimientosUpdateDocumentoData`
   */
  export namespace MantenimientosUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = MantenimientoDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosUpdateDocumentoData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosDeleteDocumento
   * @summary Eliminar un documento de mantenimiento
   * @request DELETE:/mantenimiento/documento/delete/{id}
   * @secure
   * @response `200` `MantenimientosDeleteDocumentoData`
   */
  export namespace MantenimientosDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosDeleteDocumentoData;
  }

  /**
   * No description
   * @tags mantenimientos
   * @name MantenimientosGetReporteEstadoVehiculos
   * @summary Obtener reporte de estado de mantenimiento de vehículos
   * @request GET:/mantenimiento/reporte-estado-vehiculos
   * @secure
   * @response `200` `MantenimientosGetReporteEstadoVehiculosData`
   */
  export namespace MantenimientosGetReporteEstadoVehiculos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @min 1
       * @default 1
       */
      page?: number;
      /**
       * Elementos por página
       * @min 1
       * @default 10
       */
      limit?: number;
      /**
       * Ordenamiento: proximos (menor kilometraje restante) o ultimos (mayor fecha de mantenimiento)
       * @default "proximos"
       */
      sort?: "proximos" | "ultimos";
      /** ID del vehículo para filtrar */
      vehiculoId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = MantenimientosGetReporteEstadoVehiculosData;
  }
}

export namespace Notificaciones {
  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesFindAll
   * @summary Obtener notificaciones del usuario
   * @request GET:/notificacion/find-all
   * @response `200` `NotificacionesFindAllData`
   */
  export namespace NotificacionesFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /**
       * ID del usuario
       * @example 1
       */
      userId: number;
      /**
       * Filtrar por destino del usuario
       * @example "sistema"
       */
      destino?: "sistema" | "clientes" | "usuarios" | "conductor";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesFindAllData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesCreate
   * @summary Crear una nueva notificación general
   * @request POST:/notificacion/create
   * @response `201` `NotificacionesCreateData`
   */
  export namespace NotificacionesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = NotificacionCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesCreateData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesMarkAsRead
   * @summary Marcar notificación como leída
   * @request POST:/notificacion/leido/{id}
   * @response `200` `NotificacionesMarkAsReadData`
   */
  export namespace NotificacionesMarkAsRead {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {
      userId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesMarkAsReadData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesMarkAsDismissed
   * @summary Ocultar notificación para un usuario
   * @request POST:/notificacion/ocultar/{id}
   * @response `200` `NotificacionesMarkAsDismissedData`
   */
  export namespace NotificacionesMarkAsDismissed {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {
      userId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesMarkAsDismissedData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesCreateForConductor
   * @summary Crear una nueva notificación para un conductor
   * @request POST:/notificacion/create-conductor/{conductorId}
   * @response `201` `NotificacionesCreateForConductorData`
   */
  export namespace NotificacionesCreateForConductor {
    export type RequestParams = {
      conductorId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = NotificacionCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesCreateForConductorData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesFindAllByConductor
   * @summary Obtener notificaciones de un conductor
   * @request GET:/notificacion/conductor/{conductorId}
   * @response `200` `NotificacionesFindAllByConductorData`
   */
  export namespace NotificacionesFindAllByConductor {
    export type RequestParams = {
      conductorId: number;
    };
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesFindAllByConductorData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesMarkAsReadByConductor
   * @summary Marcar notificación como leída para un conductor
   * @request POST:/notificacion/leido-conductor/{id}
   * @response `200` `NotificacionesMarkAsReadByConductorData`
   */
  export namespace NotificacionesMarkAsReadByConductor {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {
      conductorId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesMarkAsReadByConductorData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesMarkAsDismissedByConductor
   * @summary Ocultar notificación para un conductor
   * @request POST:/notificacion/ocultar-conductor/{id}
   * @response `200` `NotificacionesMarkAsDismissedByConductorData`
   */
  export namespace NotificacionesMarkAsDismissedByConductor {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {
      conductorId: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesMarkAsDismissedByConductorData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesPreviewVencimientos
   * @summary TEST: Previsualizar notificaciones de documentos por vencer
   * @request GET:/notificacion/vencimientos/test
   * @response `200` `NotificacionesPreviewVencimientosData`
   */
  export namespace NotificacionesPreviewVencimientos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.
       * @example "2025-12-18"
       */
      fecha: string;
      /**
       * Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.
       * @default 7
       * @example 7
       */
      diasAnticipacion?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesPreviewVencimientosData;
  }

  /**
   * @description Busca documentos por vencer/vencidos y CREA las notificaciones en la base de datos.
   * @tags notificaciones
   * @name NotificacionesGenerarVencimientos
   * @summary Generar y guardar notificaciones de documentos por vencer
   * @request POST:/notificacion/vencimientos/generar
   * @response `201` `NotificacionesGenerarVencimientosData`
   */
  export namespace NotificacionesGenerarVencimientos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Fecha de referencia (YYYY-MM-DD). Punto de partida para la búsqueda.
       * @example "2025-12-18"
       */
      fecha: string;
      /**
       * Días de anticipación a buscar (default: 7). Busca documentos que vencen hasta fecha + diasAnticipacion.
       * @default 7
       * @example 7
       */
      diasAnticipacion?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesGenerarVencimientosData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesSendEmail
   * @summary Enviar un correo electrónico
   * @request POST:/notificacion/send-email
   * @response `200` `NotificacionesSendEmailData` Correo enviado correctamente
   */
  export namespace NotificacionesSendEmail {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SendEmailDto;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesSendEmailData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesNotifyEachAdmin
   * @summary Enviar lista de conductores con documentos por vencer a todos los administradores
   * @request POST:/notificacion/notify-each-admin
   * @response `200` `NotificacionesNotifyEachAdminData` Correos enviados con el reporte
   */
  export namespace NotificacionesNotifyEachAdmin {
    export type RequestParams = {};
    export type RequestQuery = {
      diasAnticipacion: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesNotifyEachAdminData;
  }

  /**
   * No description
   * @tags notificaciones
   * @name NotificacionesNotifyEachConductor
   * @summary Enviar correo personalizado a cada conductor con sus documentos por vencer
   * @request POST:/notificacion/notify-each-conductor
   * @response `200` `NotificacionesNotifyEachConductorData` Proceso de notificación por correo finalizado
   */
  export namespace NotificacionesNotifyEachConductor {
    export type RequestParams = {};
    export type RequestQuery = {
      diasAnticipacion: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificacionesNotifyEachConductorData;
  }
}

export namespace Rutas {
  /**
   * @description Busca por origen o destino. Filtra por rango de fechas.
   * @tags rutas
   * @name RutasFindAll
   * @summary Obtener rutas con paginación, búsqueda y filtros
   * @request GET:/ruta/find-all
   * @secure
   * @response `200` `RutasFindAllData`
   */
  export namespace RutasFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por origen o destino de la ruta */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RutasFindAllData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasFindOne
   * @summary Obtener una ruta por ID
   * @request GET:/ruta/find-one/{id}
   * @secure
   * @response `200` `RutasFindOneData`
   */
  export namespace RutasFindOne {
    export type RequestParams = {
      /** ID de la ruta */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RutasFindOneData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasFindAllCircuitos
   * @summary Obtener circuitos con paginación, búsqueda y filtros
   * @request GET:/ruta/circuito/find-all
   * @secure
   * @response `200` `RutasFindAllCircuitosData`
   */
  export namespace RutasFindAllCircuitos {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre del circuito */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RutasFindAllCircuitosData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasFindOneCircuito
   * @summary Obtener un circuito por ID con sus rutas
   * @request GET:/ruta/circuito/find-one/{id}
   * @secure
   * @response `200` `RutasFindOneCircuitoData`
   */
  export namespace RutasFindOneCircuito {
    export type RequestParams = {
      /** ID del circuito */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RutasFindOneCircuitoData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasCreateCircuito
   * @summary Crear un nuevo circuito con rutas de ida y vuelta
   * @request POST:/ruta/circuito/create
   * @secure
   * @response `200` `RutasCreateCircuitoData`
   */
  export namespace RutasCreateCircuito {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = RutaCircuitoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = RutasCreateCircuitoData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasUpdateCircuito
   * @summary Actualizar un circuito y sus rutas
   * @request PATCH:/ruta/circuito/update/{id}
   * @secure
   * @response `200` `RutasUpdateCircuitoData`
   */
  export namespace RutasUpdateCircuito {
    export type RequestParams = {
      /** ID del circuito */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = RutaCircuitoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = RutasUpdateCircuitoData;
  }

  /**
   * No description
   * @tags rutas
   * @name RutasRemoveCircuito
   * @summary Eliminar un circuito y sus rutas asociadas
   * @request DELETE:/ruta/circuito/delete/{id}
   * @secure
   * @response `200` `RutasRemoveCircuitoData` Mensaje de confirmación
   */
  export namespace RutasRemoveCircuito {
    export type RequestParams = {
      /** ID del circuito */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RutasRemoveCircuitoData;
  }
}

export namespace Viajes {
  /**
   * @description Busca por estado, ruta ocasional y modalidad. Filtra por rango de fechas, modalidad de servicio y tipo de viaje. Si el token es de un conductor, solo retorna sus viajes asignados.
   * @tags viajes
   * @name ViajesFindAll
   * @summary Obtener viajes con paginación, búsqueda y filtros
   * @request GET:/viaje/find-all
   * @secure
   * @response `200` `ViajesFindAllData`
   */
  export namespace ViajesFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por ruta ocasional */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /** Filtrar por modalidad de servicio */
      modalidadServicio?:
        | "regular"
        | "expreso"
        | "ejecutivo"
        | "especial"
        | "turismo"
        | "corporativo";
      /** Filtrar por tipo de ruta (ocasional, fija) */
      tipoRuta?: "ocasional" | "fija";
      /** Filtrar por estado del viaje */
      estado?: "programado" | "en_progreso" | "completado" | "cancelado";
      /** Filtrar por IDs de conductores (separados por coma) */
      conductoresId?: string[];
      /** Filtrar por ID de cliente */
      clienteId?: number;
      /** Filtrar por ID de ruta */
      rutaId?: number;
      /** Filtrar por IDs de vehículos (separados por coma) */
      vehiculosId?: string[];
      /** Filtrar por sentido del viaje */
      sentido?: "ida" | "vuelta" | "circuito";
      /** Filtrar por turno del viaje */
      turno?: "dia" | "noche";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindAllData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindAllLight
   * @summary Obtener viajes (formato ligero) con paginación, búsqueda y filtros
   * @request GET:/viaje/find-all-light
   * @secure
   * @response `200` `ViajesFindAllLightData`
   */
  export namespace ViajesFindAllLight {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por ruta ocasional */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /** Filtrar por modalidad de servicio */
      modalidadServicio?:
        | "regular"
        | "expreso"
        | "ejecutivo"
        | "especial"
        | "turismo"
        | "corporativo";
      /** Filtrar por tipo de ruta (ocasional, fija) */
      tipoRuta?: "ocasional" | "fija";
      /** Filtrar por estado del viaje */
      estado?: "programado" | "en_progreso" | "completado" | "cancelado";
      /** Filtrar por IDs de conductores (separados por coma) */
      conductoresId?: string[];
      /** Filtrar por ID de cliente */
      clienteId?: number;
      /** Filtrar por ID de ruta */
      rutaId?: number;
      /** Filtrar por IDs de vehículos (separados por coma) */
      vehiculosId?: string[];
      /** Filtrar por sentido del viaje */
      sentido?: "ida" | "vuelta" | "circuito";
      /** Filtrar por turno del viaje */
      turno?: "dia" | "noche";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindAllLightData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesValidarVehiculo
   * @summary Validar disponibilidad y requisitos de un vehículo para un horario programado
   * @request GET:/viaje/validar-vehiculo
   * @secure
   * @response `200` `ViajesValidarVehiculoData`
   */
  export namespace ViajesValidarVehiculo {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ID del vehículo a validar */
      vehiculoId: number;
      /**
       * Fecha de salida programada
       * @format date-time
       */
      fechaSalida: string;
      /**
       * Fecha de llegada programada
       * @format date-time
       */
      fechaLlegada: string;
      /** ID del viaje actual (para excluirlo de la validación de cruces) */
      viajeId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesValidarVehiculoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesValidarConductor
   * @summary Validar disponibilidad y requisitos de un conductor para un horario programado
   * @request GET:/viaje/validar-conductor
   * @secure
   * @response `200` `ViajesValidarConductorData`
   */
  export namespace ViajesValidarConductor {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ID del conductor a validar */
      conductorId: number;
      /**
       * Fecha de salida programada
       * @format date-time
       */
      fechaSalida: string;
      /**
       * Fecha de llegada programada
       * @format date-time
       */
      fechaLlegada: string;
      /** ID del viaje actual (para excluirlo de la validación de cruces) */
      viajeId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesValidarConductorData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindOne
   * @summary Obtener viaje por ID
   * @request GET:/viaje/find-one/{id}
   * @secure
   * @response `200` `ViajesFindOneData`
   */
  export namespace ViajesFindOne {
    export type RequestParams = {
      /** ID del viaje */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindOneData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindTrayecto
   * @summary Visualizar trayecto de un vehículo (paradas fijas y ocasionales)
   * @request GET:/viaje/{id}/trayecto
   * @secure
   * @response `200` `ViajesFindTrayectoData`
   */
  export namespace ViajesFindTrayecto {
    export type RequestParams = {
      /** ID del viaje */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindTrayectoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesCreate
   * @summary Crear un circuito de viajes (ida y vuelta)
   * @request POST:/viaje/create
   * @secure
   * @response `201` `ViajesCreateData` ViajeCircuito creado exitosamente.
   */
  export namespace ViajesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ViajeCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesCreateData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdate
   * @summary Actualizar un viaje individual
   * @request PATCH:/viaje/update/{id}
   * @secure
   * @response `200` `ViajesUpdateData`
   */
  export namespace ViajesUpdate {
    export type RequestParams = {
      /** ID del viaje */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRemove
   * @summary Eliminar logicamente un viaje individual y desligarlo
   * @request DELETE:/viaje/delete/{id}
   * @secure
   * @response `200` `ViajesRemoveData`
   */
  export namespace ViajesRemove {
    export type RequestParams = {
      /** ID del viaje */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRemoveData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindConductores
   * @summary Obtener todos los conductores de un viaje
   * @request GET:/viaje/{viajeId}/conductores
   * @secure
   * @response `200` `ViajesFindConductoresData`
   */
  export namespace ViajesFindConductores {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindConductoresData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindConductor
   * @summary Obtener un conductor específico de un viaje
   * @request GET:/viaje/{viajeId}/conductor/{conductorId}
   * @secure
   * @response `200` `ViajesFindConductorData`
   */
  export namespace ViajesFindConductor {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del conductor */
      conductorId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindConductorData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdateConductor
   * @summary Actualizar asignación de conductor
   * @request PATCH:/viaje/{viajeId}/conductor/{conductorId}
   * @secure
   * @response `200` `ViajesUpdateConductorData`
   */
  export namespace ViajesUpdateConductor {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del conductor */
      conductorId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeConductorUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateConductorData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRemoveConductor
   * @summary Remover conductor de un viaje
   * @request DELETE:/viaje/{viajeId}/conductor/{conductorId}
   * @secure
   * @response `200` `ViajesRemoveConductorData`
   */
  export namespace ViajesRemoveConductor {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del conductor */
      conductorId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRemoveConductorData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesAssignConductor
   * @summary Asignar un conductor a un viaje
   * @request POST:/viaje/conductor/assign
   * @secure
   * @response `201` `ViajesAssignConductorData`
   */
  export namespace ViajesAssignConductor {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ViajeConductorCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesAssignConductorData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindVehiculos
   * @summary Obtener todos los vehículos de un viaje
   * @request GET:/viaje/{viajeId}/vehiculos
   * @secure
   * @response `200` `ViajesFindVehiculosData`
   */
  export namespace ViajesFindVehiculos {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindVehiculosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindVehiculo
   * @summary Obtener un vehículo específico de un viaje
   * @request GET:/viaje/{viajeId}/vehiculo/{vehiculoId}
   * @secure
   * @response `200` `ViajesFindVehiculoData`
   */
  export namespace ViajesFindVehiculo {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del vehículo */
      vehiculoId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindVehiculoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdateVehiculo
   * @summary Actualizar asignación de vehículo
   * @request PATCH:/viaje/{viajeId}/vehiculo/{vehiculoId}
   * @secure
   * @response `200` `ViajesUpdateVehiculoData`
   */
  export namespace ViajesUpdateVehiculo {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del vehículo */
      vehiculoId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeVehiculoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateVehiculoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRemoveVehiculo
   * @summary Remover vehículo de un viaje
   * @request DELETE:/viaje/{viajeId}/vehiculo/{vehiculoId}
   * @secure
   * @response `200` `ViajesRemoveVehiculoData`
   */
  export namespace ViajesRemoveVehiculo {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
      /** ID del vehículo */
      vehiculoId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRemoveVehiculoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesAssignVehiculo
   * @summary Asignar un vehículo a un viaje
   * @request POST:/viaje/vehiculo/assign
   * @secure
   * @response `201` `ViajesAssignVehiculoData`
   */
  export namespace ViajesAssignVehiculo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ViajeVehiculoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesAssignVehiculoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindComentarios
   * @summary Obtener todos los comentarios de un viaje
   * @request GET:/viaje/{viajeId}/comentarios
   * @secure
   * @response `200` `ViajesFindComentariosData`
   */
  export namespace ViajesFindComentarios {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindComentariosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindComentario
   * @summary Obtener un comentario por ID
   * @request GET:/viaje/comentario/{id}
   * @secure
   * @response `200` `ViajesFindComentarioData`
   */
  export namespace ViajesFindComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindComentarioData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesCreateComentario
   * @summary Crear un nuevo comentario para un viaje
   * @request POST:/viaje/comentario/create
   * @secure
   * @response `201` `ViajesCreateComentarioData`
   */
  export namespace ViajesCreateComentario {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ViajeComentarioCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesCreateComentarioData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdateComentario
   * @summary Actualizar un comentario
   * @request PATCH:/viaje/comentario/update/{id}
   * @secure
   * @response `200` `ViajesUpdateComentarioData`
   */
  export namespace ViajesUpdateComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeComentarioUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateComentarioData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesDeleteComentario
   * @summary Eliminar un comentario
   * @request DELETE:/viaje/comentario/delete/{id}
   * @secure
   * @response `200` `ViajesDeleteComentarioData`
   */
  export namespace ViajesDeleteComentario {
    export type RequestParams = {
      /** ID del comentario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesDeleteComentarioData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindTramos
   * @summary Obtener todos los tramos de un viaje
   * @request GET:/viaje/{viajeId}/tramos
   * @secure
   * @response `200` `ViajesFindTramosData`
   */
  export namespace ViajesFindTramos {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindTramosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesGetHojaRuta
   * @summary Obtener los tramos formateados como hoja de ruta (trayectos entre puntos)
   * @request GET:/viaje/{viajeId}/hoja-ruta
   * @secure
   * @response `200` `ViajesGetHojaRutaData`
   */
  export namespace ViajesGetHojaRuta {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesGetHojaRutaData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRegistrarDescanso
   * @summary Registrar un descanso por parte del conductor
   * @request POST:/viaje/{viajeId}/registrar-descanso
   * @secure
   * @response `201` `ViajesRegistrarDescansoData`
   */
  export namespace ViajesRegistrarDescanso {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeRegistrarDescansoDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRegistrarDescansoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRegistrarSalida
   * @summary Registrar la salida del viaje (origen)
   * @request POST:/viaje/{viajeId}/registrar-salida
   * @secure
   * @response `201` `ViajesRegistrarSalidaData`
   */
  export namespace ViajesRegistrarSalida {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeRegistrarSalidaDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRegistrarSalidaData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRegistrarLlegada
   * @summary Registrar la llegada del viaje (destino)
   * @request POST:/viaje/{viajeId}/registrar-llegada
   * @secure
   * @response `201` `ViajesRegistrarLlegadaData`
   */
  export namespace ViajesRegistrarLlegada {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeRegistrarLlegadaDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRegistrarLlegadaData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRegistrarPunto
   * @summary Registrar el paso por un punto fijo programado
   * @request POST:/viaje/{viajeId}/registrar-punto
   * @secure
   * @response `201` `ViajesRegistrarPuntoData`
   */
  export namespace ViajesRegistrarPunto {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeRegistrarPuntoDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRegistrarPuntoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesRegistrarParada
   * @summary Registrar una parada ocasional no programada
   * @request POST:/viaje/{viajeId}/registrar-parada
   * @secure
   * @response `201` `ViajesRegistrarParadaData`
   */
  export namespace ViajesRegistrarParada {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeRegistrarParadaDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesRegistrarParadaData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesGetProximoTramo
   * @summary Obtener la sugerencia del próximo tramo basado en la ruta y el progreso actual
   * @request GET:/viaje/{viajeId}/proximo-tramo
   * @secure
   * @response `200` `ViajesGetProximoTramoData`
   */
  export namespace ViajesGetProximoTramo {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /** Tipo de tramo para el que se solicita sugerencia (origen, punto, parada, descanso, destino) */
      tipo?: "origen" | "punto" | "parada" | "descanso" | "destino";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesGetProximoTramoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdateTramo
   * @summary Actualizar un tramo
   * @request PATCH:/viaje/tramo/update/{id}
   * @secure
   * @response `200` `ViajesUpdateTramoData`
   */
  export namespace ViajesUpdateTramo {
    export type RequestParams = {
      /** ID del tramo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajeTramoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateTramoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesDeleteTramo
   * @summary Eliminar un tramo
   * @request DELETE:/viaje/tramo/delete/{id}
   * @secure
   * @response `200` `ViajesDeleteTramoData`
   */
  export namespace ViajesDeleteTramo {
    export type RequestParams = {
      /** ID del tramo */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesDeleteTramoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindPasajeros
   * @summary Obtener todos los pasajeros de un viaje
   * @request GET:/viaje/{viajeId}/pasajeros
   * @secure
   * @response `200` `ViajesFindPasajerosData`
   */
  export namespace ViajesFindPasajeros {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * ID del tramo en el que suben los pasajeros (viaje_tramos)
       * @example 123
       */
      viajeTramoId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindPasajerosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpsertPasajeros
   * @summary Agregar o actualizar pasajeros en un viaje
   * @request POST:/viaje/{viajeId}/pasajeros/upsert
   * @secure
   * @response `201` `ViajesUpsertPasajerosData`
   */
  export namespace ViajesUpsertPasajeros {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ViajePasajeroFillDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpsertPasajerosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesEscanearDnis
   * @summary Escanear imágenes de DNIs y marcar asistencia/registrar pasajeros automáticamente
   * @request POST:/viaje/{viajeId}/pasajeros/escanear-dnis
   * @secure
   * @response `201` `ViajesEscanearDnisData`
   */
  export namespace ViajesEscanearDnis {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * ID del tramo en el que suben los pasajeros (viaje_tramos)
       * @example 123
       */
      viajeTramoId?: number;
    };
    export type RequestBody = ViajeEscanearDnisDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesEscanearDnisData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesAbordarPasajeros
   * @summary Marcar abordaje de pasajeros (asistencia) y registrar movimientos en el tramo
   * @request POST:/viaje/{viajeId}/pasajeros/abordar-pasajeros
   * @secure
   * @response `201` `ViajesAbordarPasajerosData`
   */
  export namespace ViajesAbordarPasajeros {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * ID del tramo en el que suben los pasajeros (viaje_tramos)
       * @example 123
       */
      viajeTramoId?: number;
    };
    export type RequestBody = ViajePasajeroAbordarPasajerosDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesAbordarPasajerosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesAbordarPasajerosPorDni
   * @summary Marcar abordaje de pasajeros por DNI y registrar movimientos en el tramo
   * @request POST:/viaje/{viajeId}/pasajeros/abordar-por-dni
   * @secure
   * @response `201` `ViajesAbordarPasajerosPorDniData`
   */
  export namespace ViajesAbordarPasajerosPorDni {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * ID del tramo en el que suben los pasajeros (viaje_tramos)
       * @example 123
       */
      viajeTramoId?: number;
    };
    export type RequestBody = ViajePasajeroAbordarDnisDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesAbordarPasajerosPorDniData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesDesabordarPasajeros
   * @summary Registrar descenso de pasajeros en el tramo
   * @request POST:/viaje/{viajeId}/pasajeros/desabordar-pasajeros
   * @secure
   * @response `201` `ViajesDesabordarPasajerosData`
   */
  export namespace ViajesDesabordarPasajeros {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * ID del tramo en el que suben los pasajeros (viaje_tramos)
       * @example 123
       */
      viajeTramoId?: number;
    };
    export type RequestBody = ViajePasajeroDesabordarPasajerosDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesDesabordarPasajerosData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindAllChecklistItems
   * @summary Obtener todos los items del catálogo de checklist
   * @request GET:/viaje/checklist-item/find-all
   * @secure
   * @response `200` `ViajesFindAllChecklistItemsData`
   */
  export namespace ViajesFindAllChecklistItems {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindAllChecklistItemsData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindChecklistItem
   * @summary Obtener un item del catálogo por ID
   * @request GET:/viaje/checklist-item/{id}
   * @secure
   * @response `200` `ViajesFindChecklistItemData`
   */
  export namespace ViajesFindChecklistItem {
    export type RequestParams = {
      /** ID del item */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindChecklistItemData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesCreateChecklistItem
   * @summary Crear un nuevo item en el catálogo
   * @request POST:/viaje/checklist-item/create
   * @secure
   * @response `201` `ViajesCreateChecklistItemData`
   */
  export namespace ViajesCreateChecklistItem {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChecklistItemCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesCreateChecklistItemData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesUpdateChecklistItem
   * @summary Actualizar un item del catálogo
   * @request PATCH:/viaje/checklist-item/update/{id}
   * @secure
   * @response `200` `ViajesUpdateChecklistItemData`
   */
  export namespace ViajesUpdateChecklistItem {
    export type RequestParams = {
      /** ID del item */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ChecklistItemUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesUpdateChecklistItemData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesDeleteChecklistItem
   * @summary Eliminar un item del catálogo
   * @request DELETE:/viaje/checklist-item/delete/{id}
   * @secure
   * @response `200` `ViajesDeleteChecklistItemData`
   */
  export namespace ViajesDeleteChecklistItem {
    export type RequestParams = {
      /** ID del item */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesDeleteChecklistItemData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesFindChecklistByTipo
   * @summary Obtener un checklist de un viaje por tipo (salida/llegada)
   * @request GET:/viaje/{viajeId}/checklist
   * @secure
   * @response `200` `ViajesFindChecklistByTipoData`
   */
  export namespace ViajesFindChecklistByTipo {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de checklist (salida o llegada)
       * @example "salida"
       */
      tipo: "salida" | "llegada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesFindChecklistByTipoData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesVerifyChecklist
   * @summary Verificar y generar un checklist de viaje (salida/llegada) basado en la configuración actual
   * @request POST:/viaje/{viajeId}/checklist/verify
   * @secure
   * @response `200` `ViajesVerifyChecklistData`
   */
  export namespace ViajesVerifyChecklist {
    export type RequestParams = {
      /** ID del viaje */
      viajeId: number;
    };
    export type RequestQuery = {
      /**
       * Tipo de checklist (salida o llegada)
       * @example "salida"
       */
      tipo: "salida" | "llegada";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesVerifyChecklistData;
  }

  /**
   * No description
   * @tags viajes
   * @name ViajesDeleteChecklist
   * @summary Eliminar un checklist
   * @request DELETE:/viaje/checklist/delete/{id}
   * @secure
   * @response `200` `ViajesDeleteChecklistData`
   */
  export namespace ViajesDeleteChecklist {
    export type RequestParams = {
      /** ID del checklist */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ViajesDeleteChecklistData;
  }
}

export namespace Clientes {
  /**
   * No description
   * @tags clientes
   * @name ClientesFindAll
   * @summary Obtener clientes con paginación, búsqueda y filtros
   * @request GET:/cliente/find-all
   * @secure
   * @response `200` `ClientesFindAllData`
   */
  export namespace ClientesFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por nombre, DNI, teléfono o email del cliente */
      search?: string;
      /** Fecha de inicio para filtrar por rango (formato: YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por rango (formato: YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por tipo de documento
       * @example "DNI"
       */
      tipoDocumento?: "DNI" | "RUC";
      /**
       * Filtrar por tipo de cliente
       * @example "personal"
       */
      tipo?: "personal" | "corporativo";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindAllData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindOne
   * @summary Obtener un cliente por ID
   * @request GET:/cliente/find-one/{id}
   * @secure
   * @response `200` `ClientesFindOneData`
   */
  export namespace ClientesFindOne {
    export type RequestParams = {
      /** ID del cliente */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindOneData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesCreate
   * @summary Crear un nuevo cliente
   * @request POST:/cliente/create
   * @secure
   * @response `200` `ClientesCreateData`
   */
  export namespace ClientesCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ClienteCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesCreateData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesUpdate
   * @summary Actualizar un cliente
   * @request PATCH:/cliente/update/{id}
   * @secure
   * @response `200` `ClientesUpdateData`
   */
  export namespace ClientesUpdate {
    export type RequestParams = {
      /** ID del cliente */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ClienteUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesUpdateData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesRemove
   * @summary Eliminar un cliente
   * @request DELETE:/cliente/delete/{id}
   * @secure
   * @response `200` `ClientesRemoveData`
   */
  export namespace ClientesRemove {
    export type RequestParams = {
      /** ID del cliente */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesRemoveData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/cliente/documento/{id}
   * @secure
   * @response `200` `ClientesFindDocumentoData`
   */
  export namespace ClientesFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindDocumentoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesCreateDocumento
   * @summary Crear un nuevo documento de cliente
   * @request POST:/cliente/documento/create
   * @secure
   * @response `201` `ClientesCreateDocumentoData`
   */
  export namespace ClientesCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ClienteDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesCreateDocumentoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesUpdateDocumento
   * @summary Actualizar un documento de cliente
   * @request PATCH:/cliente/documento/update/{id}
   * @secure
   * @response `200` `ClientesUpdateDocumentoData`
   */
  export namespace ClientesUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ClienteDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesUpdateDocumentoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesDeleteDocumento
   * @summary Eliminar un documento de cliente
   * @request DELETE:/cliente/documento/delete/{id}
   * @secure
   * @response `200` `ClientesDeleteDocumentoData`
   */
  export namespace ClientesDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesDeleteDocumentoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindAllPasajeros
   * @summary Obtener pasajeros con paginación, búsqueda y filtro por cliente
   * @request GET:/cliente/pasajero/find-all
   * @secure
   * @response `200` `ClientesFindAllPasajerosData`
   */
  export namespace ClientesFindAllPasajeros {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @example 1
       */
      page?: number;
      /**
       * Límite de items por página
       * @example 10
       */
      limit?: number;
      /** Término de búsqueda (DNI, nombres, apellidos) */
      search?: string;
      /**
       * ID del cliente para filtrar
       * @example 1
       */
      clienteId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindAllPasajerosData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindPasajero
   * @summary Obtener un pasajero por ID
   * @request GET:/cliente/pasajero/find-one/{id}
   * @secure
   * @response `200` `ClientesFindPasajeroData`
   */
  export namespace ClientesFindPasajero {
    export type RequestParams = {
      /** ID del pasajero */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindPasajeroData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesCreatePasajero
   * @summary Crear un nuevo pasajero
   * @request POST:/cliente/pasajero/create
   * @secure
   * @response `201` `ClientesCreatePasajeroData`
   */
  export namespace ClientesCreatePasajero {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PasajeroCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesCreatePasajeroData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesUpdatePasajero
   * @summary Actualizar un pasajero
   * @request PATCH:/cliente/pasajero/update/{id}
   * @secure
   * @response `200` `ClientesUpdatePasajeroData`
   */
  export namespace ClientesUpdatePasajero {
    export type RequestParams = {
      /** ID del pasajero */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PasajeroUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesUpdatePasajeroData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesDeletePasajero
   * @summary Eliminar un pasajero
   * @request DELETE:/cliente/pasajero/delete/{id}
   * @secure
   * @response `200` `ClientesDeletePasajeroData`
   */
  export namespace ClientesDeletePasajero {
    export type RequestParams = {
      /** ID del pasajero */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesDeletePasajeroData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindAllEncargados
   * @summary Obtener encargados con paginación, búsqueda y filtro por cliente
   * @request GET:/cliente/encargado/find-all
   * @secure
   * @response `200` `ClientesFindAllEncargadosData`
   */
  export namespace ClientesFindAllEncargados {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @example 1
       */
      page?: number;
      /**
       * Límite de items por página
       * @example 10
       */
      limit?: number;
      /** Término de búsqueda (DNI, nombres, apellidos) */
      search?: string;
      /**
       * ID del cliente para filtrar
       * @example 1
       */
      clienteId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindAllEncargadosData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindEncargado
   * @summary Obtener un encargado por ID
   * @request GET:/cliente/encargado/find-one/{id}
   * @secure
   * @response `200` `ClientesFindEncargadoData`
   */
  export namespace ClientesFindEncargado {
    export type RequestParams = {
      /** ID del encargado */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindEncargadoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesCreateEncargado
   * @summary Crear un nuevo encargado
   * @request POST:/cliente/encargado/create
   * @secure
   * @response `201` `ClientesCreateEncargadoData`
   */
  export namespace ClientesCreateEncargado {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EncargadoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesCreateEncargadoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesUpdateEncargado
   * @summary Actualizar un encargado
   * @request PATCH:/cliente/encargado/update/{id}
   * @secure
   * @response `200` `ClientesUpdateEncargadoData`
   */
  export namespace ClientesUpdateEncargado {
    export type RequestParams = {
      /** ID del encargado */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = EncargadoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesUpdateEncargadoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesDeleteEncargado
   * @summary Eliminar un encargado
   * @request DELETE:/cliente/encargado/delete/{id}
   * @secure
   * @response `200` `ClientesDeleteEncargadoData`
   */
  export namespace ClientesDeleteEncargado {
    export type RequestParams = {
      /** ID del encargado */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesDeleteEncargadoData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindAllEntidades
   * @summary Obtener entidades con paginación, búsqueda y filtro por cliente
   * @request GET:/cliente/entidad/find-all
   * @secure
   * @response `200` `ClientesFindAllEntidadesData`
   */
  export namespace ClientesFindAllEntidades {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @example 1
       */
      page?: number;
      /**
       * Límite de items por página
       * @example 10
       */
      limit?: number;
      /** Término de búsqueda (nombre del servicio) */
      search?: string;
      /**
       * ID del cliente para filtrar
       * @example 1
       */
      clienteId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindAllEntidadesData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesFindEntidad
   * @summary Obtener una entidad por ID
   * @request GET:/cliente/entidad/find-one/{id}
   * @secure
   * @response `200` `ClientesFindEntidadData`
   */
  export namespace ClientesFindEntidad {
    export type RequestParams = {
      /** ID de la entidad */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesFindEntidadData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesCreateEntidad
   * @summary Crear una nueva entidad
   * @request POST:/cliente/entidad/create
   * @secure
   * @response `201` `ClientesCreateEntidadData`
   */
  export namespace ClientesCreateEntidad {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = EntidadCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesCreateEntidadData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesUpdateEntidad
   * @summary Actualizar una entidad
   * @request PATCH:/cliente/entidad/update/{id}
   * @secure
   * @response `200` `ClientesUpdateEntidadData`
   */
  export namespace ClientesUpdateEntidad {
    export type RequestParams = {
      /** ID de la entidad */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = EntidadUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesUpdateEntidadData;
  }

  /**
   * No description
   * @tags clientes
   * @name ClientesDeleteEntidad
   * @summary Eliminar una entidad
   * @request DELETE:/cliente/entidad/delete/{id}
   * @secure
   * @response `200` `ClientesDeleteEntidadData`
   */
  export namespace ClientesDeleteEntidad {
    export type RequestParams = {
      /** ID de la entidad */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ClientesDeleteEntidadData;
  }
}

export namespace Talleres {
  /**
   * No description
   * @tags talleres
   * @name TalleresCreate
   * @summary Crear un nuevo taller
   * @request POST:/taller/create
   * @secure
   * @response `201` `TalleresCreateData`
   */
  export namespace TalleresCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TallerCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresCreateData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindAll
   * @summary Listar talleres de forma paginada
   * @request GET:/taller/find-all
   * @secure
   * @response `200` `TalleresFindAllData`
   */
  export namespace TalleresFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página (comienza en 1)
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Cantidad de elementos por página
       * @default 10
       * @example 10
       */
      limit?: number;
      /** Búsqueda por razón social, nombre comercial, RUC, teléfono o email */
      search?: string;
      /** Fecha de inicio para filtrar por fecha de creación (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin para filtrar por fecha de creación (YYYY-MM-DD) */
      fechaFin?: string;
      /**
       * Filtrar por tipo de taller
       * @example "interno"
       */
      tipo?: "interno" | "externo";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindAllData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindOne
   * @summary Obtener un taller por ID
   * @request GET:/taller/find-one/{id}
   * @secure
   * @response `200` `TalleresFindOneData`
   */
  export namespace TalleresFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindOneData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindSucursalesByTaller
   * @summary Obtener todas las sucursales de un taller
   * @request GET:/taller/{id}/sucursales
   * @secure
   * @response `200` `TalleresFindSucursalesByTallerData`
   */
  export namespace TalleresFindSucursalesByTaller {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindSucursalesByTallerData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresUpdate
   * @summary Actualizar un taller por ID
   * @request PATCH:/taller/update/{id}
   * @secure
   * @response `200` `TalleresUpdateData`
   */
  export namespace TalleresUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = TallerUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresUpdateData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresRemove
   * @summary Eliminar un taller por ID
   * @request DELETE:/taller/delete/{id}
   * @secure
   * @response `200` `TalleresRemoveData`
   */
  export namespace TalleresRemove {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresRemoveData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresCreateSucursal
   * @summary Crear una nueva sucursal de taller
   * @request POST:/taller/sucursales/create
   * @secure
   * @response `201` `TalleresCreateSucursalData`
   */
  export namespace TalleresCreateSucursal {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SucursalCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresCreateSucursalData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindAllSucursalesPaginated
   * @summary Listar sucursales de forma paginada
   * @request GET:/taller/sucursales/find-all-paginated
   * @secure
   * @response `200` `TalleresFindAllSucursalesPaginatedData`
   */
  export namespace TalleresFindAllSucursalesPaginated {
    export type RequestParams = {};
    export type RequestQuery = {
      /** @default 1 */
      page?: number;
      /** @default 10 */
      limit?: number;
      /** Buscar por nombre o dirección */
      search?: string;
      /** Fecha de inicio (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindAllSucursalesPaginatedData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindAllSucursales
   * @summary Obtener todas las sucursales de talleres disponibles
   * @request GET:/taller/sucursales/find-all
   * @secure
   * @response `200` `TalleresFindAllSucursalesData`
   */
  export namespace TalleresFindAllSucursales {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindAllSucursalesData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresFindOneSucursal
   * @summary Obtener una sucursal por ID
   * @request GET:/taller/sucursales/find-one/{id}
   * @secure
   * @response `200` `TalleresFindOneSucursalData`
   */
  export namespace TalleresFindOneSucursal {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresFindOneSucursalData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresUpdateSucursal
   * @summary Actualizar una sucursal por ID
   * @request PATCH:/taller/sucursales/update/{id}
   * @secure
   * @response `200` `TalleresUpdateSucursalData`
   */
  export namespace TalleresUpdateSucursal {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = SucursalUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresUpdateSucursalData;
  }

  /**
   * No description
   * @tags talleres
   * @name TalleresRemoveSucursal
   * @summary Eliminar una sucursal por ID
   * @request DELETE:/taller/sucursales/delete/{id}
   * @secure
   * @response `200` `TalleresRemoveSucursalData`
   */
  export namespace TalleresRemoveSucursal {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TalleresRemoveSucursalData;
  }
}

export namespace Reportes {
  /**
   * No description
   * @tags reportes
   * @name ReportesGetViajesDetalladosPorVehiculo
   * @summary Viajes detallados de un vehículo específico
   * @request GET:/reportes/viajes-detallados/vehiculo/{id}
   * @secure
   * @response `200` `ReportesGetViajesDetalladosPorVehiculoData` Lista de viajes detallados
   */
  export namespace ReportesGetViajesDetalladosPorVehiculo {
    export type RequestParams = {
      /** ID del vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** Fecha de inicio del reporte (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin del reporte (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportesGetViajesDetalladosPorVehiculoData;
  }

  /**
   * No description
   * @tags reportes
   * @name ReportesGetViajesDetalladosPorConductor
   * @summary Viajes detallados de un conductor específico
   * @request GET:/reportes/viajes-detallados/conductor/{id}
   * @secure
   * @response `200` `ReportesGetViajesDetalladosPorConductorData` Lista de viajes detallados
   */
  export namespace ReportesGetViajesDetalladosPorConductor {
    export type RequestParams = {
      /** ID del conductor */
      id: number;
    };
    export type RequestQuery = {
      /** Fecha de inicio del reporte (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin del reporte (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportesGetViajesDetalladosPorConductorData;
  }

  /**
   * No description
   * @tags reportes
   * @name ReportesGetViajesDetalladosPorCliente
   * @summary Viajes detallados de un cliente específico
   * @request GET:/reportes/viajes-detallados/cliente/{id}
   * @secure
   * @response `200` `ReportesGetViajesDetalladosPorClienteData` Lista de viajes detallados
   */
  export namespace ReportesGetViajesDetalladosPorCliente {
    export type RequestParams = {
      /** ID del cliente */
      id: number;
    };
    export type RequestQuery = {
      /** Fecha de inicio del reporte (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin del reporte (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportesGetViajesDetalladosPorClienteData;
  }

  /**
   * No description
   * @tags reportes
   * @name ReportesGetMantenimientosDetalladosPorVehiculo
   * @summary Mantenimientos detallados de un vehículo específico
   * @request GET:/reportes/mantenimientos-detallados/vehiculo/{id}
   * @secure
   * @response `200` `ReportesGetMantenimientosDetalladosPorVehiculoData` Lista de mantenimientos detallados
   */
  export namespace ReportesGetMantenimientosDetalladosPorVehiculo {
    export type RequestParams = {
      /** ID del vehículo */
      id: number;
    };
    export type RequestQuery = {
      /** Fecha de inicio del reporte (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin del reporte (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      ReportesGetMantenimientosDetalladosPorVehiculoData;
  }

  /**
   * No description
   * @tags reportes
   * @name ReportesGetMantenimientosDetalladosPorTaller
   * @summary Mantenimientos detallados de un taller específico
   * @request GET:/reportes/mantenimientos-detallados/taller/{id}
   * @secure
   * @response `200` `ReportesGetMantenimientosDetalladosPorTallerData` Lista de mantenimientos detallados
   */
  export namespace ReportesGetMantenimientosDetalladosPorTaller {
    export type RequestParams = {
      /** ID del taller */
      id: number;
    };
    export type RequestQuery = {
      /** Fecha de inicio del reporte (YYYY-MM-DD) */
      fechaInicio?: string;
      /** Fecha de fin del reporte (YYYY-MM-DD) */
      fechaFin?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportesGetMantenimientosDetalladosPorTallerData;
  }

  /**
   * No description
   * @tags reportes
   * @name ReportesGetReporteConductores
   * @summary Reporte general de conductores con vencimientos
   * @request GET:/reportes/conductores/general
   * @secure
   * @response `200` `ReportesGetReporteConductoresData` Lista general de conductores con vencimientos
   */
  export namespace ReportesGetReporteConductores {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ReportesGetReporteConductoresData;
  }
}

export namespace Propietarios {
  /**
   * No description
   * @tags propietarios
   * @name PropietariosFindAll
   * @summary Obtener propietarios con paginación, búsqueda y filtros
   * @request GET:/propietario/find-all
   * @secure
   * @response `200` `PropietariosFindAllData`
   */
  export namespace PropietariosFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @example 1
       */
      page?: number;
      /**
       * Registros por página
       * @example 10
       */
      limit?: number;
      /**
       * Búsqueda por nombre, dni, ruc, email, teléfono
       * @example "Juan"
       */
      search?: string;
      /**
       * Fecha inicio
       * @example "2023-01-01"
       */
      fechaInicio?: string;
      /**
       * Fecha fin
       * @example "2023-12-31"
       */
      fechaFin?: string;
      /** Filtrar por tipo de documento */
      tipoDocumento?: "DNI" | "RUC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosFindAllData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosFindOne
   * @summary Obtener un propietario por ID
   * @request GET:/propietario/find-one/{id}
   * @secure
   * @response `200` `PropietariosFindOneData`
   */
  export namespace PropietariosFindOne {
    export type RequestParams = {
      /** ID del propietario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosFindOneData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosCreate
   * @summary Crear un nuevo propietario
   * @request POST:/propietario/create
   * @secure
   * @response `200` `PropietariosCreateData`
   */
  export namespace PropietariosCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PropietarioCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosCreateData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosUpdate
   * @summary Actualizar un propietario
   * @request PATCH:/propietario/update/{id}
   * @secure
   * @response `200` `PropietariosUpdateData`
   */
  export namespace PropietariosUpdate {
    export type RequestParams = {
      /** ID del propietario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PropietarioUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosUpdateData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosRemove
   * @summary Eliminar un propietario
   * @request DELETE:/propietario/delete/{id}
   * @secure
   * @response `200` `PropietariosRemoveData`
   */
  export namespace PropietariosRemove {
    export type RequestParams = {
      /** ID del propietario */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosRemoveData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/propietario/documento/{id}
   * @secure
   * @response `200` `PropietariosFindDocumentoData`
   */
  export namespace PropietariosFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosFindDocumentoData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosCreateDocumento
   * @summary Crear un nuevo documento de propietario
   * @request POST:/propietario/documento/create
   * @secure
   * @response `201` `PropietariosCreateDocumentoData`
   */
  export namespace PropietariosCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PropietarioDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosCreateDocumentoData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosUpdateDocumento
   * @summary Actualizar un documento de propietario
   * @request PATCH:/propietario/documento/update/{id}
   * @secure
   * @response `200` `PropietariosUpdateDocumentoData`
   */
  export namespace PropietariosUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = PropietarioDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosUpdateDocumentoData;
  }

  /**
   * No description
   * @tags propietarios
   * @name PropietariosDeleteDocumento
   * @summary Eliminar un documento de propietario
   * @request DELETE:/propietario/documento/delete/{id}
   * @secure
   * @response `200` `PropietariosDeleteDocumentoData`
   */
  export namespace PropietariosDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PropietariosDeleteDocumentoData;
  }
}

export namespace Proveedores {
  /**
   * No description
   * @tags proveedores
   * @name ProveedoresFindAll
   * @summary Obtener proveedores con paginación, búsqueda y filtros
   * @request GET:/proveedor/find-all
   * @secure
   * @response `200` `ProveedoresFindAllData`
   */
  export namespace ProveedoresFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Número de página
       * @example 1
       */
      page?: number;
      /**
       * Registros por página
       * @example 10
       */
      limit?: number;
      /**
       * Búsqueda por nombre, dni, ruc, email, teléfono
       * @example "Juan"
       */
      search?: string;
      /**
       * Fecha inicio
       * @example "2023-01-01"
       */
      fechaInicio?: string;
      /**
       * Fecha fin
       * @example "2023-12-31"
       */
      fechaFin?: string;
      /** Filtrar por tipo de documento */
      tipoDocumento?: "DNI" | "RUC";
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresFindAllData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresFindOne
   * @summary Obtener un proveedor por ID
   * @request GET:/proveedor/find-one/{id}
   * @secure
   * @response `200` `ProveedoresFindOneData`
   */
  export namespace ProveedoresFindOne {
    export type RequestParams = {
      /** ID del proveedor */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresFindOneData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresCreate
   * @summary Crear un nuevo proveedor
   * @request POST:/proveedor/create
   * @secure
   * @response `200` `ProveedoresCreateData`
   */
  export namespace ProveedoresCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProveedorCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresCreateData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresUpdate
   * @summary Actualizar un proveedor
   * @request PATCH:/proveedor/update/{id}
   * @secure
   * @response `200` `ProveedoresUpdateData`
   */
  export namespace ProveedoresUpdate {
    export type RequestParams = {
      /** ID del proveedor */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ProveedorUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresUpdateData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresRemove
   * @summary Eliminar un proveedor
   * @request DELETE:/proveedor/delete/{id}
   * @secure
   * @response `200` `ProveedoresRemoveData`
   */
  export namespace ProveedoresRemove {
    export type RequestParams = {
      /** ID del proveedor */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresRemoveData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresFindDocumento
   * @summary Obtener un documento por ID
   * @request GET:/proveedor/documento/{id}
   * @secure
   * @response `200` `ProveedoresFindDocumentoData`
   */
  export namespace ProveedoresFindDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresFindDocumentoData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresCreateDocumento
   * @summary Crear un nuevo documento de proveedor
   * @request POST:/proveedor/documento/create
   * @secure
   * @response `201` `ProveedoresCreateDocumentoData`
   */
  export namespace ProveedoresCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProveedorDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresCreateDocumentoData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresUpdateDocumento
   * @summary Actualizar un documento de proveedor
   * @request PATCH:/proveedor/documento/update/{id}
   * @secure
   * @response `200` `ProveedoresUpdateDocumentoData`
   */
  export namespace ProveedoresUpdateDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = ProveedorDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresUpdateDocumentoData;
  }

  /**
   * No description
   * @tags proveedores
   * @name ProveedoresDeleteDocumento
   * @summary Eliminar un documento de proveedor
   * @request DELETE:/proveedor/documento/delete/{id}
   * @secure
   * @response `200` `ProveedoresDeleteDocumentoData`
   */
  export namespace ProveedoresDeleteDocumento {
    export type RequestParams = {
      /** ID del documento */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = ProveedoresDeleteDocumentoData;
  }
}

export namespace Alquileres {
  /**
   * No description
   * @tags alquileres
   * @name AlquileresFindAll
   * @summary Listar todos los alquileres (paginado)
   * @request GET:/admin/alquileres
   * @secure
   * @response `200` `AlquileresFindAllData`
   */
  export namespace AlquileresFindAll {
    export type RequestParams = {};
    export type RequestQuery = {
      search?: string;
      /** Filtrar por estado */
      estado?: "activo" | "finalizado" | "cancelado";
      clienteId?: number;
      /** Filtrar por tipo */
      tipo?: "maquina_seca" | "maquina_operada";
      conductorId?: number;
      vehiculoId?: number;
      fechaInicio?: string;
      fechaFin?: string;
      /** @default 1 */
      page?: number;
      /** @default 10 */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresFindAllData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresCreate
   * @summary Crear un nuevo alquiler
   * @request POST:/admin/alquileres
   * @secure
   * @response `201` `AlquileresCreateData`
   */
  export namespace AlquileresCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AlquilerCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresCreateData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresValidarVehiculo
   * @summary Validar disponibilidad y estado del vehículo para alquiler
   * @request GET:/admin/alquileres/validar-vehiculo
   * @secure
   * @response `200` `AlquileresValidarVehiculoData`
   */
  export namespace AlquileresValidarVehiculo {
    export type RequestParams = {};
    export type RequestQuery = {
      /** ID del vehículo a validar */
      vehiculoId: number;
      /**
       * Fecha de inicio del alquiler
       * @format date-time
       */
      fechaInicio: string;
      /**
       * Fecha de fin del alquiler
       * @format date-time
       */
      fechaFin?: string;
      /** ID del alquiler actual (para excluirlo de la validación de cruces) */
      alquilerId?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresValidarVehiculoData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresFindOne
   * @summary Obtener un alquiler por ID
   * @request GET:/admin/alquileres/{id}
   * @secure
   * @response `200` `AlquileresFindOneData`
   */
  export namespace AlquileresFindOne {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresFindOneData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresUpdate
   * @summary Actualizar un alquiler
   * @request PUT:/admin/alquileres/{id}
   * @secure
   * @response `200` `AlquileresUpdateData`
   */
  export namespace AlquileresUpdate {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AlquilerUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresUpdateData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresDelete
   * @summary Eliminar un alquiler
   * @request DELETE:/admin/alquileres/{id}
   * @secure
   * @response `200` `AlquileresDeleteData`
   */
  export namespace AlquileresDelete {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresDeleteData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresTerminar
   * @summary Finalizar un alquiler (fecha fin, kilometraje final y monto final)
   * @request PUT:/admin/alquileres/{id}/terminar
   * @secure
   * @response `200` `AlquileresTerminarData`
   */
  export namespace AlquileresTerminar {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AlquilerTerminarDto;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresTerminarData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresFindDocumento
   * @summary Obtener un documento de alquiler por ID
   * @request GET:/admin/alquileres/documento/{id}
   * @secure
   * @response `200` `AlquileresFindDocumentoData`
   */
  export namespace AlquileresFindDocumento {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresFindDocumentoData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresCreateDocumento
   * @summary Crear un documento de alquiler
   * @request POST:/admin/alquileres/documento/create
   * @secure
   * @response `201` `AlquileresCreateDocumentoData`
   */
  export namespace AlquileresCreateDocumento {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AlquilerDocumentoCreateDto;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresCreateDocumentoData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresUpdateDocumento
   * @summary Actualizar un documento de alquiler
   * @request PUT:/admin/alquileres/documento/update/{id}
   * @secure
   * @response `200` `AlquileresUpdateDocumentoData`
   */
  export namespace AlquileresUpdateDocumento {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AlquilerDocumentoUpdateDto;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresUpdateDocumentoData;
  }

  /**
   * No description
   * @tags alquileres
   * @name AlquileresDeleteDocumento
   * @summary Eliminar un documento de alquiler
   * @request DELETE:/admin/alquileres/documento/delete/{id}
   * @secure
   * @response `200` `AlquileresDeleteDocumentoData`
   */
  export namespace AlquileresDeleteDocumento {
    export type RequestParams = {
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = AlquileresDeleteDocumentoData;
  }
}

export namespace Storage {
  /**
   * No description
   * @tags storage
   * @name StorageUpload
   * @summary Subir un archivo (imagen, documento, video, etc.)
   * @request POST:/storage
   * @secure
   * @response `200` `StorageUploadData`
   */
  export namespace StorageUpload {
    export type RequestParams = {};
    export type RequestQuery = {
      folder: string;
    };
    export type RequestBody = StorageUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = StorageUploadData;
  }

  /**
   * No description
   * @tags storage
   * @name StorageDelete
   * @summary Eliminar un archivo
   * @request DELETE:/storage/{publicId}
   * @secure
   * @response `200` `StorageDeleteData`
   */
  export namespace StorageDelete {
    export type RequestParams = {
      publicId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StorageDeleteData;
  }

  /**
   * No description
   * @tags storage
   * @name StorageDownload
   * @summary Proxy para descargar/visualizar archivos de Azure (CORS-safe)
   * @request GET:/storage/download-file
   * @secure
   * @response `200` `StorageDownloadData`
   */
  export namespace StorageDownload {
    export type RequestParams = {};
    export type RequestQuery = {
      path: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = StorageDownloadData;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API Documentation
 * @version 1.0
 * @contact
 *
 * API endpoints for backend-transporte<br><a href="/api-json" target="_blank">Download Swagger JSON</a>
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  app = {
    /**
     * No description
     *
     * @tags App
     * @name AppGetHello
     * @request GET:/
     * @response `200` `AppGetHelloData`
     */
    getHello: (params: RequestParams = {}) =>
      this.http.request<AppGetHelloData, any>({
        path: `/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags App
     * @name AppTestError
     * @request GET:/test-error
     * @response `200` `AppTestErrorData`
     */
    testError: (params: RequestParams = {}) =>
      this.http.request<AppTestErrorData, any>({
        path: `/test-error`,
        method: "GET",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @tags auth
     * @name AuthLogin
     * @summary Login de usuario
     * @request POST:/auth/login
     * @response `200` `AuthLoginData`
     * @response `401` `void` Credenciales inválidas
     */
    login: (data: LoginDto, params: RequestParams = {}) =>
      this.http.request<AuthLoginData, void>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags auth
     * @name AuthLoginConductor
     * @summary Login de conductor
     * @request POST:/auth/conductor/login
     * @response `200` `AuthLoginConductorData`
     * @response `401` `void` Credenciales inválidas
     */
    loginConductor: (data: ConductorLoginDto, params: RequestParams = {}) =>
      this.http.request<AuthLoginConductorData, void>({
        path: `/auth/conductor/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  usuarios = {
    /**
     * @description Busca por nombre, apellido o email. Filtra por rango de fechas.
     *
     * @tags usuarios
     * @name UsuariosFindAll
     * @summary Obtener usuarios con./dto/usuario/usuario-result.dtofiltros
     * @request GET:/usuario/find-all
     * @secure
     * @response `200` `UsuariosFindAllData`
     */
    findAll: (
      query: UsuariosFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosFindAllData, any>({
        path: `/usuario/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosFindOne
     * @summary Get a user by ID
     * @request GET:/usuario/find-one/{id}
     * @secure
     * @response `200` `UsuariosFindOneData`
     */
    findOne: (
      { id, ...query }: UsuariosFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosFindOneData, any>({
        path: `/usuario/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosCreate
     * @summary Create a new user
     * @request POST:/usuario/create
     * @secure
     * @response `200` `UsuariosCreateData`
     */
    create: (data: UsuarioCreateDto, params: RequestParams = {}) =>
      this.http.request<UsuariosCreateData, any>({
        path: `/usuario/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosUpdate
     * @summary Update a user
     * @request PATCH:/usuario/update/{id}
     * @secure
     * @response `200` `UsuariosUpdateData`
     */
    update: (
      { id, ...query }: UsuariosUpdateParams,
      data: UsuarioUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosUpdateData, any>({
        path: `/usuario/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosRemove
     * @summary Delete a user
     * @request DELETE:/usuario/delete/{id}
     * @secure
     * @response `200` `UsuariosRemoveData`
     */
    remove: (
      { id, ...query }: UsuariosRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosRemoveData, any>({
        path: `/usuario/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosFindFirmas
     * @summary Obtener las firmas de un usuario
     * @request GET:/usuario/find-firmas/{id}
     * @secure
     * @response `200` `UsuariosFindFirmasData`
     */
    findFirmas: (
      { id, ...query }: UsuariosFindFirmasParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosFindFirmasData, any>({
        path: `/usuario/find-firmas/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/usuario/documento/{id}
     * @secure
     * @response `200` `UsuariosFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: UsuariosFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosFindDocumentoData, any>({
        path: `/usuario/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosCreateDocumento
     * @summary Crear un nuevo documento de usuario
     * @request POST:/usuario/documento/create
     * @secure
     * @response `201` `UsuariosCreateDocumentoData`
     */
    createDocumento: (
      data: UsuarioDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosCreateDocumentoData, any>({
        path: `/usuario/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosUpdateDocumento
     * @summary Actualizar un documento de usuario
     * @request PATCH:/usuario/documento/update/{id}
     * @secure
     * @response `200` `UsuariosUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: UsuariosUpdateDocumentoParams,
      data: UsuarioDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosUpdateDocumentoData, any>({
        path: `/usuario/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags usuarios
     * @name UsuariosDeleteDocumento
     * @summary Eliminar un documento de usuario
     * @request DELETE:/usuario/documento/delete/{id}
     * @secure
     * @response `200` `UsuariosDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: UsuariosDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<UsuariosDeleteDocumentoData, any>({
        path: `/usuario/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  conductores = {
    /**
     * @description Busca por nombre, DNI o número de licencia. Filtra por rango de fechas.
     *
     * @tags conductores
     * @name ConductoresFindAll
     * @summary Obtener conductores con paginación, búsqueda y filtros
     * @request GET:/conductor/find-all
     * @secure
     * @response `200` `ConductoresFindAllData`
     */
    findAll: (
      query: ConductoresFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresFindAllData, any>({
        path: `/conductor/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresFindAllEstadoDocumentos
     * @summary Obtener estado de documentos de conductores (activo/caducado/nulo)
     * @request GET:/conductor/estado-documentos
     * @secure
     * @response `200` `ConductoresFindAllEstadoDocumentosData`
     */
    findAllEstadoDocumentos: (
      query: ConductoresFindAllEstadoDocumentosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresFindAllEstadoDocumentosData, any>({
        path: `/conductor/estado-documentos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresFindOne
     * @summary Get a driver by ID
     * @request GET:/conductor/find-one/{id}
     * @secure
     * @response `200` `ConductoresFindOneData`
     */
    findOne: (
      { id, ...query }: ConductoresFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresFindOneData, any>({
        path: `/conductor/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresCreate
     * @summary Create a new driver
     * @request POST:/conductor/create
     * @secure
     * @response `200` `ConductoresCreateData`
     */
    create: (data: ConductorCreateDto, params: RequestParams = {}) =>
      this.http.request<ConductoresCreateData, any>({
        path: `/conductor/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresUpdate
     * @summary Update a driver
     * @request PATCH:/conductor/update/{id}
     * @secure
     * @response `200` `ConductoresUpdateData`
     */
    update: (
      { id, ...query }: ConductoresUpdateParams,
      data: ConductorUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresUpdateData, any>({
        path: `/conductor/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresRemove
     * @summary Delete a driver
     * @request DELETE:/conductor/delete/{id}
     * @secure
     * @response `200` `ConductoresRemoveData`
     */
    remove: (
      { id, ...query }: ConductoresRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresRemoveData, any>({
        path: `/conductor/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/conductor/documento/{id}
     * @secure
     * @response `200` `ConductoresFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: ConductoresFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresFindDocumentoData, any>({
        path: `/conductor/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresCreateDocumento
     * @summary Crear un nuevo documento de conductor
     * @request POST:/conductor/documento/create
     * @secure
     * @response `201` `ConductoresCreateDocumentoData`
     */
    createDocumento: (
      data: ConductorDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresCreateDocumentoData, any>({
        path: `/conductor/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresUpdateDocumento
     * @summary Actualizar un documento de conductor
     * @request PATCH:/conductor/documento/update/{id}
     * @secure
     * @response `200` `ConductoresUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: ConductoresUpdateDocumentoParams,
      data: ConductorDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresUpdateDocumentoData, any>({
        path: `/conductor/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresDeleteDocumento
     * @summary Eliminar un documento de conductor
     * @request DELETE:/conductor/documento/delete/{id}
     * @secure
     * @response `200` `ConductoresDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: ConductoresDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresDeleteDocumentoData, any>({
        path: `/conductor/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags conductores
     * @name ConductoresDownload
     * @summary Descargar documentos del conductor en ZIP
     * @request GET:/conductor/download/{id}
     * @secure
     * @response `200` `ConductoresDownloadData`
     */
    download: (
      { id, ...query }: ConductoresDownloadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ConductoresDownloadData, any>({
        path: `/conductor/download/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  dashboard = {
    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetStats
     * @summary Obtener estadísticas generales del dashboard
     * @request GET:/dashboard/stats
     * @secure
     * @response `200` `DashboardGetStatsData`
     */
    getStats: (params: RequestParams = {}) =>
      this.http.request<DashboardGetStatsData, any>({
        path: `/dashboard/stats`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetVehiculosPorEstado
     * @summary Obtener vehículos agrupados por estado
     * @request GET:/dashboard/vehiculos-estado
     * @secure
     * @response `200` `DashboardGetVehiculosPorEstadoData`
     */
    getVehiculosPorEstado: (params: RequestParams = {}) =>
      this.http.request<DashboardGetVehiculosPorEstadoData, any>({
        path: `/dashboard/vehiculos-estado`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetViajesRecientes
     * @summary Obtener los últimos 5 viajes
     * @request GET:/dashboard/viajes-recientes
     * @secure
     * @response `200` `DashboardGetViajesRecientesData`
     */
    getViajesRecientes: (params: RequestParams = {}) =>
      this.http.request<DashboardGetViajesRecientesData, any>({
        path: `/dashboard/viajes-recientes`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetMantenimientosProximos
     * @summary Obtener mantenimientos programados próximos
     * @request GET:/dashboard/mantenimientos-proximos
     * @secure
     * @response `200` `DashboardGetMantenimientosProximosData`
     */
    getMantenimientosProximos: (params: RequestParams = {}) =>
      this.http.request<DashboardGetMantenimientosProximosData, any>({
        path: `/dashboard/mantenimientos-proximos`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetRutasPopulares
     * @summary Obtener las 5 rutas más utilizadas
     * @request GET:/dashboard/rutas-populares
     * @secure
     * @response `200` `DashboardGetRutasPopularesData`
     */
    getRutasPopulares: (params: RequestParams = {}) =>
      this.http.request<DashboardGetRutasPopularesData, any>({
        path: `/dashboard/rutas-populares`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags dashboard
     * @name DashboardGetIngresosMensuales
     * @summary Obtener kilometraje de los últimos 6 meses (alias para compatibilidad)
     * @request GET:/dashboard/ingresos-mensuales
     * @secure
     * @response `200` `DashboardGetIngresosMensualesData`
     */
    getIngresosMensuales: (params: RequestParams = {}) =>
      this.http.request<DashboardGetIngresosMensualesData, any>({
        path: `/dashboard/ingresos-mensuales`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  vehiculos = {
    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindAll
     * @summary Obtener vehículos con paginación, búsqueda y filtros
     * @request GET:/vehiculo/find-all
     * @secure
     * @response `200` `VehiculosFindAllData`
     */
    findAll: (
      query: VehiculosFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindAllData, any>({
        path: `/vehiculo/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindAllEstadoDocumentos
     * @summary Obtener estado de documentos de vehículos (activo/caducado/nulo)
     * @request GET:/vehiculo/estado-documentos
     * @secure
     * @response `200` `VehiculosFindAllEstadoDocumentosData`
     */
    findAllEstadoDocumentos: (
      query: VehiculosFindAllEstadoDocumentosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindAllEstadoDocumentosData, any>({
        path: `/vehiculo/estado-documentos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosDownload
     * @summary Descargar información y documentos del vehículo (ZIP)
     * @request GET:/vehiculo/download/{id}
     * @secure
     * @response `200` `VehiculosDownloadData`
     */
    download: (
      { id, ...query }: VehiculosDownloadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosDownloadData, any>({
        path: `/vehiculo/download/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindOne
     * @summary Get a vehicle by ID
     * @request GET:/vehiculo/find-one/{id}
     * @secure
     * @response `200` `VehiculosFindOneData`
     */
    findOne: (
      { id, ...query }: VehiculosFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindOneData, any>({
        path: `/vehiculo/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosCreate
     * @summary Create a new vehicle
     * @request POST:/vehiculo/create
     * @secure
     * @response `200` `VehiculosCreateData`
     */
    create: (data: VehiculoCreateDto, params: RequestParams = {}) =>
      this.http.request<VehiculosCreateData, any>({
        path: `/vehiculo/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpdate
     * @summary Update a vehicle
     * @request PATCH:/vehiculo/update/{id}
     * @secure
     * @response `200` `VehiculosUpdateData`
     */
    update: (
      { id, ...query }: VehiculosUpdateParams,
      data: VehiculoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpdateData, any>({
        path: `/vehiculo/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosRemove
     * @summary Delete a vehicle
     * @request DELETE:/vehiculo/delete/{id}
     * @secure
     * @response `200` `VehiculosRemoveData`
     */
    remove: (
      { id, ...query }: VehiculosRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosRemoveData, any>({
        path: `/vehiculo/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/vehiculo/documento/{id}
     * @secure
     * @response `200` `VehiculosFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: VehiculosFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindDocumentoData, any>({
        path: `/vehiculo/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosCreateDocumento
     * @summary Crear un nuevo documento de vehículo
     * @request POST:/vehiculo/documento/create
     * @secure
     * @response `201` `VehiculosCreateDocumentoData`
     */
    createDocumento: (
      data: VehiculoDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosCreateDocumentoData, any>({
        path: `/vehiculo/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpdateDocumento
     * @summary Actualizar un documento de vehículo
     * @request PATCH:/vehiculo/documento/update/{id}
     * @secure
     * @response `200` `VehiculosUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: VehiculosUpdateDocumentoParams,
      data: VehiculoDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpdateDocumentoData, any>({
        path: `/vehiculo/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosDeleteDocumento
     * @summary Eliminar un documento de vehículo
     * @request DELETE:/vehiculo/documento/delete/{id}
     * @secure
     * @response `200` `VehiculosDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: VehiculosDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosDeleteDocumentoData, any>({
        path: `/vehiculo/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindComentariosByVehiculo
     * @summary Obtener todos los comentarios de un vehículo
     * @request GET:/vehiculo/{id}/comentario/find-all
     * @secure
     * @response `200` `VehiculosFindComentariosByVehiculoData`
     */
    findComentariosByVehiculo: (
      { id, ...query }: VehiculosFindComentariosByVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindComentariosByVehiculoData, any>({
        path: `/vehiculo/${id}/comentario/find-all`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindOneComentario
     * @summary Obtener un comentario por ID
     * @request GET:/vehiculo/comentario/find-one/{id}
     * @secure
     * @response `200` `VehiculosFindOneComentarioData`
     */
    findOneComentario: (
      { id, ...query }: VehiculosFindOneComentarioParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindOneComentarioData, any>({
        path: `/vehiculo/comentario/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosCreateComentario
     * @summary Crear un nuevo comentario para un vehículo
     * @request POST:/vehiculo/comentario/create
     * @secure
     * @response `201` `VehiculosCreateComentarioData`
     */
    createComentario: (
      data: VehiculoComentarioCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosCreateComentarioData, any>({
        path: `/vehiculo/comentario/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpdateComentario
     * @summary Actualizar un comentario
     * @request PATCH:/vehiculo/comentario/update/{id}
     * @secure
     * @response `200` `VehiculosUpdateComentarioData`
     */
    updateComentario: (
      { id, ...query }: VehiculosUpdateComentarioParams,
      data: VehiculoComentarioUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpdateComentarioData, any>({
        path: `/vehiculo/comentario/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosDeleteComentario
     * @summary Eliminar un comentario
     * @request DELETE:/vehiculo/comentario/delete/{id}
     * @secure
     * @response `200` `VehiculosDeleteComentarioData`
     */
    deleteComentario: (
      { id, ...query }: VehiculosDeleteComentarioParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosDeleteComentarioData, any>({
        path: `/vehiculo/comentario/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindAllMarcas
     * @summary Obtener marcas con paginación, búsqueda y filtros
     * @request GET:/vehiculo/marca/find-all
     * @secure
     * @response `200` `VehiculosFindAllMarcasData`
     */
    findAllMarcas: (
      query: VehiculosFindAllMarcasParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindAllMarcasData, any>({
        path: `/vehiculo/marca/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindOneMarca
     * @summary Obtener una marca por ID
     * @request GET:/vehiculo/marca/find-one/{id}
     * @secure
     * @response `200` `VehiculosFindOneMarcaData`
     */
    findOneMarca: (
      { id, ...query }: VehiculosFindOneMarcaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindOneMarcaData, any>({
        path: `/vehiculo/marca/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosCreateMarca
     * @summary Crear una nueva marca
     * @request POST:/vehiculo/marca/create
     * @secure
     * @response `201` `VehiculosCreateMarcaData`
     */
    createMarca: (data: MarcaCreateDto, params: RequestParams = {}) =>
      this.http.request<VehiculosCreateMarcaData, any>({
        path: `/vehiculo/marca/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpdateMarca
     * @summary Actualizar una marca
     * @request PATCH:/vehiculo/marca/update/{id}
     * @secure
     * @response `200` `VehiculosUpdateMarcaData`
     */
    updateMarca: (
      { id, ...query }: VehiculosUpdateMarcaParams,
      data: MarcaUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpdateMarcaData, any>({
        path: `/vehiculo/marca/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosDeleteMarca
     * @summary Eliminar una marca
     * @request DELETE:/vehiculo/marca/delete/{id}
     * @secure
     * @response `200` `VehiculosDeleteMarcaData`
     */
    deleteMarca: (
      { id, ...query }: VehiculosDeleteMarcaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosDeleteMarcaData, any>({
        path: `/vehiculo/marca/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindAllModelos
     * @summary Obtener modelos con paginación, búsqueda y filtros
     * @request GET:/vehiculo/modelo/find-all
     * @secure
     * @response `200` `VehiculosFindAllModelosData`
     */
    findAllModelos: (
      query: VehiculosFindAllModelosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindAllModelosData, any>({
        path: `/vehiculo/modelo/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindOneModelo
     * @summary Obtener un modelo por ID
     * @request GET:/vehiculo/modelo/find-one/{id}
     * @secure
     * @response `200` `VehiculosFindOneModeloData`
     */
    findOneModelo: (
      { id, ...query }: VehiculosFindOneModeloParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindOneModeloData, any>({
        path: `/vehiculo/modelo/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosCreateModelo
     * @summary Crear un nuevo modelo
     * @request POST:/vehiculo/modelo/create
     * @secure
     * @response `201` `VehiculosCreateModeloData`
     */
    createModelo: (
      data: ModeloCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosCreateModeloData, any>({
        path: `/vehiculo/modelo/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpdateModelo
     * @summary Actualizar un modelo
     * @request PATCH:/vehiculo/modelo/update/{id}
     * @secure
     * @response `200` `VehiculosUpdateModeloData`
     */
    updateModelo: (
      { id, ...query }: VehiculosUpdateModeloParams,
      data: ModeloUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpdateModeloData, any>({
        path: `/vehiculo/modelo/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosDeleteModelo
     * @summary Eliminar un modelo
     * @request DELETE:/vehiculo/modelo/delete/{id}
     * @secure
     * @response `200` `VehiculosDeleteModeloData`
     */
    deleteModelo: (
      { id, ...query }: VehiculosDeleteModeloParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosDeleteModeloData, any>({
        path: `/vehiculo/modelo/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindChecklistHistory
     * @summary Obtener historial de documentos de checklist
     * @request GET:/vehiculo/{id}/checklist-document/history
     * @secure
     * @response `200` `VehiculosFindChecklistHistoryData`
     */
    findChecklistHistory: (
      { id, ...query }: VehiculosFindChecklistHistoryParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindChecklistHistoryData, any>({
        path: `/vehiculo/${id}/checklist-document/history`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindIpercContinuo
     * @summary Obtener configuración: IPERC continuo
     * @request GET:/vehiculo/{id}/checklist-document/iperc-continuo/find
     * @secure
     * @response `200` `VehiculosFindIpercContinuoData`
     */
    findIpercContinuo: (
      { id, ...query }: VehiculosFindIpercContinuoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindIpercContinuoData, any>({
        path: `/vehiculo/${id}/checklist-document/iperc-continuo/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindHojaInspeccion
     * @summary Obtener configuración: Hoja de Inspección
     * @request GET:/vehiculo/{id}/checklist-document/hoja-inspeccion/find
     * @secure
     * @response `200` `VehiculosFindHojaInspeccionData`
     */
    findHojaInspeccion: (
      { id, ...query }: VehiculosFindHojaInspeccionParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindHojaInspeccionData, any>({
        path: `/vehiculo/${id}/checklist-document/hoja-inspeccion/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindInspeccionDocumentos
     * @summary Obtener configuración: Inspección de Documentos
     * @request GET:/vehiculo/{id}/checklist-document/inspeccion-documentos/find
     * @secure
     * @response `200` `VehiculosFindInspeccionDocumentosData`
     */
    findInspeccionDocumentos: (
      { id, ...query }: VehiculosFindInspeccionDocumentosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindInspeccionDocumentosData, any>({
        path: `/vehiculo/${id}/checklist-document/inspeccion-documentos/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindLuces
     * @summary Obtener configuración: Luces de Emergencia y Alarmas
     * @request GET:/vehiculo/{id}/checklist-document/luces-emergencia-alarmas/find
     * @secure
     * @response `200` `VehiculosFindLucesData`
     */
    findLuces: (
      { id, ...query }: VehiculosFindLucesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindLucesData, any>({
        path: `/vehiculo/${id}/checklist-document/luces-emergencia-alarmas/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindCinturones
     * @summary Obtener configuración: Cinturones de Seguridad
     * @request GET:/vehiculo/{id}/checklist-document/cinturones-seguridad/find
     * @secure
     * @response `200` `VehiculosFindCinturonesData`
     */
    findCinturones: (
      { id, ...query }: VehiculosFindCinturonesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindCinturonesData, any>({
        path: `/vehiculo/${id}/checklist-document/cinturones-seguridad/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindHerramientas
     * @summary Obtener configuración: Inspección de Herramientas
     * @request GET:/vehiculo/{id}/checklist-document/inspeccion-herramientas/find
     * @secure
     * @response `200` `VehiculosFindHerramientasData`
     */
    findHerramientas: (
      { id, ...query }: VehiculosFindHerramientasParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindHerramientasData, any>({
        path: `/vehiculo/${id}/checklist-document/inspeccion-herramientas/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindBotiquines
     * @summary Obtener configuración: Inspección de Botiquines
     * @request GET:/vehiculo/{id}/checklist-document/inspeccion-botiquines/find
     * @secure
     * @response `200` `VehiculosFindBotiquinesData`
     */
    findBotiquines: (
      { id, ...query }: VehiculosFindBotiquinesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindBotiquinesData, any>({
        path: `/vehiculo/${id}/checklist-document/inspeccion-botiquines/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindKitAntiderrames
     * @summary Obtener configuración: Kit Antiderrames
     * @request GET:/vehiculo/{id}/checklist-document/kit-antiderrames/find
     * @secure
     * @response `200` `VehiculosFindKitAntiderramesData`
     */
    findKitAntiderrames: (
      { id, ...query }: VehiculosFindKitAntiderramesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindKitAntiderramesData, any>({
        path: `/vehiculo/${id}/checklist-document/kit-antiderrames/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosFindRevisionVehiculos
     * @summary Obtener configuración: Revisión de Vehículos
     * @request GET:/vehiculo/{id}/checklist-document/revision-vehiculos/find
     * @secure
     * @response `200` `VehiculosFindRevisionVehiculosData`
     */
    findRevisionVehiculos: (
      { id, ...query }: VehiculosFindRevisionVehiculosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosFindRevisionVehiculosData, any>({
        path: `/vehiculo/${id}/checklist-document/revision-vehiculos/find`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertIpercContinuo
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/iperc-continuo/upsert
     * @secure
     * @response `201` `VehiculosUpsertIpercContinuoData`
     */
    upsertIpercContinuo: (
      { id, viajeId, ...query }: VehiculosUpsertIpercContinuoParams,
      data: IpercContinuoDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertIpercContinuoData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/iperc-continuo/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertHojaInspeccion
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/hoja-inspeccion/upsert
     * @secure
     * @response `201` `VehiculosUpsertHojaInspeccionData`
     */
    upsertHojaInspeccion: (
      { id, viajeId, ...query }: VehiculosUpsertHojaInspeccionParams,
      data: HojaInspeccionDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertHojaInspeccionData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/hoja-inspeccion/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertInspeccionDocumentos
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-documentos/upsert
     * @secure
     * @response `201` `VehiculosUpsertInspeccionDocumentosData`
     */
    upsertInspeccionDocumentos: (
      { id, viajeId, ...query }: VehiculosUpsertInspeccionDocumentosParams,
      data: InspeccionDocumentosDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertInspeccionDocumentosData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/inspeccion-documentos/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertLuces
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/luces-emergencia-alarmas/upsert
     * @secure
     * @response `201` `VehiculosUpsertLucesData`
     */
    upsertLuces: (
      { id, viajeId, ...query }: VehiculosUpsertLucesParams,
      data: LucesEmergenciaAlarmasDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertLucesData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/luces-emergencia-alarmas/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertCinturones
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/cinturones-seguridad/upsert
     * @secure
     * @response `201` `VehiculosUpsertCinturonesData`
     */
    upsertCinturones: (
      { id, viajeId, ...query }: VehiculosUpsertCinturonesParams,
      data: CinturonesSeguridadDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertCinturonesData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/cinturones-seguridad/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertHerramientas
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-herramientas/upsert
     * @secure
     * @response `201` `VehiculosUpsertHerramientasData`
     */
    upsertHerramientas: (
      { id, viajeId, ...query }: VehiculosUpsertHerramientasParams,
      data: InspeccionHerramientasDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertHerramientasData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/inspeccion-herramientas/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertBotiquines
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/inspeccion-botiquines/upsert
     * @secure
     * @response `201` `VehiculosUpsertBotiquinesData`
     */
    upsertBotiquines: (
      { id, viajeId, ...query }: VehiculosUpsertBotiquinesParams,
      data: InspeccionBotiquinesDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertBotiquinesData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/inspeccion-botiquines/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertKitAntiderrames
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/kit-antiderrames/upsert
     * @secure
     * @response `201` `VehiculosUpsertKitAntiderramesData`
     */
    upsertKitAntiderrames: (
      { id, viajeId, ...query }: VehiculosUpsertKitAntiderramesParams,
      data: KitAntiderramesDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertKitAntiderramesData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/kit-antiderrames/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags vehiculos
     * @name VehiculosUpsertRevisionVehiculos
     * @request POST:/vehiculo/{id}/viaje/{viajeId}/checklist-document/revision-vehiculos/upsert
     * @secure
     * @response `201` `VehiculosUpsertRevisionVehiculosData`
     */
    upsertRevisionVehiculos: (
      { id, viajeId, ...query }: VehiculosUpsertRevisionVehiculosParams,
      data: RevisionVehiculosDto,
      params: RequestParams = {},
    ) =>
      this.http.request<VehiculosUpsertRevisionVehiculosData, any>({
        path: `/vehiculo/${id}/viaje/${viajeId}/checklist-document/revision-vehiculos/upsert`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  mantenimientos = {
    /**
     * @description Busca por código de orden o ID. Filtra por fechas, tipo, estado, taller y vehículo.
     *
     * @tags mantenimientos
     * @name MantenimientosFindAll
     * @summary Obtener mantenimientos con paginación, búsqueda y filtros
     * @request GET:/mantenimiento/find-all
     * @secure
     * @response `200` `MantenimientosFindAllData`
     */
    findAll: (
      query: MantenimientosFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosFindAllData, any>({
        path: `/mantenimiento/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosFindOne
     * @summary Get a maintenance record by ID
     * @request GET:/mantenimiento/find-one/{id}
     * @secure
     * @response `200` `MantenimientosFindOneData`
     */
    findOne: (
      { id, ...query }: MantenimientosFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosFindOneData, any>({
        path: `/mantenimiento/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosCreate
     * @summary Create a new maintenance record
     * @request POST:/mantenimiento/create
     * @secure
     * @response `200` `MantenimientosCreateData`
     */
    create: (
      data: MantenimientoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosCreateData, any>({
        path: `/mantenimiento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosUpdate
     * @summary Update a maintenance record
     * @request PATCH:/mantenimiento/update/{id}
     * @secure
     * @response `200` `MantenimientosUpdateData`
     */
    update: (
      { id, ...query }: MantenimientosUpdateParams,
      data: MantenimientoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosUpdateData, any>({
        path: `/mantenimiento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosRemove
     * @summary Delete a maintenance record
     * @request DELETE:/mantenimiento/delete/{id}
     * @secure
     * @response `200` `MantenimientosRemoveData`
     */
    remove: (
      { id, ...query }: MantenimientosRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosRemoveData, any>({
        path: `/mantenimiento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosCreateMantenimientoTarea
     * @summary Agregar una tarea a un mantenimiento
     * @request POST:/mantenimiento/mantenimiento-tarea/create
     * @secure
     * @response `201` `MantenimientosCreateMantenimientoTareaData`
     */
    createMantenimientoTarea: (
      data: MantenimientoTareaCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosCreateMantenimientoTareaData, any>({
        path: `/mantenimiento/mantenimiento-tarea/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosUpdateMantenimientoTarea
     * @summary Actualizar una tarea de mantenimiento
     * @request PATCH:/mantenimiento/mantenimiento-tarea/update/{id}
     * @secure
     * @response `200` `MantenimientosUpdateMantenimientoTareaData`
     */
    updateMantenimientoTarea: (
      { id, ...query }: MantenimientosUpdateMantenimientoTareaParams,
      data: MantenimientoTareaUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosUpdateMantenimientoTareaData, any>({
        path: `/mantenimiento/mantenimiento-tarea/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosDeleteMantenimientoTarea
     * @summary Eliminar una tarea de mantenimiento
     * @request DELETE:/mantenimiento/mantenimiento-tarea/delete/{id}
     * @secure
     * @response `200` `MantenimientosDeleteMantenimientoTareaData`
     */
    deleteMantenimientoTarea: (
      { id, ...query }: MantenimientosDeleteMantenimientoTareaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosDeleteMantenimientoTareaData, any>({
        path: `/mantenimiento/mantenimiento-tarea/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosFindAllTareas
     * @summary Obtener tareas del catálogo con paginación y filtros
     * @request GET:/mantenimiento/tarea/find-all
     * @secure
     * @response `200` `MantenimientosFindAllTareasData`
     */
    findAllTareas: (
      query: MantenimientosFindAllTareasParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosFindAllTareasData, any>({
        path: `/mantenimiento/tarea/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosFindOneTarea
     * @summary Obtener una tarea del catálogo por ID
     * @request GET:/mantenimiento/tarea/find-one/{id}
     * @secure
     * @response `200` `MantenimientosFindOneTareaData`
     */
    findOneTarea: (
      { id, ...query }: MantenimientosFindOneTareaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosFindOneTareaData, any>({
        path: `/mantenimiento/tarea/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosCreateTarea
     * @summary Crear una nueva tarea en el catálogo
     * @request POST:/mantenimiento/tarea/create
     * @secure
     * @response `201` `MantenimientosCreateTareaData`
     */
    createTarea: (
      data: TareaCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosCreateTareaData, any>({
        path: `/mantenimiento/tarea/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosUpdateTarea
     * @summary Actualizar una tarea del catálogo
     * @request PATCH:/mantenimiento/tarea/update/{id}
     * @secure
     * @response `200` `MantenimientosUpdateTareaData`
     */
    updateTarea: (
      { id, ...query }: MantenimientosUpdateTareaParams,
      data: TareaUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosUpdateTareaData, any>({
        path: `/mantenimiento/tarea/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosDeleteTarea
     * @summary Eliminar una tarea del catálogo
     * @request DELETE:/mantenimiento/tarea/delete/{id}
     * @secure
     * @response `200` `MantenimientosDeleteTareaData`
     */
    deleteTarea: (
      { id, ...query }: MantenimientosDeleteTareaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosDeleteTareaData, any>({
        path: `/mantenimiento/tarea/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/mantenimiento/documento/{id}
     * @secure
     * @response `200` `MantenimientosFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: MantenimientosFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosFindDocumentoData, any>({
        path: `/mantenimiento/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosCreateDocumento
     * @summary Agregar un documento a un mantenimiento
     * @request POST:/mantenimiento/documento/create
     * @secure
     * @response `201` `MantenimientosCreateDocumentoData`
     */
    createDocumento: (
      data: MantenimientoDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosCreateDocumentoData, any>({
        path: `/mantenimiento/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosUpdateDocumento
     * @summary Actualizar un documento de mantenimiento
     * @request PATCH:/mantenimiento/documento/update/{id}
     * @secure
     * @response `200` `MantenimientosUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: MantenimientosUpdateDocumentoParams,
      data: MantenimientoDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosUpdateDocumentoData, any>({
        path: `/mantenimiento/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosDeleteDocumento
     * @summary Eliminar un documento de mantenimiento
     * @request DELETE:/mantenimiento/documento/delete/{id}
     * @secure
     * @response `200` `MantenimientosDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: MantenimientosDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosDeleteDocumentoData, any>({
        path: `/mantenimiento/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags mantenimientos
     * @name MantenimientosGetReporteEstadoVehiculos
     * @summary Obtener reporte de estado de mantenimiento de vehículos
     * @request GET:/mantenimiento/reporte-estado-vehiculos
     * @secure
     * @response `200` `MantenimientosGetReporteEstadoVehiculosData`
     */
    getReporteEstadoVehiculos: (
      query: MantenimientosGetReporteEstadoVehiculosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<MantenimientosGetReporteEstadoVehiculosData, any>({
        path: `/mantenimiento/reporte-estado-vehiculos`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  notificaciones = {
    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesFindAll
     * @summary Obtener notificaciones del usuario
     * @request GET:/notificacion/find-all
     * @response `200` `NotificacionesFindAllData`
     */
    findAll: (
      query: NotificacionesFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesFindAllData, any>({
        path: `/notificacion/find-all`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesCreate
     * @summary Crear una nueva notificación general
     * @request POST:/notificacion/create
     * @response `201` `NotificacionesCreateData`
     */
    create: (
      data: NotificacionCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesCreateData, any>({
        path: `/notificacion/create`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesMarkAsRead
     * @summary Marcar notificación como leída
     * @request POST:/notificacion/leido/{id}
     * @response `200` `NotificacionesMarkAsReadData`
     */
    markAsRead: (
      { id, ...query }: NotificacionesMarkAsReadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesMarkAsReadData, any>({
        path: `/notificacion/leido/${id}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesMarkAsDismissed
     * @summary Ocultar notificación para un usuario
     * @request POST:/notificacion/ocultar/{id}
     * @response `200` `NotificacionesMarkAsDismissedData`
     */
    markAsDismissed: (
      { id, ...query }: NotificacionesMarkAsDismissedParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesMarkAsDismissedData, any>({
        path: `/notificacion/ocultar/${id}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesCreateForConductor
     * @summary Crear una nueva notificación para un conductor
     * @request POST:/notificacion/create-conductor/{conductorId}
     * @response `201` `NotificacionesCreateForConductorData`
     */
    createForConductor: (
      { conductorId, ...query }: NotificacionesCreateForConductorParams,
      data: NotificacionCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesCreateForConductorData, any>({
        path: `/notificacion/create-conductor/${conductorId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesFindAllByConductor
     * @summary Obtener notificaciones de un conductor
     * @request GET:/notificacion/conductor/{conductorId}
     * @response `200` `NotificacionesFindAllByConductorData`
     */
    findAllByConductor: (
      { conductorId, ...query }: NotificacionesFindAllByConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesFindAllByConductorData, any>({
        path: `/notificacion/conductor/${conductorId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesMarkAsReadByConductor
     * @summary Marcar notificación como leída para un conductor
     * @request POST:/notificacion/leido-conductor/{id}
     * @response `200` `NotificacionesMarkAsReadByConductorData`
     */
    markAsReadByConductor: (
      { id, ...query }: NotificacionesMarkAsReadByConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesMarkAsReadByConductorData, any>({
        path: `/notificacion/leido-conductor/${id}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesMarkAsDismissedByConductor
     * @summary Ocultar notificación para un conductor
     * @request POST:/notificacion/ocultar-conductor/{id}
     * @response `200` `NotificacionesMarkAsDismissedByConductorData`
     */
    markAsDismissedByConductor: (
      { id, ...query }: NotificacionesMarkAsDismissedByConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesMarkAsDismissedByConductorData, any>({
        path: `/notificacion/ocultar-conductor/${id}`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesPreviewVencimientos
     * @summary TEST: Previsualizar notificaciones de documentos por vencer
     * @request GET:/notificacion/vencimientos/test
     * @response `200` `NotificacionesPreviewVencimientosData`
     */
    previewVencimientos: (
      query: NotificacionesPreviewVencimientosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesPreviewVencimientosData, any>({
        path: `/notificacion/vencimientos/test`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Busca documentos por vencer/vencidos y CREA las notificaciones en la base de datos.
     *
     * @tags notificaciones
     * @name NotificacionesGenerarVencimientos
     * @summary Generar y guardar notificaciones de documentos por vencer
     * @request POST:/notificacion/vencimientos/generar
     * @response `201` `NotificacionesGenerarVencimientosData`
     */
    generarVencimientos: (
      query: NotificacionesGenerarVencimientosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesGenerarVencimientosData, any>({
        path: `/notificacion/vencimientos/generar`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesSendEmail
     * @summary Enviar un correo electrónico
     * @request POST:/notificacion/send-email
     * @response `200` `NotificacionesSendEmailData` Correo enviado correctamente
     */
    sendEmail: (data: SendEmailDto, params: RequestParams = {}) =>
      this.http.request<NotificacionesSendEmailData, any>({
        path: `/notificacion/send-email`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesNotifyEachAdmin
     * @summary Enviar lista de conductores con documentos por vencer a todos los administradores
     * @request POST:/notificacion/notify-each-admin
     * @response `200` `NotificacionesNotifyEachAdminData` Correos enviados con el reporte
     */
    notifyEachAdmin: (
      query: NotificacionesNotifyEachAdminParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesNotifyEachAdminData, any>({
        path: `/notificacion/notify-each-admin`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags notificaciones
     * @name NotificacionesNotifyEachConductor
     * @summary Enviar correo personalizado a cada conductor con sus documentos por vencer
     * @request POST:/notificacion/notify-each-conductor
     * @response `200` `NotificacionesNotifyEachConductorData` Proceso de notificación por correo finalizado
     */
    notifyEachConductor: (
      query: NotificacionesNotifyEachConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<NotificacionesNotifyEachConductorData, any>({
        path: `/notificacion/notify-each-conductor`,
        method: "POST",
        query: query,
        ...params,
      }),
  };
  rutas = {
    /**
     * @description Busca por origen o destino. Filtra por rango de fechas.
     *
     * @tags rutas
     * @name RutasFindAll
     * @summary Obtener rutas con paginación, búsqueda y filtros
     * @request GET:/ruta/find-all
     * @secure
     * @response `200` `RutasFindAllData`
     */
    findAll: (query: RutasFindAllParams, params: RequestParams = {}) =>
      this.http.request<RutasFindAllData, any>({
        path: `/ruta/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasFindOne
     * @summary Obtener una ruta por ID
     * @request GET:/ruta/find-one/{id}
     * @secure
     * @response `200` `RutasFindOneData`
     */
    findOne: (
      { id, ...query }: RutasFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasFindOneData, any>({
        path: `/ruta/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasFindAllCircuitos
     * @summary Obtener circuitos con paginación, búsqueda y filtros
     * @request GET:/ruta/circuito/find-all
     * @secure
     * @response `200` `RutasFindAllCircuitosData`
     */
    findAllCircuitos: (
      query: RutasFindAllCircuitosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasFindAllCircuitosData, any>({
        path: `/ruta/circuito/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasFindOneCircuito
     * @summary Obtener un circuito por ID con sus rutas
     * @request GET:/ruta/circuito/find-one/{id}
     * @secure
     * @response `200` `RutasFindOneCircuitoData`
     */
    findOneCircuito: (
      { id, ...query }: RutasFindOneCircuitoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasFindOneCircuitoData, any>({
        path: `/ruta/circuito/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasCreateCircuito
     * @summary Crear un nuevo circuito con rutas de ida y vuelta
     * @request POST:/ruta/circuito/create
     * @secure
     * @response `200` `RutasCreateCircuitoData`
     */
    createCircuito: (
      data: RutaCircuitoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasCreateCircuitoData, any>({
        path: `/ruta/circuito/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasUpdateCircuito
     * @summary Actualizar un circuito y sus rutas
     * @request PATCH:/ruta/circuito/update/{id}
     * @secure
     * @response `200` `RutasUpdateCircuitoData`
     */
    updateCircuito: (
      { id, ...query }: RutasUpdateCircuitoParams,
      data: RutaCircuitoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasUpdateCircuitoData, any>({
        path: `/ruta/circuito/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags rutas
     * @name RutasRemoveCircuito
     * @summary Eliminar un circuito y sus rutas asociadas
     * @request DELETE:/ruta/circuito/delete/{id}
     * @secure
     * @response `200` `RutasRemoveCircuitoData` Mensaje de confirmación
     */
    removeCircuito: (
      { id, ...query }: RutasRemoveCircuitoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<RutasRemoveCircuitoData, any>({
        path: `/ruta/circuito/delete/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  viajes = {
    /**
     * @description Busca por estado, ruta ocasional y modalidad. Filtra por rango de fechas, modalidad de servicio y tipo de viaje. Si el token es de un conductor, solo retorna sus viajes asignados.
     *
     * @tags viajes
     * @name ViajesFindAll
     * @summary Obtener viajes con paginación, búsqueda y filtros
     * @request GET:/viaje/find-all
     * @secure
     * @response `200` `ViajesFindAllData`
     */
    findAll: (query: ViajesFindAllParams, params: RequestParams = {}) =>
      this.http.request<ViajesFindAllData, any>({
        path: `/viaje/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindAllLight
     * @summary Obtener viajes (formato ligero) con paginación, búsqueda y filtros
     * @request GET:/viaje/find-all-light
     * @secure
     * @response `200` `ViajesFindAllLightData`
     */
    findAllLight: (
      query: ViajesFindAllLightParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindAllLightData, any>({
        path: `/viaje/find-all-light`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesValidarVehiculo
     * @summary Validar disponibilidad y requisitos de un vehículo para un horario programado
     * @request GET:/viaje/validar-vehiculo
     * @secure
     * @response `200` `ViajesValidarVehiculoData`
     */
    validarVehiculo: (
      query: ViajesValidarVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesValidarVehiculoData, any>({
        path: `/viaje/validar-vehiculo`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesValidarConductor
     * @summary Validar disponibilidad y requisitos de un conductor para un horario programado
     * @request GET:/viaje/validar-conductor
     * @secure
     * @response `200` `ViajesValidarConductorData`
     */
    validarConductor: (
      query: ViajesValidarConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesValidarConductorData, any>({
        path: `/viaje/validar-conductor`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindOne
     * @summary Obtener viaje por ID
     * @request GET:/viaje/find-one/{id}
     * @secure
     * @response `200` `ViajesFindOneData`
     */
    findOne: (
      { id, ...query }: ViajesFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindOneData, any>({
        path: `/viaje/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindTrayecto
     * @summary Visualizar trayecto de un vehículo (paradas fijas y ocasionales)
     * @request GET:/viaje/{id}/trayecto
     * @secure
     * @response `200` `ViajesFindTrayectoData`
     */
    findTrayecto: (
      { id, ...query }: ViajesFindTrayectoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindTrayectoData, any>({
        path: `/viaje/${id}/trayecto`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesCreate
     * @summary Crear un circuito de viajes (ida y vuelta)
     * @request POST:/viaje/create
     * @secure
     * @response `201` `ViajesCreateData` ViajeCircuito creado exitosamente.
     */
    create: (data: ViajeCreateDto, params: RequestParams = {}) =>
      this.http.request<ViajesCreateData, any>({
        path: `/viaje/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdate
     * @summary Actualizar un viaje individual
     * @request PATCH:/viaje/update/{id}
     * @secure
     * @response `200` `ViajesUpdateData`
     */
    update: (
      { id, ...query }: ViajesUpdateParams,
      data: ViajeUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateData, any>({
        path: `/viaje/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRemove
     * @summary Eliminar logicamente un viaje individual y desligarlo
     * @request DELETE:/viaje/delete/{id}
     * @secure
     * @response `200` `ViajesRemoveData`
     */
    remove: (
      { id, ...query }: ViajesRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRemoveData, any>({
        path: `/viaje/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindConductores
     * @summary Obtener todos los conductores de un viaje
     * @request GET:/viaje/{viajeId}/conductores
     * @secure
     * @response `200` `ViajesFindConductoresData`
     */
    findConductores: (
      { viajeId, ...query }: ViajesFindConductoresParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindConductoresData, any>({
        path: `/viaje/${viajeId}/conductores`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindConductor
     * @summary Obtener un conductor específico de un viaje
     * @request GET:/viaje/{viajeId}/conductor/{conductorId}
     * @secure
     * @response `200` `ViajesFindConductorData`
     */
    findConductor: (
      { viajeId, conductorId, ...query }: ViajesFindConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindConductorData, any>({
        path: `/viaje/${viajeId}/conductor/${conductorId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdateConductor
     * @summary Actualizar asignación de conductor
     * @request PATCH:/viaje/{viajeId}/conductor/{conductorId}
     * @secure
     * @response `200` `ViajesUpdateConductorData`
     */
    updateConductor: (
      { viajeId, conductorId, ...query }: ViajesUpdateConductorParams,
      data: ViajeConductorUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateConductorData, any>({
        path: `/viaje/${viajeId}/conductor/${conductorId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRemoveConductor
     * @summary Remover conductor de un viaje
     * @request DELETE:/viaje/{viajeId}/conductor/{conductorId}
     * @secure
     * @response `200` `ViajesRemoveConductorData`
     */
    removeConductor: (
      { viajeId, conductorId, ...query }: ViajesRemoveConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRemoveConductorData, any>({
        path: `/viaje/${viajeId}/conductor/${conductorId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesAssignConductor
     * @summary Asignar un conductor a un viaje
     * @request POST:/viaje/conductor/assign
     * @secure
     * @response `201` `ViajesAssignConductorData`
     */
    assignConductor: (
      data: ViajeConductorCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesAssignConductorData, any>({
        path: `/viaje/conductor/assign`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindVehiculos
     * @summary Obtener todos los vehículos de un viaje
     * @request GET:/viaje/{viajeId}/vehiculos
     * @secure
     * @response `200` `ViajesFindVehiculosData`
     */
    findVehiculos: (
      { viajeId, ...query }: ViajesFindVehiculosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindVehiculosData, any>({
        path: `/viaje/${viajeId}/vehiculos`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindVehiculo
     * @summary Obtener un vehículo específico de un viaje
     * @request GET:/viaje/{viajeId}/vehiculo/{vehiculoId}
     * @secure
     * @response `200` `ViajesFindVehiculoData`
     */
    findVehiculo: (
      { viajeId, vehiculoId, ...query }: ViajesFindVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindVehiculoData, any>({
        path: `/viaje/${viajeId}/vehiculo/${vehiculoId}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdateVehiculo
     * @summary Actualizar asignación de vehículo
     * @request PATCH:/viaje/{viajeId}/vehiculo/{vehiculoId}
     * @secure
     * @response `200` `ViajesUpdateVehiculoData`
     */
    updateVehiculo: (
      { viajeId, vehiculoId, ...query }: ViajesUpdateVehiculoParams,
      data: ViajeVehiculoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateVehiculoData, any>({
        path: `/viaje/${viajeId}/vehiculo/${vehiculoId}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRemoveVehiculo
     * @summary Remover vehículo de un viaje
     * @request DELETE:/viaje/{viajeId}/vehiculo/{vehiculoId}
     * @secure
     * @response `200` `ViajesRemoveVehiculoData`
     */
    removeVehiculo: (
      { viajeId, vehiculoId, ...query }: ViajesRemoveVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRemoveVehiculoData, any>({
        path: `/viaje/${viajeId}/vehiculo/${vehiculoId}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesAssignVehiculo
     * @summary Asignar un vehículo a un viaje
     * @request POST:/viaje/vehiculo/assign
     * @secure
     * @response `201` `ViajesAssignVehiculoData`
     */
    assignVehiculo: (
      data: ViajeVehiculoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesAssignVehiculoData, any>({
        path: `/viaje/vehiculo/assign`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindComentarios
     * @summary Obtener todos los comentarios de un viaje
     * @request GET:/viaje/{viajeId}/comentarios
     * @secure
     * @response `200` `ViajesFindComentariosData`
     */
    findComentarios: (
      { viajeId, ...query }: ViajesFindComentariosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindComentariosData, any>({
        path: `/viaje/${viajeId}/comentarios`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindComentario
     * @summary Obtener un comentario por ID
     * @request GET:/viaje/comentario/{id}
     * @secure
     * @response `200` `ViajesFindComentarioData`
     */
    findComentario: (
      { id, ...query }: ViajesFindComentarioParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindComentarioData, any>({
        path: `/viaje/comentario/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesCreateComentario
     * @summary Crear un nuevo comentario para un viaje
     * @request POST:/viaje/comentario/create
     * @secure
     * @response `201` `ViajesCreateComentarioData`
     */
    createComentario: (
      data: ViajeComentarioCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesCreateComentarioData, any>({
        path: `/viaje/comentario/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdateComentario
     * @summary Actualizar un comentario
     * @request PATCH:/viaje/comentario/update/{id}
     * @secure
     * @response `200` `ViajesUpdateComentarioData`
     */
    updateComentario: (
      { id, ...query }: ViajesUpdateComentarioParams,
      data: ViajeComentarioUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateComentarioData, any>({
        path: `/viaje/comentario/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesDeleteComentario
     * @summary Eliminar un comentario
     * @request DELETE:/viaje/comentario/delete/{id}
     * @secure
     * @response `200` `ViajesDeleteComentarioData`
     */
    deleteComentario: (
      { id, ...query }: ViajesDeleteComentarioParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesDeleteComentarioData, any>({
        path: `/viaje/comentario/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindTramos
     * @summary Obtener todos los tramos de un viaje
     * @request GET:/viaje/{viajeId}/tramos
     * @secure
     * @response `200` `ViajesFindTramosData`
     */
    findTramos: (
      { viajeId, ...query }: ViajesFindTramosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindTramosData, any>({
        path: `/viaje/${viajeId}/tramos`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesGetHojaRuta
     * @summary Obtener los tramos formateados como hoja de ruta (trayectos entre puntos)
     * @request GET:/viaje/{viajeId}/hoja-ruta
     * @secure
     * @response `200` `ViajesGetHojaRutaData`
     */
    getHojaRuta: (
      { viajeId, ...query }: ViajesGetHojaRutaParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesGetHojaRutaData, any>({
        path: `/viaje/${viajeId}/hoja-ruta`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRegistrarDescanso
     * @summary Registrar un descanso por parte del conductor
     * @request POST:/viaje/{viajeId}/registrar-descanso
     * @secure
     * @response `201` `ViajesRegistrarDescansoData`
     */
    registrarDescanso: (
      { viajeId, ...query }: ViajesRegistrarDescansoParams,
      data: ViajeRegistrarDescansoDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRegistrarDescansoData, any>({
        path: `/viaje/${viajeId}/registrar-descanso`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRegistrarSalida
     * @summary Registrar la salida del viaje (origen)
     * @request POST:/viaje/{viajeId}/registrar-salida
     * @secure
     * @response `201` `ViajesRegistrarSalidaData`
     */
    registrarSalida: (
      { viajeId, ...query }: ViajesRegistrarSalidaParams,
      data: ViajeRegistrarSalidaDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRegistrarSalidaData, any>({
        path: `/viaje/${viajeId}/registrar-salida`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRegistrarLlegada
     * @summary Registrar la llegada del viaje (destino)
     * @request POST:/viaje/{viajeId}/registrar-llegada
     * @secure
     * @response `201` `ViajesRegistrarLlegadaData`
     */
    registrarLlegada: (
      { viajeId, ...query }: ViajesRegistrarLlegadaParams,
      data: ViajeRegistrarLlegadaDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRegistrarLlegadaData, any>({
        path: `/viaje/${viajeId}/registrar-llegada`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRegistrarPunto
     * @summary Registrar el paso por un punto fijo programado
     * @request POST:/viaje/{viajeId}/registrar-punto
     * @secure
     * @response `201` `ViajesRegistrarPuntoData`
     */
    registrarPunto: (
      { viajeId, ...query }: ViajesRegistrarPuntoParams,
      data: ViajeRegistrarPuntoDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRegistrarPuntoData, any>({
        path: `/viaje/${viajeId}/registrar-punto`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesRegistrarParada
     * @summary Registrar una parada ocasional no programada
     * @request POST:/viaje/{viajeId}/registrar-parada
     * @secure
     * @response `201` `ViajesRegistrarParadaData`
     */
    registrarParada: (
      { viajeId, ...query }: ViajesRegistrarParadaParams,
      data: ViajeRegistrarParadaDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesRegistrarParadaData, any>({
        path: `/viaje/${viajeId}/registrar-parada`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesGetProximoTramo
     * @summary Obtener la sugerencia del próximo tramo basado en la ruta y el progreso actual
     * @request GET:/viaje/{viajeId}/proximo-tramo
     * @secure
     * @response `200` `ViajesGetProximoTramoData`
     */
    getProximoTramo: (
      { viajeId, ...query }: ViajesGetProximoTramoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesGetProximoTramoData, any>({
        path: `/viaje/${viajeId}/proximo-tramo`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdateTramo
     * @summary Actualizar un tramo
     * @request PATCH:/viaje/tramo/update/{id}
     * @secure
     * @response `200` `ViajesUpdateTramoData`
     */
    updateTramo: (
      { id, ...query }: ViajesUpdateTramoParams,
      data: ViajeTramoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateTramoData, any>({
        path: `/viaje/tramo/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesDeleteTramo
     * @summary Eliminar un tramo
     * @request DELETE:/viaje/tramo/delete/{id}
     * @secure
     * @response `200` `ViajesDeleteTramoData`
     */
    deleteTramo: (
      { id, ...query }: ViajesDeleteTramoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesDeleteTramoData, any>({
        path: `/viaje/tramo/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindPasajeros
     * @summary Obtener todos los pasajeros de un viaje
     * @request GET:/viaje/{viajeId}/pasajeros
     * @secure
     * @response `200` `ViajesFindPasajerosData`
     */
    findPasajeros: (
      { viajeId, ...query }: ViajesFindPasajerosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindPasajerosData, any>({
        path: `/viaje/${viajeId}/pasajeros`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpsertPasajeros
     * @summary Agregar o actualizar pasajeros en un viaje
     * @request POST:/viaje/{viajeId}/pasajeros/upsert
     * @secure
     * @response `201` `ViajesUpsertPasajerosData`
     */
    upsertPasajeros: (
      { viajeId, ...query }: ViajesUpsertPasajerosParams,
      data: ViajePasajeroFillDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpsertPasajerosData, any>({
        path: `/viaje/${viajeId}/pasajeros/upsert`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesEscanearDnis
     * @summary Escanear imágenes de DNIs y marcar asistencia/registrar pasajeros automáticamente
     * @request POST:/viaje/{viajeId}/pasajeros/escanear-dnis
     * @secure
     * @response `201` `ViajesEscanearDnisData`
     */
    escanearDnis: (
      { viajeId, ...query }: ViajesEscanearDnisParams,
      data: ViajeEscanearDnisDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesEscanearDnisData, any>({
        path: `/viaje/${viajeId}/pasajeros/escanear-dnis`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesAbordarPasajeros
     * @summary Marcar abordaje de pasajeros (asistencia) y registrar movimientos en el tramo
     * @request POST:/viaje/{viajeId}/pasajeros/abordar-pasajeros
     * @secure
     * @response `201` `ViajesAbordarPasajerosData`
     */
    abordarPasajeros: (
      { viajeId, ...query }: ViajesAbordarPasajerosParams,
      data: ViajePasajeroAbordarPasajerosDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesAbordarPasajerosData, any>({
        path: `/viaje/${viajeId}/pasajeros/abordar-pasajeros`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesAbordarPasajerosPorDni
     * @summary Marcar abordaje de pasajeros por DNI y registrar movimientos en el tramo
     * @request POST:/viaje/{viajeId}/pasajeros/abordar-por-dni
     * @secure
     * @response `201` `ViajesAbordarPasajerosPorDniData`
     */
    abordarPasajerosPorDni: (
      { viajeId, ...query }: ViajesAbordarPasajerosPorDniParams,
      data: ViajePasajeroAbordarDnisDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesAbordarPasajerosPorDniData, any>({
        path: `/viaje/${viajeId}/pasajeros/abordar-por-dni`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesDesabordarPasajeros
     * @summary Registrar descenso de pasajeros en el tramo
     * @request POST:/viaje/{viajeId}/pasajeros/desabordar-pasajeros
     * @secure
     * @response `201` `ViajesDesabordarPasajerosData`
     */
    desabordarPasajeros: (
      { viajeId, ...query }: ViajesDesabordarPasajerosParams,
      data: ViajePasajeroDesabordarPasajerosDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesDesabordarPasajerosData, any>({
        path: `/viaje/${viajeId}/pasajeros/desabordar-pasajeros`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindAllChecklistItems
     * @summary Obtener todos los items del catálogo de checklist
     * @request GET:/viaje/checklist-item/find-all
     * @secure
     * @response `200` `ViajesFindAllChecklistItemsData`
     */
    findAllChecklistItems: (params: RequestParams = {}) =>
      this.http.request<ViajesFindAllChecklistItemsData, any>({
        path: `/viaje/checklist-item/find-all`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindChecklistItem
     * @summary Obtener un item del catálogo por ID
     * @request GET:/viaje/checklist-item/{id}
     * @secure
     * @response `200` `ViajesFindChecklistItemData`
     */
    findChecklistItem: (
      { id, ...query }: ViajesFindChecklistItemParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindChecklistItemData, any>({
        path: `/viaje/checklist-item/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesCreateChecklistItem
     * @summary Crear un nuevo item en el catálogo
     * @request POST:/viaje/checklist-item/create
     * @secure
     * @response `201` `ViajesCreateChecklistItemData`
     */
    createChecklistItem: (
      data: ChecklistItemCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesCreateChecklistItemData, any>({
        path: `/viaje/checklist-item/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesUpdateChecklistItem
     * @summary Actualizar un item del catálogo
     * @request PATCH:/viaje/checklist-item/update/{id}
     * @secure
     * @response `200` `ViajesUpdateChecklistItemData`
     */
    updateChecklistItem: (
      { id, ...query }: ViajesUpdateChecklistItemParams,
      data: ChecklistItemUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesUpdateChecklistItemData, any>({
        path: `/viaje/checklist-item/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesDeleteChecklistItem
     * @summary Eliminar un item del catálogo
     * @request DELETE:/viaje/checklist-item/delete/{id}
     * @secure
     * @response `200` `ViajesDeleteChecklistItemData`
     */
    deleteChecklistItem: (
      { id, ...query }: ViajesDeleteChecklistItemParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesDeleteChecklistItemData, any>({
        path: `/viaje/checklist-item/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesFindChecklistByTipo
     * @summary Obtener un checklist de un viaje por tipo (salida/llegada)
     * @request GET:/viaje/{viajeId}/checklist
     * @secure
     * @response `200` `ViajesFindChecklistByTipoData`
     */
    findChecklistByTipo: (
      { viajeId, ...query }: ViajesFindChecklistByTipoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesFindChecklistByTipoData, any>({
        path: `/viaje/${viajeId}/checklist`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesVerifyChecklist
     * @summary Verificar y generar un checklist de viaje (salida/llegada) basado en la configuración actual
     * @request POST:/viaje/{viajeId}/checklist/verify
     * @secure
     * @response `200` `ViajesVerifyChecklistData`
     */
    verifyChecklist: (
      { viajeId, ...query }: ViajesVerifyChecklistParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesVerifyChecklistData, any>({
        path: `/viaje/${viajeId}/checklist/verify`,
        method: "POST",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags viajes
     * @name ViajesDeleteChecklist
     * @summary Eliminar un checklist
     * @request DELETE:/viaje/checklist/delete/{id}
     * @secure
     * @response `200` `ViajesDeleteChecklistData`
     */
    deleteChecklist: (
      { id, ...query }: ViajesDeleteChecklistParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ViajesDeleteChecklistData, any>({
        path: `/viaje/checklist/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  clientes = {
    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindAll
     * @summary Obtener clientes con paginación, búsqueda y filtros
     * @request GET:/cliente/find-all
     * @secure
     * @response `200` `ClientesFindAllData`
     */
    findAll: (
      query: ClientesFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindAllData, any>({
        path: `/cliente/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindOne
     * @summary Obtener un cliente por ID
     * @request GET:/cliente/find-one/{id}
     * @secure
     * @response `200` `ClientesFindOneData`
     */
    findOne: (
      { id, ...query }: ClientesFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindOneData, any>({
        path: `/cliente/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesCreate
     * @summary Crear un nuevo cliente
     * @request POST:/cliente/create
     * @secure
     * @response `200` `ClientesCreateData`
     */
    create: (data: ClienteCreateDto, params: RequestParams = {}) =>
      this.http.request<ClientesCreateData, any>({
        path: `/cliente/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesUpdate
     * @summary Actualizar un cliente
     * @request PATCH:/cliente/update/{id}
     * @secure
     * @response `200` `ClientesUpdateData`
     */
    update: (
      { id, ...query }: ClientesUpdateParams,
      data: ClienteUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesUpdateData, any>({
        path: `/cliente/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesRemove
     * @summary Eliminar un cliente
     * @request DELETE:/cliente/delete/{id}
     * @secure
     * @response `200` `ClientesRemoveData`
     */
    remove: (
      { id, ...query }: ClientesRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesRemoveData, any>({
        path: `/cliente/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/cliente/documento/{id}
     * @secure
     * @response `200` `ClientesFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: ClientesFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindDocumentoData, any>({
        path: `/cliente/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesCreateDocumento
     * @summary Crear un nuevo documento de cliente
     * @request POST:/cliente/documento/create
     * @secure
     * @response `201` `ClientesCreateDocumentoData`
     */
    createDocumento: (
      data: ClienteDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesCreateDocumentoData, any>({
        path: `/cliente/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesUpdateDocumento
     * @summary Actualizar un documento de cliente
     * @request PATCH:/cliente/documento/update/{id}
     * @secure
     * @response `200` `ClientesUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: ClientesUpdateDocumentoParams,
      data: ClienteDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesUpdateDocumentoData, any>({
        path: `/cliente/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesDeleteDocumento
     * @summary Eliminar un documento de cliente
     * @request DELETE:/cliente/documento/delete/{id}
     * @secure
     * @response `200` `ClientesDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: ClientesDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesDeleteDocumentoData, any>({
        path: `/cliente/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindAllPasajeros
     * @summary Obtener pasajeros con paginación, búsqueda y filtro por cliente
     * @request GET:/cliente/pasajero/find-all
     * @secure
     * @response `200` `ClientesFindAllPasajerosData`
     */
    findAllPasajeros: (
      query: ClientesFindAllPasajerosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindAllPasajerosData, any>({
        path: `/cliente/pasajero/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindPasajero
     * @summary Obtener un pasajero por ID
     * @request GET:/cliente/pasajero/find-one/{id}
     * @secure
     * @response `200` `ClientesFindPasajeroData`
     */
    findPasajero: (
      { id, ...query }: ClientesFindPasajeroParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindPasajeroData, any>({
        path: `/cliente/pasajero/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesCreatePasajero
     * @summary Crear un nuevo pasajero
     * @request POST:/cliente/pasajero/create
     * @secure
     * @response `201` `ClientesCreatePasajeroData`
     */
    createPasajero: (
      data: PasajeroCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesCreatePasajeroData, any>({
        path: `/cliente/pasajero/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesUpdatePasajero
     * @summary Actualizar un pasajero
     * @request PATCH:/cliente/pasajero/update/{id}
     * @secure
     * @response `200` `ClientesUpdatePasajeroData`
     */
    updatePasajero: (
      { id, ...query }: ClientesUpdatePasajeroParams,
      data: PasajeroUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesUpdatePasajeroData, any>({
        path: `/cliente/pasajero/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesDeletePasajero
     * @summary Eliminar un pasajero
     * @request DELETE:/cliente/pasajero/delete/{id}
     * @secure
     * @response `200` `ClientesDeletePasajeroData`
     */
    deletePasajero: (
      { id, ...query }: ClientesDeletePasajeroParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesDeletePasajeroData, any>({
        path: `/cliente/pasajero/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindAllEncargados
     * @summary Obtener encargados con paginación, búsqueda y filtro por cliente
     * @request GET:/cliente/encargado/find-all
     * @secure
     * @response `200` `ClientesFindAllEncargadosData`
     */
    findAllEncargados: (
      query: ClientesFindAllEncargadosParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindAllEncargadosData, any>({
        path: `/cliente/encargado/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindEncargado
     * @summary Obtener un encargado por ID
     * @request GET:/cliente/encargado/find-one/{id}
     * @secure
     * @response `200` `ClientesFindEncargadoData`
     */
    findEncargado: (
      { id, ...query }: ClientesFindEncargadoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindEncargadoData, any>({
        path: `/cliente/encargado/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesCreateEncargado
     * @summary Crear un nuevo encargado
     * @request POST:/cliente/encargado/create
     * @secure
     * @response `201` `ClientesCreateEncargadoData`
     */
    createEncargado: (
      data: EncargadoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesCreateEncargadoData, any>({
        path: `/cliente/encargado/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesUpdateEncargado
     * @summary Actualizar un encargado
     * @request PATCH:/cliente/encargado/update/{id}
     * @secure
     * @response `200` `ClientesUpdateEncargadoData`
     */
    updateEncargado: (
      { id, ...query }: ClientesUpdateEncargadoParams,
      data: EncargadoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesUpdateEncargadoData, any>({
        path: `/cliente/encargado/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesDeleteEncargado
     * @summary Eliminar un encargado
     * @request DELETE:/cliente/encargado/delete/{id}
     * @secure
     * @response `200` `ClientesDeleteEncargadoData`
     */
    deleteEncargado: (
      { id, ...query }: ClientesDeleteEncargadoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesDeleteEncargadoData, any>({
        path: `/cliente/encargado/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindAllEntidades
     * @summary Obtener entidades con paginación, búsqueda y filtro por cliente
     * @request GET:/cliente/entidad/find-all
     * @secure
     * @response `200` `ClientesFindAllEntidadesData`
     */
    findAllEntidades: (
      query: ClientesFindAllEntidadesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindAllEntidadesData, any>({
        path: `/cliente/entidad/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesFindEntidad
     * @summary Obtener una entidad por ID
     * @request GET:/cliente/entidad/find-one/{id}
     * @secure
     * @response `200` `ClientesFindEntidadData`
     */
    findEntidad: (
      { id, ...query }: ClientesFindEntidadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesFindEntidadData, any>({
        path: `/cliente/entidad/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesCreateEntidad
     * @summary Crear una nueva entidad
     * @request POST:/cliente/entidad/create
     * @secure
     * @response `201` `ClientesCreateEntidadData`
     */
    createEntidad: (
      data: EntidadCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesCreateEntidadData, any>({
        path: `/cliente/entidad/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesUpdateEntidad
     * @summary Actualizar una entidad
     * @request PATCH:/cliente/entidad/update/{id}
     * @secure
     * @response `200` `ClientesUpdateEntidadData`
     */
    updateEntidad: (
      { id, ...query }: ClientesUpdateEntidadParams,
      data: EntidadUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesUpdateEntidadData, any>({
        path: `/cliente/entidad/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags clientes
     * @name ClientesDeleteEntidad
     * @summary Eliminar una entidad
     * @request DELETE:/cliente/entidad/delete/{id}
     * @secure
     * @response `200` `ClientesDeleteEntidadData`
     */
    deleteEntidad: (
      { id, ...query }: ClientesDeleteEntidadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ClientesDeleteEntidadData, any>({
        path: `/cliente/entidad/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  talleres = {
    /**
     * No description
     *
     * @tags talleres
     * @name TalleresCreate
     * @summary Crear un nuevo taller
     * @request POST:/taller/create
     * @secure
     * @response `201` `TalleresCreateData`
     */
    create: (data: TallerCreateDto, params: RequestParams = {}) =>
      this.http.request<TalleresCreateData, any>({
        path: `/taller/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindAll
     * @summary Listar talleres de forma paginada
     * @request GET:/taller/find-all
     * @secure
     * @response `200` `TalleresFindAllData`
     */
    findAll: (
      query: TalleresFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresFindAllData, any>({
        path: `/taller/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindOne
     * @summary Obtener un taller por ID
     * @request GET:/taller/find-one/{id}
     * @secure
     * @response `200` `TalleresFindOneData`
     */
    findOne: (
      { id, ...query }: TalleresFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresFindOneData, any>({
        path: `/taller/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindSucursalesByTaller
     * @summary Obtener todas las sucursales de un taller
     * @request GET:/taller/{id}/sucursales
     * @secure
     * @response `200` `TalleresFindSucursalesByTallerData`
     */
    findSucursalesByTaller: (
      { id, ...query }: TalleresFindSucursalesByTallerParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresFindSucursalesByTallerData, any>({
        path: `/taller/${id}/sucursales`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresUpdate
     * @summary Actualizar un taller por ID
     * @request PATCH:/taller/update/{id}
     * @secure
     * @response `200` `TalleresUpdateData`
     */
    update: (
      { id, ...query }: TalleresUpdateParams,
      data: TallerUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresUpdateData, any>({
        path: `/taller/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresRemove
     * @summary Eliminar un taller por ID
     * @request DELETE:/taller/delete/{id}
     * @secure
     * @response `200` `TalleresRemoveData`
     */
    remove: (
      { id, ...query }: TalleresRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresRemoveData, any>({
        path: `/taller/delete/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresCreateSucursal
     * @summary Crear una nueva sucursal de taller
     * @request POST:/taller/sucursales/create
     * @secure
     * @response `201` `TalleresCreateSucursalData`
     */
    createSucursal: (
      data: SucursalCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresCreateSucursalData, any>({
        path: `/taller/sucursales/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindAllSucursalesPaginated
     * @summary Listar sucursales de forma paginada
     * @request GET:/taller/sucursales/find-all-paginated
     * @secure
     * @response `200` `TalleresFindAllSucursalesPaginatedData`
     */
    findAllSucursalesPaginated: (
      query: TalleresFindAllSucursalesPaginatedParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresFindAllSucursalesPaginatedData, any>({
        path: `/taller/sucursales/find-all-paginated`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindAllSucursales
     * @summary Obtener todas las sucursales de talleres disponibles
     * @request GET:/taller/sucursales/find-all
     * @secure
     * @response `200` `TalleresFindAllSucursalesData`
     */
    findAllSucursales: (params: RequestParams = {}) =>
      this.http.request<TalleresFindAllSucursalesData, any>({
        path: `/taller/sucursales/find-all`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresFindOneSucursal
     * @summary Obtener una sucursal por ID
     * @request GET:/taller/sucursales/find-one/{id}
     * @secure
     * @response `200` `TalleresFindOneSucursalData`
     */
    findOneSucursal: (
      { id, ...query }: TalleresFindOneSucursalParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresFindOneSucursalData, any>({
        path: `/taller/sucursales/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresUpdateSucursal
     * @summary Actualizar una sucursal por ID
     * @request PATCH:/taller/sucursales/update/{id}
     * @secure
     * @response `200` `TalleresUpdateSucursalData`
     */
    updateSucursal: (
      { id, ...query }: TalleresUpdateSucursalParams,
      data: SucursalUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresUpdateSucursalData, any>({
        path: `/taller/sucursales/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags talleres
     * @name TalleresRemoveSucursal
     * @summary Eliminar una sucursal por ID
     * @request DELETE:/taller/sucursales/delete/{id}
     * @secure
     * @response `200` `TalleresRemoveSucursalData`
     */
    removeSucursal: (
      { id, ...query }: TalleresRemoveSucursalParams,
      params: RequestParams = {},
    ) =>
      this.http.request<TalleresRemoveSucursalData, any>({
        path: `/taller/sucursales/delete/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  reportes = {
    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetViajesDetalladosPorVehiculo
     * @summary Viajes detallados de un vehículo específico
     * @request GET:/reportes/viajes-detallados/vehiculo/{id}
     * @secure
     * @response `200` `ReportesGetViajesDetalladosPorVehiculoData` Lista de viajes detallados
     */
    getViajesDetalladosPorVehiculo: (
      { id, ...query }: ReportesGetViajesDetalladosPorVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ReportesGetViajesDetalladosPorVehiculoData, any>({
        path: `/reportes/viajes-detallados/vehiculo/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetViajesDetalladosPorConductor
     * @summary Viajes detallados de un conductor específico
     * @request GET:/reportes/viajes-detallados/conductor/{id}
     * @secure
     * @response `200` `ReportesGetViajesDetalladosPorConductorData` Lista de viajes detallados
     */
    getViajesDetalladosPorConductor: (
      { id, ...query }: ReportesGetViajesDetalladosPorConductorParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ReportesGetViajesDetalladosPorConductorData, any>({
        path: `/reportes/viajes-detallados/conductor/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetViajesDetalladosPorCliente
     * @summary Viajes detallados de un cliente específico
     * @request GET:/reportes/viajes-detallados/cliente/{id}
     * @secure
     * @response `200` `ReportesGetViajesDetalladosPorClienteData` Lista de viajes detallados
     */
    getViajesDetalladosPorCliente: (
      { id, ...query }: ReportesGetViajesDetalladosPorClienteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ReportesGetViajesDetalladosPorClienteData, any>({
        path: `/reportes/viajes-detallados/cliente/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetMantenimientosDetalladosPorVehiculo
     * @summary Mantenimientos detallados de un vehículo específico
     * @request GET:/reportes/mantenimientos-detallados/vehiculo/{id}
     * @secure
     * @response `200` `ReportesGetMantenimientosDetalladosPorVehiculoData` Lista de mantenimientos detallados
     */
    getMantenimientosDetalladosPorVehiculo: (
      { id, ...query }: ReportesGetMantenimientosDetalladosPorVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        ReportesGetMantenimientosDetalladosPorVehiculoData,
        any
      >({
        path: `/reportes/mantenimientos-detallados/vehiculo/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetMantenimientosDetalladosPorTaller
     * @summary Mantenimientos detallados de un taller específico
     * @request GET:/reportes/mantenimientos-detallados/taller/{id}
     * @secure
     * @response `200` `ReportesGetMantenimientosDetalladosPorTallerData` Lista de mantenimientos detallados
     */
    getMantenimientosDetalladosPorTaller: (
      { id, ...query }: ReportesGetMantenimientosDetalladosPorTallerParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ReportesGetMantenimientosDetalladosPorTallerData, any>({
        path: `/reportes/mantenimientos-detallados/taller/${id}`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags reportes
     * @name ReportesGetReporteConductores
     * @summary Reporte general de conductores con vencimientos
     * @request GET:/reportes/conductores/general
     * @secure
     * @response `200` `ReportesGetReporteConductoresData` Lista general de conductores con vencimientos
     */
    getReporteConductores: (params: RequestParams = {}) =>
      this.http.request<ReportesGetReporteConductoresData, any>({
        path: `/reportes/conductores/general`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  propietarios = {
    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosFindAll
     * @summary Obtener propietarios con paginación, búsqueda y filtros
     * @request GET:/propietario/find-all
     * @secure
     * @response `200` `PropietariosFindAllData`
     */
    findAll: (
      query: PropietariosFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosFindAllData, any>({
        path: `/propietario/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosFindOne
     * @summary Obtener un propietario por ID
     * @request GET:/propietario/find-one/{id}
     * @secure
     * @response `200` `PropietariosFindOneData`
     */
    findOne: (
      { id, ...query }: PropietariosFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosFindOneData, any>({
        path: `/propietario/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosCreate
     * @summary Crear un nuevo propietario
     * @request POST:/propietario/create
     * @secure
     * @response `200` `PropietariosCreateData`
     */
    create: (
      data: PropietarioCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosCreateData, any>({
        path: `/propietario/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosUpdate
     * @summary Actualizar un propietario
     * @request PATCH:/propietario/update/{id}
     * @secure
     * @response `200` `PropietariosUpdateData`
     */
    update: (
      { id, ...query }: PropietariosUpdateParams,
      data: PropietarioUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosUpdateData, any>({
        path: `/propietario/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosRemove
     * @summary Eliminar un propietario
     * @request DELETE:/propietario/delete/{id}
     * @secure
     * @response `200` `PropietariosRemoveData`
     */
    remove: (
      { id, ...query }: PropietariosRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosRemoveData, any>({
        path: `/propietario/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/propietario/documento/{id}
     * @secure
     * @response `200` `PropietariosFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: PropietariosFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosFindDocumentoData, any>({
        path: `/propietario/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosCreateDocumento
     * @summary Crear un nuevo documento de propietario
     * @request POST:/propietario/documento/create
     * @secure
     * @response `201` `PropietariosCreateDocumentoData`
     */
    createDocumento: (
      data: PropietarioDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosCreateDocumentoData, any>({
        path: `/propietario/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosUpdateDocumento
     * @summary Actualizar un documento de propietario
     * @request PATCH:/propietario/documento/update/{id}
     * @secure
     * @response `200` `PropietariosUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: PropietariosUpdateDocumentoParams,
      data: PropietarioDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosUpdateDocumentoData, any>({
        path: `/propietario/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags propietarios
     * @name PropietariosDeleteDocumento
     * @summary Eliminar un documento de propietario
     * @request DELETE:/propietario/documento/delete/{id}
     * @secure
     * @response `200` `PropietariosDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: PropietariosDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PropietariosDeleteDocumentoData, any>({
        path: `/propietario/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  proveedores = {
    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresFindAll
     * @summary Obtener proveedores con paginación, búsqueda y filtros
     * @request GET:/proveedor/find-all
     * @secure
     * @response `200` `ProveedoresFindAllData`
     */
    findAll: (
      query: ProveedoresFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresFindAllData, any>({
        path: `/proveedor/find-all`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresFindOne
     * @summary Obtener un proveedor por ID
     * @request GET:/proveedor/find-one/{id}
     * @secure
     * @response `200` `ProveedoresFindOneData`
     */
    findOne: (
      { id, ...query }: ProveedoresFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresFindOneData, any>({
        path: `/proveedor/find-one/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresCreate
     * @summary Crear un nuevo proveedor
     * @request POST:/proveedor/create
     * @secure
     * @response `200` `ProveedoresCreateData`
     */
    create: (data: ProveedorCreateDto, params: RequestParams = {}) =>
      this.http.request<ProveedoresCreateData, any>({
        path: `/proveedor/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresUpdate
     * @summary Actualizar un proveedor
     * @request PATCH:/proveedor/update/{id}
     * @secure
     * @response `200` `ProveedoresUpdateData`
     */
    update: (
      { id, ...query }: ProveedoresUpdateParams,
      data: ProveedorUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresUpdateData, any>({
        path: `/proveedor/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresRemove
     * @summary Eliminar un proveedor
     * @request DELETE:/proveedor/delete/{id}
     * @secure
     * @response `200` `ProveedoresRemoveData`
     */
    remove: (
      { id, ...query }: ProveedoresRemoveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresRemoveData, any>({
        path: `/proveedor/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresFindDocumento
     * @summary Obtener un documento por ID
     * @request GET:/proveedor/documento/{id}
     * @secure
     * @response `200` `ProveedoresFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: ProveedoresFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresFindDocumentoData, any>({
        path: `/proveedor/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresCreateDocumento
     * @summary Crear un nuevo documento de proveedor
     * @request POST:/proveedor/documento/create
     * @secure
     * @response `201` `ProveedoresCreateDocumentoData`
     */
    createDocumento: (
      data: ProveedorDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresCreateDocumentoData, any>({
        path: `/proveedor/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresUpdateDocumento
     * @summary Actualizar un documento de proveedor
     * @request PATCH:/proveedor/documento/update/{id}
     * @secure
     * @response `200` `ProveedoresUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: ProveedoresUpdateDocumentoParams,
      data: ProveedorDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresUpdateDocumentoData, any>({
        path: `/proveedor/documento/update/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags proveedores
     * @name ProveedoresDeleteDocumento
     * @summary Eliminar un documento de proveedor
     * @request DELETE:/proveedor/documento/delete/{id}
     * @secure
     * @response `200` `ProveedoresDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: ProveedoresDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<ProveedoresDeleteDocumentoData, any>({
        path: `/proveedor/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  alquileres = {
    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresFindAll
     * @summary Listar todos los alquileres (paginado)
     * @request GET:/admin/alquileres
     * @secure
     * @response `200` `AlquileresFindAllData`
     */
    findAll: (
      query: AlquileresFindAllParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresFindAllData, any>({
        path: `/admin/alquileres`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresCreate
     * @summary Crear un nuevo alquiler
     * @request POST:/admin/alquileres
     * @secure
     * @response `201` `AlquileresCreateData`
     */
    create: (data: AlquilerCreateDto, params: RequestParams = {}) =>
      this.http.request<AlquileresCreateData, any>({
        path: `/admin/alquileres`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresValidarVehiculo
     * @summary Validar disponibilidad y estado del vehículo para alquiler
     * @request GET:/admin/alquileres/validar-vehiculo
     * @secure
     * @response `200` `AlquileresValidarVehiculoData`
     */
    validarVehiculo: (
      query: AlquileresValidarVehiculoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresValidarVehiculoData, any>({
        path: `/admin/alquileres/validar-vehiculo`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresFindOne
     * @summary Obtener un alquiler por ID
     * @request GET:/admin/alquileres/{id}
     * @secure
     * @response `200` `AlquileresFindOneData`
     */
    findOne: (
      { id, ...query }: AlquileresFindOneParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresFindOneData, any>({
        path: `/admin/alquileres/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresUpdate
     * @summary Actualizar un alquiler
     * @request PUT:/admin/alquileres/{id}
     * @secure
     * @response `200` `AlquileresUpdateData`
     */
    update: (
      { id, ...query }: AlquileresUpdateParams,
      data: AlquilerUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresUpdateData, any>({
        path: `/admin/alquileres/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresDelete
     * @summary Eliminar un alquiler
     * @request DELETE:/admin/alquileres/{id}
     * @secure
     * @response `200` `AlquileresDeleteData`
     */
    delete: (
      { id, ...query }: AlquileresDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresDeleteData, any>({
        path: `/admin/alquileres/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresTerminar
     * @summary Finalizar un alquiler (fecha fin, kilometraje final y monto final)
     * @request PUT:/admin/alquileres/{id}/terminar
     * @secure
     * @response `200` `AlquileresTerminarData`
     */
    terminar: (
      { id, ...query }: AlquileresTerminarParams,
      data: AlquilerTerminarDto,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresTerminarData, any>({
        path: `/admin/alquileres/${id}/terminar`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresFindDocumento
     * @summary Obtener un documento de alquiler por ID
     * @request GET:/admin/alquileres/documento/{id}
     * @secure
     * @response `200` `AlquileresFindDocumentoData`
     */
    findDocumento: (
      { id, ...query }: AlquileresFindDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresFindDocumentoData, any>({
        path: `/admin/alquileres/documento/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresCreateDocumento
     * @summary Crear un documento de alquiler
     * @request POST:/admin/alquileres/documento/create
     * @secure
     * @response `201` `AlquileresCreateDocumentoData`
     */
    createDocumento: (
      data: AlquilerDocumentoCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresCreateDocumentoData, any>({
        path: `/admin/alquileres/documento/create`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresUpdateDocumento
     * @summary Actualizar un documento de alquiler
     * @request PUT:/admin/alquileres/documento/update/{id}
     * @secure
     * @response `200` `AlquileresUpdateDocumentoData`
     */
    updateDocumento: (
      { id, ...query }: AlquileresUpdateDocumentoParams,
      data: AlquilerDocumentoUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresUpdateDocumentoData, any>({
        path: `/admin/alquileres/documento/update/${id}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags alquileres
     * @name AlquileresDeleteDocumento
     * @summary Eliminar un documento de alquiler
     * @request DELETE:/admin/alquileres/documento/delete/{id}
     * @secure
     * @response `200` `AlquileresDeleteDocumentoData`
     */
    deleteDocumento: (
      { id, ...query }: AlquileresDeleteDocumentoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<AlquileresDeleteDocumentoData, any>({
        path: `/admin/alquileres/documento/delete/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  storage = {
    /**
     * No description
     *
     * @tags storage
     * @name StorageUpload
     * @summary Subir un archivo (imagen, documento, video, etc.)
     * @request POST:/storage
     * @secure
     * @response `200` `StorageUploadData`
     */
    upload: (
      query: StorageUploadParams,
      data: StorageUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageUploadData, any>({
        path: `/storage`,
        method: "POST",
        query: query,
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags storage
     * @name StorageDelete
     * @summary Eliminar un archivo
     * @request DELETE:/storage/{publicId}
     * @secure
     * @response `200` `StorageDeleteData`
     */
    delete: (
      { publicId, ...query }: StorageDeleteParams,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageDeleteData, any>({
        path: `/storage/${publicId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags storage
     * @name StorageDownload
     * @summary Proxy para descargar/visualizar archivos de Azure (CORS-safe)
     * @request GET:/storage/download-file
     * @secure
     * @response `200` `StorageDownloadData`
     */
    download: (
      query: StorageDownloadParams,
      params: RequestParams = {},
    ) =>
      this.http.request<StorageDownloadData, any>({
        path: `/storage/download-file`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
}

/**
 * ==============================================================================
 *  UTILITARIOS DE TIPOS PARA FRONTEND
 * ==============================================================================
 */

/**
 * Extrae el tipo de respuesta (data) de un método de la API
 * @example ApiResponse<"clientes", "findAll"> → PaginatedClienteResultDto
 */
export type ApiResponse<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Api<unknown>[Module][Method] extends (...args: any) => Promise<{ data: infer Data }>
  ? Data
  : never;

/**
 * Extrae todos los argumentos de un método de la API
 */
type ApiArgs<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Parameters<
  Api<unknown>[Module][Method] extends (...args: any) => any ? Api<unknown>[Module][Method] : never
>;

/**
 * Extrae el tipo del body (data) de un método de la API
 * Busca el parámetro que se llama "data" en la firma del método
 * @example ApiBody<"clientes", "create"> → ClienteCreateDto
 * @example ApiBody<"clientes", "update"> → ClienteUpdateDto
 */
export type ApiBody<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = Required<ApiArgs<Module, Method>> extends [any, any, any, ...any[]]
  ? ApiArgs<Module, Method>[1]
  : Required<ApiArgs<Module, Method>> extends [any, any, ...any[]]
    ? ApiArgs<Module, Method>[0]
    : never;

/**
 * Extrae el tipo de los query params de un método de la API
 * Busca el parámetro que se llama "query" en la firma del método
 * @example ApiQuery<"clientes", "findAll"> → { page?: number, limit?: number, search?: string, ... }
 */
export type ApiQuery<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module]
> = ApiArgs<Module, Method> extends [infer Query, ...any[]]
  ? Query
  : never;

/**
 * Extrae el tipo de un parámetro específico (path param) de un método de la API
 * @example ApiParam<"clientes", "update", "id"> → number
 * @example ApiParam<"vehiculos", "findOne", "id"> → number
 */
export type ApiParam<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  ParamName extends ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
    ? keyof Arg1
    : never
> = ApiArgs<Module, Method> extends [infer Arg1, ...any[]]
  ? ParamName extends keyof Arg1
    ? Arg1[ParamName]
    : never
  : never;

/**
 * Extrae el tipo de un campo específico de la respuesta de un método de la API
 * @example ApiField<"usuarios", "findOne", "roles"> → UsuarioResultDtoRolesEnum[]
 * @example ApiField<"vehiculos", "findOne", "estado"> → VehiculoResultDtoEstadoEnum
 */
export type ApiField<
  Module extends keyof Api<unknown>,
  Method extends keyof Api<unknown>[Module],
  FieldName extends keyof ApiResponse<Module, Method>
> = ApiResponse<Module, Method>[FieldName];
