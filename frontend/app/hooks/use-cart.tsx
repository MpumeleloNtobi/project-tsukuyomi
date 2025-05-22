"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/nextjs";

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  storeId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  storeId,
}: {
  children: ReactNode;
  storeId: string;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { userId: clerk_id } = useAuth();

  // Load cart from localStorage for the current store
  useEffect(() => {
    if (!clerk_id || !storeId) return;

    const savedCart = localStorage.getItem(`${clerk_id}-${storeId}-cart`);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
      }
    }
  }, [clerk_id, storeId]);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (!clerk_id || !storeId) return;

    localStorage.setItem(`${clerk_id}-${storeId}-cart`, JSON.stringify(items));
  }, [items, clerk_id, storeId]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i,
        );
      }
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (id: number | string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(`${clerk_id}-${storeId}-cart`);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        storeId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
