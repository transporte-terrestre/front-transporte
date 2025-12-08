import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '@route/api.route';
import { StorageResultDto, StorageDeleteResultDto } from '@interface/admin/storage.interface';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private http = inject(HttpClient);

  upload(file: File, folder?: string): Observable<StorageResultDto> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<StorageResultDto>(API_URL.storage.upload({ folder }), formData);
  }

  delete(publicId: string): Observable<StorageDeleteResultDto> {
    return this.http.delete<StorageDeleteResultDto>(API_URL.storage.delete(publicId));
  }
}
