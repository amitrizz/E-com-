"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { buildCartLineKey } from "@/lib/cart-line";

export type CartLine = {
  lineKey: string;
  productId: string;
  slug: string;
  name: string;
  priceInr: number;
  compareAtInr?: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
};

type State = { lines: CartLine[]; hydrated: boolean };

type Action =
  | { type: "HYDRATE"; lines: CartLine[] }
  | { type: "ADD"; line: CartLine }
  | { type: "SET_QTY"; lineKey: string; quantity: number }
  | { type: "REMOVE"; lineKey: string }
  | { type: "CLEAR" };

const STORAGE_KEY = "kashu-cart-v2";

function normalizeLine(raw: CartLine): CartLine {
  const lineKey =
    raw.lineKey ??
    buildCartLineKey(raw.productId, raw.color, raw.size);
  return { ...raw, lineKey };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, lines: action.lines.map(normalizeLine), hydrated: true };
    case "ADD": {
      const line = normalizeLine(action.line);
      const existing = state.lines.find((l) => l.lineKey === line.lineKey);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.lineKey === line.lineKey
              ? { ...l, quantity: l.quantity + line.quantity }
              : l
          ),
        };
      }
      return { ...state, lines: [...state.lines, line] };
    }
    case "SET_QTY":
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.lineKey === action.lineKey ? { ...l, quantity: action.quantity } : l
        ),
      };
    case "REMOVE":
      return { ...state, lines: state.lines.filter((l) => l.lineKey !== action.lineKey) };
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
  addLine: (line: Omit<CartLine, "lineKey"> & { lineKey?: string }) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  removeLine: (lineKey: string) => void;
  clearCart: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], hydrated: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let lines: CartLine[] = raw ? (JSON.parse(raw) as CartLine[]) : [];
      if (!lines.length) {
        const legacy = localStorage.getItem("kashu-cart-v1");
        if (legacy) lines = JSON.parse(legacy) as CartLine[];
      }
      dispatch({ type: "HYDRATE", lines });
    } catch {
      dispatch({ type: "HYDRATE", lines: [] });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
  }, [state.lines, state.hydrated]);

  const addLine = useCallback((line: Omit<CartLine, "lineKey"> & { lineKey?: string }) => {
    const normalized = normalizeLine(line as CartLine);
    dispatch({ type: "ADD", line: normalized });
  }, []);

  const setQuantity = useCallback((lineKey: string, quantity: number) => {
    if (quantity < 1) dispatch({ type: "REMOVE", lineKey });
    else dispatch({ type: "SET_QTY", lineKey, quantity });
  }, []);

  const removeLine = useCallback((lineKey: string) => {
    dispatch({ type: "REMOVE", lineKey });
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
