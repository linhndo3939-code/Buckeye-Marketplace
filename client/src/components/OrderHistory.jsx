import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get the token you saved during login (usually in localStorage)
                const token = localStorage.getItem('token'); 
                
                const response = await axios.get('http://localhost:5000/api/orders/mine', {
                    headers: {
                        Authorization: `Bearer ${token}` // Send the token to prove you are logged in
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="container mt-5">Loading your history...</div>;

    return (
        <div className="container mt-5">
            <h2>My Order History</h2>
            {orders.length === 0 ? (
                <p className="mt-3">You haven't placed any orders yet.</p>
            ) : (
                <table className="table table-striped mt-3">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                                <td>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <span className="badge bg-success">{order.status || 'Completed'}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderHistory;