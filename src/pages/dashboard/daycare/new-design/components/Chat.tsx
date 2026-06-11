import { useState, useRef, useEffect } from "react";
import api from "../../../../../services/api";
import {
  Send, Search, Paperclip, Mic, Video, Phone, Archive, Flag,
  UserX, CheckCheck, Check, MoreVertical, Smile, Image, FileText,
  X, Volume2, VolumeX, Circle, Dot, MessageSquare, Users, Bell,
  DollarSign, Car, AlertTriangle, Shield, ChevronDown, Hash
} from "lucide-react";
import { Avatar, Modal, Btn, Select } from "./ui";
import { mockMessages as initial } from "./mockData";
import type { Message, ChatMessage } from "./types";

// ── Types ──────────────────────────────────────────────────────
type ChatCategory = "All" | "Parents" | "Staff" | "Transport" | "Billing" | "Emergency Support";
type ConvStatus = "online" | "offline" | "away" | "busy";
type MessageType = "text" | "file" | "voice" | "image";

interface ChatConv extends Omit<Message, "avatar"> {
  avatar?: string;
  category: ChatCategory;
  status: ConvStatus;
  role: string;
  phone?: string;
  blocked: boolean;
  archived: boolean;
  muted: boolean;
  isTyping: boolean;
  readReceipts: boolean;
  messages: EnhancedMessage[];
}

interface EnhancedMessage extends ChatMessage {
  type: MessageType;
  fileName?: string;
  fileSize?: string;
  duration?: string;
  read: boolean;
  delivered: boolean;
  reactions?: string[];
}

// ── Seed Data ──────────────────────────────────────────────────
const STATUS_COLORS: Record<ConvStatus, string> = {
  online: "bg-green-400",
  offline: "bg-gray-400",
  away: "bg-yellow-400",
  busy: "bg-red-400",
};

const CATEGORY_COLORS: Record<ChatCategory, string> = {
  All: "bg-gray-100 text-gray-600",
  Parents: "bg-fuchsia-100 text-fuchsia-700",
  Staff: "bg-blue-100 text-blue-700",
  Transport: "bg-teal-100 text-teal-700",
  Billing: "bg-purple-100 text-purple-700",
  "Emergency Support": "bg-red-100 text-red-700",
};

const CATEGORY_ICONS: Record<ChatCategory, React.ReactNode> = {
  All: <MessageSquare size={12} />,
  Parents: <Users size={12} />,
  Staff: <Shield size={12} />,
  Transport: <Car size={12} />,
  Billing: <DollarSign size={12} />,
  "Emergency Support": <AlertTriangle size={12} />,
};

const QUICK_REPLIES = [
  "Your child is doing great today! 😊",
  "Please confirm pickup time.",
  "Medicine has been administered.",
  "Your child had lunch and is resting.",
  "Please call us when available.",
  "Invoice has been sent to your email.",
];

function seedConvs(): ChatConv[] {
  const base = initial.map((m, i) => ({
    ...m,
    category: (["Parents", "Staff", "Parents", "Transport", "Billing"] as ChatCategory[])[i % 5],
    status: (["online", "away", "offline", "online", "busy"] as ConvStatus[])[i % 5],
    role: m.role ?? "Parent",
    phone: `+1 (555) ${i + 1}23-${4000 + i}`,
    blocked: false,
    archived: false,
    muted: false,
    isTyping: i === 0,
    readReceipts: true,
    messages: m.messages.map(msg => ({
      ...msg,
      type: "text" as MessageType,
      read: true,
      delivered: true,
    })),
  }));

  // Add extra seed convs for variety
  const extras: ChatConv[] = [
    {
      id: "extra1", from: "Driver Mike Santos", role: "Transport Driver", time: "09:15",
      lastMessage: "Bus en route, ETA 10 mins", unread: 1,
      category: "Transport", status: "online", phone: "+1 (555) 789-0123",
      blocked: false, archived: false, muted: false, isTyping: false, readReceipts: true,
      messages: [
        { id: "e1m1", sender: "them", text: "Good morning! Bus departing now.", time: "08:45", type: "text", read: true, delivered: true },
        { id: "e1m2", sender: "them", text: "Bus en route, ETA 10 mins", time: "09:15", type: "text", read: false, delivered: true },
      ],
    },
    {
      id: "extra2", from: "Finance Dept", role: "Billing", time: "Yesterday",
      lastMessage: "Invoice INV-2025003 is now overdue", unread: 2,
      category: "Billing", status: "away", phone: "+1 (555) 456-7890",
      blocked: false, archived: false, muted: false, isTyping: false, readReceipts: true,
      messages: [
        { id: "e2m1", sender: "them", text: "This is a payment reminder for Invoice INV-2025002.", time: "Yesterday", type: "text", read: true, delivered: true },
        { id: "e2m2", sender: "them", text: "Invoice INV-2025003 is now overdue", time: "Yesterday", type: "text", read: false, delivered: true },
      ],
    },
    {
      id: "extra3", from: "Emergency Line", role: "Emergency Support", time: "2 days ago",
      lastMessage: "All clear — situation resolved", unread: 0,
      category: "Emergency Support", status: "online", phone: "+1 (555) 911-0000",
      blocked: false, archived: false, muted: false, isTyping: false, readReceipts: true,
      messages: [
        { id: "e3m1", sender: "them", text: "Emergency alert triggered for child Emma Wilson.", time: "10:34 AM", type: "text", read: true, delivered: true },
        { id: "e3m2", sender: "me", text: "Situation handled. Child is safe.", time: "10:36 AM", type: "text", read: true, delivered: true },
        { id: "e3m3", sender: "them", text: "All clear — situation resolved", time: "10:40 AM", type: "text", read: true, delivered: true },
      ],
    },
  ];

  return [...base, ...extras];
}

