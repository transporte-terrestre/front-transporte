import { UsuarioResultDto } from '../admin/usuario.interface';

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResultDto {
  accessToken: string;
  user: Partial<UsuarioResultDto>;
}
