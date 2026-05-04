import { ApiResponse, ViajeHojaRutaResultDto, Api } from '@api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: string;
  empresa: string;
}

export const generateReporteDiarioPdf = async (
  viaje: ApiResponse<'viajes', 'findOne'>,
  hojaRuta: ViajeHojaRutaResultDto | null = null,
  api?: Api<unknown>,
  signature?: SignatureSelection,
) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 12;
  let y = 15;

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      if (!url) return null;
      let relativePath = '';
      if (url.includes('.net/')) {
        const parts = url.split('.net/');
        const pathWithContainer = parts[1];
        const firstSlashIndex = pathWithContainer.indexOf('/');
        relativePath =
          firstSlashIndex !== -1
            ? decodeURIComponent(pathWithContainer.substring(firstSlashIndex + 1))
            : decodeURIComponent(pathWithContainer);
      } else {
        relativePath = decodeURIComponent(url.split('/').pop() || '');
      }

      if (!api) return null;

      const response = await api.storage.download({ path: relativePath });
      if (!response.ok) return null;

      const blob = await (response.blob ? response.blob() : (response as any).data);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

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

  const vehiculoData = (viaje as any).vehiculoPrincipal || {};
  const vehiculoDisplay = vehiculoData.placa ? (vehiculoData.marca ? `${vehiculoData.placa} - ${vehiculoData.marca}` : vehiculoData.placa) : '';
  drawFieldLine('PLACA DEL VEHÍCULO:', vehiculoDisplay.toUpperCase(), margin + 140, y, 90);

  y += 8;

  // Row 2: Conductor
  const conductorData = (viaje as any).conductorPrincipal || {};
  const conductorName = conductorData.nombreCompleto || 
                       (conductorData.nombres ? `${conductorData.nombres} ${conductorData.apellidos || ''}` : '');
  drawFieldLine('CONDUCTOR:', conductorName.toUpperCase(), margin, y, pageWidth - 2 * margin);

  y += 8;

  // Row 3: Cliente y Encargado
  const cliente = viaje.cliente;
  const clienteName = cliente?.razonSocial || cliente?.nombreCompleto || '';
  drawFieldLine('CLIENTE:', clienteName.toUpperCase(), margin, y, 130);

  const encargadoData = (viaje as any).encargado || {};
  const encargadoName = encargadoData.nombres ? `${encargadoData.nombres} ${encargadoData.apellidos || ''}` : '';
  drawFieldLine('ENCARGADO:', encargadoName.toUpperCase(), margin + 140, y, pageWidth - 2 * margin - 140);

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

  const obra = viaje.entidad?.nombreServicio ? viaje.entidad.nombreServicio.toUpperCase() : '';
  drawFieldLine('OBRA:', obra, margin + 120, y, 70);

  const rutaNombre = (viaje as any).nombreRuta || (viaje.ruta ? (viaje.ruta.destino ? `${viaje.ruta.origen} - ${viaje.ruta.destino}` : viaje.ruta.origen) : (viaje.rutaOcasional || ''));
  drawFieldLine('RUTA:', rutaNombre.toUpperCase(), margin + 195, y, pageWidth - 2 * margin - 195);

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

  // Left Signature (Company Supervisor)
  const leftSigX = margin;
  doc.line(leftSigX, sigY, leftSigX + sigWidth, sigY);
  doc.setFontSize(8);
  doc.text('FIRMA DEL SUPERVISOR INVERSIONES JR Y ASOCIADOS', leftSigX + sigWidth / 2, sigY + 4, {
    align: 'center',
    maxWidth: sigWidth,
  });

  // Center Signature (Driver)
  const centerSigX = pageWidth / 2 - sigWidth / 2;
  doc.line(centerSigX, sigY, centerSigX + sigWidth, sigY);
  doc.text('FIRMA DEL CONDUCTOR', pageWidth / 2, sigY + 4, { align: 'center' });

  // Right Signature (Contractor / Selected Signature)
  const rightSigX = pageWidth - margin - sigWidth;
  
  if (signature?.firmaUrl) {
    const imgW = 40;
    const imgH = 18;
    const base64 = await getBase64Image(signature.firmaUrl);
    if (base64) {
      const format = signature.firmaUrl.toLowerCase().includes('.jpg') || signature.firmaUrl.toLowerCase().includes('.jpeg') ? 'JPEG' : 'PNG';
      doc.addImage(base64, format, rightSigX + (sigWidth - imgW) / 2, sigY - 20, imgW, imgH);
    }
  }

  doc.line(rightSigX, sigY, rightSigX + sigWidth, sigY);
  
  if (signature) {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(signature.nombreCompleto.toUpperCase(), rightSigX + sigWidth / 2, sigY + 4, { align: 'center', maxWidth: sigWidth });
    doc.setFont('helvetica', 'normal');
    doc.text(signature.empresa.toUpperCase(), rightSigX + sigWidth / 2, sigY + 7, { align: 'center', maxWidth: sigWidth });
  } else {
    doc.text('FIRMA VB DEL CONTRATISTA', rightSigX + sigWidth / 2, sigY + 4, { align: 'center' });
  }

  doc.save(`Reporte_Diario_${viaje.id}.pdf`);
};
