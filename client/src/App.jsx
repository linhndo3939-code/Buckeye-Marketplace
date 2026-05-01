import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import './App.css'
import { CartProvider, useCart } from './context/CartContext';


const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '12px',
      width: '280px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      backgroundColor: 'white'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <h3 style={{ color: '#ba0c2f' }}>{product.title}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Seller:</strong> {product.sellerName}</p>
    </div>
  </Link>
)


function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching products:', error)
        setLoading(false)
      })
  }, [])

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '10px', fontSize: '2.5rem' }}>Available Products</h1>
      
      {/* Search Bar UI */}
      <div className="search-container" style={{ marginBottom: '40px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search for items (e.g., 'Hibbeler Dynamics')..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            padding: '12px', 
            width: '100%', 
            maxWidth: '400px', 
            borderRadius: '8px', 
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <h2>No products match your search.</h2>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {/* Mapping through filteredProducts instead of products */}
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}



function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart(); // Access the central function from CartContext
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep the useEffect to load the specific product details for this page
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id]);

  // Integrated handler that uses the Context function
  const handleAddToCart = () => {
    if (product) {
      // This triggers the axios.post logic inside CartContext.jsx to your .NET backend
      addToCart(product); 
      alert(`${product.title} added to cart!`);
    }
  };

  if (loading) return <div style={{ padding: '40px' }}><p>Loading product details...</p></div>;
  if (!product) return <div style={{ padding: '40px' }}><p>Product not found</p></div>;

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
        ← Back to Marketplace
      </Link>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '12px', 
        padding: '40px', 
        marginTop: '20px', 
        backgroundColor: 'white', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
      }}>
        <h1 style={{ color: '#ba0c2f' }}>{product.title}</h1>
        <p style={{ fontSize: '32px', color: '#28a745', fontWeight: 'bold' }}>${product.price}</p>
        <hr />
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Seller:</strong> {product.sellerName}</p>
        <p style={{ marginTop: '20px', lineHeight: '1.6' }}><strong>Description:</strong> {product.description}</p>
        
        {/* The button now triggers the integrated handleAddToCart logic */}
        <button 
          onClick={handleAddToCart} 
          style={{ 
            backgroundColor: '#ba0c2f', 
            color: 'white', 
            padding: '15px', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '20px', 
            cursor: 'pointer', 
            marginTop: '30px', 
            width: '100%', 
            fontWeight: 'bold' 
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

function ShoppingCart() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();

  if (loading) return <div style={{ padding: '40px' }}><p>Loading your Buckeye Cart...</p></div>;

  const items = cart || []; 
  
  // 1. CALCULATE TOTAL: Looks for price/Price in multiple possible locations
  const totalPrice = items.reduce((sum, item) => {
    const unitPrice = item.price || item.Price || item.product?.price || item.product?.Price || 0;
    return sum + (Number(unitPrice) * item.quantity);
  }, 0);

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ color: '#ba0c2f', borderBottom: '4px solid #ba0c2f', paddingBottom: '10px' }}>
        Your Buckeye Cart
      </h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Your cart is empty.</p>
          <Link to="/" style={{ color: '#ba0c2f', fontWeight: 'bold' }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          {items.map((item) => {
            // 2. FIND DATA: This "Deep Search" finds the name even if it's nested
            const displayTitle = item.title || item.Title || item.product?.title || item.product?.Title || "Unknown Item";
            const displayPrice = item.price || item.Price || item.product?.price || item.product?.Price || 0;

            return (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '20px 0', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0 }}>{displayTitle}</h3>
                  <p style={{ color: '#666', margin: '5px 0' }}>${Number(displayPrice).toFixed(2)} each</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    style={{ width: '35px', height: '35px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                  >-</button>
                  
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    style={{ width: '35px', height: '35px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
                  >+</button>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    style={{ marginLeft: '20px', color: '#ba0c2f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '40px', textAlign: 'right' }}>
            <h2 style={{ fontSize: '2rem' }}>Total: ${totalPrice.toFixed(2)}</h2>
          </div>
        </div>
      )}
    </div>
  );
}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Login Logic
      if (email && password) {
        alert(`Welcome back!`);
        navigate('/');
      } else {
        alert("Please enter both your OSU email and password.");
      }
    } else {
      // Sign Up Logic
      if (email && password && password === confirmPassword) {
        alert(`Account created for ${email}!`);
        setIsLogin(true); // Switch to login after signing up
      } else {
        alert("Please ensure all fields are filled and passwords match.");
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '80vh', backgroundColor: '#f9f9f9' 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '50px', borderRadius: '15px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', 
        maxWidth: '450px', textAlign: 'center' 
      }}>
        {/* Title changes based on state */}
        <h1 style={{ color: '#ba0c2f', marginBottom: '10px' }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          {isLogin ? "Log in to Buckeye Marketplace" : "Sign up with your OSU email"}
        </p>
        
        <form onSubmit={handleAuth}>
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>OSU Email</label>
            <input 
              type="text" placeholder="name.1@osu.edu" value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" placeholder="••••••••" value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          {/* Show Confirm Password only if signing up */}
          {!isLogin && (
            <div style={{ textAlign: 'left', marginBottom: '30px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Confirm Password</label>
              <input 
                type="password" placeholder="••••••••" value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              />
            </div>
          )}
          
          <button type="submit" style={{ 
            backgroundColor: '#ba0c2f', color: 'white', border: 'none', 
            padding: '15px', borderRadius: '8px', cursor: 'pointer', 
            width: '100%', fontWeight: 'bold', fontSize: '18px'
          }}>
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Link */}
        <div style={{ marginTop: '20px' }}>
          <span>{isLogin ? "New to the marketplace?" : "Already have an account?"}</span>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: '#ba0c2f', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px' }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <nav style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 40px', 
          background: '#ba0c2f', 
          color: 'white',
          height: '80px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <Link to="/" style={{ color: 'white', fontWeight: '900', textDecoration: 'none', fontSize: '1.8rem' }}>
            BUCKEYE MARKETPLACE
          </Link>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
              👤 Login
            </Link>
            <Link to="/cart" style={{ color: 'white', textDecoration: 'none', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
              🛒 Cart
            </Link>
          </div>
        </nav>

        <div style={{ backgroundColor: '#f4f4f4', minHeight: 'calc(100vh - 80px)' }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App