import { useState, useRef, useEffect } from "react";
import api from "../../../../../services/api";
import { Search, CheckCircle, XCircle, Trash2, Edit2, Star, AlertTriangle, Plus, Upload, X, ImageIcon } from "lucide-react";
import { Badge, Btn, Table, TR, TD, PageHeader, Modal, Input, Select, StatCard } from "./Modal";

type ProductStatus = "Approved" | "Pending Review" | "Rejected" | "Suspended" | "Out of Stock";

interface Product {
  id: string;
  name: string;
  category: string;
  seller: string;
  price: string;
  stock: number;
  sold: number;
  remaining: number;
  status: ProductStatus;
  ageGroup: string;
  safetyStatus: "Safe" | "Under Review" | "Unsafe";
  featured: boolean;
  description?: string;
  images?: string[];
  weight?: string;
  dimensions?: string;
  material?: string;
  brand?: string;
  sku?: string;
  certifications?: string[];
}

const initProducts: Product[] = [
  { id: "P-001", name: "Wooden Learning Blocks Set", category: "Educational", seller: "KidsCraft Ltd.", price: "৳850", stock: 200, sold: 156, remaining: 44, status: "Approved", ageGroup: "3-6 yrs", safetyStatus: "Safe", featured: true },
  { id: "P-002", name: "Premium Toy Car Collection", category: "Toys", seller: "BabyWorld BD", price: "৳1,200", stock: 500, sold: 350, remaining: 150, status: "Approved", ageGroup: "4+ yrs", safetyStatus: "Safe", featured: false },
  { id: "P-003", name: "Baby Bottle Set (4pc)", category: "Baby Care", seller: "BabyWorld BD", price: "৳650", stock: 800, sold: 640, remaining: 160, status: "Approved", ageGroup: "0-2 yrs", safetyStatus: "Safe", featured: false },
  { id: "P-004", name: "Children's Backpack — Galaxy", category: "Clothing", seller: "KidGear Emporium", price: "৳1,450", stock: 300, sold: 210, remaining: 90, status: "Approved", ageGroup: "5-10 yrs", safetyStatus: "Safe", featured: true },
  { id: "P-005", name: "Magnetic Drawing Board", category: "Educational", seller: "NurtureTech BD", price: "৳980", stock: 150, sold: 87, remaining: 63, status: "Pending Review", ageGroup: "3+ yrs", safetyStatus: "Under Review", featured: false },
  { id: "P-006", name: "Soft Plush Teddy Bear XL", category: "Toys", seller: "Tiny Tots Store", price: "৳750", stock: 400, sold: 390, remaining: 10, status: "Out of Stock", ageGroup: "All Ages", safetyStatus: "Safe", featured: false },
  { id: "P-007", name: "Baby Safety Gate", category: "Baby Safety", seller: "SafeBaby Shop", price: "৳3,200", stock: 80, sold: 34, remaining: 46, status: "Suspended", ageGroup: "0-3 yrs", safetyStatus: "Unsafe", featured: false },
  { id: "P-008", name: "Interactive Learning Tablet", category: "Educational Tech", seller: "NurtureTech BD", price: "৳4,500", stock: 60, sold: 29, remaining: 31, status: "Pending Review", ageGroup: "4-10 yrs", safetyStatus: "Under Review", featured: false },
];

