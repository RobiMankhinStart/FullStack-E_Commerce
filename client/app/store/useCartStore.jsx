// import { create } from "zustand";
// import { apiClient } from "@/app/lib/apiClient";
// import { toast } from "sonner";

// export const useCartStore = create((set, get) => ({
//   // UI State
//   isCartOpen: false,
//   openCart: () => set({ isCartOpen: true }),
//   closeCart: () => set({ isCartOpen: false }),

//   // Data State
//   cartItems: [],
//   isLoading: false,

//   // Async Actions using  apiClient
//   fetchCart: async () => {
//     set({ isLoading: true });
//     try {
//       const res = await apiClient.get("/cart/get");

//       // Extracting array safely from possible nested response shapes
//       const items =
//         res?.items || res?.data?.items || (Array.isArray(res) ? res : []);

//       set({ cartItems: Array.isArray(items) ? items : [] });
//     } catch (error) {
//       console.error("Fetch cart error:", error);
//       set({ cartItems: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   addToCart: async (productId, sku, quantity = 1) => {
//     try {
//       // Optimistically open cart when user adds an item
//       get().openCart();

//       const res = await apiClient.post("/cart/addtocart", {
//         productId,
//         sku,
//         quantity,
//       });
//       console.log("resAddTo :", res);
//       if (res?.message) {
//         toast.success(res.message);
//       }

//       // Refreshing cart data after adding
//       await get().fetchCart();
//       return { success: true };
//     } catch (error) {
//       console.error("add to cart error:", error);
//       const errorMessage = error.message || "Failed to add to cart";
//       if (errorMessage === "Product already exists in cart") {
//         // Making sure we have the latest cart data
//         await get().fetchCart();
//         toast.error("Already added in your cart");
//       } else {
//         console.error("Add to cart error:", errorMessage);
//         alert(errorMessage);
//       }
//       return {
//         success: false,
//         message: error?.response?.data?.message || "Failed to add product",
//       };
//     }
//   },

//   // Update Quantity
//   updateQuantity: async (productId, itemId, quantity) => {
//     if (quantity < 1) return toast.warning("keep minimum 1 product");

//     try {
//       const res = await apiClient.put("/cart/update", {
//         productId,
//         itemId,
//         quantity,
//       });

//       // Show backend success message ("Cart updated")
//       if (res?.message) {
//         toast.success(res.message);
//       }

//       await get().fetchCart();
//     } catch (error) {
//       toast.error(error.message || "Failed to update quantity");
//     }
//   },

//   // Remove Item
//   removeFromCart: async (itemId) => {
//     try {
//       const res = await apiClient.put("/cart/remove", { itemId });

//       // Show backend success message ("Item removed")
//       if (res?.message) {
//         toast.success(res.message);
//       }

//       await get().fetchCart();
//     } catch (error) {
//       toast.error(error.message || "Failed to remove item");
//     }
//   },
// }));

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "sonner";

// Helper function to check if authentication cookie exists
const isUserLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith("X-AS-Token="));
};

const getUserRoleFromToken = () => {
  if (typeof window === "undefined") return null;

  const tokenCookie = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("X-AS-Token="));

  if (!tokenCookie) return null;

  try {
    const token = decodeURIComponent(tokenCookie.split("=")[1]);
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

    const decoded = atob(padded);
    const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    return parsed?.role || null;
  } catch (error) {
    return null;
  }
};

