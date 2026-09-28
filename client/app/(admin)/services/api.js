// Or from '@reduxjs/toolkit/query/react'
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "@/app/lib/apiClient";

const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  credentials: "include",
});

// getting access token again using refresh token
const baseQueryWithAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const hasRefreshToken =
      typeof document !== "undefined" &&
      document.cookie.split(";").some((cookie) => {
        const [name] = cookie.trim().split("=");
        return name === "X-RF-Token";
      });

    if (!hasRefreshToken) {
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refreshaccesstoken",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
      return result;
    }

    return refreshResult;
  }

  return result;
};

export const adminApi = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: ["product", "category", "orders", "auth", "users"],
  endpoints: (build) => ({
    getProductList: build.query({
      query: () => ({
        url: "/product/admin/productlist",
        method: "GET", // Optional: GET is the default method for queries
      }),
      providesTags: ["product"],
    }),

    getAdminProfile: build.query({
      query: () => ({
        url: "/auth/profile",
        // method:"GET"
      }),
      providesTags: ["auth"],
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

    // Add inside your createApi builder endpoints:
    getAllOrdersForAdmin: build.query({
      query: ({ page = 1, limit = 10, status = "", search = "" }) => {
        const params = new URLSearchParams({ page, limit });
        if (status) params.append("status", status);
        if (search) params.append("search", search);
        return {
          url: `/order/orderlist?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["orders"],
    }),

    getDashboardStats: build.query({
      query: () => ({
        url: "/order/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["orders"],
    }),

    // USER MANAGEMENT ENDPOINTS MATCHING YOUR BACKEND
    getAllUsersForAdmin: build.query({
      query: ({ page = 1, limit = 10, role = "", search = "" } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (role) params.append("role", role);
        if (search) params.append("search", search);
        return {
          url: `/auth/userlist?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["users"],
    }),

    updateUserRole: build.mutation({
      query: ({ userId, role }) => ({
        url: `/auth/updaterole/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["users"],
    }),

    updateProfile: build.mutation({
      query: (formData) => ({
        url: "/auth/updateprofile",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["auth"],
    }),

    // MUTATION FOR STATUS UPDATE
    updateOrderStatus: build.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/update-status/${orderId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["orders"], // Triggers auto-refetch of orders list
    }),

    // alternative easy approach for get method below
    getProducts: build.query({
      query: () => "/products/productlist",
    }),
  }),
});
export const {
  useGetProductListQuery,
  useGetAdminProfileQuery,
  useGetCategoryListQuery,
  useGetProductDetailsQuery,
  useGetAllOrdersForAdminQuery,
  useGetDashboardStatsQuery,
  useGetAllUsersForAdminQuery,
  useUpdateUserRoleMutation,
  useUpdateProfileMutation,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useSignoutMutation,
  useUpdateOrderStatusMutation,
} = adminApi;
