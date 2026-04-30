import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); // Toggle between Products and Orders

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const prodRes = await axios.get('http://localhost:5000/api/products');
            setProducts(prodRes.data);
            
            // Note: This endpoint should be [Authorize(Roles = "Admin")] in your OrdersController
            const orderRes = await axios.get('http://localhost:5000/api/orders');
            setOrders(orderRes.data);
        } catch (error) {
            console.error("Error loading admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm("Delete this product permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/api/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
                alert("Product removed.");
            } catch (error) {
                alert("Action failed. Verify Admin permissions.");
            }
        }
    };

    if (loading) return <div style={{padding: '20px'}}>Loading Admin Dashboard...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Admin Control Panel</h1>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={() => setActiveTab('products')} style={tabStyle(activeTab === 'products')}>Manage Products</button>
                <button onClick={() => setActiveTab('orders')} style={tabStyle(activeTab === 'orders')}>Manage Orders</button>
            </div>

            {activeTab === 'products' ? (
                <section>
                    <h2>Product Inventory ({products.length})</h2>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>
                                    <td>${p.price}</td>
                                    <td>
                                        <button onClick={() => handleDeleteProduct(p.id)} style={deleteBtnStyle}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            ) : (
                <section>
                    <h2>Customer Orders ({orders.length})</h2>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer ID</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td>{o.id}</td>
                                    <td>{o.userId}</td>
                                    <td>${o.totalAmount}</td>
                                    <td><span style={statusBadgeStyle}>{o.status || 'Pending'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            )}
        </div>
    );
};

// --- Styles ---
const tableStyle = { width: '100%', borderCollapse: 'collapse', marginTop: '10px' };
const tabStyle = (active) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: active ? '#ba0c2f' : '#eee', // OSU Red for active
    color: active ? 'white' : 'black',
    border: '1px solid #ccc',
    marginRight: '5px'
});
const deleteBtnStyle = { backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' };
const statusBadgeStyle = { backgroundColor: '#f0ad4e', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em' };

export default AdminDashboard;