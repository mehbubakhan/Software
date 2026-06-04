import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import SEO from '../../components/SEO';

const sidebarItems = [
  { label: 'Dashboard', path: '/dashboard/parent' },
  { label: 'Nanny', path: '/dashboard/parent/hire-nanny' },
  { label: 'Daycare', path: '/dashboard/parent/daycare' },
  { label: 'Adoption', path: '/dashboard/parent/adoption' },
  { label: 'Shop', path: '/dashboard/marketplace' },
  { label: 'Job Requests', path: '/dashboard/parent/job-requests' },
  { label: 'Interviews', path: '/dashboard/parent/interviews' },
  { label: 'Schedule', path: '/dashboard/parent/schedule' },
  { label: 'Messages', path: '/dashboard/parent/messages' },
  { label: 'Notifications', path: '/dashboard/parent/notifications' },
  { label: 'Settings', path: '/dashboard/parent/settings' },
];

export default function MarketplaceBuyerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/marketplace/products');
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await api.post('/marketplace/cart', { product_id: productId, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await api.post('/marketplace/wishlist', { product_id: productId });
      alert('Added to wishlist!');
    } catch (err) {
      console.error(err);
      alert('Already in wishlist or failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white font-sans">
      <SEO title="Shop - Smart Nanny" description="Browse baby products, toys, and accessories from verified sellers." />
      <Sidebar items={sidebarItems} variant="parent-workspace" />
      
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Baby Products Marketplace</h1>
            <p className="text-slate-400 mt-1">Everything your baby needs, from verified sellers you can trust</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard/marketplace/wishlist')} className="p-3 bg-brand-card rounded-lg hover:bg-[#2A2E3D] transition">
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </button>
            <button onClick={() => navigate('/dashboard/marketplace/cart')} className="p-3 bg-brand-card rounded-lg hover:bg-[#2A2E3D] transition">
              <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </button>
          </div>
        </header>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 shrink-0 bg-brand-card p-6 rounded-2xl h-fit border border-[#2A2E3D]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold">Filters</h2>
              <button className="text-xs text-brand-violet hover:text-white transition">Clear all</button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Category</label>
                <select className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-purple">
                  <option>All Categories</option>
                  <option>Baby Dress & Accessories</option>
                  <option>Toys</option>
                  <option>Skincare</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Seller</label>
                <select className="w-full bg-[#0B0E14] border border-[#2A2E3D] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-brand-purple">
                  <option>All Sellers</option>
                  <option>Baby Care Hub</option>
                  <option>Tiny Tots</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-400 block mb-2">Price Range: $0 - $100</label>
                <input type="range" className="w-full accent-brand-purple" />
              </div>

              <div className="pt-4 border-t border-[#2A2E3D]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded bg-[#0B0E14] border-[#2A2E3D] accent-brand-purple" />
                  <span className="text-sm text-slate-300">Verified sellers only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-center bg-brand-card p-4 rounded-xl border border-[#2A2E3D]">
              <p className="text-sm text-slate-400">{products.length} products found</p>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                  Hide Filters
                </button>
                <select className="bg-[#0B0E14] border border-[#2A2E3D] rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-brand-card rounded-2xl overflow-hidden border border-[#2A2E3D] flex flex-col hover:border-brand-purple transition-colors">
                  <div className="relative h-48">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    {product.is_verified && (
                      <span className="absolute top-3 right-3 bg-verified-green text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-brand-violet mb-1">{product.seller_name}</p>
                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-yellow-400 text-sm">
                        {'★'.repeat(5)}
                      </div>
                      <span className="text-xs text-slate-400">(New)</span>
                    </div>
                    
                    <div className="mt-auto flex items-end justify-between mb-4">
                      <span className="text-2xl font-bold text-white">${product.price}</span>
                      <span className="text-xs text-verified-green">In Stock</span>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => handleAddToCart(product.id)} className="flex-1 bg-brand-purple hover:bg-violet-500 text-white font-medium py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        Add to Cart
                      </button>
                      <button onClick={() => handleAddToWishlist(product.id)} className="p-2.5 rounded-xl border border-[#2A2E3D] hover:bg-[#2A2E3D] text-slate-300 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Features Footer */}
            <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-[#2A2E3D]">
              <div className="bg-brand-card p-6 rounded-2xl text-center border border-[#2A2E3D]">
                <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mx-auto mb-4 text-brand-violet">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">Secure Checkout</h4>
                <p className="text-xs text-slate-400">Safe and encrypted payment processing</p>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl text-center border border-[#2A2E3D]">
                <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mx-auto mb-4 text-brand-violet">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">Verified Sellers</h4>
                <p className="text-xs text-slate-400">All sellers are verified and trusted</p>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl text-center border border-[#2A2E3D]">
                <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mx-auto mb-4 text-brand-violet">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">Easy Returns</h4>
                <p className="text-xs text-slate-400">Hassle-free return and refund policy</p>
              </div>
              <div className="bg-brand-card p-6 rounded-2xl text-center border border-[#2A2E3D]">
                <div className="w-12 h-12 rounded-full bg-brand-purple/20 flex items-center justify-center mx-auto mb-4 text-brand-violet">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h4 className="font-bold text-white text-sm mb-2">Fast Delivery</h4>
                <p className="text-xs text-slate-400">Quick and reliable shipping options</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
