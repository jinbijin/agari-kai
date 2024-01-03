export interface AgariNotificationDismissAction {
  label: string;
  onClose?: () => void;
}

export interface AgariNotificationDismissTimerTrigger {
  time: number;
}

export interface AgariNotificationDismissActionTrigger {
  action: AgariNotificationDismissAction;
}

export type AgariNotificationDismissTriggers =
  | (AgariNotificationDismissTimerTrigger & Partial<AgariNotificationDismissActionTrigger>)
  | (Partial<AgariNotificationDismissTimerTrigger> & AgariNotificationDismissActionTrigger);

export interface AgariNotification {
  id: number;
  message: string;
  triggers: AgariNotificationDismissTriggers;
}
