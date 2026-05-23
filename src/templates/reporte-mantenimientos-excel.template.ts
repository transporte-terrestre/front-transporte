import { ApiResponse } from '@api/backend.api';
import * as XLSX from 'xlsx';

export const generateReporteMantenimientosExcel = (data: ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'> | ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>) => {
  const headers = [
    'Codigo Orden',
    'Vehiculo (Placa)',
    'Tipo',
    'Estado',
    'Taller',
    'Kilometraje',
    'Costo Total',
    'Fecha Ingreso',
    'Fecha Salida',
  ];

  // Sort by date most recent first
  const sortedData = [...data].sort((a: any, b: any) => {
    const dateA = a.fechaIngreso ? new Date(a.fechaIngreso).getTime() : 0;
    const dateB = b.fechaIngreso ? new Date(b.fechaIngreso).getTime() : 0;
    return dateB - dateA;
  });

  const rows = sortedData.map((m: any) => {
    return [
      m.codigoOrden || `#${m.id}`,
      m.vehiculoPlaca || '---',
      m.tipo,
      m.estado,
      m.tallerNombre || '---',
      m.kilometraje || 0,
      m.costoTotal ? parseFloat(m.costoTotal) : 0,
      m.fechaIngreso ? new Date(m.fechaIngreso).toLocaleDateString() : '---',
      m.fechaSalida ? new Date(m.fechaSalida).toLocaleDateString() : '---',
    ];
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte de Mantenimientos');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_Mantenimientos_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};
