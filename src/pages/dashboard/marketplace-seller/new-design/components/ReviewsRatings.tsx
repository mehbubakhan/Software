import { useState, useEffect } from "react";
import api from "../../../../../services/api";
import { Search, Star, Trash2, Flag, Pin, MessageCircle } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, StatCard } from "./Modal";

interface Review {
  id: string;
  customer: string;
  product: string;
  seller: string;
  rating: number;
  comment: string;
  date: string;
  status: "Visible" | "Hidden" | "Flagged" | "Pinned";
  helpful: number;
}

const initReviews: Review[] = [
  { id: "REV-001", customer: "Fatima Rahman", product: "Baby Bottle Set", seller: "BabyWorld BD", rating: 5, comment: "Excellent quality! Perfectly safe for my baby. Highly recommended for all moms.", date: "2026-06-03", status: "Pinned", helpful: 24 },
  { id: "REV-002", customer: "Karim Hossain", product: "Toy Car Collection", seller: "BabyWorld BD", rating: 4, comment: "Good quality cars. My son loves them. Only minor issue was packaging.", date: "2026-06-03", status: "Visible", helpful: 12 },
  { id: "REV-003", customer: "Anonymous", product: "Learning Tablet", seller: "NurtureTech BD", rating: 1, comment: "FAKE PRODUCT!!! DO NOT BUY!!! Complete scam rubbish garbage.", date: "2026-06-02", status: "Flagged", helpful: 2 },
  { id: "REV-004", customer: "Nasrin Akter", product: "Galaxy Backpack", seller: "KidGear Emporium", rating: 5, comment: "Beautiful design and very durable. My daughter uses it every day for school.", date: "2026-06-01", status: "Visible", helpful: 18 },
  { id: "REV-005", customer: "Rahim Mia", product: "Plush Teddy Bear", seller: "Tiny Tots Store", rating: 2, comment: "Poor quality. Stuffing came out after 2 days. Not safe for small children.", date: "2026-06-01", status: "Visible", helpful: 31 },
  { id: "REV-006", customer: "bot_user_999", product: "Learning Blocks", seller: "KidsCraft Ltd.", rating: 5, comment: "Best product ever best product ever best product ever best seller best seller.", date: "2026-05-30", status: "Flagged", helpful: 0 },
];

const statusColor: Record<string, string> = { Visible: "green", Hidden: "gray", Flagged: "red", Pinned: "yellow" };

