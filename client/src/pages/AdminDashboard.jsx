import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BarChart3, Package, ShoppingCart, Users, Plus, Edit3, Trash2, Lock, Unlock, ShieldAlert, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useStore } from '../store/useStore';
import { mockProducts } from '../data/mockProducts';

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f1f5f9/0f172a?text=Gaming+Gear';
const formatVND = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

const REVENUE_DATA = [
  { month: 'T6', revenue: 42000000 }, { month: 'T7', revenue: 58000000 },
  { month: 'T8', revenue: 51000000 }, { month: 'T9', revenue: 74000000 },
  { month: 'T10', revenue: 89000000 }, { month: 'T11', revenue: 112000000 },
];

const INITIAL_USERS = [
  { _id: 'usr_01', name: 'Nguyễn Văn Gamer', email: 'customer@gaminggear.vn', role: 'Customer', locked: false },
  { _id: 'usr_02', name: 'Trần Hoàng Pro', email: 'hoangpro@gaminggear.vn', role: 'Customer', locked: false },
  { _id: 'usr_03', name: 'Lê Minh Esports', email: 'minhesports@gaminggear.vn', role: 'Customer', locked: true },
  { _id: 'usr_04', name: 'Admin GearVN', email: 'owner@gaminggear.vn', role: 'Owner', locked: false },
];

const EMPTY_FORM = {
  name: '', brand: 'Logitech', category: 'Chuột', price: 1990000, originalPrice: 2490000, stock: 10, image: PLACEHOLDER_IMG,
  specs: { switchType: '', sensor: '', dpi: '', pollingRate: '1000Hz', connection: 'Wireless' },
};

