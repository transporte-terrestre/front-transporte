import { Injectable, inject } from '@angular/core';
import { Api, ApiBody } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class DescargasService {
  private api = inject(Api);

  async descargarDocumentosZip(payload: ApiBody<'descargas', 'descargarDocumentosZip'>) {
    const { data } = await this.api.descargas.descargarDocumentosZip(payload, {
      format: 'blob' as any
    });
    return data;
  }
}
