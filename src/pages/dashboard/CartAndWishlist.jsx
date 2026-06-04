import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CartAndWishlist() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' or 'wishlist'

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [address, setAddress] = useState('123 Default Address'); // Just a mock for MVP

  const fetchCart = async () => {
    try {
      const res = await api.get('/marketplace/cart');
      setCartItems(res.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/marketplace/wishlist');
      setWishlistItems(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 5.00;
  const tax = subtotal * 0.05;
  const total = subtotal > 0 ? subtotal + shipping + tax : 0;

  const handleRemoveFromCart = async (cartItemId) => {
    await api.delete(`/marketplace/cart/${cartItemId}`);
    fetchCart();
  };

  const handleRemoveFromWishlist = async (wishlistId) => {
    await api.delete(`/marketplace/wishlist/${wishlistId}`);
    fetchWishlist();
  };

  const handleCheckout = async () => {
    try {
      const res = await api.post('/marketplace/checkout', { shipping_address: address });
      alert('Order Placed! Tracking Number: ' + res.data.tracking_number);
      navigate(`/dashboard/marketplace/orders/${res.data.tracking_number}`);
    } catch (err) {
      alert('Checkout failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white p-8">
      <button onClick={() => navigate('/dashboard/marketplace')} className="flex items-center gap-2 text-brand-violet hover:text-white transition mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Shop
      </button>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('cart')}
          className={`text-xl font-bold px-6 py-2 rounded-lg transition ${activeTab === 'cart' ? 'bg-brand-card border border-brand-purple text-white' : 'text-slate-400 hover:text-white'}`}
        >
          Shopping Cart ({cartItems.length})
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className={`text-xl font-bold px-6 py-2 rounded-lg transition ${activeTab === 'wishlist' ? 'bg-brand-card border border-brand-purple text-white' : 'text-slate-400 hover:text-white'}`}
        >
          My Wishlist ({wishlistItems.length})
        </button>
      </div>

      {activeTab === 'cart' && (
        <div className="bg-brand-card border border-[#2A2E3D] rounded-3xl p-8 flex gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            {cartItems.map(item => (
              <div key={item.cart_item_id} className="flex gap-6 items-center border-b border-[#2A2E3D] pb-6">
                <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-sm text-brand-violet">{item.seller}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-[#2A2E3D] rounded-lg overflow-hidden">
                      <button className="px-3 py-1 hover:bg-[#2A2E3D] transition">-</button>
                      <span className="px-3 py-1 text-sm border-l border-r border-[#2A2E3D]">{item.quantity}</span>
                      <button className="px-3 py-1 hover:bg-[#2A2E3D] transition">+</button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-xs text-slate-400 mt-1">${item.price} each</p>
                  <button onClick={() => handleRemoveFromCart(item.cart_item_id)} className="mt-4 text-slate-500 hover:text-red-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-80 shrink-0">
            <div className="bg-[#0B0E14] border border-[#2A2E3D] rounded-2xl p-6 sticky top-8">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>
              <div className="space-y-4 text-sm mb-6 border-b border-[#2A2E3D] pb-6">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Shipping</span>
                  <span className="text-verified-green">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Tax (5%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button onClick={handleCheckout} className="w-full py-3 bg-brand-purple hover:bg-violet-500 rounded-xl font-bold transition mb-4">
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/dashboard/marketplace')} className="w-full py-3 text-brand-violet hover:text-white transition text-sm font-bold">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="bg-brand-card border border-[#2A2E3D] rounded-3xl p-8">
          <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map(item => (
              <div key={item.wishlist_id} className="bg-[#0B0E14] rounded-2xl overflow-hidden border border-[#2A2E3D] flex flex-col">
                <img src={item.image_url || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm mb-2">{item.name}</h3>
                  <p className="font-bold text-brand-violet mb-4">${item.price}</p>
                  <div className="mt-auto flex gap-2">
                    <button onClick={async () => {
                      await api.post('/marketplace/cart', { product_id: item.id, quantity: 1 });
                      alert('Added to cart!');
                    }} className="flex-1 bg-brand-purple hover:bg-violet-500 py-2 rounded-lg text-sm font-bold transition">Add to Cart</button>
                    <button onClick={() => handleRemoveFromWishlist(item.wishlist_id)} className="p-2 border border-[#2A2E3D] hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 rounded-lg text-brand-purple transition">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
