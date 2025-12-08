export type TipoMantenimiento = 'preventivo' | 'correctivo';

export interface MantenimientoResultDto {
  id: number;
  vehiculoId: number;
  tipo: TipoMantenimiento;
  costo: string;
  descripcion: string;
  fecha: string;
  kilometraje: number;
  proveedor: string;
  creadoEn: string;
  actualizadoEn: string;
}

export interface MantenimientoCreateDto {
  vehiculoId: number;
  tipo: TipoMantenimiento;
  costo: string;
  descripcion: string;
  fecha: string;
  kilometraje: number;
  proveedor: string;
}

export interface MantenimientoUpdateDto extends Partial<MantenimientoCreateDto> {}
