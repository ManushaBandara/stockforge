import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({ children }: PageContainerProps) {
  return <div className="mx-auto w-full max-w-[1440px] p-8">{children}</div>;
}
