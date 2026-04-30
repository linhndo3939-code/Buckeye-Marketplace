import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/orders/mine');
                setOrders(response.data);
            } catch (err) {
                console.error("Error fetching orders", err);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Order History</h2>
            {orders.length === 0 ? <p>No orders found.</p> : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>Order #{order.id} - Total: ${order.totalPrice} - Status: {order.status}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default OrdersPage;
