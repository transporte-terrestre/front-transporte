import { Injectable, inject } from '@angular/core';
import { Api, ApiParam } from 'api/backend.api';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private api = inject(Api);
  async upload(file: File, folder: string) {
    return await this.api.storage.upload({ folder }, { file }).then((response) => response.data);
  }
  async delete(publicId: ApiParam<'storage', 'delete', 'publicId'>) {
    return await this.api.storage.delete({ publicId }).then((response) => response.data);
  }
}