export function ReviewsRatings() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Review | null>(null);
  const [replyModal, setReplyModal] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    api.get("/marketplace/admin/reviews").then(res => {
      setReviews(res.data.data || res.data || []);
    }).catch(console.error);
  }, []);

  function deleteReview(id: string) {
    setReviews(r => r.filter(x => x.id !== id));
    setSelected(null);
  }

  function togglePin(id: string) {
    setReviews(r => r.map(x => x.id === id ? { ...x, status: x.status === "Pinned" ? "Visible" : "Pinned" } : x));
  }

  function flagReview(id: string) {
    setReviews(r => r.map(x => x.id === id ? { ...x, status: "Flagged" } : x));
    setSelected(null);
  }

  function hideReview(id: string) {
    setReviews(r => r.map(x => x.id === id ? { ...x, status: "Hidden" } : x));
    setSelected(null);
  }

  function sendReply() {
    if (replyText.trim()) {
      setReplySent(true);
      setTimeout(() => { setReplySent(false); setReplyModal(null); setReplyText(""); }, 1500);
    }
  }

  const filtered = reviews.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.product.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1);
  const fiveStars = reviews.filter(r => r.rating === 5).length;
  const flagged = reviews.filter(r => r.status === "Flagged").length;

  function StarDisplay({ rating }: { rating: number }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={11} style={{ color: i <= rating ? "#f59e0b" : "#334155", fill: i <= rating ? "#f59e0b" : "transparent" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <PageHeader title="Reviews & Ratings" subtitle="Monitor and moderate customer reviews" />

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <StatCard label="Avg. Rating" value={`${avgRating} ★`} color="#f59e0b" />
        <StatCard label="Total Reviews" value={reviews.length} color="#0ea5e9" />
        <StatCard label="5-Star Reviews" value={fiveStars} color="#10b981" />
        <StatCard label="Flagged Reviews" value={flagged} color="#ef4444" />
      </div>

      {/* Top Rated */}
      <div className="rounded p-3" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <h3 className="mb-2" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Review Statistics</h3>
        <div className="grid grid-cols-5 gap-2">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = reviews.filter(r => r.rating === stars).length;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={stars} className="flex flex-col gap-1 items-center">
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--foreground)" }}>{stars}</span>
                  <Star size={10} style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                </div>
                <div className="w-full h-16 rounded flex items-end overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div className="w-full rounded transition-all" style={{ height: `${pct}%`, background: "#f59e0b" }} />
                </div>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "monospace" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
      </div>

      <Table headers={["ID", "Customer", "Product", "Seller", "Rating", "Comment", "Helpful", "Status", "Actions"]}>
        {filtered.map(r => (
          <TR key={r.id} onClick={() => setSelected(r)}>
            <TD mono>{r.id}</TD>
            <TD>{r.customer}</TD>
            <TD>{r.product}</TD>
            <TD>{r.seller}</TD>
            <TD><StarDisplay rating={r.rating} /></TD>
            <TD><span style={{ maxWidth: 200, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}>{r.comment}</span></TD>
            <TD mono>{r.helpful}</TD>
            <TD><Badge label={r.status} color={statusColor[r.status]} /></TD>
            <TD>
              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => togglePin(r.id)} className="p-1 rounded hover:bg-white/10" title="Pin" style={{ color: r.status === "Pinned" ? "#f59e0b" : "var(--muted-foreground)" }}><Pin size={12} /></button>
                <button onClick={() => { setReplyModal(r); }} className="p-1 rounded hover:bg-white/10" title="Reply" style={{ color: "#0ea5e9" }}><MessageCircle size={12} /></button>
                <button onClick={() => flagReview(r.id)} className="p-1 rounded hover:bg-white/10" title="Flag" style={{ color: "#f97316" }}><Flag size={12} /></button>
                <button onClick={() => deleteReview(r.id)} className="p-1 rounded hover:bg-white/10" title="Delete" style={{ color: "#ef4444" }}><Trash2 size={12} /></button>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Review — ${selected?.id}`} width={500}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{selected.customer}</p>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{selected.product} · {selected.seller}</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} style={{ color: i <= selected.rating ? "#f59e0b" : "#334155", fill: i <= selected.rating ? "#f59e0b" : "transparent" }} />
                ))}
              </div>
            </div>
            <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.comment}</p>
              <p className="mt-1" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{selected.date} · {selected.helpful} helpful</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Btn size="sm" variant="secondary" onClick={() => togglePin(selected.id)}><Pin size={13} /> {selected.status === "Pinned" ? "Unpin" : "Pin"}</Btn>
              <Btn size="sm" variant="ghost" onClick={() => { setReplyModal(selected); setSelected(null); }}><MessageCircle size={13} /> Reply</Btn>
              <Btn size="sm" variant="warning" onClick={() => flagReview(selected.id)}><Flag size={13} /> Flag Abuse</Btn>
              <Btn size="sm" variant="ghost" onClick={() => hideReview(selected.id)}>Hide</Btn>
              <Btn size="sm" variant="danger" onClick={() => deleteReview(selected.id)}><Trash2 size={13} /> Delete</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal open={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Review">
        {replyModal && (
          <div className="flex flex-col gap-3">
            <div className="rounded p-3" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{replyModal.customer} wrote:</p>
              <p style={{ fontSize: 13, color: "var(--foreground)" }}>{replyModal.comment}</p>
            </div>
            <div className="flex flex-col gap-1">
              <label style={{ fontSize: 12, color: "var(--muted-foreground)", fontWeight: 500 }}>Admin Reply</label>
              <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write admin reply..."
                className="px-3 py-2 rounded outline-none resize-none"
                style={{ background: "var(--input-background)", border: "1px solid var(--border)", color: "var(--foreground)", fontSize: 13 }} />
            </div>
            {replySent ? (
              <div className="px-3 py-2 rounded text-center" style={{ background: "#10b98120", color: "#10b981", fontSize: 13 }}>✓ Reply posted!</div>
            ) : (
              <div className="flex gap-2 justify-end">
                <Btn variant="ghost" onClick={() => setReplyModal(null)}>Cancel</Btn>
                <Btn onClick={sendReply}><MessageCircle size={13} /> Post Reply</Btn>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
