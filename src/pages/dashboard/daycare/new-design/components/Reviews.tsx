import { useState } from "react";
import {
  Star, ThumbsUp, MessageCircle, TrendingUp, Award, Filter,
  Download, BarChart3, Shield, Eye, EyeOff, Trash2, Flag,
  CheckCircle, AlertTriangle, Bot, Search, XCircle, Image,
  Home, Share2, ChevronDown, ChevronUp, Megaphone
} from "lucide-react";
import { Card, PageHeader, Modal, Btn, SearchBar } from "./ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReviewStatus = "Approved" | "Pending" | "Hidden" | "Flagged" | "Deleted";
type SentimentType = "Positive" | "Neutral" | "Negative";
type RatingCategory = "Staff Behaviour" | "Child Safety" | "Cleanliness" | "Food Quality" | "Transportation" | "Communication" | "Activities" | "CCTV Monitoring";

interface ReviewPhoto { url: string; caption: string; }

interface Review {
  id: string;
  parentName: string;
  childName: string;
  rating: number;
  category: RatingCategory;
  comment: string;
  date: string;
  helpful: number;
  status: ReviewStatus;
  reply?: string;
  replyDate?: string;
  featured: boolean;
  verified: boolean;
  reported: boolean;
  reportReason?: string;
  photos: ReviewPhoto[];
  sentiment: SentimentType;
  aiFlags: string[];
  displayOn: ("Homepage" | "Profile" | "Search" | "Landing")[];
  categoryRatings: Partial<Record<RatingCategory, number>>;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1", parentName: "Sarah Johnson", childName: "Emma Johnson", rating: 5,
    category: "Staff Behaviour",
    comment: "TinySteps has been absolutely amazing for Emma! The staff are incredibly caring and attentive. She comes home happy every single day. The teachers really go above and beyond to ensure every child feels loved and safe.",
    date: "Jun 2, 2026", helpful: 12, status: "Approved", featured: true, verified: true, reported: false,
    reply: "Thank you so much, Sarah! Emma is an absolute joy to have in the Butterfly group. We truly appreciate your kind words!", replyDate: "Jun 3, 2026",
    photos: [{ url: "", caption: "Emma's art project" }],
    sentiment: "Positive", aiFlags: [], displayOn: ["Homepage", "Profile", "Landing"],
    categoryRatings: { "Staff Behaviour": 5, "Child Safety": 5, "Cleanliness": 5, "Activities": 5 }
  },
  {
    id: "r2", parentName: "Michael Wilson", childName: "Liam Wilson", rating: 4,
    category: "Child Safety",
    comment: "Very professional and loving staff. Liam has grown so much socially since joining. My only suggestion would be more outdoor time and better safety nets on the playground equipment.",
    date: "May 28, 2026", helpful: 8, status: "Approved", featured: false, verified: true, reported: false,
    photos: [], sentiment: "Positive", aiFlags: [], displayOn: ["Profile", "Search"],
    categoryRatings: { "Staff Behaviour": 4, "Child Safety": 4, "Activities": 4, "Communication": 5 }
  },
  {
    id: "r3", parentName: "Jessica Davis", childName: "Olivia Davis", rating: 5,
    category: "Activities",
    comment: "The daily activities program is outstanding. Olivia loves the art sessions and music classes. Excellent curriculum design that keeps children engaged and learning while having fun!",
    date: "May 25, 2026", helpful: 15, status: "Approved", featured: true, verified: true, reported: false,
    reply: "We're so happy Olivia enjoys our arts program! More creative workshops coming next month.", replyDate: "May 26, 2026",
    photos: [{ url: "", caption: "Art class" }, { url: "", caption: "Music session" }],
    sentiment: "Positive", aiFlags: [], displayOn: ["Homepage", "Profile", "Search", "Landing"],
    categoryRatings: { "Activities": 5, "Staff Behaviour": 5, "Cleanliness": 4, "Communication": 5 }
  },
  {
    id: "r4", parentName: "Robert Brown", childName: "Noah Brown", rating: 3,
    category: "Communication",
    comment: "The facility is great and Noah loves it, but I'd like more frequent updates throughout the day. Sometimes it's hard to know what he's been up to. The app notifications are also quite delayed.",
    date: "May 20, 2026", helpful: 5, status: "Pending", featured: false, verified: true, reported: false,
    photos: [], sentiment: "Neutral", aiFlags: ["Complaint: app notifications", "Improvement suggestion"],
    displayOn: ["Profile"],
    categoryRatings: { "Communication": 3, "Staff Behaviour": 4, "Child Safety": 4, "Cleanliness": 4 }
  },
  {
    id: "r5", parentName: "Emily Martinez", childName: "Sophia Martinez", rating: 5,
    category: "Food Quality",
    comment: "I'm so impressed with the nutrition program. Sophia always talks about the healthy lunches and the variety. Even our family dietitian was impressed by the meal plans!",
    date: "May 18, 2026", helpful: 9, status: "Approved", featured: false, verified: true, reported: false,
    photos: [], sentiment: "Positive", aiFlags: [], displayOn: ["Profile", "Search"],
    categoryRatings: { "Food Quality": 5, "Cleanliness": 5, "Staff Behaviour": 5 }
  },
  {
    id: "r6", parentName: "David Lee", childName: "Aiden Lee", rating: 4,
    category: "Cleanliness",
    comment: "Clean, safe, and bright facility. Aiden feels right at home. The playground upgrade last month was a great improvement. Cleanliness standards are consistently maintained.",
    date: "May 15, 2026", helpful: 6, status: "Approved", featured: false, verified: true, reported: false,
    photos: [{ url: "", caption: "Playground area" }], sentiment: "Positive", aiFlags: [], displayOn: ["Profile"],
    categoryRatings: { "Cleanliness": 5, "Child Safety": 4, "Activities": 4, "Staff Behaviour": 4 }
  },
  {
    id: "r7", parentName: "Amanda Moore", childName: "Lucas Moore", rating: 2,
    category: "Communication",
    comment: "Had several issues with late pickup notifications and inconsistency with the schedule. The staff were rude when I raised concerns. This needs to improve urgently. Very disappointed.",
    date: "May 10, 2026", helpful: 3, status: "Flagged", featured: false, verified: false, reported: true,
    reportReason: "Contains aggressive language",
    reply: "We sincerely apologize, Amanda. We've addressed the notification issue and retrained staff on parent communication protocols.",
    replyDate: "May 12, 2026",
    photos: [], sentiment: "Negative", aiFlags: ["Negative sentiment", "Staff complaint", "Urgent complaint"],
    displayOn: [],
    categoryRatings: { "Communication": 2, "Staff Behaviour": 1, "Child Safety": 3 }
  },
  {
    id: "r8", parentName: "Chris Clark", childName: "Isabella Clark", rating: 5,
    category: "Staff Behaviour",
    comment: "Miss Sarah and the team are exceptional! Isabella was shy at first but they made her feel so welcome. Truly dedicated professionals who genuinely care about each child's development.",
    date: "May 5, 2026", helpful: 18, status: "Approved", featured: true, verified: true, reported: false,
    photos: [], sentiment: "Positive", aiFlags: [], displayOn: ["Homepage", "Landing"],
    categoryRatings: { "Staff Behaviour": 5, "Activities": 5, "Child Safety": 5, "Communication": 5 }
  },
  {
    id: "r9", parentName: "Unknown User", childName: "—", rating: 1,
    category: "Staff Behaviour",
    comment: "WORST PLACE EVER!!! DO NOT SEND YOUR KIDS HERE!!!! Staff are terrible terrible terrible. Everything is bad. Buy buy buy buy buy. Visit my website for better options!!!",
    date: "May 3, 2026", helpful: 0, status: "Hidden", featured: false, verified: false, reported: true,
    reportReason: "Spam / fake review",
    photos: [], sentiment: "Negative", aiFlags: ["Spam detected", "Fake review detected", "Repeated words", "External link spam", "Unverified user"],
    displayOn: [],
    categoryRatings: {}
  },
  {
    id: "r10", parentName: "Lisa Harris", childName: "Ava Harris", rating: 4,
    category: "Transportation",
    comment: "The bus service is reliable and the driver is always punctual. Ava loves the ride to daycare. GPS tracking gives me peace of mind as a parent.",
    date: "Apr 28, 2026", helpful: 7, status: "Approved", featured: false, verified: true, reported: false,
    photos: [], sentiment: "Positive", aiFlags: [], displayOn: ["Profile", "Search"],
    categoryRatings: { "Transportation": 5, "Child Safety": 4, "Communication": 4 }
  },
  {
    id: "r11", parentName: "James Scott", childName: "Elijah Scott", rating: 4,
    category: "CCTV Monitoring",
    comment: "Appreciate being able to check in on Elijah via the parent CCTV portal. Adds great reassurance. Would love higher resolution cameras in the outdoor area.",
    date: "Apr 22, 2026", helpful: 11, status: "Pending", featured: false, verified: true, reported: false,
    photos: [], sentiment: "Positive", aiFlags: ["Improvement suggestion: CCTV"], displayOn: ["Profile"],
    categoryRatings: { "CCTV Monitoring": 4, "Child Safety": 5, "Staff Behaviour": 4 }
  },
];

