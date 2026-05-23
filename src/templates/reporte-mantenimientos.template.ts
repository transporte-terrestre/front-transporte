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

export interface ReporteMantenimientoPdfData {
  tipoReporte: 'mantenimientos-vehiculo' | 'mantenimientos-taller';
  entidadNombre: string;
  fechaInicio: string;
  fechaFin: string;
  mantenimientosVehiculo?: ApiResponse<'reportes', 'getMantenimientosDetalladosPorVehiculo'>;
  mantenimientosTaller?: ApiResponse<'reportes', 'getMantenimientosDetalladosPorTaller'>;
  totalCosto: number;
  selectedSignatures?: SignatureSelection[];
}

export const generateReporteMantenimientoPdf = async (data: ReporteMantenimientoPdfData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  // Colors
  const primaryColor = [245, 158, 11] as const; // Amber/Warning
  const textColor = [31, 41, 55] as const; // Gray-800
  const lightBg = [249, 250, 251] as const; // Gray-50
  const successColor = [34, 197, 94] as const; // Green
  const dangerColor = [239, 68, 68] as const; // Red
  const infoColor = [59, 130, 246] as const; // Blue

  // Get data based on report type
  const isVehiculo = data.tipoReporte === 'mantenimientos-vehiculo';
  const rawMantenimientos = isVehiculo
    ? data.mantenimientosVehiculo || []
    : data.mantenimientosTaller || [];

  // Sort: most recent first
  const mantenimientos = [...rawMantenimientos].sort((a: any, b: any) => {
    const dateA = a.fechaIngreso ? new Date(a.fechaIngreso).getTime() : 0;
    const dateB = b.fechaIngreso ? new Date(b.fechaIngreso).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate totals
  const totalPreventivos = mantenimientos.filter((m: any) => m.tipo === 'preventivo').length;
  const totalCorrectivos = mantenimientos.filter((m: any) => m.tipo === 'correctivo').length;
  const totalCosto = mantenimientos.reduce(
    (acc: number, m: any) => acc + (parseFloat(m.costoTotal) || 0),
    0,
  );

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
  doc.text('REPORTE DE MANTENIMIENTOS', margin + 8, y + 4);

  // Report Type Badge
  const tipoLabels: Record<string, string> = {
    'mantenimientos-vehiculo': 'POR VEHICULO',
    'mantenimientos-taller': 'POR TALLER',
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
  const entityLabel = isVehiculo ? 'Vehiculo:' : 'Taller:';
  drawField(entityLabel, data.entidadNombre, margin, y);

  // Date Range
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString('es-PE');
  };
  drawField('Periodo:', `${formatDate(data.fechaInicio)} - ${formatDate(data.fechaFin)}`, col2X, y);

  y += 8;

  // === SUMMARY CARDS (4 cards) ===
  const cardWidth = (pageWidth - margin * 2 - 15) / 4;
  const cardHeight = 18;

  // Card 1: Total Mantenimientos
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('TOTAL', margin + 3, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...textColor);
  doc.text(mantenimientos.length.toString(), margin + 3, y + 14);

  // Card 2: Preventivos
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + cardWidth + 5, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('PREVENTIVOS', margin + cardWidth + 8, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...infoColor);
  doc.text(totalPreventivos.toString(), margin + cardWidth + 8, y + 14);

  // Card 3: Correctivos
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + (cardWidth + 5) * 2, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('CORRECTIVOS', margin + (cardWidth + 5) * 2 + 3, y + 6);
  doc.setFontSize(12);
  doc.setTextColor(...primaryColor);
  doc.text(totalCorrectivos.toString(), margin + (cardWidth + 5) * 2 + 3, y + 14);

  // Card 4: Costo Total
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin + (cardWidth + 5) * 3, y, cardWidth, cardHeight, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('COSTO TOTAL', margin + (cardWidth + 5) * 3 + 3, y + 6);
  doc.setFontSize(10);
  doc.setTextColor(...successColor);
  doc.text(`S/ ${totalCosto.toFixed(2)}`, margin + (cardWidth + 5) * 3 + 3, y + 14);

  doc.setTextColor(...textColor);
  y += cardHeight + 10;

  // === TABLE ===
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalle de Mantenimientos', margin, y);
  y += 4;

  // Build table data based on report type
  let tableData: string[][];
  let headers: string[];

  if (isVehiculo) {
    headers = ['Orden', 'Tipo', 'Estado', 'Taller', 'Km', 'Costo', 'Fecha'];
    tableData = mantenimientos.map((m: any) => {
      const estadoLabels: Record<string, string> = {
        pendiente: 'Pendiente',
        en_proceso: 'En Proceso',
        finalizado: 'Finalizado',
      };

      const fechaIngreso = m.fechaIngreso
        ? new Date(m.fechaIngreso).toLocaleDateString('es-PE')
        : '---';

      return [
        m.codigoOrden || `#${m.id}`,
        m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1),
        estadoLabels[m.estado] || m.estado,
        m.tallerNombre || '---',
        m.kilometraje.toLocaleString(),
        `S/ ${parseFloat(m.costoTotal).toFixed(2)}`,
        fechaIngreso,
      ];
    });
  } else {
    headers = ['Orden', 'Vehiculo', 'Tipo', 'Estado', 'Km', 'Costo', 'Fecha'];
    tableData = mantenimientos.map((m: any) => {
      const estadoLabels: Record<string, string> = {
        pendiente: 'Pendiente',
        en_proceso: 'En Proceso',
        finalizado: 'Finalizado',
      };

      const fechaIngreso = m.fechaIngreso
        ? new Date(m.fechaIngreso).toLocaleDateString('es-PE')
        : '---';

      return [
        m.codigoOrden || `#${m.id}`,
        `${m.vehiculoPlaca} - ${m.vehiculoMarca}`,
        m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1),
        estadoLabels[m.estado] || m.estado,
        m.kilometraje.toLocaleString(),
        `S/ ${parseFloat(m.costoTotal).toFixed(2)}`,
        fechaIngreso,
      ];
    });
  }

  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 7,
      cellPadding: 2.5,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
      textColor: [50, 50, 50],
    },
    headStyles: {
      fillColor: [31, 41, 55],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7,
    },
    columnStyles: isVehiculo
      ? {
          0: { cellWidth: 25 },
          1: { cellWidth: 20 },
          2: { cellWidth: 22 },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 18, halign: 'right' },
          5: { cellWidth: 24, halign: 'right' },
          6: { cellWidth: 22, halign: 'center' },
        }
      : {
          0: { cellWidth: 25 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 20 },
          3: { cellWidth: 22 },
          4: { cellWidth: 18, halign: 'right' },
          5: { cellWidth: 24, halign: 'right' },
          6: { cellWidth: 22, halign: 'center' },
        },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    didParseCell: (cellData) => {
      // Color for type column
      const tipoColIndex = isVehiculo ? 1 : 2;
      if (cellData.column.index === tipoColIndex && cellData.section === 'body') {
        const tipo = cellData.cell.raw as string;
        if (tipo === 'Preventivo') {
          cellData.cell.styles.textColor = [59, 130, 246]; // Blue
        } else if (tipo === 'Correctivo') {
          cellData.cell.styles.textColor = [245, 158, 11]; // Amber
        }
      }
      // Color for status column
      const estadoColIndex = isVehiculo ? 2 : 3;
      if (cellData.column.index === estadoColIndex && cellData.section === 'body') {
        const estado = cellData.cell.raw as string;
        if (estado === 'Finalizado') {
          cellData.cell.styles.textColor = [34, 197, 94]; // Green
        } else if (estado === 'En Proceso') {
          cellData.cell.styles.textColor = [59, 130, 246]; // Blue
        } else if (estado === 'Pendiente') {
          cellData.cell.styles.textColor = [245, 158, 11]; // Amber
        }
      }
      // Color for cost column
      const costoColIndex = isVehiculo ? 5 : 5;
      if (cellData.column.index === costoColIndex && cellData.section === 'body') {
        cellData.cell.styles.textColor = [34, 197, 94]; // Green for money
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
  const filename = `Reporte_Mantenimientos_${data.tipoReporte.split('-')[1]}_${
    new Date().toISOString().split('T')[0]
  }.pdf`;
  doc.save(filename);
};
