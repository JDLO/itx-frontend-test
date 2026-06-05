import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }){
    const [cartCount, setCartCount] = useState (() => {
        const savedCount = localStorage.getItem('cart_count');
        return savedCount ? parseInt(savedCount, 10) : 0;
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