const ALL_CATEGORIES: RatingCategory[] = [
  "Staff Behaviour", "Child Safety", "Cleanliness", "Food Quality",
  "Transportation", "Communication", "Activities", "CCTV Monitoring"
];

const DISPLAY_PAGES = ["Homepage", "Profile", "Search", "Landing"] as const;
type DisplayPage = typeof DISPLAY_PAGES[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating, size = 14, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          className={`${i <= (interactive ? (hover || rating) : rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} ${interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}`}
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
        />
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-4 text-right">{label}</span>
      <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
    </div>
  );
}

function SentimentBadge({ s }: { s: SentimentType }) {
  const map = { Positive: "bg-green-100 text-green-700", Neutral: "bg-gray-100 text-gray-600", Negative: "bg-red-100 text-red-700" };
  return <span className={`text-xs px-1.5 py-0.5 rounded-full ${map[s]}`}>{s}</span>;
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const map: Record<ReviewStatus, string> = {
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Hidden: "bg-gray-100 text-gray-600",
    Flagged: "bg-orange-100 text-orange-700",
    Deleted: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${map[status]}`} style={{ fontWeight: 600 }}>{status}</span>;
}

const catColor: Record<string, string> = {
  "Staff Behaviour": "bg-blue-100 text-blue-700",
  "Child Safety": "bg-green-100 text-green-700",
  "Cleanliness": "bg-teal-100 text-teal-700",
  "Food Quality": "bg-orange-100 text-orange-700",
  "Transportation": "bg-yellow-100 text-yellow-700",
  "Communication": "bg-pink-100 text-pink-700",
  "Activities": "bg-purple-100 text-purple-700",
  "CCTV Monitoring": "bg-indigo-100 text-indigo-700",
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState<number | "All">("All");
  const [filterStatus, setFilterStatus] = useState<ReviewStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterSentiment, setFilterSentiment] = useState<SentimentType | "All">("All");
  const [filterVerified, setFilterVerified] = useState<"All" | "Verified" | "Unverified">("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyModal, setReplyModal] = useState<Review | null>(null);
  const [replyText, setReplyText] = useState("");
  const [deleteModal, setDeleteModal] = useState<Review | null>(null);
  const [displayModal, setDisplayModal] = useState<Review | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"reviews" | "ai-monitor" | "display">("reviews");
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());

  // ─── Computed values ─────────────────────────────────────────────────────────
  const activeReviews = reviews.filter(r => r.status !== "Deleted");
  const approvedReviews = reviews.filter(r => r.status === "Approved");
  const avgRating = approvedReviews.length ? approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length : 0;
  const fiveStarCount = approvedReviews.filter(r => r.rating === 5).length;
  const pendingCount = reviews.filter(r => r.status === "Pending").length;
  const reportedCount = reviews.filter(r => r.reported).length;
  const verifiedCount = reviews.filter(r => r.verified).length;
  const ratingCounts = [5, 4, 3, 2, 1].map(n => ({ n, count: approvedReviews.filter(r => r.rating === n).length }));

  // ─── Category averages ────────────────────────────────────────────────────────
  const categoryAvg = (cat: RatingCategory): number => {
    const relevant = approvedReviews.filter(r => r.categoryRatings[cat] !== undefined);
    if (!relevant.length) return 0;
    return relevant.reduce((s, r) => s + (r.categoryRatings[cat] ?? 0), 0) / relevant.length;
  };

  // ─── Filtered list ────────────────────────────────────────────────────────────
  const filtered = activeReviews.filter(r => {
    if (search && !r.parentName.toLowerCase().includes(search.toLowerCase()) && !r.childName.toLowerCase().includes(search.toLowerCase()) && !r.comment.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterRating !== "All" && r.rating !== filterRating) return false;
    if (filterStatus !== "All" && r.status !== filterStatus) return false;
    if (filterCategory !== "All" && r.category !== filterCategory) return false;
    if (filterSentiment !== "All" && r.sentiment !== filterSentiment) return false;
    if (filterVerified === "Verified" && !r.verified) return false;
    if (filterVerified === "Unverified" && r.verified) return false;
    return true;
  });

  // ─── Actions ──────────────────────────────────────────────────────────────────
  function updateStatus(id: string, status: ReviewStatus) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  }

  function toggleFeatured(id: string) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, featured: !r.featured } : r));
  }

  function submitReply(id: string) {
    if (!replyText.trim()) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText.trim(), replyDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) } : r));
    setReplyText("");
    setReplyModal(null);
  }

  function markHelpful(id: string) {
    if (helpfulVoted.has(id)) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: r.helpful + 1 } : r));
    setHelpfulVoted(prev => new Set(prev).add(id));
  }

  function flagAbuse(id: string) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reported: true, status: "Flagged", reportReason: "Flagged by admin" } : r));
  }

  function updateDisplay(id: string, pages: DisplayPage[]) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, displayOn: pages } : r));
  }

  function exportReviews() {
    const rows = [
      ["ID", "Parent", "Child", "Rating", "Category", "Comment", "Date", "Status", "Verified", "Sentiment"],
      ...reviews.map(r => [r.id, r.parentName, r.childName, r.rating, r.category, `"${r.comment}"`, r.date, r.status, r.verified, r.sentiment])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "reviews-export.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  // ─── AI flagged reviews ───────────────────────────────────────────────────────
  const aiFlaggedReviews = reviews.filter(r => r.aiFlags.length > 0);
  const negativeSentiment = reviews.filter(r => r.sentiment === "Negative").length;

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      <PageHeader
        title="Reviews & Ratings"
        subtitle="Manage parent feedback, monitor ratings, and build your daycare reputation"
        action={
          <div className="flex gap-2 flex-wrap">
            <Btn variant="secondary" size="sm" onClick={() => setAnalyticsOpen(true)}>
              <BarChart3 size={14} /> Analytics
            </Btn>
            <Btn variant="secondary" size="sm" onClick={exportReviews}>
              <Download size={14} /> Export
            </Btn>
          </div>
        }
      />

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {[
          { label: "Total Reviews", value: activeReviews.length, color: "text-gray-800", bg: "bg-gray-50" },
          { label: "Average Rating", value: avgRating.toFixed(1) + " ★", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "5-Star Reviews", value: fiveStarCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Reviews", value: pendingCount, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Reported Reviews", value: reportedCount, color: "text-red-600", bg: "bg-red-50" },
          { label: "Verified Reviews", value: verifiedCount, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map(k => (
          <Card key={k.label} className={`p-4 ${k.bg}`}>
            <p className={`text-2xl ${k.color}`} style={{ fontWeight: 800 }}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "View Reviews", icon: <Eye size={14} />, action: () => setActiveTab("reviews") },
          { label: "AI Monitor", icon: <Bot size={14} />, action: () => setActiveTab("ai-monitor") },
          { label: "Display Settings", icon: <Home size={14} />, action: () => setActiveTab("display") },
          { label: "Generate Analytics", icon: <BarChart3 size={14} />, action: () => setAnalyticsOpen(true) },
          { label: "Export Reviews", icon: <Download size={14} />, action: exportReviews },
        ].map(b => (
          <Btn key={b.label} variant="secondary" size="sm" onClick={b.action}>
            {b.icon} {b.label}
          </Btn>
        ))}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 border-b border-gray-200 mb-5">
        {[
          { id: "reviews" as const, label: "All Reviews" },
          { id: "ai-monitor" as const, label: `AI Monitor ${aiFlaggedReviews.length > 0 ? `(${aiFlaggedReviews.length})` : ""}` },
          { id: "display" as const, label: "Frontend Display" },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${activeTab === t.id ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: ALL REVIEWS ═══ */}
      {activeTab === "reviews" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Rating Breakdown */}
            <Card className="p-5">
              <h3 className="text-gray-800 mb-4">Rating Breakdown</h3>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-5xl text-yellow-500" style={{ fontWeight: 800 }}>{avgRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={Math.round(avgRating)} size={16} />
                  <p className="text-xs text-gray-400 mt-1">{approvedReviews.length} approved reviews</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {ratingCounts.map(({ n, count }) => (
                  <RatingBar key={n} label={String(n)} count={count} total={approvedReviews.length} />
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1">
                <div className="flex items-center gap-2">
                  <Award size={13} className="text-yellow-500" />
                  <p className="text-xs text-gray-600">Most praised: <span className="text-indigo-600" style={{ fontWeight: 600 }}>Staff Behaviour</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp size={13} className="text-green-500" />
                  <p className="text-xs text-gray-600">Satisfaction rate: <span className="text-green-600" style={{ fontWeight: 600 }}>{approvedReviews.length ? Math.round((approvedReviews.filter(r => r.rating >= 4).length / approvedReviews.length) * 100) : 0}%</span></p>
                </div>
              </div>
            </Card>

            {/* Category Scores */}
            <Card className="p-5 lg:col-span-2">
              <h3 className="text-gray-800 mb-4">Rating by Category</h3>
              <div className="grid grid-cols-2 gap-3">
                {ALL_CATEGORIES.map(cat => {
                  const avg = categoryAvg(cat);
                  return (
                    <div key={cat} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => setFilterCategory(filterCategory === cat ? "All" : cat)}>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${catColor[cat]}`}>{cat}</span>
                        <div className="flex items-center gap-1 mt-1.5">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${avg >= 4 ? "bg-green-400" : avg >= 3 ? "bg-yellow-400" : "bg-red-400"}`}
                              style={{ width: `${(avg / 5) * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">{avg > 0 ? avg.toFixed(1) : "—"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <SearchBar value={search} onChange={setSearch} placeholder="Search reviews…" />
              <div className="flex items-center gap-1">
                <Filter size={13} className="text-gray-400" />
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setFilterRating(filterRating === n ? "All" : n)}
                    className={`flex items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all ${filterRating === n ? "bg-yellow-100 text-yellow-700 font-semibold" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {n}<Star size={9} className={filterRating === n ? "fill-yellow-500 text-yellow-500" : "fill-gray-400 text-gray-400"} />
                  </button>
                ))}
              </div>
              {(["All", "Approved", "Pending", "Flagged", "Hidden"] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s as ReviewStatus | "All")}
                  className={`px-3 py-1 rounded-lg text-xs transition-all ${filterStatus === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {s}
                </button>
              ))}
              {(["All", "Positive", "Neutral", "Negative"] as const).map(s => (
                <button key={s} onClick={() => setFilterSentiment(s as SentimentType | "All")}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${filterSentiment === s ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {s}
                </button>
              ))}
              <select value={filterCategory} onChange={(e: any) => setFilterCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="All">All Categories</option>
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterVerified} onChange={(e: any) => setFilterVerified(e.target.value as "All" | "Verified" | "Unverified")}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="All">All Users</option>
                <option value="Verified">Verified Only</option>
                <option value="Unverified">Unverified Only</option>
              </select>
              <span className="text-xs text-gray-400 ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            </div>
          </Card>

          {/* Review Cards */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <Card className="p-12 text-center">
                <Search size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No reviews match your filters.</p>
              </Card>
            )}
            {filtered.map(r => {
              const isExpanded = expandedId === r.id;
              return (
                <Card key={r.id} className={`p-5 transition-all ${r.status === "Hidden" ? "opacity-60" : ""} ${r.featured ? "border-yellow-300 bg-yellow-50/30" : ""}`}>
                  {/* Header row */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-sm" style={{ fontWeight: 700 }}>
                      {r.parentName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{r.parentName}</span>
                        {r.verified && <span title="Verified parent"><CheckCircle size={13} className="text-green-500" /></span>}
                        <span className="text-xs text-gray-400">re: {r.childName}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${catColor[r.category]}`}>{r.category}</span>
                        <StatusBadge status={r.status} />
                        <SentimentBadge s={r.sentiment} />
                        {r.featured && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1"><Star size={10} className="fill-yellow-500 text-yellow-500" /> Featured</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={r.rating} size={13} />
                        <span className="text-xs text-gray-400">· {r.date}</span>
                        {r.photos.length > 0 && <span className="flex items-center gap-0.5 text-xs text-blue-500"><Image size={11} /> {r.photos.length} photo{r.photos.length > 1 ? "s" : ""}</span>}
                      </div>
                    </div>
                    <button onClick={() => setExpandedId(isExpanded ? null : r.id)}
                      className="shrink-0 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Comment */}
                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                    {isExpanded ? r.comment : r.comment.length > 140 ? r.comment.slice(0, 140) + "…" : r.comment}
                  </p>

                  {/* AI Flags */}
                  {r.aiFlags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {r.aiFlags.map((f, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-red-50 text-red-600 border border-red-200 rounded-full flex items-center gap-1">
                          <Bot size={10} /> {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Reply */}
                  {r.reply && (
                    <div className="mt-3 pl-3 border-l-2 border-indigo-200 bg-indigo-50 rounded-r-lg p-3">
                      <p className="text-xs text-indigo-600" style={{ fontWeight: 600 }}>TinySteps replied · {r.replyDate}</p>
                      <p className="text-xs text-indigo-700 mt-0.5">{r.reply}</p>
                    </div>
                  )}

                  {/* Expanded: category ratings */}
                  {isExpanded && Object.keys(r.categoryRatings).length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 600 }}>Sub-ratings</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(r.categoryRatings).map(([cat, val]) => (
                          <div key={cat} className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{cat}</span>
                            <StarRating rating={val as number} size={11} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action bar */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => markHelpful(r.id)}
                      className={`flex items-center gap-1 text-xs transition-colors ${helpfulVoted.has(r.id) ? "text-indigo-600" : "text-gray-400 hover:text-indigo-600"}`}>
                      <ThumbsUp size={12} /> {r.helpful}
                    </button>

                    {/* Approve */}
                    {r.status !== "Approved" && (
                      <button onClick={() => updateStatus(r.id, "Approved")}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        <CheckCircle size={12} /> Approve
                      </button>
                    )}
                    {/* Hide */}
                    {r.status !== "Hidden" && (
                      <button onClick={() => updateStatus(r.id, "Hidden")}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                        <EyeOff size={12} /> Hide
                      </button>
                    )}
                    {r.status === "Hidden" && (
                      <button onClick={() => updateStatus(r.id, "Approved")}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        <Eye size={12} /> Show
                      </button>
                    )}
                    {/* Feature */}
                    <button onClick={() => toggleFeatured(r.id)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${r.featured ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                      <Star size={12} className={r.featured ? "fill-yellow-500 text-yellow-500" : ""} />
                      {r.featured ? "Unfeature" : "Feature"}
                    </button>
                    {/* Display */}
                    <button onClick={() => setDisplayModal(r)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
                      <Share2 size={12} /> Display
                    </button>
                    {/* Reply */}
                    <button onClick={() => { setReplyModal(r); setReplyText(r.reply ?? ""); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <MessageCircle size={12} /> {r.reply ? "Edit Reply" : "Reply"}
                    </button>
                    {/* Flag */}
                    {!r.reported && (
                      <button onClick={() => flagAbuse(r.id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors">
                        <Flag size={12} /> Flag Abuse
                      </button>
                    )}
                    {r.reported && (
                      <span className="flex items-center gap-1 text-xs text-orange-600">
                        <Flag size={12} /> {r.reportReason || "Reported"}
                      </span>
                    )}
                    {/* Delete */}
                    <button onClick={() => setDeleteModal(r)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors ml-auto">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ TAB: AI MONITOR ═══ */}
      {activeTab === "ai-monitor" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "AI Flagged", value: aiFlaggedReviews.length, color: "text-red-600", bg: "bg-red-50", desc: "Needs review" },
              { label: "Spam Detected", value: reviews.filter(r => r.aiFlags.some(f => f.toLowerCase().includes("spam"))).length, color: "text-orange-600", bg: "bg-orange-50", desc: "Auto-detected" },
              { label: "Negative Sentiment", value: negativeSentiment, color: "text-purple-600", bg: "bg-purple-50", desc: "Negative reviews" },
              { label: "Fake Reviews", value: reviews.filter(r => r.aiFlags.some(f => f.toLowerCase().includes("fake"))).length, color: "text-red-700", bg: "bg-red-100", desc: "Low confidence" },
            ].map(k => (
              <Card key={k.label} className={`p-4 ${k.bg}`}>
                <p className={`text-3xl ${k.color}`} style={{ fontWeight: 700 }}>{k.value}</p>
                <p className="text-sm text-gray-600">{k.label}</p>
                <p className="text-xs text-gray-400">{k.desc}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bot size={18} className="text-indigo-600" />
              <h3 className="text-gray-800">AI Review Monitor</h3>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full ml-auto">Active</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {[
                { label: "Fake Review Detection", desc: "Unverified users, repeated patterns", active: true },
                { label: "Spam Filter", desc: "Links, repeated words, nonsense", active: true },
                { label: "Negative Sentiment", desc: "NLP-based tone analysis", active: true },
                { label: "Repeated Complaints", desc: "Same issues across reviews", active: true },
              ].map(f => (
                <div key={f.label} className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-xs text-gray-700" style={{ fontWeight: 600 }}>{f.label}</p>
                  </div>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>

            {aiFlaggedReviews.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Shield size={32} className="mx-auto mb-2 text-green-400" />
                <p className="text-sm">All reviews look clean — no AI flags detected.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3" style={{ fontWeight: 600 }}>{aiFlaggedReviews.length} review{aiFlaggedReviews.length !== 1 ? "s" : ""} flagged by AI</p>
                {aiFlaggedReviews.map(r => (
                  <div key={r.id} className={`p-4 rounded-xl border ${r.sentiment === "Negative" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm" style={{ fontWeight: 600 }}>{r.parentName}</span>
                          <StarRating rating={r.rating} size={12} />
                          <SentimentBadge s={r.sentiment} />
                          <StatusBadge status={r.status} />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">"{r.comment.slice(0, 120)}{r.comment.length > 120 ? "…" : ""}"</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {r.aiFlags.map((f, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full flex items-center gap-1">
                              <Bot size={9} /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button onClick={() => updateStatus(r.id, "Approved")}
                        className="text-xs px-2.5 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1">
                        <CheckCircle size={12} /> Approve Anyway
                      </button>
                      <button onClick={() => updateStatus(r.id, "Hidden")}
                        className="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                        <EyeOff size={12} /> Hide
                      </button>
                      <button onClick={() => setDeleteModal(r)}
                        className="text-xs px-2.5 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-1">
                        <Trash2 size={12} /> Delete
                      </button>
                      {!r.reported && (
                        <button onClick={() => flagAbuse(r.id)}
                          className="text-xs px-2.5 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-1">
                          <Flag size={12} /> Flag Abuse
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Repeated complaints */}
          <Card className="p-5">
            <h3 className="text-gray-800 mb-3">Repeated Complaint Patterns</h3>
            <div className="space-y-2">
              {[
                { issue: "Communication / App Notifications", count: 2, severity: "medium" },
                { issue: "Staff attitude", count: 1, severity: "high" },
                { issue: "CCTV resolution request", count: 1, severity: "low" },
                { issue: "Outdoor time request", count: 1, severity: "low" },
              ].map(c => (
                <div key={c.issue} className={`flex items-center justify-between p-3 rounded-xl border ${c.severity === "high" ? "bg-red-50 border-red-200" : c.severity === "medium" ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-100"}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className={c.severity === "high" ? "text-red-500" : c.severity === "medium" ? "text-yellow-500" : "text-gray-400"} />
                    <span className="text-sm text-gray-700">{c.issue}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.count >= 2 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`}>
                    {c.count} complaint{c.count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══ TAB: FRONTEND DISPLAY ═══ */}
      {activeTab === "display" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {DISPLAY_PAGES.map(page => {
              const count = reviews.filter(r => r.status === "Approved" && r.displayOn.includes(page)).length;
              const icons: Record<DisplayPage, React.ReactNode> = {
                Homepage: <Home size={18} className="text-indigo-500" />,
                Profile: <Award size={18} className="text-blue-500" />,
                Search: <Search size={18} className="text-green-500" />,
                Landing: <Megaphone size={18} className="text-purple-500" />,
              };
              return (
                <Card key={page} className="p-4">
                  <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mb-2">{icons[page]}</div>
                  <p className="text-2xl text-gray-800" style={{ fontWeight: 700 }}>{count}</p>
                  <p className="text-sm text-gray-500">{page}</p>
                  <p className="text-xs text-gray-400">reviews displayed</p>
                </Card>
              );
            })}
          </div>

          {/* Featured reviews */}
          <Card className="p-5">
            <h3 className="text-gray-800 mb-4">Featured Reviews</h3>
            <p className="text-xs text-gray-400 mb-4">These reviews are highlighted on your public-facing pages to build trust with prospective parents.</p>
            <div className="space-y-3">
              {reviews.filter(r => r.featured && r.status === "Approved").length === 0 && (
                <p className="text-center py-6 text-sm text-gray-400">No featured reviews yet. Click "Feature" on any approved review to highlight it.</p>
              )}
              {reviews.filter(r => r.featured && r.status === "Approved").map(r => (
                <div key={r.id} className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-sm" style={{ fontWeight: 700 }}>
                    {r.parentName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm" style={{ fontWeight: 600 }}>{r.parentName}</span>
                      <StarRating rating={r.rating} size={12} />
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">"{r.comment.slice(0, 120)}{r.comment.length > 120 ? "…" : ""}"</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.displayOn.map(p => (
                        <span key={p} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setDisplayModal(r)}
                      className="text-xs px-2.5 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                      <Share2 size={12} />
                    </button>
                    <button onClick={() => toggleFeatured(r.id)}
                      className="text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                      <XCircle size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* All approved reviews with display toggles */}
          <Card className="p-5">
            <h3 className="text-gray-800 mb-4">Manage Page Display</h3>
            <p className="text-xs text-gray-400 mb-4">Control which approved reviews appear on each public page.</p>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {reviews.filter(r => r.status === "Approved").map(r => (
                <div key={r.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{r.parentName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <StarRating rating={r.rating} size={11} />
                      <span className="text-xs text-gray-400 ml-1">{r.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {DISPLAY_PAGES.map(page => {
                      const active = r.displayOn.includes(page);
                      return (
                        <button key={page}
                          onClick={() => {
                            const newPages = active
                              ? r.displayOn.filter(p => p !== page)
                              : [...r.displayOn, page];
                            updateDisplay(r.id, newPages as DisplayPage[]);
                          }}
                          className={`text-xs px-2 py-1 rounded-lg transition-all ${active ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-500 hover:bg-gray-300"}`}>
                          {page}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ═══ MODALS ═══ */}

      {/* Reply Modal */}
      {replyModal && (
        <Modal title="Reply to Review" onClose={() => setReplyModal(null)} size="md">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={replyModal.rating} size={12} />
                <span className="text-xs text-gray-500">by {replyModal.parentName} · {replyModal.date}</span>
              </div>
              <p className="text-sm text-gray-600 italic">"{replyModal.comment}"</p>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Your reply</label>
              <textarea rows={4} value={replyText} onChange={(e: any) => setReplyText(e.target.value)}
                placeholder="Write a thoughtful, professional response to this parent's review..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              <p className="text-xs text-gray-400 mt-1">{replyText.length} characters · Tip: Thank the parent and address any concerns professionally.</p>
            </div>
            <div className="flex gap-2">
              <Btn variant="primary" onClick={() => submitReply(replyModal.id)} disabled={!replyText.trim()}>
                <MessageCircle size={14} /> Submit Reply
              </Btn>
              <Btn variant="secondary" onClick={() => setReplyModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <Modal title="Delete Review" onClose={() => setDeleteModal(null)} size="sm">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700" style={{ fontWeight: 600 }}>Are you sure you want to delete this review?</p>
              <p className="text-xs text-red-600 mt-1">From: {deleteModal.parentName} · Rating: {deleteModal.rating}★</p>
              <p className="text-xs text-red-500 mt-1">This action is permanent and cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <Btn variant="danger" onClick={() => { updateStatus(deleteModal.id, "Deleted"); setDeleteModal(null); }}>
                <Trash2 size={14} /> Yes, Delete
              </Btn>
              <Btn variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Display Modal */}
      {displayModal && (
        <Modal title="Display Settings" onClose={() => setDisplayModal(null)} size="sm">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-sm text-gray-800" style={{ fontWeight: 600 }}>{displayModal.parentName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <StarRating rating={displayModal.rating} size={12} />
                <span className="text-xs text-gray-400 ml-1">{displayModal.category}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Show this review on:</p>
              <div className="grid grid-cols-2 gap-2">
                {DISPLAY_PAGES.map(page => {
                  const active = displayModal.displayOn.includes(page);
                  return (
                    <button key={page}
                      onClick={() => {
                        const newPages = active
                          ? displayModal.displayOn.filter(p => p !== page)
                          : [...displayModal.displayOn, page];
                        updateDisplay(displayModal.id, newPages as DisplayPage[]);
                        setDisplayModal(prev => prev ? { ...prev, displayOn: newPages as DisplayPage[] } : null);
                      }}
                      className={`p-3 rounded-xl border text-sm transition-all ${active ? "bg-indigo-600 text-white border-indigo-600" : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-indigo-50 hover:border-indigo-300"}`}>
                      {page}
                    </button>
                  );
                })}
              </div>
            </div>
            <Btn variant="secondary" onClick={() => setDisplayModal(null)}>Done</Btn>
          </div>
        </Modal>
      )}

      {/* Analytics Modal */}
      {analyticsOpen && (
        <Modal title="Reviews Analytics" onClose={() => setAnalyticsOpen(false)} size="lg">
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Response Rate", value: `${Math.round((reviews.filter(r => r.reply).length / activeReviews.length) * 100)}%`, color: "text-indigo-600" },
                { label: "Avg Response Time", value: "1.2 days", color: "text-blue-600" },
                { label: "Positive Rate", value: `${Math.round((reviews.filter(r => r.sentiment === "Positive").length / activeReviews.length) * 100)}%`, color: "text-green-600" },
              ].map(s => (
                <div key={s.label} className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Category Performance</p>
              <div className="space-y-2">
                {ALL_CATEGORIES.map(cat => {
                  const avg = categoryAvg(cat);
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs text-gray-600 w-36 shrink-0">{cat}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${avg >= 4 ? "bg-green-400" : avg >= 3 ? "bg-yellow-400" : "bg-red-400"}`}
                          style={{ width: `${avg > 0 ? (avg / 5) * 100 : 0}%` }} />
                      </div>
                      <StarRating rating={Math.round(avg)} size={11} />
                      <span className="text-xs text-gray-500 w-8 text-right">{avg > 0 ? avg.toFixed(1) : "—"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-3" style={{ fontWeight: 600 }}>Sentiment Breakdown</p>
              <div className="grid grid-cols-3 gap-3">
                {(["Positive", "Neutral", "Negative"] as SentimentType[]).map(s => {
                  const count = reviews.filter(r => r.sentiment === s).length;
                  const pct = activeReviews.length ? Math.round((count / activeReviews.length) * 100) : 0;
                  const colors = { Positive: "bg-green-400", Neutral: "bg-gray-400", Negative: "bg-red-400" };
                  return (
                    <div key={s} className="p-3 bg-gray-50 rounded-xl text-center">
                      <p className="text-xl" style={{ fontWeight: 700 }}>{pct}%</p>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden my-2">
                        <div className={`h-full ${colors[s]} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">{s} ({count})</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <Btn variant="primary" onClick={exportReviews}><Download size={14} /> Export CSV</Btn>
              <Btn variant="secondary" onClick={() => setAnalyticsOpen(false)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
