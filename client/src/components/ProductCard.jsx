import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f1f5f9/0f172a?text=Gaming+Gear';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart, toggleWishlist, wishlist } = useStore();

  if (!product) return null;

  const {
    _id,
    name,
    brand,
    price = 0,
    originalPrice = 0,
    stock = 0,
    images = [],
    specs = {},
  } = product;

  const inStock = stock > 0;
  const isWishlisted = wishlist.some((item) => item._id === _id);

  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const specTags = [specs.sensor, specs.pollingRate, specs.switchType].filter(
    (val) => val && val !== 'N/A'
  );

  const handleImageError = (e) => {
    e.currentTarget.src = PLACEHOLDER_IMG;
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Khung ảnh + Badge giảm giá + Nút Wishlist */}
      <div className="relative aspect-square w-full bg-[#f8fafc] overflow-hidden border-b border-slate-100">
        <Link to={`/product/${product._id}`} className="block w-full h-full">
          <img
            src={images?.[0] || PLACEHOLDER_IMG}
            alt={name}
            onError={handleImageError}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-200 cursor-pointer"
            loading="lazy"
          />
        </Link>

        {/* Badge % giảm giá màu đỏ */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-xs font-bold shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Nút thả tim Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label="Yêu thích"
          className={`absolute top-2.5 right-2.5 p-2 rounded-full border transition-all duration-200 shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 border-rose-200 text-rose-600'
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
      </div>

      {/* Nội dung thông tin sản phẩm */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
        <div>
          {/* Thương hiệu & Trạng thái tồn kho */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {brand}
            </span>
            {inStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Còn hàng ({stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <XCircle className="w-3.5 h-3.5" />
                Hết hàng
              </span>
            )}
          </div>

          {/* Tên sản phẩm */}
          <Link to={`/product/${product._id}`} className="block">
            <h3
              className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[2.5rem] hover:text-rose-600 transition-all duration-200 cursor-pointer"
              title={name}
            >
              {name}
            </h3>
          </Link>

          {/* Cụm tag thông số kỹ thuật màu xanh dương nhạt */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {specTags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-medium truncate max-w-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Giá bán & Nút thêm vào giỏ */}
        <div className="pt-2 border-t border-slate-100 mt-1">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-base font-bold text-rose-600">{formatVND(price)}</span>
            {originalPrice > price && (
              <span className="text-xs text-slate-400 line-through">
                {formatVND(originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!inStock}
            onClick={() => inStock && addToCart(product, 1)}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              inStock
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{inStock ? 'Thêm vào giỏ' : 'Tạm hết hàng'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

