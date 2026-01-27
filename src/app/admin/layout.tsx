import React from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "Dominat8 Admin",
  description: "Dominat8 admin console.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}