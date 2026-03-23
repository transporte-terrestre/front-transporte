import { ApiResponse } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: 'planner' | 'supervisor';
}

export const generateOrdenServicioPdf = async (
  mantenimiento: ApiResponse<'mantenimientos', 'findOne'>,
  selectedSignatures?: SignatureSelection[],
) => {
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
    doc.text(value || '---', x + labelWidth + 2, currentY);
  };

  const addImageFromUrl = (
    url: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        try {
          doc.addImage(img, 'PNG', x, y, w, h);
        } catch (e) {
          console.error('Error adding image to PDF', e);
        }
        resolve();
      };
      img.onerror = () => {
        console.error('Error loading image', url);
        resolve();
      };
    });
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
    y,
  );
  drawField(
    'Tipo Mantenimiento:',
    mantenimiento.tipo === 'preventivo' ? 'Preventivo-Man' : 'Correctivo-Man',
    col2X,
    y,
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
      2: { cellWidth: 60 }, // Requerimientos/Trabajos
      3: { cellWidth: 30 }, // Responsable
      4: { cellWidth: 18 }, // H.Inicio
      5: { cellWidth: 18 }, // H.Fin
      6: { cellWidth: 20 }, // Firma
    },
  };

  const tareas = mantenimiento.tareas ?? [];
  const bodyData = tareas.map((t, index) => [
    (index + 1).toString(),
    t.tarea?.codigo || '',
    t.tarea?.nombreTrabajo || '',
    t.responsable || '',
    '', // H.Inicio - dejado vacío para llenar manualmente
    '', // H.Fin - dejado vacío para llenar manualmente
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
  y += 20;

  // --- Signatures ---
  const sigY = y + 15;
  const sigWidth = 60;
  doc.setFontSize(7);

  const planner = selectedSignatures?.find((s) => s.rolEnDocumento === 'planner');
  const supervisor = selectedSignatures?.find((s) => s.rolEnDocumento === 'supervisor');

  // Left Signature (Planner)
  if (planner?.firmaUrl) {
    await addImageFromUrl(planner.firmaUrl, margin + 10, sigY - 18, 40, 18);
  }
  doc.line(margin, sigY, margin + sigWidth, sigY);
  doc.text(planner?.nombreCompleto || 'PLANNER DE MANTENIMIENTO', margin + 5, sigY + 4);
  doc.text('PLANNER DE MANTENIMIENTO', margin + 8, sigY + 7);
  doc.text('TRANSPORTES LINEA S.A.', margin + 10, sigY + 10);

  // Right Signature (Supervisor)
  const rightSigX = pageWidth - margin - sigWidth;
  if (supervisor?.firmaUrl) {
    await addImageFromUrl(supervisor.firmaUrl, rightSigX + 10, sigY - 18, 40, 18);
  }
  doc.line(rightSigX, sigY, pageWidth - margin, sigY);
  doc.text(supervisor?.nombreCompleto || 'SUPERVISOR DE MANTENIMIENTO', rightSigX + 10, sigY + 4);
  doc.text('SUPERVISOR DE MANTENIMIENTO', rightSigX + 5, sigY + 7);

  doc.save(`OrdenServicio_${mantenimiento.codigoOrden}.pdf`);
};
