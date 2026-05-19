export interface INotificationHelper {
  sendAlert(message: string, contact: string): Promise<boolean>;
}
