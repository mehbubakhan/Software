import React, { useState } from 'react';
import { 
  Search, 
  Phone, 
  Video, 
  Mic, 
  Paperclip, 
  Send,
  MessageCircle
} from 'lucide-react';

const conversationsList = [
  {
    id: 1,
    name: 'Mrs. Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    time: '10 min ago',
    lastMessage: 'Thanks for today! See you tomorrow.',
    unread: 0,
    online: true
  },
  {
    id: 2,
    name: 'Mr. Ahmed',
    avatar: 'https://i.pravatar.cc/150?img=11',
    time: '1 hour ago',
    lastMessage: 'Can we schedule an interview?',
    unread: 2,
    online: false
  },
  {
    id: 3,
    name: 'Mrs. Rahman',
    avatar: 'https://i.pravatar.cc/150?img=9',
    time: '2 hours ago',
    lastMessage: 'What time will you arrive?',
    unread: 1,
    online: true
  }
];

const initialChatHistories = {
  1: [
    { id: 1, sender: 'them', text: 'Hi! Thank you for applying to our job post.', time: '2:30 PM' },
    { id: 2, sender: 'me', text: "Hello! I'm very interested in the position.", time: '2:32 PM' },
    { id: 3, sender: 'them', text: 'Great! Do you have experience with toddlers?', time: '2:35 PM' },
    { id: 4, sender: 'me', text: 'Yes, I have 3 years of experience caring for children aged 2-5.', time: '2:36 PM' },
    { id: 5, sender: 'them', text: 'Perfect! Thanks for today! See you tomorrow.', time: '4:15 PM' }
  ],
  2: [
    { id: 1, sender: 'them', text: 'Can we schedule an interview?', time: '1:00 PM' },
    { id: 2, sender: 'them', text: 'Around 10 AM works best for me.', time: '1:05 PM' }
  ],
  3: [
    { id: 1, sender: 'them', text: 'What time will you arrive?', time: '9:00 AM' }
  ]
};

export default function Communication() {
  const [activeChat, setActiveChat] = useState(conversationsList[0]);
  const [chatHistories, setChatHistories] = useState(initialChatHistories);
  const [inputText, setInputText] = useState('');

  const currentMessages = chatHistories[activeChat.id] || [];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistories(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));
    setInputText('');
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
            {conversationsList.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveChat(conv)}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-50 transition-colors ${
                  activeChat.id === conv.id ? 'bg-[#faf5ff]' : 'hover:bg-slate-50'
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
            {currentMessages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] px-5 py-3 rounded-2xl ${
                  msg.sender === 'me' 
                    ? 'bg-[#a855f7] text-white rounded-br-sm shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  <p className={`text-[11px] mt-1 ${msg.sender === 'me' ? 'text-purple-200' : 'text-slate-400'}`}>
                    {msg.time}
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

        </div>
      </div>
    </div>
  );
}
