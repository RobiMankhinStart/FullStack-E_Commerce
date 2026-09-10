import React from "react";
import Footer from "../components/commonUI/Footer";
import { Toaster } from "sonner";
// import TopNav from "../components/commonUI/TopNav";

const MainLayout = ({ children }) => {
  return (
    <div>
      {/* <TopNav /> */}
      <main>{children}</main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default MainLayout;
