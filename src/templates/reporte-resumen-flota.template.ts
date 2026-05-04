import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ResumenVehiculoDto } from '@api/backend.api';

export interface ReporteResumenFlotaData {
  mes: string;
  fechaInicio: string;
  fechaFin: string;
  resumen: any[]; // Usando any para soportar los nuevos campos hasta que se regenere la API
  totalKilometraje: number;
  totalGalones: number;
  totalViajes: number;
}

export const generateReporteResumenFlotaPdf = async (data: ReporteResumenFlotaData) => {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
  const pageWidth = doc.internal.pageSize.width;
  const margin = 12;
  let y = 15;

  // Colors
  const primaryColor: [number, number, number] = [30, 58, 138]; // Dark Blue
  const textColor: [number, number, number] = [31, 41, 55]; // Gray-800
  const lightBg: [number, number, number] = [249, 250, 251]; // Gray-50

  // --- Header ---
  doc.setFontSize(8);
  doc.setTextColor(30, 60, 150);
  doc.setFont('helvetica', 'bold');
  doc.text('INVERSIONES JR Y ASOCIADOS SAC', margin, y);
  doc.setFontSize(7);
  doc.text('20609735237', margin + 12, y + 4);

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('VAT-016 RESUMEN DE FLOTA', pageWidth / 2, y + 5, { align: 'center' });

  y += 15;

  // --- Info cards (Summary) ---
  const cardWidth = (pageWidth - 2 * margin - 15) / 4;
  const cardHeight = 18;

  const drawCard = (label: string, value: string, x: number, currentY: number, color: [number, number, number]) => {
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(...lightBg);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD');
    
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), x + 4, currentY + 6);
    
    doc.setFontSize(11);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(value, x + 4, currentY + 14);
  };

  drawCard('Vehículos Totales', data.resumen.length.toString(), margin, y, [31, 41, 55]);
  drawCard('Viajes Totales', data.totalViajes.toString(), margin + cardWidth + 5, y, [59, 130, 246]);
  drawCard('Total Kilometraje', `${data.totalKilometraje.toLocaleString()} KM`, margin + 2 * (cardWidth + 5), y, [16, 185, 129]);
  drawCard('Total Combustible', `${data.totalGalones.toFixed(2)} GAL`, margin + 3 * (cardWidth + 5), y, [239, 68, 68]);

  y += cardHeight + 10;

  // --- Period Info ---
  doc.setFontSize(8);
  doc.setTextColor(...textColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`PERIODO: ${data.fechaInicio} AL ${data.fechaFin}`, margin, y);
  y += 6;

  // --- Table ---
  const headers = [
    'VEHÍCULO',
    'MARCA/MODELO',
    'KM ACTUAL',
    'ESTADO',
    'CLIENTE ACTUAL',
    'VIAJES',
    'RECORRIDO (KM)',
    'FUEL (GAL)',
    'REND. (KM/GAL)'
  ];

  const tableData = data.resumen.map(item => {
    const rendimiento = item.totalGalones > 0 
      ? (item.totalKilometraje / item.totalGalones).toFixed(2)
      : '—';
      
    const estadoLabels: Record<string, string> = {
      disponible: 'DISPONIBLE',
      circulacion: 'CIRCULACIÓN',
      taller: 'TALLER',
      retirado: 'RETIRADO',
      alquilado: 'ALQUILADO'
    };

    return [
      item.placa,
      `${item.marca} ${item.modelo}`,
      item.kilometrajeActual?.toLocaleString() || '0',
      estadoLabels[item.estado] || item.estado?.toUpperCase() || '—',
      item.clienteActual || (item.estado === 'disponible' ? 'DISPONIBLE' : '—'),
      item.cantidadViajes,
      item.totalKilometraje.toLocaleString(),
      item.totalGalones.toFixed(2),
      rendimiento
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    margin: { left: margin, right: margin },
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
      textColor: textColor,
      valign: 'middle'
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'center' },
      4: { halign: 'left' },
      5: { halign: 'center' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' }
    }
  });

  doc.save(`VAT-016_RESUMEN_FLOTA_${data.fechaInicio}_${data.fechaFin}.pdf`);
};
