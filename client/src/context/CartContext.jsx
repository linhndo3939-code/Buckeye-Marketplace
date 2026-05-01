import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();
const API_URL = 'http://localhost:5000/api/Cart';

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL);
            // .NET often returns PascalCase (Price) or camelCase (price). 
            // We ensure the items are mapped correctly here to avoid "string" issues.
            const normalizedItems = (response.data.items || []).map(item => ({
                ...item,
                id: item.id || item.Id,
                price: item.price || item.Price,
                title: item.title || item.Title
            }));
            setCart(normalizedItems);
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

   const addToCart = async (product) => {
    try {
        await axios.post(API_URL, {
            ProductId: product.id || product.productId, 
            // Check if your product object uses 'name' or 'productName' instead of 'title'
            Title: product.title || product.name || product.productName, 
            Price: product.price,
            Quantity: 1,
            UserId: "default-user"
        });
        fetchCart(); 
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
};

    const removeFromCart = async (cartItemId) => {
        try {
            // Ensure cartItemId is passed correctly in the URL
            await axios.delete(`${API_URL}/${cartItemId}`);
            fetchCart(); 
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(cartItemId);

    try {
        await axios.put(`${API_URL}/${cartItemId}`, { 
            Quantity: newQuantity // Match the C# property name exactly
        }); 
        fetchCart(); 
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
};

    const clearCart = async () => {
        try {
            await axios.delete(`${API_URL}/clear`);
            setCart([]);
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);