"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname.startsWith("/admin/login");

  return (
    <SessionProvider>
      {isLogin ? (
        children
      ) : (
        <div className="admin-body">
          <div className="admin-shell">
            <AdminNav />
            <div className="admin-main">{children}</div>
          </div>
        </div>
      )}
    </SessionProvider>
  );
}
