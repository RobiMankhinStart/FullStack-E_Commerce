import { create } from "zustand";
import { apiClient } from "@/app/lib/apiClient";
import { toast } from "sonner";

export const useCartStore = create((set, get) => ({
  // UI State
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // Data State
  cartItems: [],
  isLoading: false,

  // Async Actions using  apiClient
  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get("/cart/get");

      // Extracting array safely from possible nested response shapes
      const items =
        res?.items || res?.data?.items || (Array.isArray(res) ? res : []);

      set({ cartItems: Array.isArray(items) ? items : [] });
    } catch (error) {
      console.error("Fetch cart error:", error);
      set({ cartItems: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, sku, quantity = 1) => {
    try {
      // Optimistically open cart when user adds an item
      get().openCart();

      const res = await apiClient.post("/cart/addtocart", {
        productId,
        sku,
        quantity,
      });
      console.log("resAddTo :", res);
      if (res?.message) {
        toast.success(res.message);
      }

      // Refreshing cart data after adding
      await get().fetchCart();
      return { success: true };
    } catch (error) {
      console.error("add to cart error:", error);
      const errorMessage = error.message || "Failed to add to cart";
      if (errorMessage === "Product already exists in cart") {
        // Making sure we have the latest cart data
        await get().fetchCart();
        toast.error("Already added in your cart");
      } else {
        console.error("Add to cart error:", errorMessage);
        alert(errorMessage);
      }
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to add product",
      };
    }
  },

  // Update Quantity
  updateQuantity: async (productId, itemId, quantity) => {
    if (quantity < 1) return toast.warning("keep minimum 1 product");

    try {
      const res = await apiClient.put("/cart/update", {
        productId,
        itemId,
        quantity,
      });

      // Show backend success message ("Cart updated")
      if (res?.message) {
        toast.success(res.message);
      }

      await get().fetchCart();
    } catch (error) {
      toast.error(error.message || "Failed to update quantity");
    }
  },

  // Remove Item
  removeFromCart: async (itemId) => {
    try {
      const res = await apiClient.put("/cart/remove", { itemId });

      // Show backend success message ("Item removed")
      if (res?.message) {
        toast.success(res.message);
      }

      await get().fetchCart();
    } catch (error) {
      toast.error(error.message || "Failed to remove item");
    }
  },
}));
