import { Injectable, inject } from '@angular/core';
import { Api, ApiQuery, ApiBody, ApiParam } from 'api/backend.api';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private api = inject(Api);
  async findAll(query: ApiQuery<'conductores', 'findAll'>) {
    return await this.api.conductores.findAll(query).then((response) => response.data);
  }
  async findAllEstadoDocumentos(query: ApiQuery<'conductores', 'findAllEstadoDocumentos'>) {
    return await this.api.conductores
      .findAllEstadoDocumentos(query)
      .then((response) => response.data);
  }
  async findOne(id: ApiParam<'conductores', 'findOne', 'id'>) {
    return await this.api.conductores.findOne({ id }).then((response) => response.data);
  }
  async create(conductor: ApiBody<'conductores', 'create'>) {
    return await this.api.conductores.create(conductor).then((response) => response.data);
  }
  async update(
    id: ApiParam<'conductores', 'update', 'id'>,
    conductor: ApiBody<'conductores', 'update'>,
  ) {
    return await this.api.conductores.update({ id }, conductor).then((response) => response.data);
  }
  async delete(id: ApiParam<'conductores', 'remove', 'id'>) {
    return await this.api.conductores.remove({ id }).then((response) => response.data);
  }
  async findDocumento(id: ApiParam<'conductores', 'findDocumento', 'id'>) {
    return await this.api.conductores.findDocumento({ id }).then((response) => response.data);
  }
  async createDocumento(documento: ApiBody<'conductores', 'createDocumento'>) {
    return await this.api.conductores.createDocumento(documento).then((response) => response.data);
  }
  async updateDocumento(
    id: ApiParam<'conductores', 'updateDocumento', 'id'>,
    documento: ApiBody<'conductores', 'updateDocumento'>,
  ) {
    return await this.api.conductores
      .updateDocumento({ id }, documento)
      .then((response) => response.data);
  }
  async deleteDocumento(id: ApiParam<'conductores', 'deleteDocumento', 'id'>) {
    return await this.api.conductores.deleteDocumento({ id }).then((response) => response.data);
  }

  async downloadDocumentos(id: number) {
    try {
      const response = await this.api.conductores.download({ id }, { format: 'blob' });

      // The response is already a Response generic due to axios/API generator setup, we can access data as the blob
      const blob = new Blob([response.data as any], { type: 'application/zip' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;

      // Intentar extraer el nombre del archivo de los headers si es posible
      let filename = `conductor_${id}_documentos.zip`;
      const headersMap = response.headers as any;
      if (headersMap && headersMap['content-disposition']) {
        const disposition = headersMap['content-disposition'];
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading documents:', error);
    }
  }
}
