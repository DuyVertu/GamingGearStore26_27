import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Truck,
  RefreshCw,
  Rotate3d,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  Cpu,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';

const PLACEHOLDER_IMG = 'https://placehold.co/400x400/f1f5f9/0f172a?text=Gaming+Gear';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

const SPEC_ROWS = [
  { key: 'switchType', label: 'Loại Switch' },
  { key: 'sensor', label: 'Mắt đọc Sensor' },
  { key: 'dpi', label: 'Độ phân giải DPI' },
  { key: 'pollingRate', label: 'Polling Rate' },
  { key: 'connection', label: 'Chuẩn kết nối' },
];

const ProductDetailContent = ({ product, products }) => {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlist } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [is360Mode, setIs360Mode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const dragStartX = useRef(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product._id]);

  const {
    _id,
    name,
    brand,
    category,
    price = 0,
    originalPrice = 0,
    stock = 0,
    images = [],
    specs = {},
  } = product;

  const gallery = images.length > 0 ? images : [PLACEHOLDER_IMG];
  const inStock = stock > 0;
  const isWishlisted = wishlist.some((item) => item._id === _id);
  const discountPercent =
    originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const relatedProducts = products
    .filter((item) => item.category === category && item._id !== _id)
    .slice(0, 4);

  const handleImageError = (e) => {
    e.currentTarget.src = PLACEHOLDER_IMG;
  };

  const handleDecreaseQty = () => setQty((prev) => Math.max(1, prev - 1));
  const handleIncreaseQty = () => setQty((prev) => Math.min(stock, prev + 1));

  const handleAddToCart = () => {
    if (!inStock) return;
    const res = addToCart(product, qty);
    setFeedback({ type: res.success ? 'success' : 'error', text: res.message });
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    const res = addToCart(product, qty);
    if (res.success) {
      navigate('/checkout');
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handlePointerDown = (e) => {
    if (!is360Mode) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!is360Mode || !isDragging) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = e.clientX;
    setRotation((prev) => (prev + delta * 1.2 + 360) % 360);
  };

  const handlePointerUp = () => setIsDragging(false);

  const toggle360Mode = () => {
    setIs360Mode((prev) => !prev);
    setRotation(0);
    setIsDragging(false);
  };

  const activeImageSrc = is360Mode && gallery.length > 1
    ? gallery[Math.floor((rotation / 360) * gallery.length) % gallery.length]
    : gallery[selectedImageIdx] || PLACEHOLDER_IMG;

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link to="/" className="hover:text-rose-600 transition-all duration-200">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/catalog" className="hover:text-rose-600 transition-all duration-200">
            {category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium truncate max-w-md">{name}</span>
        </nav>

        {/* Bố cục 2 cột phía trên */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 lg:p-7">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Cột trái: Khung ảnh lớn + Thumbnails + Chế độ xoay 360° */}
            <div className="lg:col-span-5 space-y-3">
              <div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                style={{ perspective: '1000px' }}
                className={`relative aspect-square w-full bg-[#f8fafc] border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center select-none ${
                  is360Mode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
                }`}
              >
                <img
                  src={activeImageSrc}
                  alt={name}
                  draggable={false}
                  onError={handleImageError}
                  style={
                    is360Mode
                      ? { transform: `rotateY(${rotation}deg)`, transformStyle: 'preserve-3d' }
                      : undefined
                  }
                  className="w-full h-full object-cover object-center transition-transform duration-75"
                />

                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold shadow-sm">
                    -{discountPercent}%
                  </span>
                )}

                <button
                  type="button"
                  onClick={toggle360Mode}
                  className={`absolute top-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 shadow-sm ${
                    is360Mode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white/95 text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  <Rotate3d className="w-4 h-4" />
                  <span>{is360Mode ? 'Tắt 360°' : 'Xem 360°'}</span>
                </button>

                {is360Mode && (
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-3 shadow-sm">
                    <span className="text-[11px] font-semibold text-blue-600 whitespace-nowrap">
                      Góc {Math.round(rotation)}°
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={Math.round(rotation)}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      aria-label="Xoay góc 360 độ"
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setIs360Mode(false);
                      setSelectedImageIdx(idx);
                    }}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 bg-[#f8fafc] transition-all duration-200 ${
                      !is360Mode && selectedImageIdx === idx
                        ? 'border-rose-600 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${name} - ${idx + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin sản phẩm, Giá, Số lượng & Cụm 3 nút hành động */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
                      {brand}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{category}</span>
                  </div>

                  {inStock ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-[#16a34a] text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      Còn {stock} sản phẩm
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold">
                      <XCircle className="w-4 h-4" />
                      Hết hàng
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-slate-900 leading-snug">{name}</h1>

                {/* Giá khuyến mãi + Giá gốc + % giảm */}
                <div className="bg-[#f8fafc] border border-slate-200 rounded-xl p-4 flex items-baseline flex-wrap gap-3">
                  <span className="text-3xl font-bold text-rose-600">{formatVND(price)}</span>
                  {originalPrice > price && (
                    <>
                      <span className="text-base text-slate-400 line-through">
                        {formatVND(originalPrice)}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-xs font-bold">
                        -{discountPercent}%
                      </span>
                    </>
                  )}
                </div>

                {/* Tag thông số nổi bật */}
                <div className="flex flex-wrap gap-2">
                  {Object.values(specs)
                    .filter((val) => val && val !== 'N/A')
                    .slice(0, 4)
                    .map((val, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium"
                      >
                        {val}
                      </span>
                    ))}
                </div>

                {/* Bộ chọn số lượng */}
                <div className="flex items-center gap-4 pt-1">
                  <span className="text-sm font-semibold text-slate-700">Số lượng:</span>
                  <div className="inline-flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecreaseQty}
                      disabled={!inStock || qty <= 1}
                      aria-label="Giảm số lượng"
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-11 text-center text-sm font-bold text-slate-900 select-none">
                      {inStock ? qty : 0}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncreaseQty}
                      disabled={!inStock || qty >= stock}
                      aria-label="Tăng số lượng"
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {inStock && (
                    <span className="text-xs text-slate-400">Tối đa {stock} sản phẩm</span>
                  )}
                </div>

                {feedback && (
                  <div
                    className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold border ${
                      feedback.type === 'success'
                        ? 'bg-green-50 text-[#16a34a] border-green-200'
                        : 'bg-rose-50 text-rose-600 border-rose-200'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}
              </div>

              {/* Cụm 3 nút hành động */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={handleBuyNow}
                    className={`flex-1 py-3 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                      inStock
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>MUA NGAY</span>
                  </button>

                  <button
                    type="button"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all duration-200 ${
                      inStock
                        ? 'bg-white border-rose-600 text-rose-600 hover:bg-rose-50 cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Thêm vào giỏ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-label="Thêm vào yêu thích"
                    className={`py-3 px-4 rounded-xl border flex items-center justify-center gap-1.5 text-sm font-semibold transition-all duration-200 ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-300 text-rose-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Cam kết nhanh */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Bảo hành 24 tháng</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2">
                    <RefreshCw className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>1 đổi 1 trong 30 ngày</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 bg-[#f8fafc] border border-slate-200 rounded-lg px-3 py-2">
                    <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Giao nhanh toàn quốc</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực phía dưới chia 2 cột: Trái 60% / Phải 40% */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 items-start">
          {/* Trái (60%): Đặc điểm nổi bật & Chính sách bảo hành 24 tháng */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-rose-600" />
                Đặc điểm nổi bật
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                <strong className="text-slate-900">{name}</strong> đến từ thương hiệu{' '}
                <strong className="text-slate-900">{brand}</strong> được tối ưu chuyên biệt cho
                game thủ eSports cần độ chính xác cao, tốc độ phản hồi tức thì và độ bền vượt trội
                trong mọi trận đấu cường độ cao.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                  <span>
                    Trang bị <strong>{specs.switchType || 'linh kiện cao cấp'}</strong> cho cảm giác
                    phản hồi sắc nét và tuổi thọ bền bỉ.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                  <span>
                    Hiệu năng ổn định với <strong>{specs.pollingRate || 'tần số quét cao'}</strong>{' '}
                    và chuẩn kết nối <strong>{specs.connection || 'đa chế độ'}</strong> độ trễ thấp.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a] mt-0.5 shrink-0" />
                  <span>
                    Thiết kế công thái học chuẩn Gaming Gear, hoàn thiện tỉ mỉ phù hợp nhiều phong
                    cách cầm nắm và setup tối giản.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-5 border-t border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Chính sách bảo hành chính hãng 24 tháng
              </h3>
              <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-2 text-sm text-slate-700">
                <p>• Cam kết sản phẩm chính hãng 100% nguyên seal, đầy đủ tem nhãn nhà phân phối.</p>
                <p>• Bảo hành chính hãng <strong>24 tháng</strong> theo tiêu chuẩn của {brand}.</p>
                <p>• Hỗ trợ <strong>1 đổi 1 trong 30 ngày</strong> đầu tiên nếu phát sinh lỗi phần cứng từ nhà sản xuất.</p>
                <p>• Miễn phí vệ sinh, kiểm tra và hỗ trợ cập nhật firmware trọn đời tại cửa hàng.</p>
              </div>
            </div>
          </div>

          {/* Phải (40%): Bảng thông số kỹ thuật chuẩn gaming gear */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-blue-600" />
              Thông số kỹ thuật
            </h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {SPEC_ROWS.map((row, idx) => (
                    <tr
                      key={row.key}
                      className={idx % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'}
                    >
                      <th className="py-3 px-4 font-semibold text-slate-600 w-2/5 border-b border-slate-100">
                        {row.label}
                      </th>
                      <td className="py-3 px-4 font-medium text-slate-900 border-b border-slate-100">
                        <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-semibold">
                          {specs[row.key] || 'Đang cập nhật'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cuối trang: Sản phẩm liên quan (tối đa 4 sản phẩm cùng category) */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Sản phẩm liên quan</h2>
            <Link
              to="/catalog"
              className="text-xs font-semibold text-blue-600 hover:text-rose-600 transition-all duration-200"
            >
              Xem tất cả →
            </Link>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                  onSelectProduct={(selected) => navigate(`/product/${selected._id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
              Chưa có thêm sản phẩm khác trong danh mục {category}.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const ProductDetailPage = ({ products = mockProducts }) => {
  const { id } = useParams();
  const product = products.find((item) => item._id === id);

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-[#f8fafc] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy sản phẩm</h1>
          <p className="text-sm text-slate-500 mb-6">
            Sản phẩm bạn đang tìm không tồn tại hoặc đã ngừng kinh doanh.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh mục
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetailContent key={product._id} product={product} products={products} />;
};

export default ProductDetailPage;
