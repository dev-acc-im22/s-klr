"use client";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useGhostMode } from "@/hooks/useGhostMode";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isGhostMode } = useGhostMode();

  return (
    <DashboardLayout ghostMode={isGhostMode}>
      {children}
    </DashboardLayout>
  );
}
