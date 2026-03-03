import { ApiResponse, ViajeHojaRutaResultDto } from '@api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateReporteDiarioPdf = (
  viaje: ApiResponse<'viajes', 'findOne'>,
  hojaRuta: ViajeHojaRutaResultDto | null = null,
) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 12;
  let y = 15;

  // --- Logos and Title ---
  // Left side info (Placeholder for Inversiones JR logo)
  doc.setFontSize(8);
  doc.setTextColor(30, 60, 150);
  doc.setFont('helvetica', 'bold');
  doc.text('INVERSIONES JR Y ASOCIADOS SAC', margin, y);
  doc.setFontSize(7);
  doc.text('20609735237', margin + 12, y + 4);

  // Right side logo (Placeholder for Rentacar logo)
  doc.setFontSize(16);
  doc.setTextColor(220, 50, 20); // Redish mock logo color
  doc.setFont('helvetica', 'bolditalic');
  doc.text('Rentacar', pageWidth - margin - 35, y + 5);

  // Center Title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DIARIO DE TRABAJO DE VEHÍCULOS', pageWidth / 2, y + 5, { align: 'center' });

  y += 15;

  // --- Main Header Info Grid ---
  // Helper to draw a label and a value with an underline
  const drawFieldLine = (
    label: string,
    value: string,
    x: number,
    currentY: number,
    totalWidth: number,
  ) => {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(label, x, currentY);
    const labelWidth = doc.getTextWidth(label);
    const valueStartX = x + labelWidth + 2;

    doc.setFont('helvetica', 'normal');
    // Ensure the text fits on the line. We won't do advanced wrapping, just display:
    doc.text(value || '', valueStartX, currentY);

    // Draw underline from label end to the specified totalWidth boundary
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(valueStartX - 1, currentY + 1, x + totalWidth, currentY + 1);
  };

  const fmtDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleDateString('es-PE') : '';

  // Row 1: Fecha, Turno, Placa
  drawFieldLine('FECHA:', fmtDate(viaje.fechaSalida), margin, y, 60);

  const turno = viaje.turno ? (viaje.turno === 'dia' ? 'DÍA' : 'NOCHE') : 'DÍA';
  drawFieldLine('TURNO:', turno, margin + 70, y, 60);

  const vehiculo = viaje.vehiculos?.[0] || { placa: '' };
  drawFieldLine('PLACA DEL VEHÍCULO:', vehiculo.placa, margin + 140, y, 90);

  y += 8;

  // Row 2: Conductor
  const conductor = viaje.conductores?.[0] || { nombreCompleto: '', nombres: '' };
  const conductorName = conductor.nombreCompleto || (conductor as any).nombres || '';
  drawFieldLine('CONDUCTOR:', conductorName.toUpperCase(), margin, y, pageWidth - 2 * margin);

  y += 8;

  // Row 3: Cliente
  const cliente = viaje.cliente;
  const clienteName = cliente?.razonSocial || cliente?.nombreCompleto || '';
  drawFieldLine('CLIENTE:', clienteName.toUpperCase(), margin, y, pageWidth - 2 * margin);

  y += 8;

  // Row 4: Servicio & Obra
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICIO:', margin, y);
  doc.setFont('helvetica', 'normal');
  const svcX = margin + 20;
  doc.text('INTERNO (   )', svcX, y);
  doc.text('EXTERNO (   )', svcX + 30, y);
  doc.text('TRANSVERSAL (   )', svcX + 60, y);

  drawFieldLine('OBRA:', '', margin + 120, y, pageWidth - 2 * margin - 120);

  y += 8;

  // Row 5: Fuel Stats
  drawFieldLine('GALONES ABASTECIDOS:', '', margin, y, 50);
  drawFieldLine('KILOMETRAJE DE ABASTECIMIENTO:', '', margin + 60, y, 70);
  drawFieldLine('Nº VALE:', viaje.numeroVale || '', margin + 140, y, 40);
  drawFieldLine('HORA DE ABASTECIMIENTO:', '', margin + 190, y, pageWidth - 2 * margin - 190);

  y += 6;

  // --- Main Table ---
  const tableHeaders = [
    'HORA SALIDA',
    'KM INICIAL',
    'PUNTO PARTIDA',
    'PUNTO LLEGADA',
    'Nº PASAJEROS',
    'HR TERMINO\nSERVICIO',
    'KM FINAL',
    'TIEMPO DE\nSERVICIO',
    'KILOMETRAJE\nSERVICIO',
  ];

  const tableBody: any[][] =
    hojaRuta?.tramos?.map((t) => [
      t.horaSalida,
      t.kmInicial,
      t.puntoPartida,
      t.puntoLlegada,
      t.numeroPasajeros?.toString() || '0',
      t.horaTermino,
      t.kmFinal,
      t.tiempoRecorrido,
      t.kilometrajeRecorrido,
    ]) || [];

  // Pad table with empty rows up to roughly 12-15 to match the visual height
  const defaultRows = 14;
  while (tableBody.length < defaultRows) {
    tableBody.push(['', '', '', '', '', '', '', '', '']);
  }

  // To match the image exactly, we add a total row physically embedded inside the table
  // but as a special footer row to handle the right-alignment
  tableBody.push([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    {
      content: (hojaRuta?.kilometrajeTotal || '0') + ' KM',
      styles: { fontStyle: 'bold', halign: 'center' },
    },
  ]);

  autoTable(doc, {
    startY: y,
    head: [tableHeaders],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 7,
      font: 'helvetica',
      cellPadding: 1.5,
      halign: 'center',
      valign: 'middle',
      lineColor: [0, 0, 0],
      lineWidth: 0.2, // Darker grid lines
      textColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [200, 200, 200], // Gray background
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 22 },
      2: { halign: 'center' }, // Both departure and arrival centered according to image
      3: { halign: 'center' },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 22 },
      7: { cellWidth: 22 },
      8: { cellWidth: 26 },
    },
    margin: { left: margin, right: margin, bottom: 40 },
  });

  y = (doc as any).lastAutoTable.finalY;

  // --- Observations Box ---
  // The OBSERVACIONES header is inside a full-width cell physically attached to the table in the image
  doc.setFillColor(200, 200, 200);
  doc.rect(margin, y, pageWidth - margin * 2, 5, 'FD'); // Filled rectangle
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OBSERVACIONES', pageWidth / 2, y + 3.5, { align: 'center' });

  // Two empty rows below
  y += 5;
  doc.rect(margin, y, pageWidth - margin * 2, 5); // Empty row 1
  y += 5;
  doc.rect(margin, y, pageWidth - margin * 2, 5); // Empty row 2
  y += 5;

  // --- Signatures ---
  // Signatures should be positioned at the bottom, so use pageHeight - 15
  const sigY = pageHeight - 15;
  const sigWidth = 70;

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);

  // Left Signature
  doc.line(margin, sigY, margin + sigWidth, sigY);
  doc.setFontSize(8);
  doc.text('FIRMA DEL SUPERVISOR INVERSIONES JR Y ASOCIADOS', margin + sigWidth / 2, sigY + 4, {
    align: 'center',
    maxWidth: sigWidth,
  });

  // Center Signature
  const centerSigX = pageWidth / 2 - sigWidth / 2;
  doc.line(centerSigX, sigY, centerSigX + sigWidth, sigY);
  doc.text('FIRMA DEL CONDUCTOR', pageWidth / 2, sigY + 4, { align: 'center' });

  // Right Signature
  const rightSigX = pageWidth - margin - sigWidth;
  doc.line(rightSigX, sigY, rightSigX + sigWidth, sigY);
  doc.text('FIRMA VB DEL CONTRATISTA', rightSigX + sigWidth / 2, sigY + 4, { align: 'center' });

  doc.save(`Reporte_Diario_${viaje.id}.pdf`);
};
