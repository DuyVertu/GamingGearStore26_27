/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        gear: {
          bg: '#f8fafc',       // Nền trang chủ sáng dịu
          card: '#ffffff',     // Nền thẻ sản phẩm trắng
          border: '#e2e8f0',   // Viền mảnh
          text: '#0f172a',     // Chữ chính đậm
          muted: '#64748b',    // Chữ phụ / giá gốc gạch ngang
          primary: '#e11d48',  // Đỏ điểm nhấn (CTA, Flash Sale, Giá giảm)
          spec: '#2563eb',     // Xanh dương (Tag thông số DPI, Polling Rate, Switch)
          stock: '#16a34a',    // Xanh lá (Còn hàng)
        }
      },
      boxShadow: {
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
