import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ViajeResultDto } from '@interface/admin/viaje.interface';

export const generateHojaRutaPdf = (viaje: ViajeResultDto) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  // Helper for Bold Label + Normal Value
  const drawField = (label: string, value: string, x: number, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x, currentY);
    const labelWidth = doc.getTextWidth(label);

    doc.setFont('helvetica', 'normal');
    doc.text(value, x + labelWidth + 2, currentY);
  };

  // --- Header ---

  // 1. Title Line (Centered) + Top Spacing
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const titleText = `HOJA DE RUTA NRO. ${viaje.id.toString().padStart(8, '0')}`;
  const titleWidth = doc.getTextWidth(titleText);
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(titleText, titleX, y);

  y += 6;

  // 2. Company & Op Line (Left & Right)
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSPORTES LINEA S.A.', margin, y);

  doc.setFontSize(10);
  doc.text('Op. Quellaveco', pageWidth - margin, y, { align: 'right' });

  y += 6;

  // 3. Address Line - Smaller and Grayish
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.setFont('helvetica', 'normal');
  doc.text('Dirección: Ofic Principal Av.D.A. Carrión 140, Urb. Sn Nicolás - TRUJILLO', margin, y);
  doc.text('Correo-Teléfono: informes@linea.pe - 0801-00-015', pageWidth - margin, y, {
    align: 'right',
  });
  doc.setTextColor(0); // Reset

  y += 4;
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // --- Trip Info ---
  const col2X = pageWidth / 2 + 5;

  // Row 1: Unit & Route
  const vehiculos = viaje.vehiculos ?? [];
  const vehiculo = vehiculos[0] || { codigoInterno: '---', placa: '---', marca: '', modelo: '' };

  drawField(
    'Unidad (Code-Placa):',
    `${vehiculo.codigoInterno || '---'} - ${vehiculo.placa}`,
    margin,
    y
  );

  const rutaOrigen = viaje.ruta?.origen || '---';
  const rutaDestino = viaje.ruta?.destino || '---';
  drawField('Ruta:', `${rutaOrigen} - ${rutaDestino}`, col2X, y);

  y += 6;

  // Row 2: Dates
  const fmtDate = (dateStr?: string | null) =>
    dateStr ? new Date(dateStr).toLocaleString('es-PE') : '---';
  drawField('F. de Inicio:', fmtDate(viaje.fechaSalida), margin, y);
  drawField('F. de Llegada:', fmtDate(viaje.fechaLlegada), col2X, y);

  y += 6;

  // Conductors & Crew
  const conductores = viaje.conductores ?? [];
  const tripulantes = viaje.tripulantes ?? [];

  // Max 3 rows
  for (let i = 0; i < 3; i++) {
    const conductor = conductores[i];
    const tripulante = tripulantes[i];

    const condLabel = `Conductor ${i + 1}:`;
    const condValue = conductor
      ? `${conductor.nombreCompleto || conductor.nombres} (Lic: ${
          conductor.numeroLicencia || '---'
        })`
      : '---';

    const tripLabel = `Tripulante ${i + 1}:`;
    const tripValue = tripulante || '---';

    drawField(condLabel, condValue, margin, y);
    drawField(tripLabel, tripValue, col2X, y);
    y += 5;
  }
  y += 3;

  // Modalidad
  drawField('Modalidad del Servicio:', viaje.modalidadServicio?.toUpperCase() || '---', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text(`Escalas comerciales:`, col2X, y);
  y += 4;

  // Common Table Styles
  const tableThemeStyles = {
    theme: 'grid' as const,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [200, 200, 200] as any,
      lineWidth: 0.1,
      textColor: [50, 50, 50] as any,
    },
    headStyles: {
      fillColor: [245, 247, 250] as any,
      textColor: [0, 0, 0] as any,
      fontStyle: 'bold' as any,
      lineColor: [200, 200, 200] as any,
      lineWidth: 0.1,
    },
  };

  // --- Tables: Escalas Comerciales ---
  autoTable(doc, {
    startY: y,
    head: [
      [
        { content: 'Salida', colSpan: 2, styles: { halign: 'center' } },
        { content: 'Llegada', colSpan: 2, styles: { halign: 'center' } },
      ],
      ['Terminal terrestre:', 'Hora:', 'Terminal terrestre:', 'Hora:'],
    ],
    body: [
      ['Firma:', 'DNI:', 'Firma:', 'DNI:'],
      ['SUP. EMBARQUE', '', 'UP. DESEMBARQUE', ''],
    ],
    ...tableThemeStyles,
    columnStyles: {
      0: { cellWidth: (pageWidth - margin * 2) / 4 },
      1: { cellWidth: (pageWidth - margin * 2) / 4 },
      2: { cellWidth: (pageWidth - margin * 2) / 4 },
      3: { cellWidth: (pageWidth - margin * 2) / 4 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 6;

  // --- Odometro ---
  autoTable(doc, {
    startY: y,
    body: [['Odómetro inicial', '', 'Odómetro final', '']],
    ...tableThemeStyles,
    columnStyles: {
      0: { cellWidth: 30, fontStyle: 'bold', fillColor: [250, 250, 250] as any },
      1: { cellWidth: 50 },
      2: { cellWidth: 30, fontStyle: 'bold', fillColor: [250, 250, 250] as any },
      3: { cellWidth: 'auto' },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // --- Conductors Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Datos Generales de los Conductores y Turno de Conducción', margin, y);
  y += 3;

  const conductoresData = conductores.map((c) => [
    c.nombreCompleto || `${c.nombres} ${c.apellidos}`,
    c.numeroLicencia || '',
    '',
    '',
    '',
  ]);

  while (conductoresData.length < 3) {
    conductoresData.push(['', '', '', '', '']);
  }

  autoTable(doc, {
    startY: y,
    head: [
      [
        {
          content: 'Nombres y Apellidos',
          rowSpan: 2,
          styles: { valign: 'middle', halign: 'center' },
        },
        { content: 'Nº de Licencia', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
        { content: 'Turno conducción', colSpan: 2, styles: { halign: 'center' } },
        { content: 'FIRMA', rowSpan: 2, styles: { valign: 'middle', halign: 'center' } },
      ],
      ['Inicio', 'Fin'],
    ],
    body: conductoresData,
    ...tableThemeStyles,
    headStyles: {
      ...tableThemeStyles.headStyles,
      halign: 'center',
      valign: 'middle',
    },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // --- Incidencias ---
  doc.setFont('helvetica', 'bold');
  doc.text('Incidencias del viaje', margin, y);
  y += 2;

  const createIncidenciaTable = (startY: number) => {
    autoTable(doc, {
      startY: startY,
      body: [
        [
          { content: 'Nombres y apellidos:', styles: { fontStyle: 'bold' } },
          '',
          { content: 'Lugar:', styles: { fontStyle: 'bold' } },
          '',
          { content: 'Fecha / hora:', styles: { fontStyle: 'bold' } },
          '',
        ],
        [
          {
            content: 'Dejo constancia que,',
            colSpan: 6,
            styles: { minCellHeight: 8, fontStyle: 'bold' },
          },
        ],
        [
          {
            content: 'FIRMA',
            colSpan: 3,
            styles: { halign: 'right', fontStyle: 'bold', valign: 'bottom' },
          },
          {
            content: 'DNI',
            colSpan: 3,
            styles: { halign: 'right', fontStyle: 'bold', valign: 'bottom' },
          },
        ],
      ],
      ...tableThemeStyles,
      columnStyles: {
        0: { cellWidth: 35, fillColor: [252, 252, 252] as any },
        2: { cellWidth: 15, fillColor: [252, 252, 252] as any },
        4: { cellWidth: 20, fillColor: [252, 252, 252] as any },
      },
      // Force the last row to have some height for the signature
      didParseCell: (data) => {
        if (data.row.index === 2) {
          data.cell.styles.minCellHeight = 8;
        }
      },
    });
    return (doc as any).lastAutoTable.finalY;
  };

  // Generate 2 blocks
  y = createIncidenciaTable(y);
  y += 5;
  createIncidenciaTable(y);

  doc.save(`HojaRuta_${viaje.id}.pdf`);
};
