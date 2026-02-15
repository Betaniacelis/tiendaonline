import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { getCarritoCount } from "@/api/carrito";

interface CartContextType {
  count: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  count: 0,
  refresh: async () => {},
});

export function CartProvider({
  children,
  userId,
}: {
  children: ReactNode;
  userId: string | null;
}) {
  const [count, setCount] = useState(0);

  const refresh = async () => {
    if (!userId) {
      setCount(0);
      return;
    }
    try {
      const c = await getCarritoCount(userId);
      setCount(c);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  return (
    <CartContext.Provider value={{ count, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
