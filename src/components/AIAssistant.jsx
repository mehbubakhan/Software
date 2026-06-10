import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2, Volume2, Mic, MicOff } from 'lucide-react';
import api from '../services/api';

export default function AIAssistant({ role = 'parent' }) {
  const getRoleDetails = (role) => {
    switch (role) {
      case 'nanny': return { title: 'Nanny Assistant', greeting: 'Hi there! I am your AI Nanny Assistant. How can I help you manage your career or find the perfect job today?' };
      case 'daycare': return { title: 'Daycare Assistant', greeting: 'Hello! I am your AI Daycare Assistant. How can I assist you with facility management or licensing today?' };
      case 'adoption': return { title: 'Adoption Assistant', greeting: 'Welcome! I am your AI Adoption Assistant. Do you have any questions about the adoption process or requirements?' };
      case 'seller': return { title: 'Seller Assistant', greeting: 'Hi! I am your AI Seller Assistant. How can I help you optimize your marketplace listings today?' };
      case 'admin': return { title: 'Admin Assistant', greeting: 'Greetings Admin. I am your AI Assistant. How can I assist you with platform moderation today?' };
      default: return { title: 'Parent Assistant', greeting: 'Hi there! I am your AI Childcare Assistant. How can I help you with your little ones today?' };
    }
  };

  const { title, greeting } = getRoleDetails(role);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: greeting }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { messages: updatedMessages, role });
      if (response.data.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am so sorry, but I am having trouble connecting to my brain right now.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-full shadow-2xl shadow-fuchsia-500/30 transition-transform hover:scale-105 z-50 flex items-center justify-center"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#a855f7] to-[#c084fc] p-4 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px]">{title}</h3>
                <p className="text-[11px] font-medium text-white/80">Always here to help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc] flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-[#1e7b2b] text-white' : 'bg-white border border-slate-200 text-[#a855f7]'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm relative group ${msg.role === 'user' ? 'bg-[#1e7b2b] text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none pr-8'}`}>
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => speakText(msg.content)}
                      className="absolute right-2 top-2 p-1 text-slate-400 hover:text-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Read aloud"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-[#a855f7] flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-tl-none text-[14px] flex items-center gap-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-[#a855f7]" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="relative flex items-center gap-2">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-full transition shadow-sm border shrink-0 ${isRecording ? 'bg-red-50 text-red-500 border-red-200 animate-pulse' : 'bg-[#f8fafc] text-slate-500 border-slate-200 hover:text-[#a855f7]'}`}
                title={isRecording ? "Stop recording" : "Start recording"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "Ask me anything..."}
                  className="w-full bg-[#f8fafc] border border-slate-200 rounded-full pl-4 pr-12 py-3 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#a855f7]/50"
                  disabled={isLoading}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 top-1.5 p-2 bg-[#a855f7] hover:bg-[#9333ea] disabled:bg-slate-300 text-white rounded-full transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-400 font-medium mt-2">
              AI responses can be inaccurate. Please verify important information.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
