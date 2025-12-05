import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { UsuarioCreateDto, UsuarioResultDto, UsuarioUpdateDto } from '@interface/admin/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);

  findAll(): Observable<UsuarioResultDto[]> {
    return this.http.get<UsuarioResultDto[]>(API_URL.usuarios.findAll);
  }

  findOne(id: number): Observable<UsuarioResultDto> {
    return this.http.get<UsuarioResultDto>(API_URL.usuarios.findOne(id));
  }

  create(usuario: UsuarioCreateDto): Observable<UsuarioResultDto> {
    return this.http.post<UsuarioResultDto>(API_URL.usuarios.create, usuario);
  }

  update(id: number, usuario: UsuarioUpdateDto): Observable<UsuarioResultDto> {
    return this.http.patch<UsuarioResultDto>(API_URL.usuarios.update(id), usuario);
  }

  delete(id: number): Observable<UsuarioResultDto> {
    return this.http.delete<UsuarioResultDto>(API_URL.usuarios.delete(id));
  }
}
