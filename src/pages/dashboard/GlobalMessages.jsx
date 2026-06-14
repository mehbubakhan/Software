import React, { useState, useEffect, useRef } from 'react'
import api from '../../services/api'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { Search, Plus, X, Phone, Video, MoreVertical, MessageCircle } from 'lucide-react'

export default function GlobalMessages() {
  const { user } = useAuth() || {}
  const { socket, sendMessage, onlineUsers } = useSocket() || {}
  
  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [themTyping, setThemTyping] = useState(false)
  
  const [showNewChat, setShowNewChat] = useState(false)
  const [contacts, setContacts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const fetchConversations = async () => {
    try {
      const res = await api.get('/messages')
      if (res.data?.data) {
        setConversations(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching conversations:', err)
    }
  }

  const fetchContacts = async () => {
    try {
      const res = await api.get('/messages/contacts')
      if (res.data?.data) {
        setContacts(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching contacts:', err)
    }
  }

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`)
      const list = res.data?.data || []
      setMessages(list.map((m, idx) => ({
        id: m.id || idx,
        text: m.content,
        sender: m.sender_id === user?.id ? 'me' : 'them',
        time: new Date(m.sent_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchConversations()
    fetchContacts()
  }, [])

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.id)
    }
  }, [activeChat])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, themTyping])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleReceiveMessage = (msg) => {
      if (activeChat && (msg.sender_id === activeChat.id || msg.receiver_id === activeChat.id)) {
        setMessages(prev => [...prev, {
          id: msg.id,
          text: msg.content,
          sender: msg.sender_id === user?.id ? 'me' : 'them',
          time: new Date(msg.sent_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }])
      }
      fetchConversations() // update last message and unread count
    }

    const handleTypingStart = ({ senderId }) => {
      if (activeChat && senderId == activeChat.id) setThemTyping(true)
    }

    const handleTypingStop = ({ senderId }) => {
      if (activeChat && senderId == activeChat.id) setThemTyping(false)
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('typing_start', handleTypingStart)
    socket.on('typing_stop', handleTypingStop)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('typing_start', handleTypingStart)
      socket.off('typing_stop', handleTypingStop)
    }
  }, [socket, activeChat, user])

  const openChat = (contactOrConv) => {
    setActiveChat({
      id: contactOrConv.id,
      name: contactOrConv.name,
      role: contactOrConv.role,
      avatar: contactOrConv.avatar || `https://i.pravatar.cc/150?img=${contactOrConv.id}`
    })
    setThemTyping(false)
    
    // If we just clicked a conversation, optimistically mark it as read locally
    setConversations(prev => prev.map(c => c.id === contactOrConv.id ? { ...c, unread: 0 } : c))
  }

  const handleTyping = (e) => {
    setText(e.target.value)
    
    if (socket && activeChat) {
      if (!isTyping) {
        setIsTyping(true)
        socket.emit('typing_start', { receiverId: activeChat.id })
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        socket.emit('typing_stop', { receiverId: activeChat.id })
      }, 2000)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeChat) return
    const msgText = text
    setText('')
    
    try {
      if (socket) {
        setIsTyping(false)
        socket.emit('typing_stop', { receiverId: activeChat.id })
        
        // Optimistic UI update
        const tempMsg = {
          id: Date.now(),
          text: msgText,
          sender: 'me',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, tempMsg])
        
        await sendMessage(activeChat.id, msgText)
      } else {
        await api.post(`/messages/${activeChat.id}`, { content: msgText })
        fetchMessages(activeChat.id)
      }
      fetchConversations()
    } catch (err) {
      console.error(err)
    }
  }

  const isUserOnline = (userId) => {
    return onlineUsers?.includes(userId.toString())
  }

  // Filter and merge contacts and conversations
  let mergedList = [...contacts];
  conversations.forEach(conv => {
    const idx = mergedList.findIndex(c => c.id === conv.id);
    if (idx !== -1) {
      mergedList[idx] = { ...mergedList[idx], ...conv };
    } else {
      mergedList.push(conv);
    }
  });

  // Sort: Unread first, then by timestamp (most recent), then alphabetically
  mergedList.sort((a, b) => {
    if ((a.unread > 0) && !(b.unread > 0)) return -1;
    if (!(a.unread > 0) && (b.unread > 0)) return 1;
    
    if (a.timestamp && b.timestamp) return b.timestamp - a.timestamp;
    if (a.timestamp) return -1;
    if (b.timestamp) return 1;

    return (a.name || '').localeCompare(b.name || '');
  });

  const filteredMerged = mergedList.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || c.role?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Get unique roles for the filter dropdown
  const uniqueRoles = ['all', ...new Set(mergedList.map(c => c.role))];

  return (
    <div className="flex h-[calc(100vh-100px)] max-w-6xl mx-auto my-6 bg-white rounded-3xl shadow-xl shadow-fuchsia-900/5 border border-slate-100 overflow-hidden text-slate-800">
      
      {/* Sidebar: Unified Contacts List */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chats</h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:bg-white transition-all" 
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-white flex justify-between items-center border-b border-slate-100">
            <span>Contacts</span>
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-fuchsia-500 capitalize"
            >
              {uniqueRoles.map(role => (
                <option key={role || 'unknown'} value={role}>{role === 'all' ? 'All Roles' : (role || 'unknown').replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {filteredMerged.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">No contacts found.</div>
          ) : (
            filteredMerged.map(c => (
              <div
                key={`contact-${c.id}`}
                onClick={() => openChat(c)}
                className={`p-4 px-6 border-b border-slate-50 cursor-pointer hover:bg-white transition-colors flex items-center gap-4 ${activeChat?.id === c.id ? 'bg-fuchsia-50/50' : ''}`}
              >
                <div className="relative shrink-0">
                  <img src={c.avatar || `https://i.pravatar.cc/150?img=${c.id}`} alt={c.name} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white" />
                  {isUserOnline(c.id) && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
                <div className="flex-1 min-w-0 flex justify-between items-center">
                  <div>
                    <h4 className={`font-bold truncate ${c.unread > 0 ? 'text-slate-900' : 'text-slate-700'}`}>{c.name || 'User'}</h4>
                    <p className="text-[10px] font-bold text-fuchsia-600 capitalize">{c.role?.replace('_', ' ') || 'Member'}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 bg-fuchsia-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 px-6 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={activeChat.avatar} alt={activeChat.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                  {isUserOnline(activeChat.id) && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-lg leading-tight">{activeChat.name}</h3>
                  <p className={`text-xs font-semibold ${isUserOnline(activeChat.id) ? 'text-green-600' : 'text-slate-400'}`}>
                    {isUserOnline(activeChat.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 flex items-center justify-center transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 flex items-center justify-center transition-colors">
                  <Video className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors ml-2">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="w-20 h-20 bg-fuchsia-50 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-fuchsia-300" />
                  </div>
                  <p className="font-medium text-slate-600">Start a conversation with {activeChat.name}</p>
                  <p className="text-sm mt-1">Send a message to say hello!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex gap-3 max-w-[75%] ${msg.sender === 'me' ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className="shrink-0 mt-auto mb-1">
                      {msg.sender === 'me' ? (
                        <div className="w-6 h-6 rounded-full bg-fuchsia-600 border-2 border-white shadow-sm"></div>
                      ) : (
                        <img src={activeChat.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" alt="Avatar"/>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className={`p-4 rounded-3xl shadow-sm ${msg.sender === 'me' ? 'bg-fuchsia-600 rounded-br-sm text-white' : 'bg-white border border-slate-100 rounded-bl-sm text-slate-800'}`}>
                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] font-medium mt-1.5 px-2 ${msg.sender === 'me' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))
              )}
              {themTyping && (
                <div className="flex gap-3 max-w-[75%]">
                  <div className="shrink-0 mt-auto mb-1">
                     <img src={activeChat.avatar} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" alt="Avatar"/>
                  </div>
                  <div className="p-4 bg-white border border-slate-100 rounded-3xl rounded-bl-sm shadow-sm flex items-center space-x-1.5 h-12">
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 px-6 border-t border-slate-100 bg-white">
              <div className="flex items-end gap-3 bg-slate-50 rounded-3xl px-2 py-2 border border-slate-200 focus-within:border-fuchsia-400 focus-within:ring-4 focus-within:ring-fuchsia-500/10 transition-all shadow-inner">
                <button type="button" className="p-3 text-slate-400 hover:text-fuchsia-500 hover:bg-white rounded-full transition-colors mb-0.5">
                  <Plus className="w-5 h-5" />
                </button>
                <textarea 
                  value={text} 
                  onChange={handleTyping} 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Type a message..." 
                  className="flex-1 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none max-h-32 py-3"
                  rows={1}
                />
                <button 
                  type="submit" 
                  disabled={!text.trim()}
                  className={`p-3 rounded-full flex items-center justify-center transition-all mb-0.5 ${text.trim() ? 'bg-fuchsia-600 text-white shadow-md hover:bg-fuchsia-700 hover:shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="relative">
              <div className="w-32 h-32 mb-6 bg-fuchsia-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-16 h-16 text-fuchsia-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Welcome to Minimate Chat</h2>
            <p className="text-slate-500 max-w-sm text-center">Select a conversation from the sidebar or click the + icon to start a new chat with anyone in the platform.</p>
          </div>
        )}
      </div>
    </div>
  )
}
