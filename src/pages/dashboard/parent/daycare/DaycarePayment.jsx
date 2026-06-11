import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';

export default function DaycarePayment() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'mobile'
  const [step, setStep] = useState(1); // 1: form/provider, 2: mobile number, 3: mobile pin, 4: success
  const [mobileProvider, setMobileProvider] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [mobileData, setMobileData] = useState({
    number: '',
    pin: ''
  });

  const handleProcessPayment = async () => {
    setLoading(true);
    try {
      const payload = paymentMethod === 'card' ? { type: 'card', ...cardData } : { type: 'mobile', provider: mobileProvider, ...mobileData };
      const response = await api.post('/daycare/payment', payload);
      setTransactionData({
        amount: '$1,200.00',
        id: response.data.transactionId,
        date: new Date().toLocaleString(),
        paymentMethod: paymentMethod === 'card' ? 'Card Ending 5678' : `${mobileProvider} - ${mobileData.number.slice(-4)}`
      });
      setStep(4); // Success
    } catch (err) {
      console.error('Payment error', err);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { name: 'bKash', desc: 'Mobile financial service', icon: '🦩', color: 'text-pink-500' },
    { name: 'Nagad', desc: 'Digital Financial Service', icon: '♾️', color: 'text-orange-500' },
    { name: 'Rocket', desc: 'Dutch-Bangla Bank Ltd', icon: '🚀', color: 'text-purple-500' }
  ];

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl mt-8">
        <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-800 flex items-center gap-2 mb-6 transition text-sm font-semibold">
          ← Back to Details
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
            <h1 className="text-xl font-bold text-slate-800">Payment Method</h1>
            <div className="text-slate-400 text-sm">Fee: <span className="text-slate-800 font-bold">$1,200.00</span></div>
          </div>

          {step !== 4 && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => { setPaymentMethod('card'); setStep(1); }}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition font-bold ${paymentMethod === 'card' ? 'border-fuchsia-500 bg-fuchsia-500/10 text-slate-800' : 'border-slate-200 text-slate-400 hover:bg-slate-800'}`}
              >
                <span>💳</span> Credit/Debit Card
              </button>
              <button 
                onClick={() => { setPaymentMethod('mobile'); setStep(1); }}
                className={`flex items-center justify-center gap-2 py-4 rounded-xl border transition font-bold ${paymentMethod === 'mobile' ? 'border-fuchsia-500 bg-fuchsia-500/10 text-slate-800' : 'border-slate-200 text-slate-400 hover:bg-slate-800'}`}
              >
                <span>📱</span> Mobile Payment
              </button>
            </div>
          )}

          {/* CARD PAYMENT FLOW */}
          {paymentMethod === 'card' && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Card Number <span className="text-red-500">*</span></label>
                <input value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} type="text" placeholder="4758 9825 8957 5678" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Cardholder Name <span className="text-red-500">*</span></label>
                <input value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Expiry Date <span className="text-red-500">*</span></label>
                  <input value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} type="text" placeholder="MM/YY" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">CVV <span className="text-red-500">*</span></label>
                  <input value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} type="password" placeholder="123" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500" />
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-xl p-4 flex items-center gap-3 mt-6 text-sm">
                <span>🔒</span> Your payment information is encrypted and secure.
              </div>

              <button disabled={loading} onClick={handleProcessPayment} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl mt-6 transition disabled:opacity-50">
                {loading ? 'Processing...' : 'Pay / Order - $1200.00'}
              </button>
            </div>
          )}

          {/* MOBILE PAYMENT FLOW - STEP 1: Select Provider */}
          {paymentMethod === 'mobile' && step === 1 && (
            <div className="space-y-4">
              <h3 className="text-slate-400 mb-2 font-semibold text-sm">Select Payment Provider</h3>
              <div className="grid gap-3">
                {providers.map(prov => (
                  <button 
                    key={prov.name}
                    onClick={() => { setMobileProvider(prov.name); setStep(2); }}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-fuchsia-500 hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl ${prov.color}`}>{prov.icon}</div>
                      <div className="text-left">
                        <div className="font-bold text-slate-800">{prov.name}</div>
                        <div className="text-xs text-slate-400">{prov.desc}</div>
                      </div>
                    </div>
                    <div className="text-slate-500">›</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MOBILE PAYMENT FLOW - STEP 2: Enter Number */}
          {paymentMethod === 'mobile' && step === 2 && (
            <div className="space-y-6">
              <h3 className="text-slate-400 font-semibold text-sm">Selected Provider</h3>
              <div className="border border-fuchsia-500 rounded-xl p-4 flex items-center gap-4">
                <div className="text-2xl text-pink-500">{providers.find(p => p.name === mobileProvider)?.icon}</div>
                <div>
                  <div className="font-bold text-slate-800">{mobileProvider} Payment</div>
                  <div className="text-xs text-slate-400">Account: ACTIVE</div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">{mobileProvider} Account Number <span className="text-red-500">*</span></label>
                <input value={mobileData.number} onChange={e => setMobileData({...mobileData, number: e.target.value})} type="tel" placeholder="017... (e.g. 11 digits)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 text-center text-lg tracking-widest" />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm">
                <span className="mt-0.5">ℹ️</span> By clicking proceed you will receive an OTP on your phone. Please enter it in the next step.
              </div>

              <button onClick={() => setStep(3)} disabled={mobileData.number.length < 11} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50">
                Proceed to Payment
              </button>
            </div>
          )}

          {/* MOBILE PAYMENT FLOW - STEP 3: Enter PIN */}
          {paymentMethod === 'mobile' && step === 3 && (
            <div className="space-y-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center text-2xl mb-2">
                🔒
              </div>
              <p className="text-slate-600">A verification code has been sent to<br/> <span className="font-bold text-slate-800">{mobileData.number}</span></p>

              <div className="w-full max-w-sm">
                <label className="block text-sm text-slate-400 mb-1 text-left">Enter Your PIN</label>
                <input value={mobileData.pin} onChange={e => setMobileData({...mobileData, pin: e.target.value})} type="password" placeholder="••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-800 focus:outline-none focus:border-fuchsia-500 text-center text-2xl tracking-[1em]" />
              </div>

              <button disabled={loading || mobileData.pin.length < 4} onClick={handleProcessPayment} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl mt-4 transition disabled:opacity-50">
                {loading ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 4 && transactionData && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-slate-800 text-4xl mb-6">✓</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
              <p className="text-slate-400 mb-8">Your payment for Daycare Admission was successful.</p>

              <div className="w-full bg-slate-50 rounded-xl p-6 space-y-4 text-sm border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Transaction Details</h3>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount</span>
                  <span className="font-bold text-slate-800">{transactionData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID</span>
                  <span className="font-mono text-slate-800">{transactionData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="text-slate-800">{transactionData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="text-slate-800">{transactionData.paymentMethod}</span>
                </div>
              </div>

              <button onClick={() => navigate('/dashboard/parent')} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-4 rounded-xl transition">
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

