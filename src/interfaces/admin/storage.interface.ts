export interface StorageResultDto {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resourceType: string;
  createdAt: string;
}

export interface StorageDeleteResultDto {
  result: string;
}
