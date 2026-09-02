import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "/auth/refreshtoken",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      // retry original request
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const adminApiService = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["product"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => "/product/allproducts",
      providesTags: ["product"],
    }),
    getCategories: build.query({
      query: () => "/category/all",
    }),
    createNewProduct: build.mutation({
      query: (productData) => ({
        url: "/product/create",
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: productData,
      }),
      providesTags: ["product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useCreateNewProductMutation,
} = adminApiService;

// getProducts = http://localhost:8000/products