const AdminDashboard = ({ products: propProducts, setProducts: propSetProducts }) => {
  const { user, orders, updateOrderStatus } = useStore();
  const [tab, setTab] = useState('stats');
  const [localProducts, setLocalProducts] = useState(mockProducts);
  const products = propProducts || localProducts;
  const setProducts = propSetProducts || setLocalProducts;

  const [customers, setCustomers] = useState(INITIAL_USERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  if (!user || user.role !== 'Owner') return <Navigate to="/" replace />;

  const totalRevenue = orders.filter((o) => o.status !== 'Cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
  const openAdd = () => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); };
  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({ ...p, image: p.images?.[0] || PLACEHOLDER_IMG, specs: { ...EMPTY_FORM.specs, ...(p.specs || {}) } });
    setModalOpen(true);
  };
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), originalPrice: Number(form.originalPrice), stock: Number(form.stock), images: [form.image || PLACEHOLDER_IMG] };
    if (editingId) setProducts((prev) => prev.map((p) => (p._id === editingId ? { ...payload, _id: editingId } : p)));
    else setProducts((prev) => [{ ...payload, _id: `prod-${Date.now()}` }, ...prev]);
    setModalOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase">Owner Portal</span>
            <h1 className="text-lg font-extrabold text-slate-900 mt-0.5">Bảng Điều Khiển Quản Trị GEARVN</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'stats', label: '1. Thống kê', icon: BarChart3 },
              { id: 'products', label: '2. Sản phẩm', icon: Package },
              { id: 'orders', label: '3. Đơn hàng', icon: ShoppingCart },
              { id: 'users', label: '4. Khách hàng', icon: Users },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setTab(id)} className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all duration-200 ${tab === id ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-[#f8fafc] text-slate-700 border-slate-200 hover:border-rose-300'}`}>
                <Icon className="w-4 h-4" /><span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {tab === 'stats' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Tổng Doanh Thu', val: formatVND(totalRevenue), badge: '+18.4% tháng này' },
                { title: 'Tổng Đơn Hàng', val: orders.length, badge: `${orders.filter((o) => o.status === 'Pending').length} chờ xử lý` },
                { title: 'Sản Phẩm Tồn Kho', val: products.reduce((s, p) => s + Number(p.stock || 0), 0), badge: `${products.length} mã SKU` },
                { title: 'Tài Khoản Khách Hàng', val: customers.length, badge: `${customers.filter((u) => !u.locked).length} đang hoạt động` },
              ].map((kpi, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase">{kpi.title}</p>
                  <p className="text-xl font-extrabold text-rose-600">{kpi.val}</p>
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[11px] font-semibold">{kpi.badge}</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4">Biểu Đồ Doanh Thu 6 Tháng Gần Nhất (VNĐ)</h2>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip formatter={(v) => formatVND(v)} />
                    <Bar dataKey="revenue" fill="#e11d48" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'products' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Quản lý Sản phẩm ({products.length})</h2>
              <button type="button" onClick={openAdd} className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all duration-200">
                <Plus className="w-4 h-4" /><span>Thêm sản phẩm</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase bg-[#f8fafc]">
                    <th className="p-3">Sản phẩm</th><th className="p-3">Thông số (Specs)</th><th className="p-3">Giá KM</th><th className="p-3">Tồn kho</th><th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-900 flex items-center gap-2.5">
                        <img src={p.images?.[0] || PLACEHOLDER_IMG} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        <div><p>{p.name}</p><span className="text-[11px] text-slate-500">{p.brand} • {p.category}</span></div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.values(p.specs || {}).filter((v) => v && v !== 'N/A').slice(0, 3).map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[11px] font-medium">{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-rose-600 font-bold">{formatVND(p.price)}</td>
                      <td className="p-3"><span className={`font-bold ${p.stock > 0 ? 'text-[#16a34a]' : 'text-rose-600'}`}>{p.stock > 0 ? `Còn ${p.stock}` : 'Hết hàng'}</span></td>
                      <td className="p-3 text-right space-x-1.5">
                        <button type="button" onClick={() => openEdit(p)} className="p-1.5 rounded-lg border border-slate-200 text-blue-600 hover:bg-blue-50"><Edit3 className="w-4 h-4" /></button>
                        <button type="button" onClick={() => setProducts((prev) => prev.filter((x) => x._id !== p._id))} className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3 overflow-x-auto">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Điều phối Trạng thái Đơn hàng</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase bg-[#f8fafc]">
                  <th className="p-3">Mã đơn</th><th className="p-3">Khách hàng</th><th className="p-3">Thanh toán</th><th className="p-3">Tổng tiền</th><th className="p-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="p-3 font-bold text-slate-900">{o._id}</td>
                    <td className="p-3 text-slate-700">{o.shippingAddress?.fullName || o.customer || o.user?.name || 'Khách lẻ'}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">{o.paymentMethod}</span></td>
                    <td className="p-3 font-bold text-rose-600">{formatVND(o.totalAmount)}</td>
                    <td className="p-3">
                      <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-[#f8fafc] font-bold text-slate-800 focus:outline-none focus:border-rose-600">
                        {['Pending', 'Processing', 'Completed', 'Cancelled'].map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3 overflow-x-auto">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Quản lý Tài khoản Khách hàng</h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase bg-[#f8fafc]">
                  <th className="p-3">Họ tên</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Trạng thái</th><th className="p-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((u) => (
                  <tr key={u._id}>
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">{u.role}</span></td>
                    <td className="p-3"><span className={`font-bold ${u.locked ? 'text-rose-600' : 'text-[#16a34a]'}`}>{u.locked ? 'Đã khóa' : 'Hoạt động'}</span></td>
                    <td className="p-3 text-right">
                      <button type="button" onClick={() => setCustomers((prev) => prev.map((x) => (x._id === u._id ? { ...x, locked: !x.locked } : x)))} className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition-all duration-200 ${u.locked ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                        {u.locked ? <><Unlock className="w-3.5 h-3.5" /> Mở khóa</> : <><Lock className="w-3.5 h-3.5" /> Khóa</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveProduct} className="bg-white border border-slate-200 rounded-xl shadow-lg max-w-lg w-full p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-extrabold uppercase text-slate-900">{editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button type="button" onClick={() => setModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <input required placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-2 px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg" />
              <input required placeholder="Thương hiệu" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg">
                {['Chuột', 'Bàn phím', 'Tai nghe', 'Lót chuột'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" required placeholder="Giá KM" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg" />
              <input type="number" required placeholder="Tồn kho (stock)" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg" />
              {['switchType', 'sensor', 'dpi', 'pollingRate', 'connection'].map((k) => (
                <input key={k} placeholder={`Spec: ${k}`} value={form.specs?.[k] || ''} onChange={(e) => setForm({ ...form, specs: { ...form.specs, [k]: e.target.value } })} className="px-3 py-2 bg-[#f8fafc] border border-slate-200 rounded-lg" />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">Hủy</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold">Lưu thông tin</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default AdminDashboard;

