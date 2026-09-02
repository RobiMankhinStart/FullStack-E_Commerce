import React from "react";
import Footer from "../components/commonUI/Footer";
import { Toaster } from "sonner";

const MainLayout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default MainLayout;
