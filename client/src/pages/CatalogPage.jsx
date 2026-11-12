import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  PackageSearch,
  X,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockProducts';

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under-2m', label: 'Dưới 2.000.000₫', min: 0, max: 2000000 },
  { id: '2m-4m', label: 'Từ 2 - 4 triệu', min: 2000000, max: 4000000 },
  { id: 'over-4m', label: 'Trên 4.000.000₫', min: 4000000, max: Infinity },
];

const SPEC_FILTERS = [
  { key: 'switchType', label: 'Loại Switch (switchType)' },
  { key: 'sensor', label: 'Mắt đọc (sensor)' },
  { key: 'dpi', label: 'Độ nhạy (DPI)' },
  { key: 'pollingRate', label: 'Polling Rate (Hz)' },
  { key: 'connection', label: 'Loại kết nối (connection)' },
];

const INITIAL_FILTERS = {
  keyword: '',
  category: '',
  brand: '',
  priceRange: 'all',
  switchType: '',
  sensor: '',
  dpi: '',
  pollingRate: '',
  connection: '',
};

const CatalogPage = ({
  products = mockProducts,
  initialCategory = '',
  initialKeyword = '',
  onSelectProduct,
}) => {
  const sourceProducts = products?.length ? products : mockProducts;

  const [filters, setFilters] = useState({
    ...INITIAL_FILTERS,
    category: initialCategory,
    keyword: initialKeyword,
  });
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setFilters((prev) => ({ ...prev, category: initialCategory }));
  }, [initialCategory]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, keyword: initialKeyword }));
  }, [initialKeyword]);

  // Trích xuất danh sách tùy chọn động từ dữ liệu sản phẩm
  const filterOptions = useMemo(() => {
    const getUnique = (extractor) =>
      Array.from(
        new Set(
          sourceProducts
            .map(extractor)
            .filter((val) => val && val !== 'N/A')
        )
      );

    return {
      categories: getUnique((p) => p.category),
      brands: getUnique((p) => p.brand),
      switchType: getUnique((p) => p.specs?.switchType),
      sensor: getUnique((p) => p.specs?.sensor),
      dpi: getUnique((p) => p.specs?.dpi),
      pollingRate: getUnique((p) => p.specs?.pollingRate),
      connection: getUnique((p) => p.specs?.connection),
    };
  }, [sourceProducts]);

  const updateFilter = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value && field !== 'keyword' && field !== 'priceRange' ? '' : value,
    }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSortBy('default');
  };

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, val]) => {
      if (key === 'priceRange') return val !== 'all';
      return Boolean(val && val.trim());
    }).length;
  }, [filters]);

  // Lọc kết hợp tức thì & sắp xếp
  const filteredProducts = useMemo(() => {
    const keywordNorm = filters.keyword.trim().toLowerCase();
    const selectedPrice =
      PRICE_RANGES.find((r) => r.id === filters.priceRange) || PRICE_RANGES[0];

    const matched = sourceProducts.filter((product) => {
      const specs = product.specs || {};

      if (keywordNorm) {
        const searchable = `${product.name} ${product.brand} ${product.category}`.toLowerCase();
        if (!searchable.includes(keywordNorm)) return false;
      }

      if (filters.category && product.category !== filters.category) return false;
      if (filters.brand && product.brand !== filters.brand) return false;

      const price = Number(product.price) || 0;
      if (price < selectedPrice.min || price > selectedPrice.max) return false;

      if (filters.switchType && specs.switchType !== filters.switchType) return false;
      if (filters.sensor && specs.sensor !== filters.sensor) return false;
      if (filters.dpi && specs.dpi !== filters.dpi) return false;
      if (filters.pollingRate && specs.pollingRate !== filters.pollingRate) return false;
      if (filters.connection && specs.connection !== filters.connection) return false;

      return true;
    });

    if (sortBy === 'price-asc') {
      return [...matched].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...matched].sort((a, b) => b.price - a.price);
    }
    return matched;
  }, [sourceProducts, filters, sortBy]);

  return (
    <main className="min-h-screen bg-[#f8fafc] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* CỘT TRÁI: SIDEBAR BỘ LỌC (Rộng 280px trên màn hình lớn) */}
          <aside className="w-full lg:w-[280px] shrink-0 bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-5 lg:sticky lg:top-6">
            {/* Header bộ lọc & Nút xóa bộ lọc */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-rose-600" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Bộ lọc tìm kiếm
                </h2>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={resetFilters}
                disabled={activeFilterCount === 0 && sortBy === 'default'}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 disabled:text-slate-300 disabled:cursor-not-allowed transition-all duration-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Xóa bộ lọc</span>
              </button>
            </div>

            {/* 1. Từ khóa tìm kiếm */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Từ khóa tìm kiếm
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => updateFilter('keyword', e.target.value)}
                  placeholder="Tên gear, hãng, danh mục..."
                  className="w-full pl-9 pr-8 py-2 text-xs bg-[#f8fafc] border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-rose-600 focus:bg-white transition-all duration-200"
                />
                {filters.keyword && (
                  <button
                    type="button"
                    onClick={() => updateFilter('keyword', '')}
                    aria-label="Xóa từ khóa"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 2. Danh mục */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Danh mục
              </span>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.categories.map((cat) => {
                  const active = filters.category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => updateFilter('category', cat)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                        active
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-[#f8fafc] text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Thương hiệu */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Thương hiệu
              </span>
              <div className="flex flex-wrap gap-1.5">
                {filterOptions.brands.map((brand) => {
                  const active = filters.brand === brand;
                  return (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => updateFilter('brand', brand)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all duration-200 ${
                        active
                          ? 'bg-rose-50 text-rose-600 border-rose-600 font-semibold'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      {brand}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Khoảng giá */}
            <div className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Khoảng giá
              </span>
              <div className="space-y-1.5">
                {PRICE_RANGES.map((range) => {
                  const active = filters.priceRange === range.id;
                  return (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => updateFilter('priceRange', range.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        active
                          ? 'bg-rose-50 border-rose-600 text-rose-600 font-semibold'
                          : 'bg-[#f8fafc] border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{range.label}</span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          active ? 'bg-rose-600' : 'bg-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5 - 9. Thông số kỹ thuật: switchType, sensor, dpi, pollingRate, connection */}
            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              <span className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                Thông số kỹ thuật (Specs)
              </span>

              {SPEC_FILTERS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    {label}
                  </label>
                  <select
                    value={filters[key]}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className={`w-full px-2.5 py-2 text-xs rounded-lg border transition-all duration-200 focus:outline-none focus:border-rose-600 ${
                      filters[key]
                        ? 'bg-blue-50/60 border-blue-300 text-blue-700 font-semibold'
                        : 'bg-[#f8fafc] border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="">Tất cả</option>
                    {filterOptions[key]?.map((optionVal) => (
                      <option key={optionVal} value={optionVal}>
                        {optionVal}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </aside>

          {/* CỘT PHẢI: THỐNG KÊ KẾT QUẢ, THANH SẮP XẾP & LƯỚI SẢN PHẨM */}
          <section className="flex-1 w-full space-y-4">
            {/* Thanh công cụ: Số lượng kết quả & Sắp xếp */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">
                  {filters.category || 'Tất cả Gaming Gear'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-bold">
                  {filteredProducts.length} sản phẩm
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sắp xếp:
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'default', label: 'Mặc định' },
                    { id: 'price-asc', label: 'Giá tăng dần' },
                    { id: 'price-desc', label: 'Giá giảm dần' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSortBy(option.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                        sortBy === option.id
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-[#f8fafc] text-slate-700 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lưới hiển thị ProductCard hoặc Trạng thái trống */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Không có sản phẩm nào khớp với tổ hợp bộ lọc hiện tại. Vui lòng thử điều chỉnh hoặc xóa bớt điều kiện lọc.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all duration-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Xóa bộ lọc</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default CatalogPage;

