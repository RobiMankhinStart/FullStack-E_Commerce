import React from "react";
import Footer from "../components/commonUI/Footer";

const MainLayout = ({ children }) => {
  return (
    <div>
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
