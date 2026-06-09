import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }){
    const [cartCount, setCartCount] = useState (() => {
        const savedCount = localStorage.getItem('cart_count');
        const parsed = parseInt(savedCount, 10);
        return Number.isNaN(parsed) ? 0 : parsed;
    });

    useEffect(() => {
        localStorage.setItem('cart_count', cartCount);
    }, [cartCount]);

    return (
        <CartContext.Provider value={{ cartCount, setCartCount}}>
            {children}
        </CartContext.Provider>
    );
}