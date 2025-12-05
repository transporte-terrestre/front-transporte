import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { ClienteCreateDto, ClienteResultDto, ClienteUpdateDto } from '@interface/admin/cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);

  findAll(): Observable<ClienteResultDto[]> {
    return this.http.get<ClienteResultDto[]>(API_URL.clientes.findAll);
  }

  findOne(id: number): Observable<ClienteResultDto> {
    return this.http.get<ClienteResultDto>(API_URL.clientes.findOne(id));
  }

  create(cliente: ClienteCreateDto): Observable<ClienteResultDto> {
    return this.http.post<ClienteResultDto>(API_URL.clientes.create, cliente);
  }

  update(id: number, cliente: ClienteUpdateDto): Observable<ClienteResultDto> {
    return this.http.patch<ClienteResultDto>(API_URL.clientes.update(id), cliente);
  }

  delete(id: number): Observable<ClienteResultDto> {
    return this.http.delete<ClienteResultDto>(API_URL.clientes.delete(id));
  }
}
