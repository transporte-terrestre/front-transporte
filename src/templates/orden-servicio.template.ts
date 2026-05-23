import { ApiResponse, Api } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: 'planner' | 'supervisor';
  empresa: string;
}

export const generateOrdenServicioPdf = async (
  mantenimiento: ApiResponse<'mantenimientos', 'findOne'>,
  selectedSignatures?: SignatureSelection[],
  api?: Api<unknown>,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  let y = margin;

  // Helper for centered text within a specific width
  const drawCenteredText = (text: string, xPos: number, yPos: number, width: number) => {
    const textWidth = doc.getTextWidth(text);
    doc.text(text || '', xPos + (width - textWidth) / 2, yPos);
  };

  // Helper for label and value on the same line
  const drawField = (label: string, value: string, xPos: number, yPos: number, labelWidth = 40) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, xPos, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(value || '—', xPos + labelWidth, yPos);
  };

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      if (!url) return null;
      
      // 1. Extract path from Azure URL: https://<account>.blob.core.windows.net/<container>/<path>
      let relativePath = '';
      if (url.includes('.net/')) {
        const parts = url.split('.net/');
        const pathWithContainer = parts[1];
        const firstSlashIndex = pathWithContainer.indexOf('/');
        relativePath = firstSlashIndex !== -1 ? pathWithContainer.substring(firstSlashIndex + 1) : pathWithContainer;
      } else {
        relativePath = url.split('/').pop() || '';
      }

      // 2. Use our generated Api proxy instead of hardcoded fetch
      if (!api) throw new Error('Api service not provided to PDF generator');
      
      const response = await api.storage.download({ path: relativePath });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const blob = await (response.blob ? response.blob() : (response as any).data);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error('Error fetching image via Api proxy:', e);
      return null;
    }
  };

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const title = `ORDEN DE SERVICIO Nro : ${mantenimiento.codigoOrden}`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (pageWidth - titleWidth) / 2, y);
  y += 10;

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
    'Taller',
    mantenimiento.taller?.nombreComercial || mantenimiento.taller?.razonSocial || '---',
    margin,
    y,
  );
  drawField(
    'Tipo Mantenimiento',
    mantenimiento.tipo === 'preventivo' ? 'Preventivo-Man' : 'Correctivo-Man',
    col2X,
    y,
  );
  y += 6;

  // Line 2
  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString('es-PE') : '---');
  drawField('Fecha Inicio', fmtDate(mantenimiento.fechaIngreso), margin, y);
  drawField('Fecha Término', fmtDate(mantenimiento.fechaSalida), col2X, y);
  y += 6;

  // Line 3
  drawField('Odómetro', mantenimiento.kilometraje?.toString() || '0', margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Km', col2X, y);
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
  const sigWidth = 70; 
  doc.setFontSize(7);

  const planner = selectedSignatures?.find((s) => s.rolEnDocumento === 'planner');
  const supervisor = selectedSignatures?.find((s) => s.rolEnDocumento === 'supervisor');

  // Left Signature (Planner)
  if (planner) {
    if (planner.firmaUrl) {
      const imgW = 40;
      const imgH = 18;
      const base64 = await getBase64Image(planner.firmaUrl);
      if (base64) {
        const format = planner.firmaUrl.toLowerCase().includes('.jpg') || planner.firmaUrl.toLowerCase().includes('.jpeg') ? 'JPEG' : 'PNG';
        doc.addImage(base64, format, margin + (sigWidth - imgW) / 2, sigY - 18, imgW, imgH);
      }
    }
    doc.line(margin, sigY, margin + sigWidth, sigY);
    doc.setFont('helvetica', 'bold');
    drawCenteredText(planner.nombreCompleto, margin, sigY + 4, sigWidth);
    doc.setFont('helvetica', 'normal');
    drawCenteredText(planner.empresa, margin, sigY + 7, sigWidth);
  }

  // Right Signature (Supervisor)
  if (supervisor) {
    const rightSigX = pageWidth - margin - sigWidth;
    if (supervisor.firmaUrl) {
      const imgW = 40;
      const imgH = 18;
      const base64 = await getBase64Image(supervisor.firmaUrl);
      if (base64) {
        const format = supervisor.firmaUrl.toLowerCase().includes('.jpg') || supervisor.firmaUrl.toLowerCase().includes('.jpeg') ? 'JPEG' : 'PNG';
        doc.addImage(base64, format, rightSigX + (sigWidth - imgW) / 2, sigY - 18, imgW, imgH);
      }
    }
    doc.line(rightSigX, sigY, pageWidth - margin, sigY);
    doc.setFont('helvetica', 'bold');
    drawCenteredText(supervisor.nombreCompleto, rightSigX, sigY + 4, sigWidth);
    doc.setFont('helvetica', 'normal');
    drawCenteredText(supervisor.empresa, rightSigX, sigY + 7, sigWidth);
  }

  doc.save(`OrdenServicio_${mantenimiento.codigoOrden}.pdf`);
};
