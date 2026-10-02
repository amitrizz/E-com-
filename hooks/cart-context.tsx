"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  priceInr: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
};

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "HYDRATE"; lines: CartLine[] }
  | { type: "ADD"; line: CartLine }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" };

const STORAGE_KEY = "kashu-cart-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, lines: action.lines, hydrated: true };
    case "ADD": {
      const existing = state.lines.find((l) => l.productId === action.line.productId);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.productId === action.line.productId
              ? { ...l, quantity: l.quantity + action.line.quantity }
              : l
          ),
        };
      }
      return { ...state, lines: [...state.lines, action.line] };
    }
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.productId === action.productId ? { ...l, quantity: action.quantity } : l
        ),
      };
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.productId !== action.productId) };
    case "CLEAR":
      return { ...state, lines: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  lines: CartLine[];
  hydrated: boolean;
  count: number;
  subtotal: number;
  addLine: (line: CartLine) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const lines = raw ? (JSON.parse(raw) as CartLine[]) : [];
      dispatch({ type: "HYDRATE", lines });
    } catch {
      dispatch({ type: "HYDRATE", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.hydrated]);

  const addLine = useCallback((line: CartLine) => {
    dispatch({ type: "ADD", line });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) dispatch({ type: "REMOVE", productId });
    else dispatch({ type: "SET_QTY", productId, quantity });
  }, []);

  const removeLine = useCallback((productId: string) => {
    dispatch({ type: "REMOVE", productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const count = useMemo(
    () => state.lines.reduce((n, l) => n + l.quantity, 0),
    [state.lines]
  );
  const subtotal = useMemo(
    () => state.lines.reduce((n, l) => n + l.priceInr * l.quantity, 0),
    [state.lines]
  );

  const value = useMemo(
    () => ({
      lines: state.lines,
      hydrated: state.hydrated,
      count,
      subtotal,
      addLine,
      setQuantity,
      removeLine,
      clearCart,
    }),
    [state.lines, state.hydrated, count, subtotal, addLine, setQuantity, removeLine, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
