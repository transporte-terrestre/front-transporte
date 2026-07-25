import { ApiResponse } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: string;
  empresa: string;
}

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
  selectedSignatures?: SignatureSelection[];
}

type ViajeReporteItem = ApiResponse<'reportes', 'getViajesDetalladosPorCliente'>[number] & {
  nombreRuta?: string | null;
};

export const generateReportePdf = async (data: ReportePdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  // Colors
  const primaryColor = [245, 158, 11] as const; // Amber/Secondary
  const textColor = [31, 41, 55] as const; // Gray-800
  const lightBg = [249, 250, 251] as const; // Gray-50
  const infoColor = [59, 130, 246] as const; // Blue

  // Calculate totals if not provided
  const totalKmReales =
    data.totalKilometrosFinales ??
    data.viajes.reduce((acc, v) => {
      return acc + (v.distanciaFinal ? parseFloat(v.distanciaFinal) : 0);
    }, 0);

  const totalHorasTotales =
    data.totalHorasTotales ?? data.viajes.reduce((acc, v) => acc + (v.horasTotales || 0), 0);

  const drawCenteredText = (text: string, x: number, currentY: number, width: number) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text, x + (width - textWidth) / 2, currentY);
  };

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

  // Sort trips: most recent first
  const sortedViajes = [...data.viajes].sort((a, b) => {
    const dateA = a.fechaSalida ? new Date(a.fechaSalida).getTime() : 0;
    const dateB = b.fechaSalida ? new Date(b.fechaSalida).getTime() : 0;
    return dateB - dateA;
  });

  const getRutaDisplay = (viaje: ViajeReporteItem): string => {
    if (viaje.nombreRuta?.trim()) {
      return viaje.nombreRuta.trim();
    }

    if (viaje.rutaOrigen && viaje.rutaDestino) {
      return `${viaje.rutaOrigen} - ${viaje.rutaDestino}`;
    }

    return viaje.rutaOcasional || 'Sin ruta';
  };

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

  const summaryCards = [
    { label: 'TOTAL VIAJES', value: data.viajes.length.toString(), color: textColor },
    { label: 'KM REALES', value: totalKmReales.toFixed(2), color: infoColor },
    { label: 'HORA TOTAL', value: totalHorasTotales.toFixed(2), color: primaryColor },
  ];

  summaryCards.forEach((card, index) => {
    const cardX = margin + index * (cardWidth + 5);
    doc.setFillColor(...lightBg);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100);
    doc.text(card.label, cardX + 3, y + 6);
    doc.setFontSize(12);
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    doc.text(card.value, cardX + 3, y + 14);
  });

  doc.setTextColor(...textColor);
  y += cardHeight + 10;

  // === TRIPS TABLE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Viajes', margin, y);
  y += 4;

  const tableData = sortedViajes.map((viaje) => {
    const ruta = getRutaDisplay(viaje);

    const kmReal = viaje.distanciaFinal || '—';
    const estadoLabels: Record<string, string> = {
      programado: 'Programado',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };

    const fechaSalida = viaje.fechaSalida
      ? new Date(viaje.fechaSalida).toLocaleDateString('es-PE')
      : '---';

    const horasTotales = viaje.horasTotales ? viaje.horasTotales.toFixed(2) : '-';
    const conductor = viaje.conductorNombre || '---';
    const unidad = [viaje.vehiculoPlaca, viaje.vehiculoMarca, viaje.vehiculoModelo]
      .filter(Boolean)
      .join(' - ') || '---';

    return [
      `#${viaje.id}`,
      ruta,
      estadoLabels[viaje.estado] || viaje.estado,
      kmReal,
      fechaSalida,
      horasTotales,
      conductor,
      unidad,
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [
      ['ID', 'Ruta', 'Estado', 'Km Real', 'Fecha', 'Hora Total', 'Conductor', 'Unidad'],
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
      0: { cellWidth: 11, halign: 'center' }, // ID
      1: { halign: 'left' }, // Ruta - Auto width to fill space
      2: { cellWidth: 20 }, // Estado
      3: { cellWidth: 14, halign: 'right' }, // Km Real
      4: { cellWidth: 20, halign: 'center' }, // Fecha
      5: { cellWidth: 18, halign: 'right' }, // Hora total
      6: { cellWidth: 28, halign: 'left' }, // Conductor
      7: { cellWidth: 30, halign: 'left' }, // Unidad
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
    },
  });

  y = (doc as any).lastAutoTable.finalY + 20;

  // Check if we need a new page for signatures
  if (y > doc.internal.pageSize.height - 40) {
    doc.addPage();
    y = 30;
  }

  // === Signatures ===
  if (data.selectedSignatures && data.selectedSignatures.length > 0) {
    const sigY = y + 20;
    const sigWidth = 60;
    const sigSpacing = (pageWidth - margin * 2 - sigWidth * data.selectedSignatures.length) / (data.selectedSignatures.length + 1);

    for (let i = 0; i < data.selectedSignatures.length; i++) {
      const sig = data.selectedSignatures[i];
      const sigX = margin + sigSpacing + i * (sigWidth + sigSpacing);

      if (sig.firmaUrl) {
        const imgW = 40;
        const imgH = 18;
        const base64 = await getBase64Image(sig.firmaUrl);
        if (base64) {
          const format = sig.firmaUrl.toLowerCase().includes('.jpg') || sig.firmaUrl.toLowerCase().includes('.jpeg') ? 'JPEG' : 'PNG';
          doc.addImage(base64, format, sigX + (sigWidth - imgW) / 2, sigY - 18, imgW, imgH);
        }
      }

      doc.setDrawColor(0);
      doc.line(sigX, sigY, sigX + sigWidth, sigY);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      drawCenteredText(sig.nombreCompleto, sigX, sigY + 5, sigWidth);
      doc.setFont('helvetica', 'normal');
      drawCenteredText(sig.empresa, sigX, sigY + 8, sigWidth);
    }
  }

  // === FOOTER ===
  // doc.setDrawColor(220);
  // doc.line(margin, y, pageWidth - margin, y);

  // Save
  const filename = `Reporte_${data.tipoReporte}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
