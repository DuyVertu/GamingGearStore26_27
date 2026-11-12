# GAMINGGEAR STORE - GLOBAL RULES (LIGHT & MINIMALIST THEME)
- Zero conversational filler. Output ONLY code or minimal diffs (2 context lines).
- Split UI into modular components (<150 lines/file).
- Stack: React 18+ Vite SPA, TailwindCSS, Zustand (LocalStorage persist), Node.js v20+, Express, Mongoose (Indexed), JWT + bcryptjs (salt=10).
- UI Theme (GEARVN Modular Layout + Clean Light Mode):
  * Main Background: `#f8fafc` (Slate 50 - Nền xám trắng dịu mắt)
  * Card / Surface: `#ffffff` (Trắng tinh khiết cho khung sản phẩm, header)
  * Default Border: `#e2e8f0` (Viền xám mảnh tinh tế)
  * Text Primary: `#0f172a` (Đen xám đậm sắc nét), Secondary: `#64748b`
  * Primary Brand / Sale / CTA: `#e11d48` (Đỏ GEARVN hiện đại - Nút mua, Giá KM)
  * Technical Specs Badge / Active Filter: `#2563eb` (Xanh dương chuẩn công nghệ trên nền `#eff6ff`)
  * In-Stock Status: `#16a34a` (Xanh lá đậm)
  * Transitions: `transition-all duration-200` (150ms-350ms standard) kèm đổ bóng nhẹ `hover:shadow-md hover:-translate-y-0.5`.
- Product Specs Schema: `{ switchType, sensor, dpi, pollingRate, connection }`.
