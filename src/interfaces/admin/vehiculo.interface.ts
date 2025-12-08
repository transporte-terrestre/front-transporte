export interface VehiculoResultDto {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  fechaVencimientoSoat: string;
  estado: 'activo' | 'taller' | 'retirado';
  imagenes: string[];
  documentos: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface VehiculoCreateDto {
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  kilometraje: number;
  fechaVencimientoSoat: string;
  estado?: 'activo' | 'taller' | 'retirado';
  imagenes?: string[];
  documentos?: string[];
}

export interface VehiculoUpdateDto extends Partial<VehiculoCreateDto> {}
