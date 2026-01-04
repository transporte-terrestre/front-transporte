/**
 * Extrae el mensaje de error de la respuesta de la API
 * @param error El objeto de error capturado
 * @param defaultMessage Mensaje por defecto si no se puede extraer el mensaje
 * @returns El mensaje de error formateado
 */
export function getErrorMessage(error: any, defaultMessage: string = 'Ha ocurrido un error'): string {
  // Si el error tiene la estructura típica de respuesta de API
  if (error?.error?.message) {
    // Si es un array de mensajes, unirlos
    if (Array.isArray(error.error.message)) {
      return error.error.message.join(', ');
    }
    return error.error.message;
  }

  // Si tiene mensaje directo
  if (error?.message) {
    if (Array.isArray(error.message)) {
      return error.message.join(', ');
    }
    return error.message;
  }

  // Si es un string directamente
  if (typeof error === 'string') {
    return error;
  }

  // Mensaje por defecto
  return defaultMessage;
}
