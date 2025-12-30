import * as XLSX from 'xlsx';
import { ReporteConductorDto } from 'api/backend.api';

export const generateReporteConductoresExcel = (data: ReporteConductorDto[]) => {
  // Define columns based on the user's requirement (matching the image)
  const headers = [
    'rut', // DNI
    'empresa', // RUC Empresa
    'ost', // Empty/Hardcoded
    'nombres',
    'apellidos',
    'Induccion - Anexo 4', // SI/NO
    'Fec.Emision Induccion', // Empty/NA
    'Manejo defensivo AAQ', // SI/NO
    'Fec.Vence Manejo Def',
    'SCTR', // SI/NO
    'Vencimiento SCTR',
    'Seguro vida Ley', // SI/NO
    'Fec. Vence Seg Vida Ley',
    'Documento de Identidad', // SI/NO
    'AUTORIZA_SSGG', // NO
    'Curso Seguridad Portuaria', // NO
    'Foto Funcionario', // SI
    'Curso Mercancias Peligrosas', // NO
    'Curso Basico PBIP', // NO
    'F. Venc. Examen Medico Temporal', // NA
    'F. Vence examen medico',
    'Vence Examen Psicosensometrico',
    'Fecha induccion temporal', // NA
    'Vence Induccion Visita', // NA
    'Vence EM Visita', // NA
    'Fecha Vencimiento Licencia',
    'PASECONDUC', // NO/SI (maybe based on license validity?)
  ];

  const rows = data.map((c) => {
    return [
      c.dni,
      c.rucEmpresa,
      c.ost,
      c.nombres,
      c.apellidos,
      c.induccionAnexo4,
      c.fecEmisionInduccion,
      c.manejoDefensivoAaq,
      c.fecVenceManejoDef,
      c.sctr,
      c.vencimientoSctr,
      c.seguroVidaLey,
      c.fecVenceSegVidaLey,
      c.documentoIdentidad,
      c.autorizaSsgg,
      c.cursoSeguridadPortuaria,
      c.fotoFuncionario,
      c.cursoMercanciasPeligrosas,
      c.cursoBasicoPbip,
      c.fVencExamenMedicoTemporal,
      c.fVenceExamenMedico,
      c.venceExamenPsicosensometrico,
      c.fechaInduccionTemporal,
      c.venceInduccionVisita,
      c.venceEmVisita,
      c.fechaVencimientoLicencia,
      c.paseconduc,
    ];
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Conductores');

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Download
  const url = window.URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_General_Conductores_${new Date().toISOString().split('T')[0]}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);
};
