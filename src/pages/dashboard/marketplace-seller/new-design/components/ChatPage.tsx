import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Search } from "lucide-react";

interface Message {
  id: string;
  sender: "admin" | "other";
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type: "seller" | "customer";
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}

const initConversations: Conversation[] = [
  {
    id: "C-001", name: "BabyWorld BD", avatar: "BW", type: "seller", lastMessage: "When will my withdrawal be processed?", time: "2 min ago", unread: 2, online: true,
    messages: [
      { id: "m1", sender: "other", text: "Hello admin, I have submitted a withdrawal request.", time: "10:32 AM", read: true },
      { id: "m2", sender: "admin", text: "Hi BabyWorld BD! I can see your request. It's currently under review.", time: "10:35 AM", read: true },
      { id: "m3", sender: "other", text: "When will my withdrawal be processed?", time: "10:40 AM", read: false },
      { id: "m4", sender: "other", text: "The amount is ৳45,000.", time: "10:40 AM", read: false },
    ]
  },
  {
    id: "C-002", name: "Fatima Rahman", avatar: "FR", type: "customer", lastMessage: "I want to return the product", time: "15 min ago", unread: 1, online: false,
    messages: [
      { id: "m1", sender: "other", text: "Hi, I received a damaged product in my order ORD-2891.", time: "09:15 AM", read: true },
      { id: "m2", sender: "admin", text: "Sorry to hear that! Please share a photo of the damage.", time: "09:20 AM", read: true },
      { id: "m3", sender: "other", text: "I want to return the product and get a refund.", time: "09:45 AM", read: false },
    ]
  },
  {
    id: "C-003", name: "KidsCraft Ltd.", avatar: "KC", type: "seller", lastMessage: "Thank you for approving our products!", time: "1 hr ago", unread: 0, online: true,
    messages: [
      { id: "m1", sender: "other", text: "Admin, we've uploaded 15 new products for review.", time: "08:00 AM", read: true },
      { id: "m2", sender: "admin", text: "Thanks! We'll review them shortly.", time: "08:10 AM", read: true },
      { id: "m3", sender: "other", text: "Thank you for approving our products!", time: "08:45 AM", read: true },
    ]
  },
  {
    id: "C-004", name: "Rahim Mia", avatar: "RM", type: "customer", lastMessage: "Order still not delivered after 5 days", time: "2 hr ago", unread: 3, online: false,
    messages: [
      { id: "m1", sender: "other", text: "My order ORD-2888 was placed 5 days ago.", time: "Yesterday", read: true },
      { id: "m2", sender: "other", text: "Still not delivered, tracking shows no update.", time: "Yesterday", read: true },
      { id: "m3", sender: "admin", text: "We're investigating with the courier. Will update you soon.", time: "Yesterday", read: true },
      { id: "m4", sender: "other", text: "Order still not delivered after 5 days", time: "10:00 AM", read: false },
    ]
  },
];

export function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(initConversations);
  const [activeConv, setActiveConv] = useState<Conversation | null>(initConversations[0]);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "seller" | "customer">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages.length]);

  function sendMessage() {
    if (!inputText.trim() || !activeConv) return;
    const newMsg: Message = {
      id: `m${Date.now()}`, sender: "admin", text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), read: true
    };
    const updated = conversations.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: inputText.trim(), time: "now", unread: 0 }
        : c
    );
    setConversations(updated);
    setActiveConv(updated.find(c => c.id === activeConv.id) || null);
    setInputText("");
  }

  function openConversation(conv: Conversation) {
    const updated = conversations.map(c =>
      c.id === conv.id ? { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c
    );
    setConversations(updated);
    setActiveConv(updated.find(c => c.id === conv.id) || null);
  }

  const filteredConvs = conversations.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex h-full" style={{ height: "calc(100vh - 48px)" }}>
      {/* Sidebar */}
      <div className="flex flex-col flex-shrink-0" style={{ width: 260, borderRight: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="p-3" style={{ borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 8 }}>Messages</h3>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
            <Search size={12} style={{ color: "var(--muted-foreground)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
          </div>
          <div className="flex gap-1 mt-2">
            {(["all", "seller", "customer"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-2 py-1 rounded text-xs capitalize"
                style={{ background: filter === f ? "var(--primary)" : "transparent", color: filter === f ? "#fff" : "var(--muted-foreground)" }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filteredConvs.map(conv => (
            <button
              key={conv.id}
              onClick={() => openConversation(conv)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
              style={{ background: activeConv?.id === conv.id ? "var(--muted)" : "transparent", borderBottom: "1px solid var(--border)" }}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "#fff" }}>
                  {conv.avatar}
                </div>
                {conv.online && <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2" style={{ background: "#10b981", borderColor: "var(--card)" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{conv.name}</span>
                  <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{conv.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)" }} className="truncate">{conv.lastMessage}</span>
                  {conv.unread > 0 && (
                    <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#0ea5e9", fontSize: 9, color: "#fff" }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConv ? (
        <div className="flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
            <div className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--primary)", color: "#fff" }}>
                {activeConv.avatar}
              </div>
              {activeConv.online && <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2" style={{ background: "#10b981", borderColor: "var(--card)" }} />}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{activeConv.name}</p>
              <p style={{ fontSize: 11, color: activeConv.online ? "#10b981" : "var(--muted-foreground)" }}>
                {activeConv.online ? "Online" : "Offline"} · {activeConv.type}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
            {activeConv.messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[70%]">
                  <div className="rounded-lg px-3 py-2" style={{
                    background: msg.sender === "admin" ? "var(--primary)" : "var(--muted)",
                    color: msg.sender === "admin" ? "#fff" : "var(--foreground)",
                    fontSize: 13,
                    borderRadius: msg.sender === "admin" ? "12px 12px 4px 12px" : "12px 12px 12px 4px"
                  }}>
                    {msg.text}
                  </div>
                  <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2, textAlign: msg.sender === "admin" ? "right" : "left" }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-1 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {["Withdrawal approved ✓", "We'll investigate", "Refund processed", "Please provide more details"].map(q => (
              <button key={q} onClick={() => setInputText(q)}
                className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs hover:opacity-80 transition-opacity"
                style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
            <button className="p-2 rounded hover:bg-white/10 transition-colors" style={{ color: "var(--muted-foreground)" }}>
              <Paperclip size={15} />
            </button>
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 outline-none px-3 py-2 rounded"
              style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }}
            />
            <button onClick={sendMessage} className="w-9 h-9 rounded flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{ background: "var(--primary)" }}>
              <Send size={15} color="#fff" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p style={{ fontSize: 13, color: "var(--muted-foreground)" }}>Select a conversation</p>
        </div>
      )}
    </div>
  );
}
