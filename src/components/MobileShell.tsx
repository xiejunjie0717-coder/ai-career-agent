import type { ReactNode } from "react";

import { AppShell } from "@/components/AppShell";

type Props = {
  title?: string;
  showBack?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  showTabs?: boolean;
  rightSlot?: ReactNode;
};

export function MobileShell({ title, showBack, children, footer, showTabs, rightSlot }: Props) {
  return (
    <AppShell
      title={title}
      showBack={showBack}
      footer={footer}
      showTabs={showTabs}
      rightSlot={rightSlot}
    >
      {children}
    </AppShell>
  );
}
