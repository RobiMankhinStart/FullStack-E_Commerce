// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_API,
  }),
  //   tagTypes: ['Post'],
  endpoints: (build) => ({
    getProductList: build.query({
      query: () => ({
        url: "/product/productlist",
        method: "GET", // Optional: GET is the default method for queries
      }),
    }),
    getCategoryList: build.query({
      query: () => ({
        url: "/category/all",
        method: "GET",
      }),
    }),
    // alternative easy approach for get method below
    getProducts: build.query({
      query: () => "/products/productlist",
    }),
  }),
});
export const { useGetProductListQuery, useGetCategoryListQuery } = adminApi;
