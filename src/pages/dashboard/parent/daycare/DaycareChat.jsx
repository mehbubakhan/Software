import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../../services/api';
import { useSocket } from '../../../../context/SocketContext';
import { useAuth } from '../../../../context/AuthContext';

export default function DaycareChat() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [daycare, setDaycare] = useState(null);
  const [loading, setLoading] = useState(true);

  const { socket, sendMessage } = useSocket() || {};
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchDaycareAndMessages = async () => {
      try {
        const response = await api.get(`/daycare/${id}`);
        const data = response.data.data;
        setDaycare(data);
        
        // Fetch historical messages from unified messaging
        const msgRes = await api.get(`/messages/${id}`);
        let history = [];
        if (msgRes.data && msgRes.data.data) {
          history = msgRes.data.data.map(m => ({
            id: m.id,
            sender: m.sender_id === user?.id ? 'user' : 'daycare',
            text: m.content,
            time: new Date(m.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
        }

        // Add welcome message if chat is empty
        if (history.length === 0) {
          history.push({
            id: 'welcome_1',
            sender: 'daycare',
            text: `Hello! Welcome to ${data.name}. How can we help you today?`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
        setMessages(history);
      } catch (err) {
        console.error('Error fetching chat data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDaycareAndMessages();
  }, [id, user?.id]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.sender_id == id) {
        setMessages(prev => [...prev, {
          id: msg.id,
          sender: 'daycare',
          text: msg.content,
          time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    };
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !sendMessage) return;

    const currentInput = inputValue;
    setInputValue('');

    // Optimistic UI update
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'user',
        text: currentInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      await sendMessage(id, currentInput, 'direct');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Loading chat...</div>;
  }

  if (!daycare) {
    return <div className="text-center text-slate-500 py-12">Daycare not found.</div>;
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-68px)] text-slate-800 -m-6 p-8 font-sans pb-24">
      <div className="max-w-4xl mx-auto mt-4 h-[calc(100vh-140px)] flex flex-col">
        
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-t-2xl p-6 flex items-center justify-between shadow-sm z-10">
          <div>
            <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-2 transition text-sm font-semibold">
              ← Back to Details
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-800">{daycare.name}</h1>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <span className="text-yellow-400 leading-none">★</span> {daycare.rating} ({Array.isArray(daycare.reviews) ? daycare.reviews.length : daycare.reviews} reviews)
              </span>
              <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">🔴 Live CCTV</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-800">{daycare.price}</div>
            <div className="text-xs text-slate-500">{daycare.careType || 'Full-Time Care'}</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="bg-white border-x border-slate-200 flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}>
              <div className={`p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-fuchsia-600 text-white rounded-br-sm shadow-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm border border-slate-200 shadow-sm'}`}>
                {msg.text}
              </div>
              <div className={`text-xs text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.time}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white border border-slate-200 rounded-b-2xl p-4 shadow-sm">
          <form onSubmit={handleSend} className="flex gap-4">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition"
            />
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50 flex items-center gap-2"
            >
              <span>📨</span> Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

