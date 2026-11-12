import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, MapPin, CreditCard, ClipboardCheck, AlertCircle, CheckCircle2, QrCode } from 'lucide-react';
import { useStore } from '../store/useStore';

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f1f5f9/0f172a?text=Gaming+Gear';
const QR_SAMPLE = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=GEARVN-BANK-TRANSFER-DEMO';
const formatVND = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const CheckoutPage = ({ onNavigateAuth, onOrderCreated }) => {
  const { cart, user, updateCartQty, removeFromCart, clearCart } = useStore();
  const [shipping, setShipping] = useState({ fullName: user?.name || '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [authPrompt, setAuthPrompt] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!user) return setAuthPrompt(true);
    if (!shipping.fullName.trim() || !shipping.phone.trim() || !shipping.address.trim()) {
      return setErrorMsg('Vui lòng điền đầy đủ Họ tên, SĐT và Địa chỉ nhận hàng ở Bước 1.');
    }
    if (cart.length === 0) return;

    const updatedStockItems = cart.map((item) => ({ ...item, stock: Math.max(0, (item.stock || 0) - (item.qty || 1)) }));
    const newOrder = {
      _id: `ORD-${Date.now().toString().slice(-6)}`,
      user: { _id: user._id, name: user.name, role: user.role },
      items: updatedStockItems,
      shippingAddress: shipping,
      paymentMethod,
      totalAmount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    try {
      const saved = JSON.parse(localStorage.getItem('gaminggear-orders') || '[]');
      localStorage.setItem('gaminggear-orders', JSON.stringify([newOrder, ...saved]));
    } catch {}
    setCreatedOrder(newOrder);
    clearCart();
    if (onOrderCreated) onOrderCreated(newOrder);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
            <h1 className="text-lg font-extrabold text-slate-900">Giỏ Hàng & Thanh Toán One-Page</h1>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">{totalItems} món</span>
          </div>
          {cart.length > 0 && <button type="button" onClick={clearCart} className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-all duration-200">Xóa toàn bộ giỏ</button>}
        </div>

        {authPrompt && !user && (
          <div className="bg-white border-2 border-rose-600 rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-rose-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-xs sm:text-sm font-bold">Bạn cần đăng nhập tài khoản trước khi xác nhận thanh toán đơn hàng!</p>
            </div>
            <button type="button" onClick={() => onNavigateAuth && onNavigateAuth()} className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase transition-all duration-200">Chuyển sang trang Đăng nhập</button>
          </div>
        )}

        {createdOrder && (
          <div className="bg-white border border-emerald-300 rounded-xl shadow-sm p-4 space-y-1">
            <div className="flex items-center gap-2 text-[#16a34a] font-extrabold text-sm"><CheckCircle2 className="w-5 h-5" /><span>Đặt hàng thành công! Mã đơn: {createdOrder._id} (Trạng thái: {createdOrder.status})</span></div>
            <p className="text-xs text-slate-600">Người nhận: <strong>{createdOrder.shippingAddress.fullName}</strong> - {createdOrder.shippingAddress.phone} | Đã trừ tồn kho ({createdOrder.items.length} món).</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-4">
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Giỏ hàng của bạn</h2>
              {cart.length === 0 ? <p className="text-xs text-slate-500 py-4 text-center">Giỏ hàng đang trống.</p> : (
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item._id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={item.images?.[0] || PLACEHOLDER_IMG} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{item.name}</h3>
                          <p className="text-xs font-bold text-rose-600">{formatVND(item.price)} <span className="text-[11px] text-[#16a34a] font-medium ml-2">Kho: {item.stock}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button type="button" onClick={() => updateCartQty(item._id, item.qty - 1)} className="p-1 rounded border border-slate-200 hover:bg-slate-100"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button type="button" disabled={item.qty >= item.stock} onClick={() => updateCartQty(item._id, item.qty + 1)} className="p-1 rounded border border-slate-200 hover:bg-slate-100 disabled:opacity-40"><Plus className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => removeFromCart(item._id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Bước 1: Địa chỉ nhận hàng (Shipping Address)</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Họ và tên người nhận *" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} className="px-3 py-2 text-xs bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600" />
                <input type="tel" placeholder="Số điện thoại *" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} className="px-3 py-2 text-xs bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600" />
              </div>
              <input type="text" placeholder="Địa chỉ nhận hàng chi tiết *" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} className="w-full px-3 py-2 text-xs bg-[#f8fafc] border border-slate-200 rounded-lg focus:outline-none focus:border-rose-600" />
            </section>

            <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-rose-600" /><h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Bước 2: Phương thức thanh toán (Payment Method)</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[{ id: 'COD', title: 'Thanh toán khi nhận hàng (COD)', desc: 'Kiểm tra hàng trước khi thanh toán' }, { id: 'BANK', title: 'Chuyển khoản Ngân hàng (QR)', desc: 'Quét mã VietQR tự động điền nội dung' }].map((m) => (
                  <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)} className={`p-3 rounded-xl border text-left transition-all duration-200 ${paymentMethod === m.id ? 'bg-rose-50/70 border-rose-600' : 'bg-[#f8fafc] border-slate-200'}`}>
                    <p className="text-xs font-bold text-slate-900">{m.title}</p><p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                  </button>
                ))}
              </div>
              {paymentMethod === 'BANK' && (
                <div className="p-3 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center gap-4">
                  <img src={QR_SAMPLE} alt="QR Mẫu" className="w-20 h-20 rounded-lg border border-slate-200 bg-white p-1 shrink-0" />
                  <div className="text-xs space-y-0.5 text-slate-700">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[11px]"><QrCode className="w-3 h-3" /> VietQR Mẫu</span>
                    <p className="font-bold text-slate-900">Vietcombank - STK: 1029384756 (GAMINGGEAR STORE)</p>
                    <p>Số tiền: <strong className="text-rose-600">{formatVND(totalAmount)}</strong></p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <form onSubmit={handleConfirmOrder} className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4 lg:sticky lg:top-20">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100"><ClipboardCheck className="w-5 h-5 text-rose-600" /><h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">Bước 3: Tóm tắt đơn hàng (Review Order)</h2></div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item._id} className="py-2 flex items-center justify-between text-xs">
                  <span className="text-slate-700 font-medium truncate max-w-[200px]">{item.name} <strong className="text-blue-600">x{item.qty}</strong></span>
                  <span className="font-bold text-slate-900">{formatVND(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500"><span>Thanh toán:</span><strong className="text-slate-800">{paymentMethod}</strong></div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2"><span>Tổng tiền:</span><span className="text-rose-600">{formatVND(totalAmount)}</span></div>
            </div>
            {errorMsg && <p className="text-xs font-semibold text-rose-600">{errorMsg}</p>}
            <button type="submit" disabled={cart.length === 0} className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm transition-all duration-200 cursor-pointer">
              Xác nhận đặt hàng ({totalItems} món)
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
