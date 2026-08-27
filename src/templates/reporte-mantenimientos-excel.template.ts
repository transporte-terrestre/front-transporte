import { ApiResponse } from '@api/backend.api';
import * as XLSX from 'xlsx-js-style';

type MantenimientoReporte =
  | ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'>[number]
  | ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>[number];

export interface ReporteMantenimientosExcelOptions {
  titulo?: string;
  subtitulo?: string;
  nombreArchivo?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

type Celda = string | number;

const COLUMNAS = [
  'N°',
  'PLACA',
  'MARCA / MODELO',
  'AÑO',
  'TIPO VEHÍCULO',
  'N° REPORTE',
  'TIPO MANT.',
  'INTERVENCIÓN',
  'FECHA SERVICIO',
  'KM AL SERVICIO',
  'KM PRÓXIMO MANT.',
  'TALLER / CONCESIONARIO',
  'N° FACTURA / CERTIFICADO',
  'COSTO',
  'MONEDA',
  'ESTADO UNIDAD',
  'OBSERVACIONES',
] as const;

const ANCHOS_COLUMNAS = [6, 13, 25, 8, 16, 20, 14, 36, 15, 16, 18, 34, 30, 14, 10, 18, 42];
const FILA_ENCABEZADOS = 3;
const COLOR_TITULO = '203C68';
const COLOR_ENCABEZADO = '2E5F9E';
const COLOR_FILA_PAR = 'E5F1FB';
const COLOR_FILA_IMPAR = 'F4F8FC';
const COLOR_BORDE = 'B8CDE0';
const COLOR_TEXTO = '1F2937';

const ESTADOS_UNIDAD: Record<string, string> = {
  disponible: 'OPERATIVA',
  circulacion: 'EN CIRCULACIÓN',
  taller: 'EN TALLER',
  alquilado: 'ALQUILADA',
  retirado: 'RETIRADA',
};

const TIPOS_MANTENIMIENTO: Record<string, string> = {
  preventivo: 'Preventivo',
  correctivo: 'Correctivo',
};

const COLOR_ESTADO: Record<string, string> = {
  operativa: '16803C',
  'en circulación': '1D4ED8',
  'en taller': 'B45309',
  alquilada: '7C3AED',
  retirada: '991B1B',
};

const obtenerFecha = (valor: unknown): Date | null => {
  if (!valor) return null;
  const fecha = new Date(String(valor));
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

const convertirFechaExcel = (valor: unknown): number | '' => {
  const fecha = obtenerFecha(valor);
  if (!fecha) return '';

  const partes = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(fecha)
    .reduce<Record<string, string>>((resultado, parte) => {
      resultado[parte.type] = parte.value;
      return resultado;
    }, {});

  return (
    Date.UTC(Number(partes['year']), Number(partes['month']) - 1, Number(partes['day'])) / 86_400_000 +
    25_569
  );
};

const numero = (valor: unknown): number | '' => {
  if (valor === null || valor === undefined || valor === '') return '';
  const resultado = Number(valor);
  return Number.isFinite(resultado) ? Number(resultado.toFixed(2)) : '';
};

const texto = (valor: unknown, predeterminado = '—'): string => {
  if (valor === null || valor === undefined || String(valor).trim() === '') return predeterminado;
  return String(valor).trim();
};

const formatearFechaConsulta = (valor?: string): string => {
  if (!valor) return '';
  const [anio, mes, dia] = valor.split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : valor;
};

const obtenerPeriodoConsulta = (fechaInicio?: string, fechaFin?: string): string => {
  const inicio = formatearFechaConsulta(fechaInicio);
  const fin = formatearFechaConsulta(fechaFin);
  if (inicio && fin) return `Periodo consultado: ${inicio} al ${fin}`;
  if (inicio) return `Periodo consultado desde: ${inicio}`;
  if (fin) return `Periodo consultado hasta: ${fin}`;
  return '';
};

const obtenerPlaca = (mantenimiento: Record<string, unknown>): string =>
  texto(mantenimiento['vehiculoPlaca']);

const obtenerTaller = (mantenimiento: Record<string, unknown>): string => {
  const nombre = texto(mantenimiento['tallerNombre'], '');
  const sucursal = texto(mantenimiento['tallerSucursal'], '');
  if (!nombre && !sucursal) return '—';
  if (!sucursal) return nombre;
  if (!nombre) return sucursal;
  return `${nombre} — ${sucursal}`;
};

const crearFila = (mantenimiento: MantenimientoReporte, indice: number): Celda[] => {
  const item = mantenimiento as MantenimientoReporte & Record<string, unknown>;
  const moneda = item.moneda === 'USD' ? 'USD' : 'PEN';
  const estado = texto(item.vehiculoEstado, '');
  const marca = texto(item.vehiculoMarca, '');
  const modelo = texto(item.vehiculoModelo, '');

  return [
    indice,
    obtenerPlaca(item),
    [marca, modelo].filter(Boolean).join(' / ') || '—',
    numero(item.vehiculoAnio),
    texto(item.vehiculoTipo),
    texto(item.codigoOrden || (item.id ? `#${item.id}` : null)),
    TIPOS_MANTENIMIENTO[String(item.tipo)] || texto(item.tipo),
    texto(item.intervencion || item.descripcion),
    convertirFechaExcel(item.fechaIngreso),
    numero(item.kilometraje),
    numero(item.kilometrajeProximoMantenimiento),
    obtenerTaller(item),
    texto(item.numeroFacturaCertificado),
    numero(item.costoTotal),
    moneda,
    ESTADOS_UNIDAD[estado] || texto(estado),
    texto(item.observaciones),
  ];
};

const aplicarBorde = () => ({
  top: { style: 'thin', color: { rgb: COLOR_BORDE } },
  bottom: { style: 'thin', color: { rgb: COLOR_BORDE } },
  left: { style: 'thin', color: { rgb: COLOR_BORDE } },
  right: { style: 'thin', color: { rgb: COLOR_BORDE } },
});

const aplicarEstilos = (
  hoja: XLSX.WorkSheet,
  cantidadFilas: number,
  mostrarPeriodo: boolean,
): void => {
  const ultimaColumna = XLSX.utils.encode_col(COLUMNAS.length - 1);
  const ultimaFila = FILA_ENCABEZADOS + cantidadFilas + 1;

  hoja['!cols'] = ANCHOS_COLUMNAS.map((wch) => ({ wch }));
  hoja['!rows'] = [
    { hpt: 30 },
    { hpt: 22 },
    { hpt: mostrarPeriodo ? 20 : 8 },
    { hpt: 38 },
    ...Array.from({ length: cantidadFilas }, () => ({ hpt: 32 })),
  ];
  hoja['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: COLUMNAS.length - 1 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: COLUMNAS.length - 1 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: COLUMNAS.length - 1 } },
  ];
  hoja['!autofilter'] = { ref: `A${FILA_ENCABEZADOS + 1}:${ultimaColumna}${ultimaFila}` };

  const estiloTitulo = {
    font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: 'FFFFFF' } },
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_TITULO } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };
  const estiloSubtitulo = {
    font: { name: 'Calibri', sz: 10, italic: true, color: { rgb: 'DCEBFA' } },
    fill: { patternType: 'solid', fgColor: { rgb: COLOR_TITULO } },
    alignment: { horizontal: 'center', vertical: 'center' },
  };
  const estiloPeriodo = {
    font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: COLOR_TITULO } },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: mostrarPeriodo ? 'DCEBFA' : 'FFFFFF' },
    },
    alignment: { horizontal: 'center', vertical: 'center' },
  };

  for (let columna = 0; columna < COLUMNAS.length; columna += 1) {
    const titulo = XLSX.utils.encode_cell({ r: 0, c: columna });
    const subtitulo = XLSX.utils.encode_cell({ r: 1, c: columna });
    const separador = XLSX.utils.encode_cell({ r: 2, c: columna });
    hoja[titulo] ||= { t: 's', v: '' };
    hoja[subtitulo] ||= { t: 's', v: '' };
    hoja[separador] ||= { t: 's', v: '' };
    hoja[titulo].s = estiloTitulo;
    hoja[subtitulo].s = estiloSubtitulo;
    hoja[separador].s = estiloPeriodo;
  }

  for (let columna = 0; columna < COLUMNAS.length; columna += 1) {
    const celda = hoja[XLSX.utils.encode_cell({ r: FILA_ENCABEZADOS, c: columna })];
    if (!celda) continue;
    celda.s = {
      font: { name: 'Calibri', sz: 10, bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: COLOR_ENCABEZADO } },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: aplicarBorde(),
    };
  }

  for (let fila = FILA_ENCABEZADOS + 1; fila <= ultimaFila; fila += 1) {
    const esFilaPar = fila % 2 === 0;
    for (let columna = 0; columna < COLUMNAS.length; columna += 1) {
      const direccion = XLSX.utils.encode_cell({ r: fila, c: columna });
      const celda = hoja[direccion];
      if (!celda) continue;

      celda.s = {
        font: { name: 'Calibri', sz: 10, color: { rgb: COLOR_TEXTO } },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: esFilaPar ? COLOR_FILA_PAR : COLOR_FILA_IMPAR },
        },
        alignment: {
          horizontal: [0, 3, 6, 8, 9, 10, 13, 14, 15].includes(columna)
            ? 'center'
            : 'left',
          vertical: 'center',
          wrapText: [2, 4, 7, 11, 12, 16].includes(columna),
        },
        border: aplicarBorde(),
      };

      if (columna === 8) celda.z = 'dd/mm/yyyy';
      if ([9, 10].includes(columna)) celda.z = '#,##0.##;[Red]-#,##0.##;0';
      if (columna === 13) celda.z = '#,##0.00;[Red]-#,##0.00;0.00';

      if (columna === 6) {
        celda.s.font = {
          name: 'Calibri',
          sz: 10,
          bold: true,
          color: { rgb: String(celda.v).toLowerCase() === 'correctivo' ? 'C2410C' : '2563A8' },
        };
      }

      if (columna === 15) {
        celda.s.font = {
          name: 'Calibri',
          sz: 10,
          bold: true,
          color: { rgb: COLOR_ESTADO[String(celda.v).toLowerCase()] || '166534' },
        };
      }
    }
  }
};

