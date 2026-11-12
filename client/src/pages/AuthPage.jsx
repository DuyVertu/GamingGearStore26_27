import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';

const QUICK_ROLES = [
  { role: 'Customer', name: 'Nguyễn Văn Gamer', email: 'customer@gaminggear.vn', badge: 'Mua sắm & Đặt hàng' },
  { role: 'Owner', name: 'Admin GearVN', email: 'owner@gaminggear.vn', badge: 'Quản trị kho & Đơn hàng' },
];

const AuthPage = ({ onSuccess }) => {
  const { user, login, logout, mergeGuestCart, cart } = useStore();
  const [tab, setTab] = useState('login');
  const [selectedRole, setSelectedRole] = useState('Customer');
  const [form, setForm] = useState({ name: '', email: 'customer@gaminggear.vn', password: 'password123' });
  const [notice, setNotice] = useState('');

  const handleSelectRole = (preset) => {
    setSelectedRole(preset.role);
    setForm((prev) => ({ ...prev, name: preset.name, email: preset.email }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const preset = QUICK_ROLES.find((r) => r.role === selectedRole) || QUICK_ROLES[0];
    const userData = {
      _id: `usr_${selectedRole.toLowerCase()}_01`,
      name: tab === 'register' && form.name.trim() ? form.name.trim() : preset.name,
      email: form.email.trim() || preset.email,
      role: selectedRole,
    };
    const mockToken = `jwt_mock_${selectedRole.toLowerCase()}_${Date.now()}`;

    login(userData, mockToken);
    mergeGuestCart();
    setNotice(`Đăng nhập thành công (${selectedRole}). Đã đồng bộ ${cart.length} sản phẩm trong giỏ!`);
    if (onSuccess) onSuccess(userData);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-10 px-4">
      <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase">
                GEARVN Account
              </span>
              <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                {tab === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký thành viên'}
              </h1>
            </div>
            <ShieldCheck className="w-8 h-8 text-rose-600" />
          </div>

          <div className="grid grid-cols-2 p-1 bg-[#f8fafc] border border-slate-200 rounded-lg">
            {[
              { id: 'login', label: 'Đăng nhập' },
              { id: 'register', label: 'Đăng ký' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setTab(t.id); setNotice(''); }}
                className={`py-2 text-xs font-bold rounded-md transition-all duration-200 ${
                  tab === t.id ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Chọn nhanh Role để Test
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {QUICK_ROLES.map((item) => {
                const active = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleSelectRole(item)}
                    className={`p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                      active ? 'bg-rose-50/70 border-rose-600 text-slate-900' : 'bg-[#f8fafc] border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-900">{item.role}</span>
                      <UserCheck className={`w-4 h-4 ${active ? 'text-rose-600' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[11px] text-blue-600 font-medium mt-1">{item.badge}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nhập họ tên của bạn" className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full pl-9 pr-3 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200" />
            </div>
          </div>

          {notice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#16a34a] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <button type="submit" className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all duration-200">
            <span>{tab === 'login' ? `Đăng nhập (${selectedRole})` : `Đăng ký (${selectedRole})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {user && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Đang đăng nhập: <strong className="text-slate-900">{user.name}</strong> ({user.role})</span>
              <button type="button" onClick={logout} className="text-rose-600 font-semibold hover:underline">Đăng xuất</button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default AuthPage;
