import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MantenimientoResultDto } from '@interface/admin/mantenimiento.interface';

export const generateOrdenServicioPdf = (mantenimiento: MantenimientoResultDto) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  const drawField = (label: string, value: string, x: number, currentY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(label, x, currentY);
    const labelWidth = doc.getTextWidth(label);

    doc.setFont('helvetica', 'normal');
    doc.text(value, x + labelWidth + 2, currentY);
  };

  // --- Header ---
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `ORDEN DE SERVICIO Nro : ${mantenimiento.codigoOrden}`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, y);
  y += 8;

  doc.setFontSize(12);
  const subTitle = `Unidad: ${
    (mantenimiento.vehiculo?.codigoInterno || '') + '-' + (mantenimiento.vehiculo?.placa || '')
  }`;
  const subTitleWidth = doc.getTextWidth(subTitle);
  doc.text(subTitle, (pageWidth - subTitleWidth) / 2, y);
  y += 12;

  // --- Info Header ---
  const col2X = pageWidth / 2 + 10;

  // Line 1
  drawField(
    'Taller:',
    mantenimiento.taller?.nombreComercial || mantenimiento.taller?.razonSocial || '---',
    margin,
    y
  );
  drawField(
    'Tipo Mantenimiento:',
    mantenimiento.tipo === 'preventivo' ? 'Preventivo-Man' : 'Correctivo-Man',
    col2X,
    y
  );
  y += 6;

  // Line 2
  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString('es-PE') : '---');
  drawField('Fecha Inicio:', fmtDate(mantenimiento.fechaIngreso), margin, y);
  drawField('Fecha Término:', fmtDate(mantenimiento.fechaSalida), col2X, y);
  y += 6;

  // Line 3
  drawField('Odómetro:', mantenimiento.kilometraje.toString(), margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Km:', col2X, y);
  y += 10;

  // --- Table ---
  const tableThemeStyles = {
    theme: 'grid' as const,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [0, 0, 0] as any,
      lineWidth: 0.1,
      textColor: [0, 0, 0] as any,
    },
    headStyles: {
      fillColor: [180, 180, 180] as any,
      textColor: [0, 0, 0] as any,
      fontStyle: 'bold' as any,
      lineColor: [0, 0, 0] as any,
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' as const }, // Item
      1: { cellWidth: 20 }, // Cod
      3: { cellWidth: 40 }, // Responsable
      4: { cellWidth: 15 }, // H.Inicio
      5: { cellWidth: 15 }, // H.Fin
      6: { cellWidth: 20 }, // Firma
    },
  };

  const tareas = mantenimiento.tareas ?? [];
  const bodyData = tareas.map((t, index) => [
    (index + 1).toString(),
    t.codigo || '',
    t.descripcion,
    t.responsable || '',
    t.horaInicio || '',
    t.horaFin || '',
    '',
  ]);

  while (bodyData.length < 5) {
    bodyData.push(['', '', '', '', '', '', '']);
  }

  autoTable(doc, {
    startY: y,
    head: [
      ['Item', 'Cod.', 'Requerimientos/Trabajos', 'Responsable', 'H.Inicio', 'H.Fin', 'Firma'],
    ],
    body: bodyData,
    ...tableThemeStyles,
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- Trabajos Adicionales ---
  doc.setFont('helvetica', 'bold');
  doc.text('Trabajos Adicionales:', margin, y);
  y += 5;

  doc.setDrawColor(0);
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;
  doc.line(margin, y, pageWidth - margin, y);
  y += 7;
  doc.line(margin, y, pageWidth - margin, y);
  y += 25;

  // --- Signatures ---
  const sigY = y;
  const sigWidth = 60;

  // Left Signature
  doc.line(margin, sigY, margin + sigWidth, sigY);
  doc.setFontSize(7);
  doc.text('NESTOR YONATHAN ARI HEREDIA', margin + 5, sigY + 4);
  doc.text('PLANNER DE MANTENIMIENTO', margin + 8, sigY + 7);
  doc.text('TRANSPORTES LINEA S.A.', margin + 10, sigY + 10);

  // Right Signature
  const rightSigX = pageWidth - margin - sigWidth;
  doc.line(rightSigX, sigY, pageWidth - margin, sigY);
  doc.text('CARLOS ZUNIGA RAMIREZ', rightSigX + 10, sigY + 4);
  doc.text('SUPERVISOR DE MANTENIMIENTO', rightSigX + 5, sigY + 7);

  doc.save(`OrdenServicio_${mantenimiento.codigoOrden}.pdf`);
};
