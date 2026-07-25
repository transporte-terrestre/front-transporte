import * as XLSX from 'xlsx';

export const roundToMaxTwoDecimals = (
  value: number | string | null | undefined,
): number | string | null | undefined => {
  if (value === null || value === undefined || value === '') return value;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Number(numericValue.toFixed(2)) : value;
};

export const formatMaxTwoDecimals = (value: number | string | null | undefined): string => {
  const roundedValue = roundToMaxTwoDecimals(value);
  return roundedValue === null || roundedValue === undefined ? '' : String(roundedValue);
};

export const applyMaxTwoDecimalFormat = (worksheet: XLSX.WorkSheet): void => {
  Object.keys(worksheet).forEach((cellAddress) => {
    if (cellAddress.startsWith('!')) return;

    const cell = worksheet[cellAddress];
    if (cell?.t === 'n' && typeof cell.v === 'number' && Number.isFinite(cell.v)) {
      // Positivos; negativos; cero: evita que Excel muestre "0.".
      cell.z = '0.##;-0.##;0';
    }
  });
};
