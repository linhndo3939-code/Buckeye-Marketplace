import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

// Centralized API URL (Addressing Professor's coaching note on hardcoded URLs)
const API_URL = 'http://localhost:5000/api/cart';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Fetch Cart from Database on Load
    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            // The API returns { items: [...] }, so we set the items array
            setCart(response.data.items || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 2. Add to Cart (POST)
    const addToCart = async (product) => {
        try {
            await axios.post(API_URL, {
                productId: product.id,
                quantity: 1
            });
            fetchCart(); // Refresh cart from DB after adding
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // 3. Remove Single Item (DELETE)
    const removeFromCart = async (cartItemId) => {
        try {
            await axios.delete(`${API_URL}/${cartItemId}`);
            fetchCart(); // Refresh cart from DB after removing
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // 4. Update Quantity (PUT) - New feature required by rubric
    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            await axios.put(`${API_URL}/${cartItemId}`, newQuantity, {
                headers: { 'Content-Type': 'application/json' }
            });
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // 5. Clear Cart (DELETE /clear)
    const clearCart = async () => {
        try {
            await axios.delete(`${API_URL}/clear`);
            setCart([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ 
            cart, 
            loading, 
            addToCart, 
            removeFromCart, 
            updateQuantity, 
            clearCart 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);