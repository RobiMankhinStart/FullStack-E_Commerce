import AdminShell from "@/app/components/admin/AdminShell";
import AdminProvider from "./services/AdminProvider";
export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
