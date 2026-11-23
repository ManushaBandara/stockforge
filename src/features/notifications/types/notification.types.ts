
import type { ExternalToast } from "sonner";

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading";

export interface NotificationOptions extends ExternalToast {
  description?: string;
}
