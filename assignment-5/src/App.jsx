import React, { useState } from 'react';
import './App.css';

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    price: 2499,
    category: 'Electronics',
    image: '🎧'
  },
  {
    id: 2,
    name: 'Ergonomic Mechanical Keyboard',
    price: 3299,
    category: 'Computers',
    image: '⌨️'
  },
  {
    id: 3,
    name: 'Smart Fitness Tracker Watch',
    price: 1899,
    category: 'Wearables',
    image: '⌚'
  },
  {
    id: 4,
    name: 'Aluminum Laptop Stand',
    price: 799,
    category: 'Accessories',
    image: '💻'
  },
  {
    id: 5,
    name: 'Fast Wireless Charger Pad',
    price: 999,
    category: 'Electronics',
    image: '🔋'
  },
  {
    id: 6,
    name: 'USB-C Multiport Adapter Hub',
    price: 1499,
    category: 'Accessories',
    image: '🔌'
  }
];

const VALID_COUPONS = {
  SAVE10: 10,
  FESTIVE20: 20,
  SUPER50: 50
};

const GST_RATE = 0.18; // 18% GST

function App() {
  const [cart, setCart] = useState([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + change;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }

    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, discountPercent: VALID_COUPONS[code] });
      setCouponMessage({
        type: 'success',
        text: `Coupon '${code}' applied! You saved ${VALID_COUPONS[code]}%.`
      });
      setCouponInput('');
    } else {
      setCouponMessage({
        type: 'error',
        text: 'Invalid coupon code. Try SAVE10, FESTIVE20, or SUPER50.'
      });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponMessage({ type: 'info', text: 'Coupon removed.' });
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon
    ? (subtotal * appliedCoupon.discountPercent) / 100
    : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const gstAmount = taxableAmount * GST_RATE;
  const grandTotal = taxableAmount + gstAmount;

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-brand">
          <h1>ElectroBazaar</h1>
          <span>Tech & Accessories Store</span>
        </div>
        <div className="nav-badge">
          Cart Items: <strong>{cart.reduce((total, i) => total + i.quantity, 0)}</strong>
        </div>
      </header>

      <main className="main-content">
        {/* Left Column: Product Catalog */}
        <section className="catalog-section">
          <h2>Product Catalog</h2>
          <div className="product-grid">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-icon">{product.image}</div>
                <span className="product-cat">{product.category}</span>
                <h3>{product.name}</h3>
                <p className="product-price">₹{product.price.toLocaleString('en-IN')}</p>
                <button
                  className="btn btn-add"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Cart & Checkout Summary */}
        <section className="cart-section">
          <div className="cart-card">
            <h2>Your Shopping Cart</h2>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your shopping cart is currently empty.</p>
                <span className="empty-hint">Select items from the catalog to add them.</span>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <span className="item-price">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </span>
                      </div>

                      <div className="quantity-controls">
                        <button
                          className="btn-qty"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span className="qty-number">{item.quantity}</span>
                        <button
                          className="btn-qty"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <button
                        className="btn-remove"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="coupon-box">
                  <label htmlFor="coupon">Apply Coupon Code</label>
                  <form onSubmit={handleApplyCoupon} className="coupon-form">
                    <input
                      id="coupon"
                      type="text"
                      placeholder="e.g. SAVE10, FESTIVE20"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button type="submit" className="btn btn-apply">
                      Apply
                    </button>
                  </form>

                  {couponMessage.text && (
                    <p className={`coupon-msg ${couponMessage.type}`}>
                      {couponMessage.text}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="applied-tag">
                      <span>
                        Active: <strong>{appliedCoupon.code}</strong> (
                        {appliedCoupon.discountPercent}% Off)
                      </span>
                      <button onClick={handleRemoveCoupon}>Remove</button>
                    </div>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="bill-summary">
                  <div className="bill-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="bill-row discount">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="bill-row">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount.toFixed(2)}</span>
                  </div>

                  <hr className="divider" />

                  <div className="bill-row grand-total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-checkout"
                    onClick={() => alert(`Order placed! Grand Total: ₹${grandTotal.toFixed(2)}`)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;