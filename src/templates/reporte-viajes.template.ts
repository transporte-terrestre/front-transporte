import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViajeDetalladoDto } from '@interface/admin/reportes.interface';

export interface ReportePdfData {
  tipoReporte: 'vehiculo' | 'conductor' | 'cliente';
  entidadNombre: string;
  fechaInicio: string;
  fechaFin: string;
  viajes: ViajeDetalladoDto[];
  totalKilometros: number;
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

  // === SUMMARY CARDS ===
  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cardHeight = 18;

  // Card 1: Total Viajes
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('TOTAL VIAJES', margin + 4, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(...textColor);
  doc.text(data.viajes.length.toString(), margin + 4, y + 14);

  // Card 2: Completados
  const completados = data.viajes.filter((v) => v.estado === 'completado').length;
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + cardWidth + 5, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('COMPLETADOS', margin + cardWidth + 9, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(34, 197, 94); // Green
  doc.text(completados.toString(), margin + cardWidth + 9, y + 14);

  // Card 3: Total Km
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + (cardWidth + 5) * 2, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('KILÓMETROS', margin + (cardWidth + 5) * 2 + 4, y + 6);
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`${data.totalKilometros.toFixed(2)} km`, margin + (cardWidth + 5) * 2 + 4, y + 14);

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
        ? `${viaje.rutaOrigen} → ${viaje.rutaDestino}`
        : viaje.rutaOcasional || 'Sin ruta';

    const distancia = viaje.distancia ? `${viaje.distancia} km` : '—';

    const estadoLabels: Record<string, string> = {
      programado: 'Programado',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };

    const fechaSalida = viaje.fechaSalida
      ? new Date(viaje.fechaSalida).toLocaleDateString('es-PE')
      : '---';

    return [
      `#${viaje.id}`,
      ruta,
      viaje.modalidadServicio,
      estadoLabels[viaje.estado] || viaje.estado,
      distancia,
      fechaSalida,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [['ID', 'Ruta', 'Modalidad', 'Estado', 'Km', 'Fecha']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      textColor: [50, 50, 50],
    },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 18, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 25, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    didParseCell: (data) => {
      // Color for status column
      if (data.column.index === 3 && data.section === 'body') {
        const estado = data.cell.raw as string;
        if (estado === 'Completado') {
          data.cell.styles.textColor = [34, 197, 94];
        } else if (estado === 'En Progreso') {
          data.cell.styles.textColor = [59, 130, 246];
        } else if (estado === 'Cancelado') {
          data.cell.styles.textColor = [239, 68, 68];
        } else if (estado === 'Programado') {
          data.cell.styles.textColor = [245, 158, 11];
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // === FOOTER ===
  doc.setDrawColor(220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // Total Summary
  doc.setFillColor(...primaryColor);
  doc.roundedRect(pageWidth - margin - 60, y - 2, 60, 12, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255);
  doc.text(`Total: ${data.totalKilometros.toFixed(2)} km`, pageWidth - margin - 5, y + 6, {
    align: 'right',
  });

  doc.setTextColor(100);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('TRANSPORTES LINEA S.A. - Sistema de Gestión de Flota', margin, y + 5);

  // Save
  const filename = `Reporte_${data.tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
