import { ApiResponse } from '@api/backend.api';
import * as XLSX from 'xlsx';

type ViajeReporte = ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>[number];
type ValorCelda = string | number | null;

const ZONA_HORARIA = 'America/Lima';
const MILISEGUNDOS_POR_DIA = 86_400_000;
const DESFASE_FECHA_EXCEL = 25_569;

const ENCABEZADOS = [
  'ID',
  'Placa',
  'Marca',
  'Modelo',
  'Fecha',
  'RUTA',
  'CONDUCTOR',
  'Hora Inicio',
  'Hora Fin',
  'Tiempo Trayecto',
  'km inicial',
  'km final',
  'ESTADO',
] as const;

const ANCHOS_COLUMNAS = [8, 13, 16, 18, 12, 32, 30, 13, 13, 17, 16, 16, 16];

const formateadorFechaHora = new Intl.DateTimeFormat('es-PE', {
  timeZone: ZONA_HORARIA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const obtenerFechaValida = (valor: string | null): Date | null => {
  if (!valor) return null;

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const obtenerParteFecha = (fecha: Date, tipo: Intl.DateTimeFormatPartTypes): number => {
  const parte = formateadorFechaHora.formatToParts(fecha).find((item) => item.type === tipo);
  return Number(parte?.value ?? 0);
};

const convertirFechaExcel = (valor: string | null): number | null => {
  const fecha = obtenerFechaValida(valor);
  if (!fecha) return null;

  const fechaUtc = Date.UTC(
    obtenerParteFecha(fecha, 'year'),
    obtenerParteFecha(fecha, 'month') - 1,
    obtenerParteFecha(fecha, 'day'),
  );

  return fechaUtc / MILISEGUNDOS_POR_DIA + DESFASE_FECHA_EXCEL;
};

const convertirHoraExcel = (valor: string | null): number | null => {
  const fecha = obtenerFechaValida(valor);
  if (!fecha) return null;

  const segundos =
    obtenerParteFecha(fecha, 'hour') * 3_600 +
    obtenerParteFecha(fecha, 'minute') * 60 +
    obtenerParteFecha(fecha, 'second');

  return segundos / 86_400;
};

const calcularDuracionExcel = (inicio: string | null, fin: string | null): number | null => {
  const fechaInicio = obtenerFechaValida(inicio);
  const fechaFin = obtenerFechaValida(fin);
  if (!fechaInicio || !fechaFin) return null;

  const duracion = fechaFin.getTime() - fechaInicio.getTime();
  return duracion >= 0 ? duracion / MILISEGUNDOS_POR_DIA : null;
};

const obtenerRuta = (viaje: ViajeReporte): string => {
  if (viaje.tipoRuta === 'fija' && viaje.rutaOrigen && viaje.rutaDestino) {
    return `${viaje.rutaOrigen} - ${viaje.rutaDestino}`;
  }

  return viaje.rutaOcasional || 'Sin ruta';
};

const crearFila = (viaje: ViajeReporte): ValorCelda[] => [
  viaje.id,
  viaje.vehiculoPlaca || '',
  viaje.vehiculoMarca || '',
  viaje.vehiculoModelo || '',
  convertirFechaExcel(viaje.fechaSalida),
  obtenerRuta(viaje),
  viaje.conductorNombre || '',
  convertirHoraExcel(viaje.fechaSalida),
  convertirHoraExcel(viaje.fechaLlegada),
  calcularDuracionExcel(viaje.fechaSalida, viaje.fechaLlegada),
  viaje.kilometrajeInicial,
  viaje.kilometrajeFinal,
  viaje.estado.replaceAll('_', ' ').toUpperCase(),
];

const aplicarFormato = (hoja: XLSX.WorkSheet, cantidadFilas: number): void => {
  hoja['!cols'] = ANCHOS_COLUMNAS.map((ancho) => ({ wch: ancho }));
  hoja['!rows'] = [{ hpt: 22 }];
  hoja['!autofilter'] = { ref: `A1:M${Math.max(cantidadFilas + 1, 1)}` };

  ENCABEZADOS.forEach((_, indice) => {
    const celda = hoja[XLSX.utils.encode_cell({ r: 0, c: indice })];
    if (!celda) return;

    celda.s = {
      font: { bold: true },
      alignment: { vertical: 'center' },
      border: { bottom: { style: 'thin', color: { rgb: '808080' } } },
    };
  });

  for (let fila = 2; fila <= cantidadFilas + 1; fila += 1) {
    const fecha = hoja[`E${fila}`];
    const horaInicio = hoja[`H${fila}`];
    const horaFin = hoja[`I${fila}`];
    const duracion = hoja[`J${fila}`];
    const kilometrajeInicial = hoja[`K${fila}`];
    const kilometrajeFinal = hoja[`L${fila}`];

    if (fecha) fecha.z = 'dd/mm/yyyy';
    if (horaInicio) horaInicio.z = 'hh:mm:ss';
    if (horaFin) horaFin.z = 'hh:mm:ss';
    if (duracion) duracion.z = '[hh]:mm:ss';
    if (kilometrajeInicial) kilometrajeInicial.z = '0.##;-0.##;0';
    if (kilometrajeFinal) kilometrajeFinal.z = '0.##;-0.##;0';
  }
};

export const crearLibroReporteViajesExcel = (
  data: ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>,
): XLSX.WorkBook => {
  const viajesOrdenados = [...data].sort((viajeA, viajeB) => {
    const fechaA = obtenerFechaValida(viajeA.fechaSalida)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const fechaB = obtenerFechaValida(viajeB.fechaSalida)?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return fechaA - fechaB || viajeA.id - viajeB.id;
  });

  const filas = viajesOrdenados.map(crearFila);
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([[...ENCABEZADOS], ...filas], {
    cellDates: true,
    dateNF: 'dd/mm/yyyy',
  });
  aplicarFormato(ws, filas.length);
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Viajes');
  return wb;
};

export const generateReporteViajesExcel = (
  data: ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>,
): void => {
  const wb = crearLibroReporteViajesExcel(data);

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_Viajes_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};
