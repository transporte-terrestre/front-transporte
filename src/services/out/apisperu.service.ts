import { Injectable } from '@angular/core';

export interface ApisPeruRucResponse {
  ruc: string;
  razonSocial: string;
  nombreComercial: string | null;
  telefonos: string[];
  tipo: string | null;
  estado: string;
  condicion: string;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
}

export interface ApisPeruDniResponse {
  success: boolean;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  codVerifica: number;
  codVerificaLetra: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApisPeruService {
  private readonly token =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Inhlcmlja2N1YUBnbWFpbC5jb20ifQ.IrQ8Gs0fuO9ykLZjpgkeiprlMBv8xPu52RyKzL-hxkQ';
  private readonly baseUrl = 'https://dniruc.apisperu.com/api/v1';

  async getRuc(ruc: string): Promise<ApisPeruRucResponse> {
    const url = `${this.baseUrl}/ruc/${ruc}?token=${this.token}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al consultar RUC');
    return await response.json();
  }

  async getDni(dni: string): Promise<ApisPeruDniResponse> {
    const url = `${this.baseUrl}/dni/${dni}?token=${this.token}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al consultar DNI');
    return await response.json();
  }
}
