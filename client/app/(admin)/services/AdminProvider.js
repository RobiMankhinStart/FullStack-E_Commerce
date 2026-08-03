"use client";

import { ApiProvider } from "@reduxjs/toolkit/query/react";
import React from "react";
import { adminApi } from "./api";

const AdminProvider = ({ children }) => {
  return <ApiProvider api={adminApi}>{children}</ApiProvider>;
};

export default AdminProvider;
