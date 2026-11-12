import React from 'react';
import { Gamepad2, Search, Heart, ShoppingCart, User, LogOut, X } from 'lucide-react';
import { useStore } from '../store/useStore';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const Navbar = ({
  searchQuery = '',
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onNavigateHome,
}) => {
  const { cart, wishlist, user, logout } = useStore();

  const totalCartItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalCartAmount = cart.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  );
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo GamingGear Store */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-sm group-hover:bg-rose-700 transition-all duration-200">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-none">
              GAMING<span className="text-rose-600">GEAR</span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 tracking-wider uppercase">
              Pro Esports Store
            </span>
          </div>
        </button>

        {/* Thanh tìm kiếm từ khóa tức thì ở giữa */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Tìm chuột, bàn phím HE, tai nghe, switch, cảm biến..."
              className="w-full pl-10 pr-9 py-2 bg-[#f8fafc] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 transition-all duration-200"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange && onSearchChange('')}
                className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-md"
                aria-label="Xóa từ khóa"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Cụm nút bên phải: Wishlist, Giỏ hàng, Đăng nhập / Tài khoản */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Nút Wishlist */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative p-2.5 rounded-xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all duration-200"
            title="Danh sách yêu thích"
          >
            <Heart className="w-5 h-5 text-slate-700" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Nút Giỏ hàng (Badge số lượng + Tổng tiền) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#f8fafc] hover:bg-slate-100 border border-slate-200 text-slate-900 transition-all duration-200"
            title="Giỏ hàng"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-rose-600" />
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {totalCartItems}
              </span>
            </div>
            <div className="hidden md:flex flex-col items-start leading-tight pl-1">
              <span className="text-[11px] text-slate-500 font-medium">Giỏ hàng</span>
              <span className="text-xs font-bold text-rose-600">
                {formatVND(totalCartAmount)}
              </span>
            </div>
          </button>

          {/* Nút Đăng nhập / Tài khoản */}
          {user ? (
            <div className="flex items-center gap-1.5 pl-2 pr-1.5 py-1.5 rounded-xl bg-[#f8fafc] border border-slate-200">
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-2 text-left px-1.5 py-0.5 rounded-lg hover:bg-slate-200/60 transition-all duration-200"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                  {user.name || user.email || 'Tài khoản'}
                </span>
              </button>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

