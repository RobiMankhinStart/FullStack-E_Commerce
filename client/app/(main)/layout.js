import React from "react";
import Footer from "../components/commonUI/Footer";
import { Toaster } from "sonner";
import TopNav from "../components/main/common/TopNav";

const MainLayout = ({ children }) => {
  return (
    <div>
      <TopNav />
      <main className="mt-20">{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default MainLayout;