const aplicarEstiloResumen = (hoja: XLSX.WorkSheet): void => {
  hoja['!cols'] = [{ wch: 24 }, { wch: 18 }];
  hoja['!rows'] = [{ hpt: 24 }, { hpt: 22 }, { hpt: 22 }, { hpt: 22 }];

  ['A1', 'B1'].forEach((direccion) => {
    hoja[direccion].s = {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { patternType: 'solid', fgColor: { rgb: COLOR_ENCABEZADO } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: aplicarBorde(),
    };
  });

  ['A2', 'B2', 'A3', 'B3', 'A4', 'B4'].forEach((direccion) => {
    if (!hoja[direccion]) return;
    hoja[direccion].s = {
      fill: { patternType: 'solid', fgColor: { rgb: 'E5F1FB' } },
      border: aplicarBorde(),
    };
  });
  ['B2', 'B3', 'B4'].forEach((direccion) => {
    if (hoja[direccion]) hoja[direccion].z = direccion === 'B2' ? '0' : '#,##0.00;[Red]-#,##0.00;0.00';
  });
};

export const generateReporteMantenimientosExcel = (
  data:
    | ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'>
    | ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>,
  options: ReporteMantenimientosExcelOptions = {},
): void => {
  const mantenimientos = [...data].sort((a, b) => {
    const itemA = a as MantenimientoReporte & Record<string, unknown>;
    const itemB = b as MantenimientoReporte & Record<string, unknown>;
    const placaComparacion = obtenerPlaca(itemA).localeCompare(obtenerPlaca(itemB), 'es', {
      numeric: true,
      sensitivity: 'base',
    });
    if (placaComparacion !== 0) return placaComparacion;

    return (
      (obtenerFecha(itemA.fechaIngreso)?.getTime() || 0) -
      (obtenerFecha(itemB.fechaIngreso)?.getTime() || 0)
    );
  });

  const filas = mantenimientos.map((mantenimiento, indice) => crearFila(mantenimiento, indice + 1));
  const titulo = options.titulo || 'HISTORIAL COMPLETO DE MANTENIMIENTOS — TODAS LAS UNIDADES';
  const subtitulo =
    options.subtitulo ||
    'Ordenado por Unidad y Fecha | Preventivos y Correctivos | Inversiones JR y Asociados S.A.C.';
  const periodo = obtenerPeriodoConsulta(options.fechaInicio, options.fechaFin);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([[titulo], [subtitulo], [periodo], [...COLUMNAS], ...filas]);
  aplicarEstilos(ws, filas.length, Boolean(periodo));
  wb.Props = {
    Title: titulo,
    Subject: 'Historial completo de mantenimientos',
    Author: 'Inversiones JR y Asociados S.A.C.',
    Company: 'Inversiones JR y Asociados S.A.C.',
  };
  XLSX.utils.book_append_sheet(wb, ws, 'Historial Mantenimientos');

  const totales = mantenimientos.reduce(
    (resultado, mantenimiento) => {
      const item = mantenimiento as MantenimientoReporte & Record<string, unknown>;
      const moneda = item.moneda === 'USD' ? 'USD' : 'PEN';
      resultado[moneda] += Number(item.costoTotal) || 0;
      return resultado;
    },
    { PEN: 0, USD: 0 },
  );
  const resumen = XLSX.utils.aoa_to_sheet([
    ['CONCEPTO', 'VALOR'],
    ['Registros exportados', mantenimientos.length],
    ['Total soles (PEN)', Number(totales.PEN.toFixed(2))],
    ['Total dólares (USD)', Number(totales.USD.toFixed(2))],
  ]);
  aplicarEstiloResumen(resumen);
  XLSX.utils.book_append_sheet(wb, resumen, 'Resumen');

  const nombreArchivo =
    options.nombreArchivo || `Historial_Mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`;
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  window.URL.revokeObjectURL(url);
};
