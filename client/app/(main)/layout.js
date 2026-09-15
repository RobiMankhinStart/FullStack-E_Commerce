import React from "react";
import Footer from "../components/commonUI/Footer";
import { Toaster } from "sonner";
import TopNav from "../components/main/common/TopNav";
import CartDrawer from "../components/commonUI/CartDrawer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <TopNav />
      <main className="mt-20">{children}</main>
      <Footer />
      <CartDrawer />
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default MainLayout;