// ── Component ─────────────────────────────────────────────────
type ModalType = "videoCall" | "blockConfirm" | "reportUser" | "fileShare" | null;

export function Chat() {
  const [conversations, setConversations] = useState<ChatConv[]>(seedConvs);

  useEffect(() => {
    api.get('/daycare/portal/messages')
      .then((res: any) => {
        // Here we could map the backend data, but since it's just a simple mock structure currently,
        // we'll keep the frontend seed logic if the backend returns an array with id "1" only.
        if (res.data.length > 1) {
          // If real backend data, map it (stub for future integration)
          // setConversations(res.data.map(mapToConv))
        }
      })
      .catch((err: any) => console.error(err));
  }, []);

  const [active, setActive] = useState<string>(conversations[0].id);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<ChatCategory>("All");
  const [modal, setModal] = useState<ModalType>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [videoCallSeconds, setVideoCallSeconds] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeConv = conversations.find(c => c.id === active)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active, activeConv?.messages.length]);

  // Simulate typing indicator and auto-reply
  function simulateReply(convId: string) {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, isTyping: true } : c));
    const t = setTimeout(() => {
      const replies = [
        "Thanks for the update! 😊",
        "Understood, I'll take note of that.",
        "Can you please provide more details?",
        "Acknowledged. We'll handle it right away.",
        "Thank you for letting us know!",
      ];
      const reply: EnhancedMessage = {
        id: `auto-${Date.now()}`, sender: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text", read: false, delivered: true,
      };
      setConversations(prev => prev.map(c => c.id === convId ? {
        ...c, isTyping: false, lastMessage: reply.text, time: reply.time, unread: c.id === active ? 0 : c.unread + 1,
        messages: [...c.messages, reply],
      } : c));
    }, 1500 + Math.random() * 1000);
    typingTimer.current = t;
  }

  function send(text?: string) {
    const msgText = text ?? input.trim();
    if (!msgText) return;
    const msg: EnhancedMessage = {
      id: `msg${Date.now()}`, sender: "me", text: msgText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text", read: false, delivered: true,
    };
    setConversations(prev => prev.map(c =>
      c.id === active ? { ...c, lastMessage: msg.text, time: msg.time, unread: 0, messages: [...c.messages, msg] } : c
    ));
    setInput("");
    setShowQuickReplies(false);
    if (Math.random() > 0.3) simulateReply(active);
  }

  function sendVoice() {
    if (isRecording) {
      if (recordingTimer.current) clearInterval(recordingTimer.current);
      const duration = `0:${String(recordingSeconds).padStart(2, "0")}`;
      const msg: EnhancedMessage = {
        id: `msg${Date.now()}`, sender: "me", text: `🎤 Voice message`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "voice", duration, read: false, delivered: true,
      };
      setConversations(prev => prev.map(c =>
        c.id === active ? { ...c, lastMessage: "🎤 Voice message", time: msg.time, messages: [...c.messages, msg] } : c
      ));
      setIsRecording(false);
      setRecordingSeconds(0);
    } else {
      setIsRecording(true);
      recordingTimer.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    }
  }

  function sendFile(type: "image" | "file") {
    const name = type === "image" ? "photo_activity.jpg" : "child_report.pdf";
    const msg: EnhancedMessage = {
      id: `msg${Date.now()}`, sender: "me",
      text: type === "image" ? `📷 ${name}` : `📎 ${name}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: type === "image" ? "image" : "file",
      fileName: name, fileSize: type === "image" ? "1.2 MB" : "0.4 MB",
      read: false, delivered: true,
    };
    setConversations(prev => prev.map(c =>
      c.id === active ? { ...c, lastMessage: msg.text, time: msg.time, messages: [...c.messages, msg] } : c
    ));
    setModal(null);
  }

  function startVideoCall() {
    setVideoCallActive(true);
    setVideoCallSeconds(0);
    setModal("videoCall");
    videoTimer.current = setInterval(() => setVideoCallSeconds(s => s + 1), 1000);
  }

  function endVideoCall() {
    if (videoTimer.current) clearInterval(videoTimer.current);
    setVideoCallActive(false);
    setModal(null);
    const mins = Math.floor(videoCallSeconds / 60);
    const secs = videoCallSeconds % 60;
    const msg: EnhancedMessage = {
      id: `msg${Date.now()}`, sender: "me",
      text: `📹 Video call ended · ${mins}:${String(secs).padStart(2, "0")}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text", read: false, delivered: true,
    };
    setConversations(prev => prev.map(c =>
      c.id === active ? { ...c, lastMessage: msg.text, time: msg.time, messages: [...c.messages, msg] } : c
    ));
  }

  function openConv(id: string) {
    setActive(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setShowQuickReplies(false);
  }

  function toggleArchive(id: string) { setConversations(prev => prev.map(c => c.id === id ? { ...c, archived: !c.archived } : c)); }
  function toggleMute(id: string) { setConversations(prev => prev.map(c => c.id === id ? { ...c, muted: !c.muted } : c)); }
  function blockUser() { setConversations(prev => prev.map(c => c.id === active ? { ...c, blocked: !c.blocked } : c)); setModal(null); }

  const EMOJIS = ["😊", "👍", "❤️", "😢", "😮", "🙏", "✅", "⭐", "🎉", "💙"];

  const filteredConvs = conversations.filter(c => {
    const m = c.from.toLowerCase().includes(search.toLowerCase());
    const cat = filterCat === "All" || c.category === filterCat;
    return m && cat && !c.archived;
  });

  const totalUnread = conversations.filter(c => !c.archived).reduce((s, c) => s + c.unread, 0);

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">

      {/* ── Left Sidebar ── */}
      <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>Messages {totalUnread > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-fuchsia-600 text-white text-xs rounded-full">{totalUnread}</span>}</h2>
          </div>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e: any) => setSearch(e.target.value)} placeholder="Search conversations…"
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500" />
          </div>
          {/* Category filter */}
          <div className="flex flex-wrap gap-1">
            {(["All", "Parents", "Staff", "Transport", "Billing", "Emergency Support"] as ChatCategory[]).map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all ${filterCat === cat ? "bg-fuchsia-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {CATEGORY_ICONS[cat]} {cat === "Emergency Support" ? "Emergency" : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConvs.map(c => (
            <button key={c.id} onClick={() => openConv(c.id)}
              className={`w-full flex items-center gap-2.5 p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${active === c.id ? "bg-fuchsia-50" : ""} ${c.blocked ? "opacity-50" : ""}`}>
              <div className="relative shrink-0">
                <Avatar name={c.from} size="sm" />
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_COLORS[c.status]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs truncate" style={{ fontWeight: c.unread > 0 ? 600 : 400 }}>{c.from}</p>
                  <span className="text-xs text-gray-400 shrink-0 ml-1">{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <p className="text-xs text-gray-400 truncate">{c.isTyping ? <span className="text-green-500 italic">typing…</span> : c.lastMessage}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    {c.muted && <VolumeX size={9} className="text-gray-400" />}
                    {c.unread > 0 && <span className="bg-fuchsia-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{c.unread}</span>}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs mt-0.5 ${CATEGORY_COLORS[c.category]}`}>
                  {CATEGORY_ICONS[c.category]}{c.category === "Emergency Support" ? "Emergency" : c.category}
                </span>
              </div>
            </button>
          ))}
          {filteredConvs.length === 0 && (
            <div className="text-center text-gray-400 py-8 text-xs">No conversations found</div>
          )}
        </div>
      </div>

      {/* ── Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Avatar name={activeConv.from} size="sm" />
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_COLORS[activeConv.status]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm" style={{ fontWeight: 600 }}>{activeConv.from}</p>
              {activeConv.blocked && <span className="text-xs text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Blocked</span>}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${CATEGORY_COLORS[activeConv.category]}`}>{activeConv.category === "Emergency Support" ? "Emergency" : activeConv.category}</span>
            </div>
            <p className="text-xs text-gray-400">
              {activeConv.isTyping ? <span className="text-green-500 italic">typing…</span> : `${activeConv.role} · ${activeConv.status}`}
            </p>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button onClick={() => { setModal("fileShare"); }} title="Share File"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><Paperclip size={16} /></button>
            <button onClick={startVideoCall} title="Video Call"
              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"><Video size={16} /></button>
            <a href={`tel:${activeConv.phone}`}>
              <button title="Voice Call" className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"><Phone size={16} /></button>
            </a>
            <button onClick={() => toggleMute(activeConv.id)} title={activeConv.muted ? "Unmute" : "Mute"}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              {activeConv.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={() => toggleArchive(activeConv.id)} title="Archive"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"><Archive size={16} /></button>
            <button onClick={() => setModal("blockConfirm")} title={activeConv.blocked ? "Unblock" : "Block User"}
              className={`p-1.5 rounded-lg transition-colors ${activeConv.blocked ? "text-red-500 bg-red-50" : "hover:bg-red-50 text-gray-400 hover:text-red-500"}`}><UserX size={16} /></button>
            <button onClick={() => { setReportReason(""); setModal("reportUser"); }} title="Report"
              className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"><Flag size={16} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConv.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-sm ${msg.sender !== "me" ? "flex items-end gap-2" : ""}`}>
                {msg.sender === "them" && <Avatar name={activeConv.from} size="sm" />}
                <div>
                  {/* Message bubble */}
                  {msg.type === "voice" ? (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl ${msg.sender === "me" ? "bg-fuchsia-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      <Mic size={14} />
                      <div className="flex gap-0.5 items-end h-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className={`w-0.5 rounded-full ${msg.sender === "me" ? "bg-white/70" : "bg-gray-400"}`}
                            style={{ height: `${Math.random() * 12 + 4}px` }} />
                        ))}
                      </div>
                      <span className="text-xs">{msg.duration ?? "0:00"}</span>
                    </div>
                  ) : msg.type === "image" || msg.type === "file" ? (
                    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "me" ? "bg-fuchsia-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      {msg.type === "image" ? <Image size={14} /> : <FileText size={14} />}
                      <div>
                        <p className="text-xs" style={{ fontWeight: 500 }}>{msg.fileName}</p>
                        <p className="text-xs opacity-70">{msg.fileSize}</p>
                      </div>
                    </div>
                  ) : (
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.sender === "me" ? "bg-fuchsia-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      {msg.text}
                    </div>
                  )}
                  {/* Time + read receipt */}
                  <div className={`flex items-center gap-1 mt-0.5 ${msg.sender === "me" ? "justify-end" : ""}`}>
                    <p className="text-xs text-gray-400">{msg.time}</p>
                    {msg.sender === "me" && activeConv.readReceipts && (
                      msg.read ? <CheckCheck size={12} className="text-fuchsia-500" /> : <Check size={12} className="text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {activeConv.isTyping && (
            <div className="flex items-end gap-2">
              <Avatar name={activeConv.from} size="sm" />
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies */}
        {showQuickReplies && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={() => send(r)}
                  className="px-3 py-1 rounded-full text-xs bg-white border border-gray-200 text-gray-600 hover:border-fuchsia-300 hover:text-fuchsia-600 transition-all">{r}</button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji bar */}
        {showEmoji && (
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 flex gap-2 flex-wrap">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => { setInput(p => p + e); setShowEmoji(false); inputRef.current?.focus(); }}
                className="text-xl hover:scale-125 transition-transform">{e}</button>
            ))}
          </div>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center gap-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording… 0:{String(recordingSeconds).padStart(2, "0")} — Click mic to send
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => { setShowEmoji(p => !p); setShowQuickReplies(false); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Smile size={18} /></button>
            <button onClick={() => { setModal("fileShare"); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"><Paperclip size={18} /></button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e: any) => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={activeConv.blocked ? "Conversation blocked" : "Type a message…"}
              disabled={activeConv.blocked}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:opacity-50"
            />
            <button onClick={() => setShowQuickReplies(p => !p)} title="Quick replies"
              className={`p-1.5 rounded-lg transition-colors ${showQuickReplies ? "bg-fuchsia-50 text-fuchsia-600" : "hover:bg-gray-100 text-gray-400"}`}>
              <MessageSquare size={18} />
            </button>
            <button onClick={sendVoice} title={isRecording ? "Stop & Send" : "Voice message"}
              className={`p-1.5 rounded-lg transition-colors ${isRecording ? "bg-red-500 text-white animate-pulse" : "hover:bg-gray-100 text-gray-400"}`}>
              <Mic size={18} />
            </button>
            <button onClick={() => send()} disabled={!input.trim() || activeConv.blocked}
              className="w-9 h-9 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Video Call Modal ── */}
      {modal === "videoCall" && (
        <Modal title="" onClose={endVideoCall} size="lg">
          <div className="bg-slate-900 rounded-xl overflow-hidden" style={{ height: 320 }}>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <Avatar name={activeConv.from} size="lg" />
                <p className="text-white mt-3" style={{ fontWeight: 600 }}>{activeConv.from}</p>
                <p className="text-green-400 text-sm mt-1">
                  {videoCallActive ? `${Math.floor(videoCallSeconds / 60)}:${String(videoCallSeconds % 60).padStart(2, "0")}` : "Calling…"}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 w-20 h-16 bg-fuchsia-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                <span className="text-white text-xs">You</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Mic size={20} className="text-gray-600" /></button>
            <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"><Video size={20} className="text-gray-600" /></button>
            <button onClick={endVideoCall} className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"><Phone size={20} className="text-white rotate-[135deg]" /></button>
          </div>
        </Modal>
      )}

      {/* ── File Share Modal ── */}
      {modal === "fileShare" && (
        <Modal title="Share File" onClose={() => setModal(null)}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Image size={24} />, label: "Send Photo", action: () => sendFile("image"), color: "bg-fuchsia-50 text-fuchsia-600" },
              { icon: <FileText size={24} />, label: "Send Document", action: () => sendFile("file"), color: "bg-green-50 text-green-600" },
              { icon: <Mic size={24} />, label: "Voice Message", action: () => { sendVoice(); setModal(null); }, color: "bg-red-50 text-red-600" },
              { icon: <Video size={24} />, label: "Video Call", action: () => { setModal(null); startVideoCall(); }, color: "bg-purple-50 text-purple-600" },
            ].map(item => (
              <button key={item.label} onClick={item.action}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${item.color} hover:opacity-80 transition-opacity`}>
                {item.icon}
                <span className="text-sm" style={{ fontWeight: 500 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Block Confirm Modal ── */}
      {modal === "blockConfirm" && (
        <Modal title={activeConv.blocked ? "Unblock User" : "Block User"} onClose={() => setModal(null)}>
          <p className="text-sm text-gray-600 mb-4">
            {activeConv.blocked
              ? `Unblocking ${activeConv.from} will restore their ability to send messages.`
              : `Blocking ${activeConv.from} will prevent them from sending messages. You can unblock later.`}
          </p>
          <div className="flex justify-end gap-2">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={blockUser}><UserX size={14} /> {activeConv.blocked ? "Unblock" : "Block"}</Btn>
          </div>
        </Modal>
      )}

      {/* ── Report Modal ── */}
      {modal === "reportUser" && (
        <Modal title={`Report — ${activeConv.from}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Inappropriate language", "Harassment", "Spam", "Threatening behavior", "False information"].map(r => (
                <button key={r} onClick={() => setReportReason(r)} className={`px-3 py-1 rounded-full text-xs border transition-all ${reportReason === r ? "bg-red-500 text-white border-red-500" : "bg-red-50 text-red-700 border-red-200"}`}>{r}</button>
              ))}
            </div>
            <textarea value={reportReason} onChange={(e: any) => setReportReason(e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Describe the issue…" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => setModal(null)} disabled={!reportReason.trim()}><Flag size={14} /> Submit Report</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
