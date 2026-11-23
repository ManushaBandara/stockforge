
import { toast } from "sonner";
import type { NotificationOptions } from "../types/notification.types";

export const notify = {
  success: (message: string, options?: NotificationOptions) =>
    toast.success(message, options),

  error: (message: string, options?: NotificationOptions) =>
    toast.error(message, options),

  warning: (message: string, options?: NotificationOptions) =>
    toast.warning(message, options),

  info: (message: string, options?: NotificationOptions) =>
    toast.info(message, options),

  loading: (message: string, options?: NotificationOptions) =>
    toast.loading(message, options),

  message: (message: string, options?: NotificationOptions) =>
    toast(message, options),

  dismiss: (toastId?: string | number) =>
    toast.dismiss(toastId),
};
