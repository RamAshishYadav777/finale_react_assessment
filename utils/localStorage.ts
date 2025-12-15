import { CartItem } from "@/redux/slices/cartSlice";

export const loadCartFromStorage = (): { items: CartItem[]; couponCode: string | null } | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const serializedState = localStorage.getItem("cart-storage");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load cart from storage", err);
    return undefined;
  }
};

export const saveCartToStorage = (state: { items: CartItem[]; couponCode: string | null }) => {
  if (typeof window === "undefined") return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("cart-storage", serializedState);
  } catch (err) {
    console.error("Could not save cart to storage", err);
  }
};
