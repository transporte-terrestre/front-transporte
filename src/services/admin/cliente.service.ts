import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import {
  ClienteCreateDto,
  ClienteResultDto,
  ClienteUpdateDto,
  PaginatedClienteResultDto,
  ClienteDocumentoResultDto,
  ClienteDocumentoCreateDto,
  ClienteDocumentoUpdateDto,
  ClientePaginationParams,
} from '@interface/admin/cliente.interface';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private http = inject(HttpClient);

  findAll(params?: ClientePaginationParams): Observable<PaginatedClienteResultDto> {
    return this.http.get<PaginatedClienteResultDto>(API_URL.clientes.findAll(params));
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

  findDocumento(id: number): Observable<ClienteDocumentoResultDto> {
    return this.http.get<ClienteDocumentoResultDto>(API_URL.clientes.documentos.find(id));
  }

  createDocumento(documento: ClienteDocumentoCreateDto): Observable<ClienteDocumentoResultDto> {
    return this.http.post<ClienteDocumentoResultDto>(API_URL.clientes.documentos.create, documento);
  }

  updateDocumento(
    id: number,
    documento: ClienteDocumentoUpdateDto
  ): Observable<ClienteDocumentoResultDto> {
    return this.http.patch<ClienteDocumentoResultDto>(
      API_URL.clientes.documentos.update(id),
      documento
    );
  }

  deleteDocumento(id: number): Observable<ClienteDocumentoResultDto> {
    return this.http.delete<ClienteDocumentoResultDto>(API_URL.clientes.documentos.delete(id));
  }
}
