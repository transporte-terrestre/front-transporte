import { ApiResponse } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportePdfData {
  tipoReporte: 'vehiculo' | 'conductor' | 'cliente';
  entidadNombre: string;
  fechaInicio: string;
  fechaFin: string;
  viajes: ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>;
  totalKilometrosFinales: number;
  totalKilometrosEstimados?: number;
  totalDiferencia?: number;
  totalHorasTotales?: number;
  totalHorasExcedidas?: number;
}

export const generateReportePdf = (data: ReportePdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  // Colors
  const primaryColor = [245, 158, 11] as const; // Amber/Secondary
  const textColor = [31, 41, 55] as const; // Gray-800
  const lightBg = [249, 250, 251] as const; // Gray-50
  const successColor = [34, 197, 94] as const; // Green
  const dangerColor = [239, 68, 68] as const; // Red
  const infoColor = [59, 130, 246] as const; // Blue

  // Calculate totals if not provided
  const totalKmEstimados =
    data.totalKilometrosEstimados ??
    data.viajes.reduce((acc, v) => {
      return acc + (v.distanciaEstimada ? parseFloat(v.distanciaEstimada) : 0);
    }, 0);

  const totalKmFinales =
    data.totalKilometrosFinales ??
    data.viajes.reduce((acc, v) => {
      return acc + (v.distanciaFinal ? parseFloat(v.distanciaFinal) : 0);
    }, 0);

  const totalDiferencia =
    data.totalDiferencia ?? data.viajes.reduce((acc, v) => acc + v.diferencia, 0);

  const totalHorasTotales =
    data.totalHorasTotales ?? data.viajes.reduce((acc, v) => acc + (v.horasTotales || 0), 0);

  const totalHorasExcedidas =
    data.totalHorasExcedidas ?? data.viajes.reduce((acc, v) => acc + (v.horasExcedidas || 0), 0);

  // Helper function
  const drawField = (label: string, value: string, x: number, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x, currentY);
    const labelWidth = doc.getTextWidth(label);

    doc.setFont('helvetica', 'normal');
    doc.text(value, x + labelWidth + 2, currentY);
  };

  // === HEADER ===

  // Title with accent line
  doc.setFillColor(...primaryColor);
  doc.rect(margin, y - 4, 4, 14, 'F'); // Left accent bar

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...textColor);
  doc.text('REPORTE DE VIAJES', margin + 8, y + 4);

  // Report Type Badge
  const tipoLabels: Record<string, string> = {
    vehiculo: 'POR VEHÍCULO',
    conductor: 'POR CONDUCTOR',
    cliente: 'POR CLIENTE',
  };

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(tipoLabels[data.tipoReporte] || '', margin + 8, y + 10);

  // Date on right
  doc.setFontSize(8);
  doc.setTextColor(100);
  const generatedDate = new Date().toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Generado: ${generatedDate}`, pageWidth - margin, y, { align: 'right' });
  doc.setTextColor(...textColor);

  y += 20;

  // === INFO SECTION ===
  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const col2X = pageWidth / 2 + 10;

  // Entity Name
  const entityLabel =
    data.tipoReporte === 'vehiculo'
      ? 'Vehículo:'
      : data.tipoReporte === 'conductor'
      ? 'Conductor:'
      : 'Cliente:';
  drawField(entityLabel, data.entidadNombre, margin, y);

  // Date Range
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString('es-PE');
  };
  drawField('Período:', `${formatDate(data.fechaInicio)} - ${formatDate(data.fechaFin)}`, col2X, y);

  y += 8;

  // === SUMMARY CARDS (4 cards now) ===
  const cardWidth = (pageWidth - margin * 2 - 15) / 4;
  const cardHeight = 18;

  // Card 1: Total Viajes
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('TOTAL VIAJES', margin + 3, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(data.viajes.length.toString(), margin + 3, y + 14);

  // Card 2: Km Estimados
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + cardWidth + 5, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('KM ESTIMADOS', margin + cardWidth + 8, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...infoColor);
  doc.text(totalKmEstimados.toFixed(2), margin + cardWidth + 8, y + 14);

  // Card 3: Km Finales
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + (cardWidth + 5) * 2, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('KM FINALES', margin + (cardWidth + 5) * 2 + 3, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(totalKmFinales.toFixed(2), margin + (cardWidth + 5) * 2 + 3, y + 14);

  // Card 4: Diferencia
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + (cardWidth + 5) * 3, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('DIFERENCIA', margin + (cardWidth + 5) * 3 + 3, y + 6);
  doc.setFontSize(12);
  // Color based on difference
  if (totalDiferencia > 0) {
    doc.setTextColor(...dangerColor);
    doc.text(`+${totalDiferencia.toFixed(2)}`, margin + (cardWidth + 5) * 3 + 3, y + 14);
  } else if (totalDiferencia < 0) {
    doc.setTextColor(...successColor);
    doc.text(totalDiferencia.toFixed(2), margin + (cardWidth + 5) * 3 + 3, y + 14);
  } else {
    doc.setTextColor(100);
    doc.text('0.00', margin + (cardWidth + 5) * 3 + 3, y + 14);
  }

  doc.setTextColor(...textColor);
  y += cardHeight + 10;

  // === TRIPS TABLE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Viajes', margin, y);
  y += 4;

  const tableData = data.viajes.map((viaje) => {
    const ruta =
      viaje.tipoRuta === 'fija' && viaje.rutaOrigen && viaje.rutaDestino
        ? `${viaje.rutaOrigen} - ${viaje.rutaDestino}`
        : viaje.rutaOcasional || 'Sin ruta';

    const kmEstimado = viaje.distanciaEstimada || '—';
    const kmFinal = viaje.distanciaFinal || '—';
    const diferencia =
      viaje.diferencia !== 0
        ? viaje.diferencia > 0
          ? `+${viaje.diferencia.toFixed(2)}`
          : viaje.diferencia.toFixed(2)
        : '0';

    const estadoLabels: Record<string, string> = {
      programado: 'Programado',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };

    const fechaSalida = viaje.fechaSalida
      ? new Date(viaje.fechaSalida).toLocaleDateString('es-PE')
      : '---';

    const horasContrato = viaje.horasContrato ? parseFloat(viaje.horasContrato).toFixed(2) : '-';
    const horasTotales = viaje.horasTotales ? viaje.horasTotales.toFixed(2) : '-';
    const horasExcedidas =
      viaje.horasExcedidas && viaje.horasExcedidas > 0
        ? `+${viaje.horasExcedidas.toFixed(2)}`
        : '-';

    return [
      `#${viaje.id}`,
      ruta,
      estadoLabels[viaje.estado] || viaje.estado,
      kmEstimado,
      kmFinal,
      diferencia,
      fechaSalida,
      horasContrato,
      horasTotales,
      horasExcedidas,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [
      ['ID', 'Ruta', 'Estado', 'Km Est.', 'Km Real', 'Dif.', 'Fecha', 'H. Ctr', 'H. Tot', 'H. Exc'],
    ],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2.5,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      textColor: [50, 50, 50],
      minCellWidth: 10,
    },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' }, // ID
      1: { halign: 'left' }, // Ruta - Auto width to fill space
      2: { cellWidth: 22 }, // Estado
      3: { cellWidth: 16, halign: 'right' }, // Km Est
      4: { cellWidth: 16, halign: 'right' }, // Km Real
      5: { cellWidth: 14, halign: 'right' }, // Dif
      6: { cellWidth: 22, halign: 'center' }, // Fecha
      7: { cellWidth: 16, halign: 'right' }, // H. Ctr
      8: { cellWidth: 16, halign: 'right' }, // H. Tot
      9: { cellWidth: 16, halign: 'right' }, // H. Exc
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    didParseCell: (cellData) => {
      // Color for status column
      if (cellData.column.index === 2 && cellData.section === 'body') {
        const estado = cellData.cell.raw as string;
        if (estado === 'Completado') {
          cellData.cell.styles.textColor = [34, 197, 94];
        } else if (estado === 'En Progreso') {
          cellData.cell.styles.textColor = [59, 130, 246];
        } else if (estado === 'Cancelado') {
          cellData.cell.styles.textColor = [239, 68, 68];
        } else if (estado === 'Programado') {
          cellData.cell.styles.textColor = [245, 158, 11];
        }
      }
      // Color for difference column
      if (cellData.column.index === 5 && cellData.section === 'body') {
        const dif = cellData.cell.raw as string;
        if (dif.startsWith('+')) {
          cellData.cell.styles.textColor = [239, 68, 68]; // Red for positive
        } else if (dif.startsWith('-')) {
          cellData.cell.styles.textColor = [34, 197, 94]; // Green for negative
        }
      }
      // Color for Exceeded hours column (Index 9 now)
      if (cellData.column.index === 9 && cellData.section === 'body') {
        const val = cellData.cell.raw as string;
        if (val.startsWith('+')) {
          cellData.cell.styles.textColor = [239, 68, 68]; // Red for exceeded
          cellData.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // === FOOTER ===
  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setTextColor(100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TRANSPORTES LINEA S.A. - Sistema de Gestion de Flota', margin, y + 8);

  // Save
  const filename = `Reporte_${data.tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