const isCartRestrictedRole = () => {
  const role = getUserRoleFromToken();
  return ["admin", "editor"].includes(String(role || "").toLowerCase());
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      // UI State
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      // Data State
      cartItems: [],
      cartId: null,
      isLoading: false,
      lastCartClearAt: 0,

      // 1. FETCH CART
      fetchCart: async () => {
        // If guest, keep items currently stored in localStorage
        if (!isUserLoggedIn()) return;

        const requestStartedAt = Date.now();
        set({ isLoading: true });
        try {
          const res = await apiClient.get("/cart/get");

          if (get().lastCartClearAt > requestStartedAt) {
            return;
          }

          // Extract cartId from response shapes
          const fetchedCartId =
            res?._id || res?.data?._id || res?.cart?._id || null;

          // Extracting array safely from possible nested response shapes
          const items =
            res?.items || res?.data?.items || (Array.isArray(res) ? res : []);

          set({
            cartId: fetchedCartId,
            cartItems: Array.isArray(items) ? items : [],
          });
        } catch (error) {
          if (get().lastCartClearAt > requestStartedAt) {
            return;
          }

          const status = error?.status || error?.response?.status;
          if (status === 401 || status === 403) {
            set({ cartId: null, cartItems: [] });
            return;
          }

          console.error("Fetch cart error:", error);
          set({ cartItems: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      // 2. ADD TO CART
      addToCart: async (
        productIdOrPayload,
        sku,
        quantity = 1,
        productData = {},
      ) => {
        if (isCartRestrictedRole()) {
          toast.warning(
            "Admin and editor accounts cannot add products to cart.",
          );
          return {
            success: false,
            message: "Admin and editor accounts cannot add products to cart.",
          };
        }

        const payload =
          typeof productIdOrPayload === "object" && productIdOrPayload !== null
            ? {
                productId:
                  productIdOrPayload.productId ||
                  productIdOrPayload._id ||
                  productIdOrPayload.id,
                sku: productIdOrPayload.sku,
                quantity:
                  Number(productIdOrPayload.quantity) > 0
                    ? Number(productIdOrPayload.quantity)
                    : Number(quantity),
                productData:
                  productIdOrPayload.product ||
                  productIdOrPayload.productData ||
                  productData,
              }
            : {
                productId: productIdOrPayload,
                sku,
                quantity: Number(quantity) > 0 ? Number(quantity) : 1,
                productData,
              };

        const normalizedProductId = payload.productId;
        const normalizedSku = payload.sku;
        const normalizedQuantity = payload.quantity;
        const normalizedProductData = payload.productData || {};

        if (!normalizedProductId || !normalizedSku) {
          toast.error("Missing product or variant information");
          return {
            success: false,
            message: "Missing product or variant information",
          };
        }

        get().openCart();

        if (isUserLoggedIn()) {
          // --- LOGGED-IN USER: Send to Express Backend ---
          try {
            const res = await apiClient.post("/cart/addtocart", {
              productId: normalizedProductId,
              sku: normalizedSku,
              quantity: normalizedQuantity,
            });

            if (res?.message) {
              toast.success(res.message);
            }

            await get().fetchCart();
            return { success: true };
          } catch (error) {
            const status = error?.status || error?.response?.status;
            const errorMessage = error.message || "Failed to add to cart";

            if (status === 401 || status === 403) {
              toast.warning(
                error?.data?.message ||
                  "This account is not allowed to access cart actions.",
              );
              return {
                success: false,
                message:
                  error?.data?.message ||
                  "This account is not allowed to access cart actions.",
              };
            }

            console.error("Add to cart error:", error);

            if (errorMessage === "Product already exists in cart") {
              await get().fetchCart();
              toast.error("Already added in your cart");
            } else {
              toast.error(errorMessage);
            }

            return {
              success: false,
              message:
                error?.response?.data?.message || "Failed to add product",
            };
          }
        } else {
          // --- GUEST USER: Manage locally in LocalStorage ---
          const currentItems = get().cartItems;
          const existingIndex = currentItems.findIndex(
            (item) =>
              (item.productId === normalizedProductId ||
                item.product?._id === normalizedProductId ||
                item._id === normalizedProductId) &&
              item.sku === normalizedSku,
          );

          let updatedItems = [...currentItems];

          if (existingIndex > -1) {
            toast.error("Already added in your cart");
            return { success: false, message: "Already added in your cart" };
          } else {
            // Append new item with minimal necessary structure for guest display
            updatedItems.push({
              _id: `guest_${Date.now()}`,
              productId: normalizedProductId,
              sku: normalizedSku,
              quantity: normalizedQuantity,
              product: normalizedProductData,
            });
            toast.success("Item added to cart");
          }

          set({ cartItems: updatedItems });
          return { success: true };
        }
      },

      // 3. UPDATE QUANTITY
      updateQuantity: async (productId, itemId, quantity) => {
        if (quantity < 1) return toast.warning("Keep minimum 1 product");

        if (isUserLoggedIn()) {
          // --- LOGGED-IN USER ---
          try {
            const res = await apiClient.put("/cart/update", {
              productId,
              itemId,
              quantity,
            });

            if (res?.message) {
              toast.success(res.message);
            }

            await get().fetchCart();
          } catch (error) {
            toast.error(error.message || "Failed to update quantity");
          }
        } else {
          // --- GUEST USER ---
          const updatedItems = get().cartItems.map((item) => {
            if (item._id === itemId || item.productId === productId) {
              return { ...item, quantity };
            }
            return item;
          });

          set({ cartItems: updatedItems });
          toast.success("Cart updated");
        }
      },

      // 4. REMOVE ITEM
      removeFromCart: async (itemId, productId) => {
        if (isUserLoggedIn()) {
          // --- LOGGED-IN USER ---
          try {
            const res = await apiClient.put("/cart/remove", { itemId });

            if (res?.message) {
              toast.success(res.message);
            }

            await get().fetchCart();
          } catch (error) {
            toast.error(error.message || "Failed to remove item");
          }
        } else {
          // --- GUEST USER ---
          const updatedItems = get().cartItems.filter(
            (item) => item._id !== itemId && item.productId !== productId,
          );

          set({ cartItems: updatedItems });
          toast.success("Item removed");
        }
      },

      // 5. FRONTEND MERGE / SYNC (Triggered right after user logs in)
      syncGuestCartToBackend: async () => {
        const guestItems = get().cartItems;

        // If no guest items are in state, just fetch existing backend cart
        if (!guestItems || guestItems.length === 0) {
          await get().fetchCart();
          return;
        }

        set({ isLoading: true });

        try {
          // Sequentially push guest items to your existing Express /cart/addtocart API
          for (const item of guestItems) {
            try {
              await apiClient.post("/cart/addtocart", {
                productId: item.productId || item.product?._id,
                sku: item.sku,
                quantity: item.quantity,
              });
            } catch (err) {
              // Ignore duplicate items during sync loop
              console.warn("Item sync warning:", err?.message);
            }
          }

          // Clear local storage guest array and fetch full merged DB cart
          localStorage.removeItem("guest-cart-storage");
          await get().fetchCart();
          toast.success("Guest cart merged with your account!");
        } catch (error) {
          console.error("Cart sync error:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      // 6. Cleaning state & localStorage after logging out
      clearCart: () => {
        set({
          cartId: null,
          cartItems: [],
          lastCartClearAt: Date.now(),
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("guest-cart-storage");
        }
      },
    }),
    {
      name: "guest-cart-storage", // Key name in LocalStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartItems: state.cartItems }), // Only persist cartItems
    },
  ),
);
