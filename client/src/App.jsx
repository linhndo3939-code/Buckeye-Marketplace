import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom'
import './App.css'

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      width: '250px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <h3>{product.title}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Seller:</strong> {product.sellerName}</p>
    </div>
  </Link>
)

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Buckeye Marketplace</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <h2>No products available at the moment.</h2>
      ) : (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching product:', error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div style={{ padding: '20px' }}><p>Loading product details...</p></div>
  }

  if (!product) {
    return <div style={{ padding: '20px' }}><p>Product not found</p></div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to List
      </Link>
      <div style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '24px',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1>{product.title}</h1>
        <p style={{ fontSize: '24px', color: '#28a745', fontWeight: 'bold' }}>${product.price}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Seller:</strong> {product.sellerName}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Posted:</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
        
        {/* Scarlet Add to Cart Button */}
        <button 
          onClick={() => alert(`${product.title} added to cart!`)}
          style={{
            backgroundColor: '#ba0c2f', 
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '18px',
            cursor: 'pointer',
            marginTop: '20px',
            width: '100%'
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App