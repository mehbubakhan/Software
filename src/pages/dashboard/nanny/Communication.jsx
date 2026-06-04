import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { 
  Search, 
  Phone, 
  Video, 
  Mic, 
  Paperclip, 
  Send,
  MessageCircle
} from 'lucide-react';

export default function Communication() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages');
        if (res.data?.data?.length > 0) {
          setConversations(res.data.data);
          setActiveChat(res.data.data[0]);
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    let interval;
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await api.get(`/messages/${activeChat.id}`);
        setMessages(res.data?.data || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    
    if (activeChat) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // Polling every 3 seconds
    }
    return () => clearInterval(interval);
  }, [activeChat]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;
    
    try {
      await api.post(`/messages/${activeChat.id}`, { content: inputText });
      setInputText('');
      // Optimistically fetch messages immediately
      const res = await api.get(`/messages/${activeChat.id}`);
      setMessages(res.data?.data || []);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };



  const handleCallOption = (type) => {
    alert(`Initiating ${type} with ${activeChat.name}...`);
  };

  return (
    <div className="space-y-6 pb-6 flex flex-col h-[calc(100vh-120px)] min-h-[600px]">
      {/* Header */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          Messages <MessageCircle className="w-8 h-8 text-slate-300" />
        </h1>
        <p className="text-slate-500 mt-2">Chat with parents and families</p>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col md:flex-row bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-0">
        
        {/* Left Sidebar - Conversations */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col flex-shrink-0 bg-white">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-50 transition-colors ${
                  activeChat?.id === conv.id ? 'bg-[#faf5ff]' : 'hover:bg-slate-50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full object-cover" />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-slate-900 truncate">{conv.name}</h3>
                    <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{conv.time}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-sm truncate ${conv.unread > 0 ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="bg-[#a855f7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Area - Active Chat */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
          {activeChat ? (
          <>
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeChat.avatar} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover" />
                {activeChat.online && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-bold text-slate-900">{activeChat.name}</h2>
                <p className="text-xs text-slate-500">{activeChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <button onClick={() => handleCallOption('Voice Message')} className="hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50" title="Send Voice Message">
                <Mic className="w-5 h-5" />
              </button>
              <button onClick={() => handleCallOption('Voice Call')} className="hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50" title="Voice Call">
                <Phone className="w-5 h-5" />
              </button>
              <button onClick={() => handleCallOption('Video Call')} className="hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50" title="Video Call">
                <Video className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender_id === user?.id ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                  msg.sender_id === user?.id 
                    ? 'bg-[#a855f7] text-white rounded-br-sm shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                  <p className={`text-[11px] mt-1 ${msg.sender_id === user?.id ? 'text-purple-200' : 'text-slate-400'}`}>
                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-3">
              <button type="button" className="text-slate-400 hover:text-slate-600 p-2">
                <Paperclip className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
              <button 
                type="submit" 
                className={`p-2.5 rounded-full flex items-center justify-center transition-colors ${
                  inputText.trim() 
                    ? 'bg-[#a855f7] text-white hover:bg-purple-600' 
                    : 'bg-slate-100 text-slate-400'
                }`}
                disabled={!inputText.trim()}
              >
                <Send className="w-5 h-5 translate-x-0.5 translate-y-0.5" />
              </button>
            </form>
          </div>
          </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
