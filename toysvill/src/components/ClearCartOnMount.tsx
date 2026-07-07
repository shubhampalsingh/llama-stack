"use client";

import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

// After a successful checkout, empty the toy chest.
export function ClearCartOnMount() {
  const cart = useCart();
  useEffect(() => {
    cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
