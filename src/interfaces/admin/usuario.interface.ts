export type Rol = 'admin' | 'empleado';

export interface UsuarioResultDto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: Rol[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface UsuarioCreateDto {
  nombre: string;
  apellido: string;
  email: string;
  contrasenia: string;
  roles: Rol[];
}

export interface UsuarioUpdateDto extends Partial<UsuarioCreateDto> {}
