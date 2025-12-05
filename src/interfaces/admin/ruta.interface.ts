export interface RutaResultDto {
  id: number;
  origen: string;
  destino: string;
  origenLat: string;
  origenLng: string;
  destinoLat: string;
  destinoLng: string;
  distancia: string;
  costoBase: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface RutaCreateDto {
  origen: string;
  destino: string;
  origenLat: string;
  origenLng: string;
  destinoLat: string;
  destinoLng: string;
  distancia: string;
  costoBase: string;
}

export interface RutaUpdateDto extends Partial<RutaCreateDto> {}
