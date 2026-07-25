import { ApiResponse } from '@api/backend.api';
import { applyMaxTwoDecimalFormat, roundToMaxTwoDecimals } from '@helper/excel.helper';
import * as XLSX from 'xlsx';

export const generateReporteViajesExcel = (data: ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>) => {
  const headers = [
    'ID',
    'Ruta',
    'Estado',
    'Km Estimado',
    'Km Real',
    'Diferencia',
    'Fecha Salida',
    'Vehiculo (Placa)',
    'Conductor',
    'Horas Contrato',
    'Horas Totales',
    'Horas Excedidas',
  ];

  // Sort by date most recent first
  const sortedData = [...data].sort((a, b) => {
    const dateA = a.fechaSalida ? new Date(a.fechaSalida).getTime() : 0;
    const dateB = b.fechaSalida ? new Date(b.fechaSalida).getTime() : 0;
    return dateB - dateA;
  });

  const rows = sortedData.map((v) => {
    const ruta =
      v.tipoRuta === 'fija' && v.rutaOrigen && v.rutaDestino
        ? `${v.rutaOrigen} - ${v.rutaDestino}`
        : v.rutaOcasional || 'Sin ruta';

    return [
      v.id,
      ruta,
      v.estado,
      roundToMaxTwoDecimals(v.distanciaEstimada ? parseFloat(v.distanciaEstimada) : 0),
      roundToMaxTwoDecimals(v.distanciaFinal ? parseFloat(v.distanciaFinal) : 0),
      roundToMaxTwoDecimals(v.diferencia || 0),
      v.fechaSalida ? new Date(v.fechaSalida).toLocaleDateString() : '---',
      v.vehiculoPlaca || '---',
      v.conductorNombre || '---',
      roundToMaxTwoDecimals(v.horasContrato ? parseFloat(v.horasContrato) : 0),
      roundToMaxTwoDecimals(v.horasTotales || 0),
      roundToMaxTwoDecimals(v.horasExcedidas || 0),
    ];
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyMaxTwoDecimalFormat(ws);
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Viajes');

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
