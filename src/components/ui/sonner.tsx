
import { Toaster as Sonner, type ToasterProps } from "sonner";
import type { CSSProperties } from "react";

import {
  CircleCheck,
  Info,
  TriangleAlert,
  CircleX,
  LoaderCircle,
} from "lucide-react";

const Toaster = ({ toastOptions, ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="stockforge-toaster"
      position="bottom-right"
      closeButton
      expand={false}
      visibleToasts={5}
      gap={10}
      offset={24}
      icons={{
        success: <CircleCheck size={19} strokeWidth={2.2} />,
        error: <CircleX size={19} strokeWidth={2.2} />,
        warning: <TriangleAlert size={19} strokeWidth={2.2} />,
        info: <Info size={19} strokeWidth={2.2} />,
        loading: <LoaderCircle size={19} className="animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#171a21",
          "--normal-text": "#f1f5f9",
          "--normal-border": "#303642",
          "--border-radius": "13px",
        } as CSSProperties
      }
      toastOptions={{
        duration: 4500,
        ...toastOptions,
        classNames: {
          toast: "sf-toast",
          title: "sf-toast-title",
          description: "sf-toast-description",
          closeButton: "sf-toast-close",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
