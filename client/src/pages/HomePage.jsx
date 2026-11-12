import React, { useMemo } from 'react';
import { Mouse, Keyboard, Headphones, Layers, Zap, ChevronRight, Flame, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';

const CATEGORIES = [
  { id: 'Chuột', label: 'Chuột Gaming', sub: 'Siêu nhẹ, 4K/8KHz', icon: Mouse },
  { id: 'Bàn phím', label: 'Bàn phím cơ', sub: 'Hall Effect, Rapid Trigger', icon: Keyboard },
  { id: 'Tai nghe', label: 'Tai nghe', sub: 'Wireless, 7.1 Surround', icon: Headphones },
  { id: 'Lót chuột', label: 'Lót chuột', sub: 'Esports Speed / Control', icon: Layers },
];

const SUB_BANNERS = [
  { id: 'Bàn phím', tag: 'Rapid Trigger 0.1mm', tagBg: 'bg-blue-600', title: 'Bàn Phím Cơ Hall Effect', sub: 'Wooting, Akko HE, ASUS ROG', img: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80' },
  { id: 'Tai nghe', tag: 'Ưu đãi đến 20%', tagBg: 'bg-rose-600', title: 'Tai Nghe Wireless Pro', sub: 'HyperX Cloud III, BlackShark V2', img: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=600&q=80' },
];

const HomePage = ({ products = mockProducts, onSelectCategory, onSelectProduct }) => {
  const list = products?.length ? products : mockProducts;
  const goCategory = (cat) => onSelectCategory && onSelectCategory(cat);

  const flashSaleProducts = useMemo(() => {
    const getDiscount = (p) => (p.originalPrice > p.price ? (p.originalPrice - p.price) / p.originalPrice : 0);
    return [...list].sort((a, b) => getDiscount(b) - getDiscount(a)).slice(0, 4);
  }, [list]);

  const sections = useMemo(
    () => [
      { id: 'Chuột', title: 'Chuột Gaming Nổi Bật', badge: '4000Hz / 8000Hz Wireless', icon: Flame, items: list.filter((p) => p.category === 'Chuột').slice(0, 4) },
      { id: 'Bàn phím', title: 'Bàn Phím Cơ Hall Effect / Custom', badge: 'Rapid Trigger & Hot-swap', icon: Sparkles, items: list.filter((p) => p.category === 'Bàn phím').slice(0, 4) },
    ],
    [list]
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. KHỐI HERO: Sidebar Danh mục (Trái) + Banner Lớn (Giữa) + 2 Banner Phụ (Phải) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-3 flex flex-col justify-between">
            <div className="px-2.5 py-2 border-b border-slate-100 mb-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Danh mục sản phẩm</span>
            </div>
            <nav className="flex-1 flex flex-col justify-around divide-y divide-slate-100">
              {CATEGORIES.map(({ id, label, sub, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => goCategory(id)}
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-rose-50/70 group transition-all duration-200 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600 transition-all duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-all duration-200">{label}</p>
                      <p className="text-[11px] text-slate-500">{sub}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </nav>
          </aside>

          <div className="lg:col-span-6 relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-end group">
            <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80" alt="Pro Esports Gaming Gear" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-200" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
            <div className="relative z-10 p-6 sm:p-8 text-white space-y-3 max-w-lg">
              <span className="inline-block px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">GEARVN Esports Series</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">Vũ Khí Tối Thượng Cho Mọi Tựa Game FPS</h1>
              <p className="text-xs sm:text-sm text-slate-200">Trải nghiệm Polling Rate 8000Hz & Switch Từ Tính Rapid Trigger thế hệ mới.</p>
              <button type="button" onClick={() => goCategory('Chuột')} className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all duration-200">
                Khám phá ngay
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {SUB_BANNERS.map((b) => (
              <div key={b.id} onClick={() => goCategory(b.id)} className="relative bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5 flex flex-col justify-end min-h-[160px] cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <img src={b.img} alt={b.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-transparent" />
                <div className="relative z-10 text-white">
                  <span className={`px-2 py-0.5 rounded ${b.tagBg} text-[10px] font-bold uppercase`}>{b.tag}</span>
                  <h3 className="text-base font-bold mt-1.5">{b.title}</h3>
                  <p className="text-xs text-slate-200">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. KHỐI FLASH SALE: Khung viền đỏ nổi bật hiển thị 4 sản phẩm giảm giá sâu nhất */}
        <section className="bg-white border-2 border-rose-600 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-rose-600 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <h2 className="text-lg font-extrabold uppercase tracking-wide">Flash Sale Giá Sốc Hôm Nay</h2>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-semibold">Top 4 Deal Giảm Sâu Nhất</span>
            </div>
            <button type="button" onClick={() => goCategory('')} className="text-xs font-bold bg-white text-rose-600 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-all duration-200 flex items-center gap-1">
              <span>Xem tất cả</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleProducts.map((product) => (
              <ProductCard key={product._id} product={product} onSelectProduct={onSelectProduct} />
            ))}
          </div>
        </section>

        {/* 3. KHỐI DANH MỤC RIÊNG BIỆT: Chuột nổi bật & Phím cơ Hall Effect / Custom (Lưới 4 cột) */}
        {sections.map(({ id, title, badge, icon: SectionIcon, items }) => (
          <section key={id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <SectionIcon className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">{badge}</span>
              </div>
              <button type="button" onClick={() => goCategory(id)} className="text-xs font-semibold text-blue-600 hover:text-rose-600 flex items-center gap-1 transition-all duration-200">
                <span>Xem tất cả {id}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {items.map((product) => (
                <ProductCard key={product._id} product={product} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default HomePage;
