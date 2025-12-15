import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  thresholdDiscount: number;
  couponDiscount: number;
  couponCode: string | null;
  payable: number;
  history: CartItem[][]; // Stack of item arrays for undo
}

const initialState: CartState = {
  items: [],
  total: 0,
  thresholdDiscount: 0,
  couponDiscount: 0,
  couponCode: null,
  payable: 0,
  history: [],
};

// Helper: Calculate all totals based on current items and coupon
const calculateCart = (state: CartState) => {
  state.total = state.items.reduce((sum, item) => sum + item.price, 0);

  // 1. Threshold Discount: Apply 10% if total > 300
  if (state.total > 300) {
    state.thresholdDiscount = state.total * 0.10;
  } else {
    state.thresholdDiscount = 0;
  }

  // 2. Coupon Discount
  state.couponDiscount = 0;
  const taxableAmount = state.total - state.thresholdDiscount;

  if (state.couponCode === "SAVE20") {
    state.couponDiscount = taxableAmount * 0.20;
  } else if (state.couponCode === "WELCOME10") {
    state.couponDiscount = taxableAmount * 0.10;
  } else if (state.couponCode === "FLAT50") {
    state.couponDiscount = 50;
  }

  // Ensure no negative payable
  state.payable = Math.max(0, state.total - state.thresholdDiscount - state.couponDiscount);
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Used for Local Storage hydration
    hydrateCart(state, action: PayloadAction<{ items: CartItem[]; couponCode: string | null }>) {
      state.items = action.payload.items || [];
      state.couponCode = action.payload.couponCode || null;
      // Clear history on hydrate to avoid undoing into empty state unintentionally
      state.history = [];
      calculateCart(state);
    },

    addItem(state, action: PayloadAction<CartItem>) {
      // Save current state to history
      state.history.push([...state.items]);
      state.items.push(action.payload);
      calculateCart(state);
    },

    removeItem(state, action: PayloadAction<number>) {
      const index = state.items.findIndex((i) => i.id === action.payload);
      if (index !== -1) {
        state.history.push([...state.items]);
        state.items.splice(index, 1);
        calculateCart(state);
      }
    },

    applyCoupon(state, action: PayloadAction<string>) {
      state.couponCode = action.payload;
      calculateCart(state);
    },

    undoLastAction(state) {
      const prevItems = state.history.pop();
      if (prevItems) {
        state.items = prevItems;
        calculateCart(state);
      }
    },
  },
});

export const { hydrateCart, addItem, removeItem, applyCoupon, undoLastAction } =
  cartSlice.actions;

export default cartSlice.reducer;
