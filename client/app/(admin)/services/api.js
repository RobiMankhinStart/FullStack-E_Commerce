// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_API,
  credentials: "include",
});

// getting access token again using refresh token
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refreshaccesstoken",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // Retry original request with the new cookie/token
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const adminApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["product", "category"],
  endpoints: (build) => ({
    getProductList: build.query({
      query: () => ({
        url: "/product/admin/productlist",
        method: "GET", // Optional: GET is the default method for queries
      }),
      providesTags: ["product"],
    }),
    getCategoryList: build.query({
      query: () => ({
        url: "/category/all",
        method: "GET",
      }),
      providesTags: ["category"],
    }),
    createNewProduct: build.mutation({
      query: (productData) => ({
        url: "/product/createproduct",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: productData,
      }),
      invalidatesTags: ["product"],
    }),
    getProductDetails: build.query({
      query: (slug) => ({
        url: `/product/${slug}`,
        method: "GET",
      }),
      providesTags: (result, error, slug) => [{ type: "product", id: slug }],
    }),

    // 2. Updating existing product
    updateProduct: build.mutation({
      query: ({ slug, formData }) => ({
        url: `/product/updateproduct/${slug}`,
        method: "PUT",
        body: formData, // FormData instance
      }),
      invalidatesTags: (result, error, { slug }) => [
        "product",
        { type: "product", id: slug },
      ],
    }),

    signout: build.mutation({
      query: () => ({
        url: "/auth/signout",
        method: "POST",
      }),
    }),
    // alternative easy approach for get method below
    getProducts: build.query({
      query: () => "/products/productlist",
    }),
  }),
});
export const {
  useGetProductListQuery,
  useGetCategoryListQuery,
  useGetProductDetailsQuery,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useSignoutMutation,
} = adminApi;
