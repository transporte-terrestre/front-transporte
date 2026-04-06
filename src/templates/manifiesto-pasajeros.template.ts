import { ApiResponse, ViajePasajeroResultDto, Api } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface SignatureSelection {
  userId: number;
  nombreCompleto: string;
  firmaUrl: string;
  rolEnDocumento: string;
}

export const generateManifiestoPasajerosPdf = async (
  viaje: ApiResponse<'viajes', 'findOne'>,
  pasajeros: ViajePasajeroResultDto[],
  api?: Api<unknown>,
  signature?: SignatureSelection,
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      if (!url) return null;
      let relativePath = '';
      if (url.includes('.net/')) {
        const parts = url.split('.net/');
        const pathWithContainer = parts[1];
        const firstSlashIndex = pathWithContainer.indexOf('/');
        relativePath = firstSlashIndex !== -1 ? pathWithContainer.substring(firstSlashIndex + 1) : pathWithContainer;
      } else {
        relativePath = url.split('/').pop() || '';
      }

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

  const drawCenteredText = (text: string, xPos: number, yPos: number, width: number) => {
    const textWidth = doc.getTextWidth(text || '');
    doc.text(text || '', xPos + (width - textWidth) / 2, yPos);
  };

  // Header Logos/Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('JJC', margin, y + 6);
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('INGENIERÍA\nY CONSTRUCCIÓN', margin, y + 10);

  // Center Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'italic');
  doc.text('MANIFIESTO DE PASAJEROS', pageWidth / 2, y + 8, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nº FICHA: ${viaje.id}`, pageWidth / 2, y + 14, { align: 'center' });

  // Right Logos/Titles
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bolditalic');
  doc.text('Rentacar', pageWidth - margin, y + 3, { align: 'right' });
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('INVERSIONES JR Y ASOCIADOS SAC\n20609735237', pageWidth - margin, y + 7, { align: 'right' });

  y += 18;

  // Box 1: Company Info
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] },
    body: [
      [
        { content: `RUC:\n${(viaje as any).cliente?.ruc || '20609735237'}`, styles: { halign: 'left', cellWidth: 25 } },
        { content: `RAZON SOCIAL:\n${(viaje as any).cliente?.razonSocial || 'INVERSIONES JR Y ASOCIADOS S.A.C.'}`, styles: { halign: 'left' } },
        { content: 'TELEFONO:\n', styles: { halign: 'left', cellWidth: 35 } },
        { content: `DIRECCION:\n${(viaje as any).cliente?.direccion || 'LIMA'}`, styles: { halign: 'left', cellWidth: 40 } }
      ]
    ]
  });
  y = (doc as any).lastAutoTable.finalY;

  // Row 2: Trip details
  let rutaTexto = '---';
  if ((viaje as any).nombreRuta) {
    rutaTexto = (viaje as any).nombreRuta;
  } else if ((viaje as any).tipoRuta === 'ocasional' || (viaje as any).rutaOcasional) {
    rutaTexto = (viaje as any).rutaOcasional || '---';
  } else if ((viaje as any).ruta) {
    const r = (viaje as any).ruta;
    const origen = r.origen || r.rutaIda?.origen || '';
    const destino = r.destino || r.rutaIda?.destino || '';
    if (origen && destino) {
      rutaTexto = `${origen} - ${destino}`;
    } else {
      rutaTexto = r.nombre || '---';
    }
  } else if ((viaje as any).descripcionRuta) {
    rutaTexto = (viaje as any).descripcionRuta;
  }

  const fecha = viaje.fechaSalida ? new Date(viaje.fechaSalida).toLocaleDateString('es-PE') : '---';
  const hora = viaje.fechaSalida ? new Date(viaje.fechaSalida).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '---';
  
  const vehiculos = viaje.vehiculos ?? [];
  const placa = vehiculos[0]?.placa || '---';

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] },
    body: [
      [
        { content: `RUTA:\n${rutaTexto}` },
        { content: `FECHA:\n${fecha}`, styles: { cellWidth: 25, halign: 'center' } },
        { content: `HORA:\n${hora}`, styles: { cellWidth: 25, halign: 'center' } },
        { content: `PLACA:\n${placa}`, styles: { cellWidth: 25, halign: 'center' } }
      ]
    ]
  });
  y = (doc as any).lastAutoTable.finalY;

  // Row 3: Conductores
  const conductores = viaje.conductores ?? [];
  const c1 = conductores[0];
  const c2 = conductores[1];
  
  const cond1 = c1 ? `${c1.nombres || ''} ${c1.apellidos || ''}`.trim() : '---';
  const lic1 = c1?.numeroLicencia ? ` / LICENCIA: ${c1.numeroLicencia}` : '';
  
  const cond2 = c2 ? `${c2.nombres || ''} ${c2.apellidos || ''}`.trim() : '---';
  const lic2 = c2?.numeroLicencia ? ` / LICENCIA: ${c2.numeroLicencia}` : '';

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] },
    columnStyles: {
      0: { cellWidth: (pageWidth - 2 * margin) / 2 },
      1: { cellWidth: (pageWidth - 2 * margin) / 2 }
    },
    body: [
      [
        { content: `CONDUCTOR 1: ${cond1}${lic1}` },
        { content: `CONDUCTOR 2: ${cond2}${lic2}` }
      ]
    ]
  });
  y = (doc as any).lastAutoTable.finalY + 2;

  // Passenger Table Data
  const tableData = pasajeros.map((p, index) => {
    const nombres = p.nombres || '';
    const apellidos = p.apellidos || '';
    return [
      (index + 1).toString(),
      `${nombres} ${apellidos}`.trim(),
      p.dni || '',
      (viaje as any).cliente?.razonSocial || '', // Empresa
      '', // Firma Ida
      ''  // Firma Retorno
    ];
  });

  while (tableData.length < 18) {
    const nextIndex = tableData.length + 1;
    tableData.push([nextIndex.toString(), '', '', '', '', '']);
  }

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    head: [
      [
        { content: 'Nº', styles: { halign: 'center', cellWidth: 10 } },
        { content: 'NOMBRES Y APELLIDOS', styles: { halign: 'center' } },
        { content: 'DNI', styles: { halign: 'center', cellWidth: 25 } },
        { content: 'EMPRESA', styles: { halign: 'center', cellWidth: 25 } },
        { content: 'FIRMA IDA', styles: { halign: 'center', cellWidth: 25 } },
        { content: 'FIRMA RETORNO', styles: { halign: 'center', cellWidth: 25 } }
      ]
    ],
    body: tableData,
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: [242, 228, 28], 
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center' }
    }
  });

  y = (doc as any).lastAutoTable.finalY + 20;

  // Footer signature
  if (y + 35 > doc.internal.pageSize.height) {
    doc.addPage();
    y = 25;
  }
  
  const sigWidth = 70;
  const sigX = (pageWidth - sigWidth) / 2; // Center the single signature
  
  if (signature?.firmaUrl) {
    const imgW = 45;
    const imgH = 20;
    const base64 = await getBase64Image(signature.firmaUrl);
    if (base64) {
      const format = signature.firmaUrl.toLowerCase().includes('.jpg') ? 'JPEG' : 'PNG';
      doc.addImage(base64, format, sigX + (sigWidth - imgW) / 2, y - 18, imgW, imgH);
    }
  }

  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(sigX, y, sigX + sigWidth, y);
  doc.setLineDashPattern([], 0); 
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  drawCenteredText(signature?.nombreCompleto || '__________________________', sigX, y + 5, sigWidth);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  // drawCenteredText(signature?.rolEnDocumento || 'SUPERVISOR DE OPERACIONES', sigX, y + 9, sigWidth);
  drawCenteredText('TRANSPORTES LINEA S.A.', sigX, y + 9, sigWidth);

  doc.save(`Manifiesto_${viaje.id}.pdf`);
};
