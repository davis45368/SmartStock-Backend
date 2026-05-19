import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[MÓDULO AUDITORÍA DE ERRORES]: ${err.stack}`);

  const isClientError =
    err.message.includes('no localizado') ||
    err.message.includes('no requiere reorden') ||
    err.message.includes('debe ser mayor a cero');

  res.status(isClientError ? 400 : 500).json({
    error: isClientError ? 'Solicitud inválida' : 'Fallo Crítico Interno',
    message: err.message || 'Ha ocurrido un error inesperado en el procesamiento de datos del inventario.',
  });
}
