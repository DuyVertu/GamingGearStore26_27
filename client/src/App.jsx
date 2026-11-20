import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { Shield, LayoutGrid, Home } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetailPage from './pages/ProductDetailPage';
import { mockProducts } from './data/mockProducts';
import { useStore } from './store/useStore';

const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useStore();
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    if (location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenCart={() => navigate('/checkout')}
        onOpenWishlist={() => navigate('/catalog')}
        onOpenAuth={() => navigate('/auth')}
        onNavigateHome={() => {
          setSelectedCategory('');
          setSearchQuery('');
          navigate('/');
        }}
      />

      {/* Thanh điều hướng phụ chuẩn GEARVN Light Mode */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-rose-600 flex items-center gap-1 transition-all duration-200">
              <Home className="w-3.5 h-3.5" />
              <span>Trang chủ</span>
            </Link>
            <Link to="/catalog" className="hover:text-rose-600 flex items-center gap-1 transition-all duration-200">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Danh mục & Bộ lọc</span>
            </Link>
            <Link to="/checkout" className="hover:text-rose-600 transition-all duration-200">
              Thanh toán One-Page
            </Link>
          </div>
          {user?.role === 'Owner' && (
            <Link
              to="/admin"
              className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-rose-600 hover:text-white font-bold flex items-center gap-1 transition-all duration-200"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Quản trị Owner (/admin)</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={() => navigate('/catalog')}
              />
            }
          />
          <Route
            path="/catalog"
            element={
              <CatalogPage
                products={products}
                initialCategory={selectedCategory}
                initialKeyword={searchQuery}
              />
            }
          />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route
            path="/auth"
            element={
              <AuthPage
                onSuccess={(u) => navigate(u?.role === 'Owner' ? '/admin' : '/')}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                onNavigateAuth={() => navigate('/auth')}
              />
            }
          />
          <Route
            path="/admin"
            element={
              <AdminDashboard
                products={products}
                setProducts={setProducts}
              />
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;
