export type EstadoViaje = 'programado' | 'en_progreso' | 'completado' | 'cancelado';

export interface ViajeResultDto {
  id: number;
  rutaId: number;
  vehiculoId: number;
  conductorId: number;
  fechaSalida: string;
  fechaLlegada: string | null;
  estado: EstadoViaje;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ViajeCreateDto {
  rutaId: number;
  vehiculoId: number;
  conductorId: number;
  fechaSalida: string;
  fechaLlegada?: string | null;
  estado?: EstadoViaje;
}

export interface ViajeUpdateDto extends Partial<ViajeCreateDto> {}
