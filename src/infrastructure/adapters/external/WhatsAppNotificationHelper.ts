import { INotificationHelper } from '../../../domain/ports/INotificationHelper';

export class WhatsAppNotificationHelper implements INotificationHelper {
  public async sendAlert(message: string, contact: string): Promise<boolean> {
    try {
      console.log(
        `[PIPELINE NOTIFICACIONES] Transmitiendo alerta hacia proveedor (${contact}): ${message}`
      );
      return true;
    } catch (err) {
      console.error('Fallo de comunicación del Helper de Notificación', err);
      return false;
    }
  }
}
