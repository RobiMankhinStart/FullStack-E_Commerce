// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000",
  }),
  //   tagTypes: ['Post'],
  endpoints: (build) => ({
    getProductList: build.query({
      query: () => ({
        url: "/product/productlist",
        method: "GET", // Optional: GET is the default method for queries
      }),
    }),
    // alternative easy approach for get method below
    getProducts: build.query({
      query: () => "/products/productlist",
    }),
  }),
});
export const { useGetProductListQuery } = adminApi;
