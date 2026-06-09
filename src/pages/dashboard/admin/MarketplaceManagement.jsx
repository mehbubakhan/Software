import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, DollarSign, Search, Store } from 'lucide-react';
import api from '../../../services/api';

export default function MarketplaceManagement() {
  const [data, setData] = useState({ shops: [], products: [] });
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('shops');

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        const res = await api.get('/admin/marketplace');
        if (res.data?.ok) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load marketplace:", err);
      }
    };
    fetchMarketplace();
  }, []);

  const filteredShops = data.shops.filter(s => 
    s.business_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProducts = data.products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-amber-500" /> Marketplace Control
          </h1>
          <p className="text-slate-500 font-medium mt-2">Oversee seller shops, product approvals, and transaction disputes.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none w-full md:w-80 font-medium shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 flex gap-6">
          <button onClick={() => setActiveTab('shops')} className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'shops' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Seller Shops</button>
          <button onClick={() => setActiveTab('products')} className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-all ${activeTab === 'products' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Products Overview</button>
        </div>

        <div className="overflow-x-auto p-6">
          {activeTab === 'shops' && (
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider font-black border-b border-slate-100">
                  <th className="pb-4">Shop Name</th>
                  <th className="pb-4">Owner</th>
                  <th className="pb-4">Revenue</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShops.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">No shops found.</td>
                  </tr>
                ) : (
                  filteredShops.map(shop => (
                    <tr key={shop.id} className="hover:bg-slate-50 transition">
                      <td className="py-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-slate-400" /> {shop.business_name}
                        </div>
                      </td>
                      <td className="py-5 text-slate-700 font-medium">{shop.name || `User ID: ${shop.user_id}`}</td>
                      <td className="py-5 text-emerald-600 font-bold">{shop.revenue || '৳0'}</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${shop.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {shop.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <button className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition">
                          Manage Shop
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'products' && (
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider font-black border-b border-slate-100">
                  <th className="pb-4">Product Name</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Stock</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-500 font-medium">No products found.</td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 transition">
                      <td className="py-5 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-slate-400" /> {product.name}
                        </div>
                      </td>
                      <td className="py-5 text-slate-700 font-bold">৳{product.price}</td>
                      <td className="py-5 text-slate-500 font-medium">{product.remaining || 0} left</td>
                      <td className="py-5">
                        <span className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider ${product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {product.status || 'Draft'}
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <button className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition">
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
