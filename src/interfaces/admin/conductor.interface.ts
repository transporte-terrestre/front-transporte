export type ClaseLicencia = 'A' | 'B';
export type CategoriaLicencia = 'Uno' | 'Dos' | 'Tres';

export interface ConductorResultDto {
  id: number;
  dni: string;
  nombre: string;
  numeroLicencia: string;
  claseLicencia: ClaseLicencia;
  categoriaLicencia: CategoriaLicencia;
  fechaExpedicion: string;
  fechaRevalidacion: string;
  imagenes: string[];
  documentos: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface ConductorCreateDto {
  dni: string;
  nombre: string;
  numeroLicencia: string;
  claseLicencia: ClaseLicencia;
  categoriaLicencia: CategoriaLicencia;
  fechaExpedicion: string;
  fechaRevalidacion: string;
  imagenes?: string[];
  documentos?: string[];
}

export interface ConductorUpdateDto extends Partial<ConductorCreateDto> {}
