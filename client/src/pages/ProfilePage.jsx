import React, { useState, useEffect } from 'react';
import { Navigate, Link, useSearchParams } from 'react-router-dom';
import {
  User,
  Lock,
  Package,
  Heart,
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

const TABS = [
  { id: 'profile', label: 'Hồ sơ cá nhân', icon: User },
  { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
  { id: 'orders', label: 'Đơn hàng của tôi', icon: Package },
  { id: 'wishlist', label: 'Danh sách yêu thích', icon: Heart },
];

const STATUS_BADGE = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-600 border-blue-200',
  Completed: 'bg-emerald-50 text-[#16a34a] border-emerald-200',
  Cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
};

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
};

const ProfilePage = () => {
  const { user, wishlist, orders, updateProfile, toggleWishlist, addToCart, syncOrders } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const validTab = TABS.some((t) => t.id === tabParam) ? tabParam : 'profile';
  const [activeTab, setActiveTab] = useState(validTab);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });
  const [wishlistNotice, setWishlistNotice] = useState('');

  useEffect(() => {
    setActiveTab(validTab);
  }, [validTab]);

  useEffect(() => {
    syncOrders();
  }, [syncOrders]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const userOrders = orders.filter((o) => !o.user?._id || o.user._id === user._id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'profile' ? {} : { tab: tabId }, { replace: true });
    setProfileMsg({ type: '', text: '' });
    setPwdMsg({ type: '', text: '' });
    setWishlistNotice('');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      return setProfileMsg({ type: 'error', text: 'Họ tên không được để trống.' });
    }
    updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
      address: profileForm.address.trim(),
    });
    setProfileMsg({ type: 'success', text: 'Đã cập nhật thông tin hồ sơ thành công.' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = pwdForm;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'Vui lòng điền đầy đủ tất cả các trường.' });
    }
    if (newPassword.length < 6) {
      return setPwdMsg({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
    }
    if (newPassword !== confirmPassword) {
      return setPwdMsg({ type: 'error', text: 'Xác nhận mật khẩu mới không khớp.' });
    }
    if (newPassword === currentPassword) {
      return setPwdMsg({ type: 'error', text: 'Mật khẩu mới phải khác mật khẩu hiện tại.' });
    }
    setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPwdMsg({ type: 'success', text: 'Đổi mật khẩu thành công.' });
  };

  const handleMoveToCart = (product) => {
    const res = addToCart(product, 1);
    if (res.success) {
      toggleWishlist(product);
      setWishlistNotice(`Đã chuyển "${product.name}" sang giỏ hàng.`);
    } else {
      setWishlistNotice(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar 4 tab bên trái */}
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-11 h-11 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-extrabold text-base shrink-0">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name || 'Thành viên'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase">
                {user.role || 'Customer'}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              const badge = id === 'orders' ? userOrders.length : id === 'wishlist' ? wishlist.length : null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleTabChange(id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </span>
                  {badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        active ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Nội dung chính bên phải */}
        <section className="lg:col-span-9 bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
          {/* Tab 1: Hồ sơ cá nhân */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
              <div className="pb-3 border-b border-slate-100">
                <h1 className="text-base font-extrabold text-slate-900">Hồ sơ cá nhân</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quản lý thông tin liên hệ và địa chỉ giao hàng mặc định.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Nhập họ tên của bạn"
                  className="w-full px-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="VD: 0901234567"
                  className="w-full px-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ mặc định</label>
                <textarea
                  rows={3}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200"
                />
              </div>

              {profileMsg.text && (
                <div
                  className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-[#16a34a]'
                      : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </form>
          )}

          {/* Tab 2: Đổi mật khẩu */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
              <div className="pb-3 border-b border-slate-100">
                <h1 className="text-base font-extrabold text-slate-900">Đổi mật khẩu</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Đặt mật khẩu mạnh tối thiểu 6 ký tự để bảo vệ tài khoản.
                </p>
              </div>

              {[
                { key: 'currentPassword', label: 'Mật khẩu cũ', placeholder: 'Nhập mật khẩu hiện tại' },
                { key: 'newPassword', label: 'Mật khẩu mới', placeholder: 'Nhập mật khẩu mới (>= 6 ký tự)' },
                { key: 'confirmPassword', label: 'Xác nhận mật khẩu mới', placeholder: 'Nhập lại mật khẩu mới' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {field.label} *
                  </label>
                  <input
                    type="password"
                    required
                    value={pwdForm[field.key]}
                    onChange={(e) => setPwdForm({ ...pwdForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3.5 py-2 text-sm bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-rose-600 transition-all duration-200"
                  />
                </div>
              ))}

              {pwdMsg.text && (
                <div
                  className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                    pwdMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-[#16a34a]'
                      : 'bg-rose-50 border-rose-200 text-rose-600'
                  }`}
                >
                  {pwdMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{pwdMsg.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200"
              >
                <Lock className="w-4 h-4" />
                <span>Cập nhật mật khẩu</span>
              </button>
            </form>
          )}

          {/* Tab 3: Đơn hàng của tôi */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h1 className="text-base font-extrabold text-slate-900">Đơn hàng của tôi</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Theo dõi lịch sử và trạng thái các đơn hàng đã đặt.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                  {userOrders.length} đơn hàng
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Bạn chưa có đơn hàng nào</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all duration-200"
                  >
                    Khám phá Gaming Gear
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-[#f8fafc]">
                        <th className="py-2.5 px-3 rounded-tl-lg">Mã đơn</th>
                        <th className="py-2.5 px-3">Ngày đặt</th>
                        <th className="py-2.5 px-3">Sản phẩm</th>
                        <th className="py-2.5 px-3">Tổng tiền</th>
                        <th className="py-2.5 px-3 rounded-tr-lg">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {userOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-[#f8fafc] transition-all duration-200">
                          <td className="py-3 px-3 font-bold text-slate-900">{order._id}</td>
                          <td className="py-3 px-3 text-slate-600">{formatDate(order.createdAt)}</td>
                          <td className="py-3 px-3 text-slate-600">
                            {order.items?.length || 0} sản phẩm ({order.paymentMethod || 'COD'})
                          </td>
                          <td className="py-3 px-3 font-bold text-rose-600">
                            {formatVND(order.totalAmount)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                                STATUS_BADGE[order.status] || STATUS_BADGE.Pending
                              }`}
                            >
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Danh sách yêu thích (Wishlist) */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h1 className="text-base font-extrabold text-slate-900">Danh sách yêu thích</h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Các sản phẩm bạn đã lưu để mua sau.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                  {wishlist.length} sản phẩm
                </span>
              </div>

              {wishlistNotice && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600">
                  {wishlistNotice}
                </div>
              )}

              {wishlist.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">Danh sách yêu thích đang trống</p>
                  <Link
                    to="/catalog"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all duration-200"
                  >
                    Tìm sản phẩm yêu thích
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {wishlist.map((product) => {
                    const inStock = (product.stock || 0) > 0;
                    return (
                      <div key={product._id} className="flex flex-col gap-2">
                        <ProductCard product={product} />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => toggleWishlist(product)}
                            className="py-2 px-2.5 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa</span>
                          </button>
                          <button
                            type="button"
                            disabled={!inStock}
                            onClick={() => handleMoveToCart(product)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
                              inStock
                                ? 'bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200'
                                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Sang giỏ</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default ProfilePage;
