import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Search,
  Send,
  Paperclip,
  Video,
  UserX,
  Archive,
  Flag,
  MoreVertical,
  Check,
  CheckCheck,
  Mic,
  Image as ImageIcon,
  FileText,
  X,
  Phone,
  Wifi,
  WifiOff,
  History,
  Bell,
  Download,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  category: 'Application Discussion' | 'Meeting Discussion' | 'Document Clarification' | 'Support Chat';
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  relatedId?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: 'image' | 'document' | 'voice';
  timestamp: string;
  read: boolean;
  isMe: boolean;
  delivered?: boolean;
}

export default function ChatSystem() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 'CHAT-001',
      name: 'John & Mary Smith',
      avatar: '👫',
      category: 'Application Discussion',
      lastMessage: 'Thank you for reviewing our application',
      timestamp: '14:30',
      unread: 2,
      online: true,
      relatedId: 'APP-2024-001'
    },
    {
      id: 'CHAT-002',
      name: 'Williams Family',
      avatar: '👨‍👩‍👧',
      category: 'Meeting Discussion',
      lastMessage: 'Confirmed for tomorrow at 10 AM',
      timestamp: '13:45',
      unread: 0,
      online: false,
      relatedId: 'MEET-2024-042'
    },
    {
      id: 'CHAT-003',
      name: 'Chen Family',
      avatar: '👪',
      category: 'Document Clarification',
      lastMessage: 'I have uploaded the corrected certificate',
      timestamp: '12:20',
      unread: 1,
      online: true,
      typing: false,
      relatedId: 'DOC-005'
    },
    {
      id: 'CHAT-004',
      name: 'Sarah Johnson',
      avatar: '👩',
      category: 'Support Chat',
      lastMessage: 'How do I update my phone number?',
      timestamp: '11:15',
      unread: 3,
      online: false,
      relatedId: 'APP-2024-003'
    },
    {
      id: 'CHAT-005',
      name: 'Robert & Linda Garcia',
      avatar: '👨‍👩‍👧‍👦',
      category: 'Application Discussion',
      lastMessage: 'We have completed the home safety checklist',
      timestamp: 'Yesterday',
      unread: 0,
      online: false,
      relatedId: 'APP-2024-008'
    },
    {
      id: 'CHAT-006',
      name: 'Michael Davis',
      avatar: '👨',
      category: 'Document Clarification',
      lastMessage: 'Is my income certificate acceptable?',
      timestamp: 'Yesterday',
      unread: 1,
      online: true,
      relatedId: 'DOC-012'
    },
  ]);

  const [allMessages, setAllMessages] = useState<{ [chatId: string]: Message[] }>({
    'CHAT-001': [
      {
        id: 'MSG-001',
        senderId: 'CHAT-001',
        senderName: 'John Smith',
        text: 'Hello, we submitted our application last week. Any updates on the review process?',
        timestamp: '14:15',
        read: true,
        isMe: false,
        delivered: true
      },
      {
        id: 'MSG-002',
        senderId: 'me',
        senderName: 'Admin',
        text: 'Hello! Your application is currently under review by our verification team. We\'ll notify you within 3-5 business days.',
        timestamp: '14:20',
        read: true,
        isMe: true,
        delivered: true
      },
      {
        id: 'MSG-003',
        senderId: 'CHAT-001',
        senderName: 'John Smith',
        text: 'Thank you for reviewing our application',
        timestamp: '14:30',
        read: false,
        isMe: false,
        delivered: true
      }
    ],
    'CHAT-003': [
      {
        id: 'MSG-101',
        senderId: 'CHAT-003',
        senderName: 'Chen Family',
        text: 'Hi, you mentioned there was an issue with my marriage certificate?',
        timestamp: '12:10',
        read: true,
        isMe: false,
        delivered: true
      },
      {
        id: 'MSG-102',
        senderId: 'me',
        senderName: 'Admin',
        text: 'Yes, the document appears to have a watermark missing. Can you please re-upload a clear scan?',
        timestamp: '12:15',
        read: true,
        isMe: true,
        delivered: true
      },
      {
        id: 'MSG-103',
        senderId: 'CHAT-003',
        senderName: 'Chen Family',
        text: 'I have uploaded the corrected certificate',
        timestamp: '12:20',
        read: false,
        isMe: false,
        delivered: true
      },
      {
        id: 'MSG-104',
        senderId: 'CHAT-003',
        senderName: 'Chen Family',
        fileName: 'Marriage_Certificate_Corrected.pdf',
        fileType: 'document',
        timestamp: '12:20',
        read: false,
        isMe: false,
        delivered: true
      }
    ]
  });

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isTyping, setIsTyping] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showMessageHistory, setShowMessageHistory] = useState(false);
  const [webSocketConnected, setWebSocketConnected] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ['All', 'Application Discussion', 'Meeting Discussion', 'Document Clarification', 'Support Chat'];

  const statistics = {
    total: chats.length,
    unread: chats.reduce((sum, chat) => sum + chat.unread, 0),
    online: chats.filter(c => c.online).length,
    active: chats.filter(c => c.unread > 0).length
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || chat.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages, selectedChat]);

  // Simulate WebSocket connection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random disconnection/reconnection
      if (Math.random() > 0.95) {
        setWebSocketConnected(false);
        toast.error('Connection lost. Reconnecting...');
        setTimeout(() => {
          setWebSocketConnected(true);
          toast.success('Connected');
        }, 2000);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Simulate incoming messages
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      // Random chance of receiving a message
      if (Math.random() > 0.9 && selectedChat.online) {
        simulateIncomingMessage();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedChat]);

  const simulateIncomingMessage = () => {
    if (!selectedChat) return;

    const responses = [
      'That sounds great!',
      'When can we schedule the next meeting?',
      'Thank you for the update.',
      'I have a question about the process.',
      'Perfect, I\'ll prepare the documents.',
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Show typing indicator first
    setChats(chats.map(c =>
      c.id === selectedChat.id ? { ...c, typing: true } : c
    ));

    setTimeout(() => {
      const newMessage: Message = {
        id: `MSG-${Date.now()}`,
        senderId: selectedChat.id,
        senderName: selectedChat.name,
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        isMe: false,
        delivered: true
      };

      setAllMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
      }));

      setChats(chats.map(c =>
        c.id === selectedChat.id
          ? { ...c, lastMessage: randomResponse, timestamp: 'Just now', unread: c.unread + 1, typing: false }
          : c
      ));

      // Trigger notification
      if (notificationsEnabled) {
        toast.info(`New message from ${selectedChat.name}`);
      }
    }, 2000);
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    // Mark messages as read
    setChats(chats.map(c =>
      c.id === chat.id ? { ...c, unread: 0 } : c
    ));

    // Mark all messages in this chat as read
    setAllMessages(prev => ({
      ...prev,
      [chat.id]: (prev[chat.id] || []).map(m => ({ ...m, read: true }))
    }));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      senderId: 'me',
      senderName: 'Admin',
      text: messageInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      isMe: true,
      delivered: false
    };

    setAllMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setMessageInput('');

    // Update chat last message
    setChats(chats.map(c =>
      c.id === selectedChat.id
        ? { ...c, lastMessage: messageInput, timestamp: 'Just now' }
        : c
    ));

    // Simulate message delivery
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id].map(m =>
          m.id === newMessage.id ? { ...m, delivered: true } : m
        )
      }));
    }, 500);

    // Simulate read receipt
    setTimeout(() => {
      if (selectedChat.online) {
        setAllMessages(prev => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map(m =>
            m.id === newMessage.id ? { ...m, read: true } : m
          )
        }));
      }
    }, 2000);

    toast.success('Message sent');

    // Trigger notification for sent message
    if (notificationsEnabled) {
      toast.info(`Message sent to ${selectedChat.name}`);
    }
  };

  const handleFileUpload = (type: 'image' | 'document' | 'voice') => {
    if (!selectedChat) return;

    const fileNames = {
      image: 'screenshot.png',
      document: 'document.pdf',
      voice: 'voice-message.mp3'
    };

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      senderId: 'me',
      senderName: 'Admin',
      fileName: fileNames[type],
      fileType: type,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      isMe: true,
      delivered: false
    };

    setAllMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setShowFileUpload(false);

    // Update chat last message
    setChats(chats.map(c =>
      c.id === selectedChat.id
        ? { ...c, lastMessage: `📎 ${fileNames[type]}`, timestamp: 'Just now' }
        : c
    ));

    // Simulate delivery
    setTimeout(() => {
      setAllMessages(prev => ({
        ...prev,
        [selectedChat.id]: prev[selectedChat.id].map(m =>
          m.id === newMessage.id ? { ...m, delivered: true } : m
        )
      }));
    }, 1000);

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} sent`);
  };

  const handleDownloadFile = (fileName: string) => {
    toast.success(`Downloading ${fileName}...`);
  };

  const handleStartVideoCall = () => {
    if (!selectedChat) return;
    toast.info(`Starting video call with ${selectedChat.name}...`);
    if (notificationsEnabled) {
      toast.info(`Video call notification sent to ${selectedChat.name}`);
    }
  };

  const handleStartVoiceCall = () => {
    if (!selectedChat) return;
    toast.info(`Starting voice call with ${selectedChat.name}...`);
    if (notificationsEnabled) {
      toast.info(`Voice call notification sent to ${selectedChat.name}`);
    }
  };

  const handleBlockUser = () => {
    if (!selectedChat) return;
    if (window.confirm(`Are you sure you want to block ${selectedChat.name}?`)) {
      toast.warning(`${selectedChat.name} has been blocked`);
      setSelectedChat(null);
    }
  };

  const handleArchiveChat = () => {
    if (!selectedChat) return;
    setChats(chats.filter(c => c.id !== selectedChat.id));
    setSelectedChat(null);
    toast.success('Chat archived');
  };

  const handleReportUser = () => {
    if (!selectedChat) return;
    toast.error(`${selectedChat.name} has been reported to admin`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleLoadHistory = () => {
    if (!selectedChat) return;
    toast.info('Loading message history...');
    setTimeout(() => {
      toast.success('Message history loaded');
      setShowMessageHistory(true);
    }, 1000);
  };

  const currentMessages = selectedChat ? (allMessages[selectedChat.id] || []) : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat & Communication</h1>
        <p className="text-gray-600 mt-1">Real-time messaging with parents and applicants</p>
      </div>

      {/* Connection Status & Notifications */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {webSocketConnected ? (
                <>
                  <Wifi className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-red-600">Disconnected</span>
                </>
              )}
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => {
                  setNotificationsEnabled(e.target.checked);
                  toast.success(e.target.checked ? 'Notifications enabled' : 'Notifications disabled');
                }}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Notifications</span>
            </label>
          </div>
          <div className="text-sm text-gray-600">
            Real-time WebSocket messaging active
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-500 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.total}</h3>
          <p className="text-sm text-gray-600">Total Chats</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-orange-500 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.unread}</h3>
          <p className="text-sm text-gray-600">Unread Messages</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-500 p-3 rounded-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.online}</h3>
          <p className="text-sm text-gray-600">Online</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-500 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{statistics.active}</h3>
          <p className="text-sm text-gray-600">Active Chats</p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
        <div className="grid grid-cols-12 h-full">
          {/* Chat List Sidebar */}
          <div className="col-span-4 border-r border-gray-200 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="text-3xl">{chat.avatar}</div>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {chat.typing ? (
                          <span className="text-blue-600 italic">typing...</span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                          {chat.category}
                        </span>
                        {chat.relatedId && (
                          <span className="text-xs text-gray-500">{chat.relatedId}</span>
                        )}
                      </div>
                    </div>
                    {chat.unread > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="col-span-8 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-3xl">{selectedChat.avatar}</div>
                      {selectedChat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                      <p className="text-sm text-gray-600">
                        {selectedChat.online ? (
                          <span className="text-green-600">● Online</span>
                        ) : (
                          'Offline'
                        )} • {selectedChat.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadHistory}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Message History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleStartVoiceCall}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voice Call"
                    >
                      <Phone className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleStartVideoCall}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Video Call"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowChatMenu(!showChatMenu)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showChatMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <button
                            onClick={() => {
                              handleBlockUser();
                              setShowChatMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <UserX className="w-4 h-4" />
                            Block User
                          </button>
                          <button
                            onClick={() => {
                              handleArchiveChat();
                              setShowChatMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archive Chat
                          </button>
                          <button
                            onClick={() => {
                              handleReportUser();
                              setShowChatMenu(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                          >
                            <Flag className="w-4 h-4" />
                            Report User
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {currentMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs ${message.isMe ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                        {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
                        {message.fileType && (
                          <div className={`flex items-center gap-2 p-2 ${message.isMe ? 'bg-blue-700' : 'bg-gray-50'} rounded mt-2`}>
                            {message.fileType === 'image' && <ImageIcon className="w-4 h-4" />}
                            {message.fileType === 'document' && <FileText className="w-4 h-4" />}
                            {message.fileType === 'voice' && <Mic className="w-4 h-4" />}
                            <span className="text-sm flex-1">{message.fileName}</span>
                            <button
                              onClick={() => handleDownloadFile(message.fileName!)}
                              className={`p-1 ${message.isMe ? 'hover:bg-blue-800' : 'hover:bg-gray-200'} rounded`}
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1 gap-2">
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                          {message.isMe && (
                            <span className="flex items-center gap-1">
                              {message.read ? (
                                <CheckCheck className="w-4 h-4 text-blue-300" />
                              ) : message.delivered ? (
                                <CheckCheck className="w-4 h-4" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedChat.typing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  {showFileUpload && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg flex gap-2">
                      <button
                        onClick={() => handleFileUpload('image')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Image
                      </button>
                      <button
                        onClick={() => handleFileUpload('document')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        Document
                      </button>
                      <button
                        onClick={() => handleFileUpload('voice')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Mic className="w-4 h-4" />
                        Voice
                      </button>
                      <button
                        onClick={() => setShowFileUpload(false)}
                        className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={messageInput}
                      onChange={handleInputChange}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!webSocketConnected}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || !webSocketConnected}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {isTyping && (
                    <p className="text-xs text-gray-500 mt-2">You are typing...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
                  <p className="text-gray-400 text-sm mt-2">Choose from {categories.length - 1} chat categories</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
