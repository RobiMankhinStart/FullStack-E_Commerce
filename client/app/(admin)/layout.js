import AdminShell from "@/app/components/admin/AdminShell";
import AdminProvider from "./services/AdminProvider";
import { Toaster } from "sonner";
export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>
        {children}
        <Toaster richColors position="top-right" />
      </AdminShell>
    </AdminProvider>
  );
}