const statusColor: Record<ProductStatus, string> = {
  "Approved": "green", "Pending Review": "yellow", "Rejected": "red", "Suspended": "orange", "Out of Stock": "gray"
};
const safetyColor = { Safe: "green", "Under Review": "yellow", Unsafe: "red" };

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);
  const [editModal, setEditModal] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/marketplace/seller/products");
      const data = res.data.data || res.data || [];
      const mapped = data.map((p: any) => ({
        id: p.id ? p.id.toString() : "0",
        name: p.name || "",
        category: p.category_name || "General",
        seller: p.seller_name || "You",
        price: "৳" + (p.price || 0),
        stock: p.stock || 0,
        sold: 0,
        remaining: p.stock || 0,
        status: p.is_verified ? "Approved" : "Pending Review",
        ageGroup: "All Ages",
        safetyStatus: "Safe",
        featured: false,
        description: p.description || ""
      }));
      setProducts(mapped);
    } catch (error) {
      console.error(error);
    }
  };

  const [addModal, setAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "Educational",
    seller: "",
    price: "",
    stock: "",
    ageGroup: "3-6 yrs",
    brand: "",
    sku: "",
    weight: "",
    dimensions: "",
    material: "",
    certifications: [] as string[],
    images: [] as string[],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateStatus(id: string, status: ProductStatus) {
    setProducts(p => p.map(x => x.id === id ? { ...x, status } : x));
    setSelected(null);
  }

  function toggleFeatured(id: string) {
    setProducts(p => p.map(x => x.id === id ? { ...x, featured: !x.featured } : x));
  }

  function markUnsafe(id: string) {
    setProducts(p => p.map(x => x.id === id ? { ...x, safetyStatus: "Unsafe", status: "Suspended" } : x));
    setSelected(null);
  }

  function deleteProduct(id: string) {
    setProducts(p => p.filter(x => x.id !== id));
    setSelected(null);
  }

  function saveEdit() {
    if (editModal) {
      setProducts(p => p.map(x => x.id === editModal.id ? { ...x, name: editName || x.name, price: editPrice || x.price } : x));
      setEditModal(null);
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewProduct(prev => ({
            ...prev,
            images: [...prev.images, event.target!.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  }

  function addCertification(cert: string) {
    if (cert && !newProduct.certifications.includes(cert)) {
      setNewProduct(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert]
      }));
    }
  }

  function removeCertification(cert: string) {
    setNewProduct(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  }

  async function saveNewProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await api.post("/marketplace/seller/products", {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      });
      await fetchProducts();
      resetAddModal();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  }

  function resetAddModal() {
    setAddModal(false);
    setNewProduct({
      name: "",
      description: "",
      category: "Educational",
      seller: "",
      price: "",
      stock: "",
      ageGroup: "3-6 yrs",
      brand: "",
      sku: "",
      weight: "",
      dimensions: "",
      material: "",
      certifications: [],
      images: [],
    });
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <PageHeader title="Product Management" subtitle={`${products.length} total products`} />
        <Btn onClick={() => setAddModal(true)}>
          <Plus size={14} /> Add Product
        </Btn>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <StatCard label="Total Products" value={products.length} color="#0ea5e9" />
        <StatCard label="Approved" value={products.filter(p => p.status === "Approved").length} color="#10b981" />
        <StatCard label="Pending" value={products.filter(p => p.status === "Pending Review").length} color="#f59e0b" />
        <StatCard label="Out of Stock" value={products.filter(p => p.status === "Out of Stock").length} color="#ef4444" />
        <StatCard label="Unsafe" value={products.filter(p => p.safetyStatus === "Unsafe").length} color="#f97316" />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded flex-1 min-w-[200px]" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="outline-none bg-transparent flex-1" style={{ fontSize: 12, color: "var(--foreground)" }} />
        </div>
        {["All", "Approved", "Pending Review", "Rejected", "Suspended", "Out of Stock"].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="px-2.5 py-1.5 rounded text-xs transition-colors"
            style={{ background: filterStatus === s ? "var(--primary)" : "var(--muted)", color: filterStatus === s ? "#fff" : "var(--muted-foreground)", border: "1px solid var(--border)" }}>
            {s}
          </button>
        ))}
      </div>

      <Table headers={["ID", "Product", "Category", "Seller", "Price", "Stock", "Sold", "Remaining", "Safety", "Status", "Actions"]}>
        {filtered.map(p => (
          <TR key={p.id} onClick={() => setSelected(p)}>
            <TD mono>{p.id}</TD>
            <TD>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "var(--muted)" }}>
                  <span style={{ fontSize: 14 }}>🧸</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, maxWidth: 140 }} className="truncate block">{p.name}</span>
              </div>
            </TD>
            <TD>{p.category}</TD>
            <TD>{p.seller}</TD>
            <TD mono>{p.price}</TD>
            <TD mono>{p.stock}</TD>
            <TD mono>{p.sold}</TD>
            <TD mono>
              <span style={{ color: p.remaining < 20 ? "#ef4444" : "inherit" }}>{p.remaining}</span>
            </TD>
            <TD><Badge label={p.safetyStatus} color={safetyColor[p.safetyStatus]} /></TD>
            <TD><Badge label={p.status} color={statusColor[p.status]} /></TD>
            <TD>
              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                <button onClick={() => { setEditModal(p); setEditName(p.name); setEditPrice(p.price); }} className="p-1 rounded hover:bg-white/10" title="Edit" style={{ color: "#0ea5e9" }}><Edit2 size={12} /></button>
                {p.status === "Pending Review" && <button onClick={() => updateStatus(p.id, "Approved")} className="p-1 rounded hover:bg-white/10" title="Approve" style={{ color: "#10b981" }}><CheckCircle size={12} /></button>}
                {p.status === "Pending Review" && <button onClick={() => updateStatus(p.id, "Rejected")} className="p-1 rounded hover:bg-white/10" title="Reject" style={{ color: "#ef4444" }}><XCircle size={12} /></button>}
                <button onClick={() => toggleFeatured(p.id)} className="p-1 rounded hover:bg-white/10" title="Feature" style={{ color: p.featured ? "#f59e0b" : "var(--muted-foreground)" }}><Star size={12} /></button>
                <button onClick={() => markUnsafe(p.id)} className="p-1 rounded hover:bg-white/10" title="Mark Unsafe" style={{ color: "#f97316" }}><AlertTriangle size={12} /></button>
                <button onClick={() => deleteProduct(p.id)} className="p-1 rounded hover:bg-white/10" title="Delete" style={{ color: "#ef4444" }}><Trash2 size={12} /></button>
              </div>
            </TD>
          </TR>
        ))}
      </Table>

      {/* Product Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Product Details — ${selected?.id}`} width={600}>
        {selected && (
          <div className="flex flex-col gap-4">
            {/* Product Images Gallery */}
            {selected.images && selected.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
                {selected.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${selected.name} ${idx + 1}`}
                    className="h-32 rounded flex-shrink-0"
                    style={{ border: "1px solid var(--border)", objectFit: "cover" }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded flex items-center justify-center text-3xl" style={{ background: "var(--muted)" }}>
                {selected.images && selected.images.length > 0 ? (
                  <img src={selected.images[0]} alt={selected.name} className="w-full h-full object-cover rounded" />
                ) : "🧸"}
              </div>
              <div className="flex-1">
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)" }}>{selected.name}</h3>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>
                  {selected.category} · {selected.seller}
                  {selected.brand && <> · {selected.brand}</>}
                </p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <Badge label={selected.status} color={statusColor[selected.status]} />
                  <Badge label={selected.safetyStatus} color={safetyColor[selected.safetyStatus]} />
                  {selected.featured && <Badge label="Featured" color="yellow" />}
                </div>
              </div>
            </div>

            {selected.description && (
              <div className="p-3 rounded" style={{ background: "var(--muted)", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.6 }}>{selected.description}</p>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              <StatCard label="Price" value={selected.price} color="#0ea5e9" />
              <StatCard label="Stock" value={selected.stock} color="#06b6d4" />
              <StatCard label="Sold" value={selected.sold} color="#10b981" />
              <StatCard label="Remaining" value={selected.remaining} color={selected.remaining < 20 ? "#ef4444" : "#94a3b8"} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Age Group</span><p style={{ fontSize: 13, color: "var(--foreground)", fontWeight: 500 }}>{selected.ageGroup}</p></div>
              <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Product ID</span><p style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "monospace" }}>{selected.id}</p></div>
              {selected.sku && <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>SKU</span><p style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "monospace" }}>{selected.sku}</p></div>}
              {selected.weight && <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Weight</span><p style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.weight}</p></div>}
              {selected.dimensions && <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Dimensions</span><p style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.dimensions}</p></div>}
              {selected.material && <div><span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Material</span><p style={{ fontSize: 13, color: "var(--foreground)" }}>{selected.material}</p></div>}
            </div>

            {selected.certifications && selected.certifications.length > 0 && (
              <div>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)", display: "block", marginBottom: 6 }}>Safety Certifications</span>
                <div className="flex flex-wrap gap-2">
                  {selected.certifications.map(cert => (
                    <div key={cert} className="px-2 py-1 rounded text-xs" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              {selected.status === "Pending Review" && <Btn variant="success" size="sm" onClick={() => updateStatus(selected.id, "Approved")}><CheckCircle size={13} /> Approve</Btn>}
              {selected.status === "Pending Review" && <Btn variant="danger" size="sm" onClick={() => updateStatus(selected.id, "Rejected")}><XCircle size={13} /> Reject</Btn>}
              {selected.status === "Approved" && <Btn variant="warning" size="sm" onClick={() => updateStatus(selected.id, "Suspended")}>Suspend</Btn>}
              <Btn variant="secondary" size="sm" onClick={() => toggleFeatured(selected.id)}><Star size={13} /> {selected.featured ? "Unfeature" : "Feature"}</Btn>
              <Btn variant="danger" size="sm" onClick={() => markUnsafe(selected.id)}><AlertTriangle size={13} /> Mark Unsafe</Btn>
              <Btn variant="danger" size="sm" onClick={() => deleteProduct(selected.id)}><Trash2 size={13} /> Delete</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Product">
        {editModal && (
          <div className="flex flex-col gap-3">
            <Input label="Product Name" value={editName} onChange={e => setEditName(e.target.value)} />
            <Input label="Price" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
            <Select label="Status" value={editModal.status} onChange={e => setEditModal({ ...editModal, status: e.target.value as ProductStatus })}
              options={[
                { value: "Approved", label: "Approved" }, { value: "Pending Review", label: "Pending Review" },
                { value: "Rejected", label: "Rejected" }, { value: "Suspended", label: "Suspended" }, { value: "Out of Stock", label: "Out of Stock" }
              ]} />
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setEditModal(null)}>Cancel</Btn>
              <Btn onClick={saveEdit}>Save Changes</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Product Modal */}
      <Modal open={addModal} onClose={resetAddModal} title="Add New Product" width={700}>
        <div className="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
          {/* Image Upload Section */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>
              Product Images * <span style={{ color: "var(--muted-foreground)", fontWeight: 400 }}>(Click or drag to upload)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors hover:border-primary"
              style={{ borderColor: "var(--border)", background: "var(--muted)" }}
            >
              <Upload size={24} style={{ color: "var(--muted-foreground)", margin: "0 auto 8px" }} />
              <p style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Upload product images (PNG, JPG, WebP)</p>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 4 }}>Maximum 5 images, 5MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Image Preview */}
            {newProduct.images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-2">
                {newProduct.images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-20 object-cover rounded" style={{ border: "1px solid var(--border)" }} />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "#ef4444", color: "white" }}
                    >
                      <X size={12} />
                    </button>
                    {idx === 0 && (
                      <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: "var(--primary)", color: "white" }}>
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Input
                label="Product Name *"
                placeholder="e.g., Wooden Learning Blocks Set"
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                placeholder="Detailed product description..."
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 rounded outline-none transition-colors text-sm"
                style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
              />
            </div>
            <Select
              label="Category *"
              value={newProduct.category}
              onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
              options={[
                { value: "Educational", label: "Educational" },
                { value: "Toys", label: "Toys" },
                { value: "Baby Care", label: "Baby Care" },
                { value: "Clothing", label: "Clothing" },
                { value: "Educational Tech", label: "Educational Tech" },
                { value: "Baby Safety", label: "Baby Safety" },
                { value: "Books", label: "Books" },
                { value: "Outdoor", label: "Outdoor" },
              ]}
            />
            <Input
              label="Seller/Vendor *"
              placeholder="e.g., KidsCraft Ltd."
              value={newProduct.seller}
              onChange={e => setNewProduct({ ...newProduct, seller: e.target.value })}
            />
            <Input
              label="Brand"
              placeholder="e.g., Fisher-Price"
              value={newProduct.brand}
              onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
            />
            <Input
              label="SKU"
              placeholder="e.g., WLB-001"
              value={newProduct.sku}
              onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Price (৳) *"
              placeholder="850"
              value={newProduct.price}
              onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <Input
              label="Initial Stock *"
              placeholder="200"
              type="number"
              value={newProduct.stock}
              onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
            />
            <Select
              label="Age Group *"
              value={newProduct.ageGroup}
              onChange={e => setNewProduct({ ...newProduct, ageGroup: e.target.value })}
              options={[
                { value: "0-2 yrs", label: "0-2 years" },
                { value: "3-6 yrs", label: "3-6 years" },
                { value: "4+ yrs", label: "4+ years" },
                { value: "5-10 yrs", label: "5-10 years" },
                { value: "All Ages", label: "All Ages" },
              ]}
            />
          </div>

          {/* Physical Specifications */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Weight"
              placeholder="e.g., 500g"
              value={newProduct.weight}
              onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })}
            />
            <Input
              label="Dimensions"
              placeholder="e.g., 20x15x10 cm"
              value={newProduct.dimensions}
              onChange={e => setNewProduct({ ...newProduct, dimensions: e.target.value })}
            />
            <Input
              label="Material"
              placeholder="e.g., Wood, Plastic"
              value={newProduct.material}
              onChange={e => setNewProduct({ ...newProduct, material: e.target.value })}
            />
          </div>

          {/* Safety Certifications */}
          <div className="flex flex-col gap-2">
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>
              Safety Certifications
            </label>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 rounded outline-none transition-colors text-sm"
                style={{ background: "var(--muted)", border: "1px solid var(--border)", color: "var(--foreground)" }}
                onChange={e => {
                  if (e.target.value) {
                    addCertification(e.target.value);
                    e.target.value = "";
                  }
                }}
              >
                <option value="">Select certification...</option>
                <option value="CE Certified">CE Certified</option>
                <option value="ISO 9001">ISO 9001</option>
                <option value="ASTM F963">ASTM F963</option>
                <option value="EN71">EN71</option>
                <option value="BIS Certified">BIS Certified</option>
                <option value="Non-Toxic">Non-Toxic</option>
                <option value="FDA Approved">FDA Approved</option>
              </select>
            </div>
            {newProduct.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {newProduct.certifications.map(cert => (
                  <div key={cert} className="flex items-center gap-1 px-2 py-1 rounded text-xs" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}>
                    <span>{cert}</span>
                    <button onClick={() => removeCertification(cert)} className="hover:bg-white/10 rounded p-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-3" style={{ borderTop: "1px solid var(--border)" }}>
            <Btn variant="ghost" onClick={resetAddModal}>Cancel</Btn>
            <Btn onClick={saveNewProduct}>
              <Plus size={14} /> Add Product
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}
