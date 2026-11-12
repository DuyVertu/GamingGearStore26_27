import React from 'react';
import { Gamepad2, ShieldCheck, Truck, RefreshCw, Headphones, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  const policies = [
    {
      icon: ShieldCheck,
      title: 'Bảo hành chính hãng 24 tháng',
      desc: 'Cam kết 100% sản phẩm phân phối chính ngạch, bảo hành theo Serial điện tử.',
    },
    {
      icon: RefreshCw,
      title: '1 đổi 1 trong 30 ngày đầu',
      desc: 'Đổi mới ngay lập tức nếu phát sinh lỗi phần cứng từ nhà sản xuất (Switch, Sensor).',
    },
    {
      icon: Truck,
      title: 'Giao nhanh 2H nội thành',
      desc: 'Miễn phí vận chuyển toàn quốc cho đơn hàng Gaming Gear từ 1.000.000đ.',
    },
    {
      icon: Headphones,
      title: 'Hỗ trợ kỹ thuật Esports',
      desc: 'Tư vấn chọn form cầm chuột, custom bàn phím HE & cập nhật firmware miễn phí.',
    },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 mt-12">
      {/* dải cam kết dịch vụ & bảo hành */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-xl bg-[#f8fafc] border border-slate-200"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Thông tin cửa hàng & chính sách chi tiết */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Thương hiệu */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                GAMING<span className="text-rose-600">GEAR</span> STORE
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Hệ thống bán lẻ chuột Esports siêu nhẹ, bàn phím cơ Magnetic Hall Effect (Rapid Trigger), tai nghe và bàn di chuột chuẩn thi đấu chuyên nghiệp.
            </p>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Số 01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP.HCM</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hotline: 1800 6975 (08:30 - 21:30 mỗi ngày)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-600 shrink-0" />
                <span>support@gaminggear.vn</span>
              </p>
            </div>
          </div>

          {/* Cột 2: Chính sách bảo hành */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Chính sách & Bảo hành
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Bảo hành chính hãng 12 - 24 tháng theo tiêu chuẩn NSX</li>
              <li>• Bảo hành lỗi Double-Click, loạn Scroll Encoder & mắt đọc</li>
              <li>• Hỗ trợ mượn thiết bị tương đương trong thời gian chờ hãng</li>
              <li>• Kiểm tra tình trạng bảo hành trực tuyến qua Số Điện Thoại</li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Hướng dẫn & Thanh toán
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Thanh toán COD, Chuyển khoản QR hoặc Thẻ tín dụng</li>
              <li>• Hỗ trợ trả góp 0% lãi suất cho đơn hàng từ 3.000.000đ</li>
              <li>• Đồng kiểm ngoại quan sản phẩm trước khi nhận hàng</li>
              <li>• Cung cấp hóa đơn VAT điện tử đầy đủ cho doanh nghiệp</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} GamingGear Store. All rights reserved.</p>
          <p>Giao diện Clean Light Mode cảm hứng từ GEARVN Esports.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

