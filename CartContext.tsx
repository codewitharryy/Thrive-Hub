import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = (product) => {
    setItems(prev => {
      const found = prev.find(i=>i.id===product.id);
      if(found) return prev.map(i=> i.id===product.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {...product, qty:1}];
    });
  };
  const remove = (id) => setItems(prev => prev.filter(i=>i.id!==id));
  const updateQty = (id, qty) => setItems(prev => prev.map(i=> i.id===id?{...i,qty}:i));
  const clear = ()=> setItems([]);
  const total = items.reduce((s,i)=> s + i.price * i.qty, 0);
  return <CartContext.Provider value={{items, add, remove, updateQty, clear, total}}>{children}</CartContext.Provider>
}