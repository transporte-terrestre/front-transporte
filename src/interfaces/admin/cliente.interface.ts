export interface ClienteResultDto {
  id: number;
  dni: string;
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ClienteCreateDto {
  dni: string;
  nombre: string;
  apellido: string;
  email?: string | null;
  telefono?: string | null;
  direccion?: string | null;
}

export interface ClienteUpdateDto extends Partial<ClienteCreateDto> {}
