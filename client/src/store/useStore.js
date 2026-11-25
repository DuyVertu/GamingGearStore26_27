import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mockProducts } from '../data/mockProducts';

const CART_KEY = 'gaminggear-cart';
const WISHLIST_KEY = 'gaminggear-wishlist';
const AUTH_KEY = 'gaminggear-auth';
const ORDERS_KEY = 'gaminggear-orders';
const PRODUCTS_KEY = 'gaminggear-products';

const multiKeyStorage = {
  getItem: (name) => {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      const wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || '{"user":null,"token":null}');
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const productsRaw = localStorage.getItem(PRODUCTS_KEY);
      const products = productsRaw ? JSON.parse(productsRaw) : null;
      const raw = localStorage.getItem(name);
      const base = raw ? JSON.parse(raw) : { state: {}, version: 0 };
      return JSON.stringify({
        ...base,
        state: {
          ...base.state,
          products:
            Array.isArray(products) && products.length
              ? products
              : base.state?.products?.length
                ? base.state.products
                : mockProducts,
          cart: Array.isArray(cart) ? cart : base.state?.cart || [],
          wishlist: Array.isArray(wishlist) ? wishlist : base.state?.wishlist || [],
          orders: Array.isArray(orders) ? orders : base.state?.orders || [],
          user: auth?.user ?? base.state?.user ?? null,
          token: auth?.token ?? base.state?.token ?? null,
        },
      });
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
      const parsed = JSON.parse(value);
      const state = parsed?.state || {};
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(state.products || mockProducts));
      localStorage.setItem(CART_KEY, JSON.stringify(state.cart || []));
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist || []));
      localStorage.setItem(ORDERS_KEY, JSON.stringify(state.orders || []));
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ user: state.user || null, token: state.token || null })
      );
    } catch {
      // Ignore storage quota errors
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(WISHLIST_KEY);
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(AUTH_KEY);
  },
};

export const useStore = create(
  persist(
    (set, get) => ({
      products: mockProducts,
      cart: [],
      wishlist: [],
      orders: [],
      user: null,
      token: null,

      addToCart: (product, qty = 1) => {
        if (!product || product.stock <= 0 || qty <= 0) {
          return { success: false, message: 'Sản phẩm đã hết hàng' };
        }
        const { cart } = get();
        const existingItem = cart.find((item) => item._id === product._id);
        const currentQty = existingItem ? existingItem.qty : 0;

        if (currentQty + qty > product.stock) {
          return {
            success: false,
            message: `Số lượng vượt quá tồn kho (Còn ${product.stock} sản phẩm)`,
          };
        }

        const updatedCart = existingItem
          ? cart.map((item) =>
              item._id === product._id ? { ...item, qty: item.qty + qty } : item
            )
          : [...cart, { ...product, qty }];

        set({ cart: updatedCart });
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
      },

      updateCartQty: (productId, qty) => {
        const { cart } = get();
        const target = cart.find((item) => item._id === productId);
        if (!target) return;
        if (qty <= 0) {
          set({ cart: cart.filter((item) => item._id !== productId) });
          return;
        }
        const safeQty = Math.min(qty, target.stock);
        set({
          cart: cart.map((item) =>
            item._id === productId ? { ...item, qty: safeQty } : item
          ),
        });
      },

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== productId),
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((item) => item._id === product._id);
          return {
            wishlist: exists
              ? state.wishlist.filter((item) => item._id !== product._id)
              : [...state.wishlist, product],
          };
        }),

      mergeGuestCart: (serverCart = []) => {
        const { cart: guestCart } = get();
        const mergedMap = new Map();

        serverCart.forEach((item) => {
          if (item && item.stock > 0) {
            mergedMap.set(item._id, { ...item, qty: Math.min(item.qty || 1, item.stock) });
          }
        });

        guestCart.forEach((guestItem) => {
          if (!guestItem || guestItem.stock <= 0) return;
          if (mergedMap.has(guestItem._id)) {
            const existing = mergedMap.get(guestItem._id);
            const combinedQty = Math.min(existing.qty + guestItem.qty, guestItem.stock);
            mergedMap.set(guestItem._id, { ...existing, qty: combinedQty });
          } else {
            mergedMap.set(guestItem._id, {
              ...guestItem,
              qty: Math.min(guestItem.qty || 1, guestItem.stock),
            });
          }
        });

        const mergedCart = Array.from(mergedMap.values());
        set({ cart: mergedCart });
        return mergedCart;
      },

      login: (userData, token, serverCart = []) => {
        set({ user: userData, token });
        get().mergeGuestCart(serverCart);
      },

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      createOrder: (orderData = {}) => {
        const { cart, user, orders, products, clearCart } = get();
        const items = orderData.items || cart;
        const totalAmount =
          orderData.totalAmount ??
          items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);

        const newOrder = {
          _id: `ORD-${Date.now().toString().slice(-6)}`,
          user:
            orderData.user ||
            (user ? { _id: user._id, name: user.name, email: user.email, role: user.role } : null),
          items,
          shippingAddress: orderData.shippingAddress,
          paymentMethod: orderData.paymentMethod || 'COD',
          totalAmount,
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };

        const updatedProducts = products.map((p) => {
          const ordered = items.find((item) => item._id === p._id);
          return ordered
            ? { ...p, stock: Math.max(0, (p.stock || 0) - (ordered.qty || 1)) }
            : p;
        });

        set({
          orders: [newOrder, ...orders],
          products: updatedProducts,
        });
        clearCart();
        return newOrder;
      },

      updateOrderStatus: (orderId, newStatus) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          ),
        })),

      syncOrders: () => {
        try {
          const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
          if (Array.isArray(saved)) {
            set({ orders: saved });
          }
        } catch {
          // Ignore parse errors
        }
      },

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'gaminggear-store',
      storage: createJSONStorage(() => multiKeyStorage),
    }
  )
);

export default useStore;

