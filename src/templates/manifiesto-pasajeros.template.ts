import { ApiResponse, ViajePasajeroResultDto } from 'api/backend.api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateManifiestoPasajerosPdf = (
  viaje: ApiResponse<'viajes', 'findOne'>,
  pasajeros: ViajePasajeroResultDto[]
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  let y = 14;

  // Header Logos/Titles (Text placeholders for logos)
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

  // Right Logos/Titles
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bolditalic');
  // Stack 'Rentacar' on top, aligned to the right
  doc.text('Rentacar', pageWidth - margin, y + 3, { align: 'right' });
  
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  // Stack the company name and RUC below 'Rentacar', also aligned to the right
  doc.text('INVERSIONES JR Y ASOCIADOS SAC\n20609735237', pageWidth - margin, y + 7, { align: 'right' });

  y += 18;

  // Box 1: Company Info
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] },
    body: [
      [
        { content: 'RUC:\n20609735237', styles: { halign: 'left', cellWidth: 25 } },
        { content: 'RAZON SOCIAL:\nINVERSIONES JR Y ASOCIADOS S.A.C.', styles: { halign: 'left' } },
        { content: 'TELEFONO:\n', styles: { halign: 'left', cellWidth: 35 } },
        { content: 'DIRECCION:\nLIMA', styles: { halign: 'left', cellWidth: 40 } }
      ]
    ]
  });
  y = (doc as any).lastAutoTable.finalY;

  // Row 2: Trip details
  let rutaTexto = '---';
  if ((viaje as any).tipoRuta === 'ocasional' || (viaje as any).rutaOcasional) {
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
  const cond1 = conductores[0] ? `${conductores[0].nombres || ''} ${conductores[0].apellidos || ''}`.trim() : '---';
  const cond2 = conductores[1] ? `${conductores[1].nombres || ''} ${conductores[1].apellidos || ''}`.trim() : '---';

  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 7, cellPadding: 1.5, lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] },
    body: [
      [
        { content: `CONDUCTOR 1: ${cond1}` },
        { content: `CONDUCTOR 2: ${cond2}` }
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
      '', // Empresa
      '', // Firma Ida
      ''  // Firma Retorno
    ];
  });

  // Fill up to 21 rows empty representation
  while (tableData.length < 21) {
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
      fillColor: [242, 228, 28], // --color-primary
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center' } // number centered and bold
    }
  });

  y = (doc as any).lastAutoTable.finalY + 20;

  // Footer signature
  if (y + 20 > doc.internal.pageSize.height) {
    doc.addPage();
    y = 20;
  }
  
  const signatureWidth = 60;
  // Let's place signature on left like the image, specifically near bottom left center
  const signatureX = margin + 20;
  
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  // Dashed or solid line? The image shows a dashed line
  doc.setLineDashPattern([1, 1], 0);
  doc.line(signatureX, y, signatureX + signatureWidth, y);
  doc.setLineDashPattern([], 0); // reset pattern
  
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(' PAUL BARRENECHEA C.', signatureX + (signatureWidth / 2), y + 4, { align: 'center' });
  doc.text('SUPERVISOR DE OPERACIONES', signatureX + (signatureWidth / 2), y + 8, { align: 'center' });

  doc.save(`Manifiesto_${viaje.id}.pdf`);
};
