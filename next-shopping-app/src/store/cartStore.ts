
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/Product";

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    increment: (id: number) => void;
    decrement: (id: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],

            addToCart: (product) => {
                const existing = get().cart.find((item) => item.id === product.id);
                if (existing) {
                    set({
                        cart: get().cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...get().cart, { ...product, quantity: 1 }] });
                }
            },

            removeFromCart: (id) => {
                set({ cart: get().cart.filter((item) => item.id !== id) });
            },

            increment: (id) => {
                set({
                    cart: get().cart.map((item) =>
                        item.id === id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
            },

            decrement: (id) => {
                set({
                    cart: get().cart.map((item) =>
                        item.id === id
                            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                            : item
                    ),
                });
            },

            clearCart: () => set({ cart: [] }),

            // total is now a method instead of getter
            getTotal: () =>
                get().cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0),
        }),
        {
            name: "cart-storage", // localStorage key
            partialize: (state) => ({ cart: state.cart }), // persist only cart
        }
    )
);
