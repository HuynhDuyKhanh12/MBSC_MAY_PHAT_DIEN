export type Product = {
  id: number;
  name: string;
  brand?: string;
  image: string;
  images?: string[];
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  isHot?: boolean;
  isOutOfStock?: boolean;
  description?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Máy phát điện diesel 10KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 18990000,
    oldPrice: 20990000,
    discountPercent: 10,
    isHot: true,
    description: "Máy phát điện diesel 10KVA chính hãng, tiết kiệm nhiên liệu.",
  },
  {
    id: 2,
    name: "Máy phát điện gia đình 3KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 5990000,
    description: "Máy phát điện nhỏ gọn dành cho gia đình.",
  },
  {
    id: 3,
    name: "Dịch vụ bảo dưỡng máy phát điện",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 490000,
    oldPrice: 550000,
    discountPercent: 11,
    description: "Dịch vụ bảo dưỡng máy phát điện tận nơi.",
  },
  {
    id: 4,
    name: "Sửa chữa bo mạch AVR",
    brand: "AVR",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 350000,
    isHot: true,
    description: "Sửa chữa và thay thế bo mạch AVR máy phát điện.",
  },

  // ✅ Bạn muốn có thêm id 5..12 giống list cũ thì copy nhân đôi:
  {
    id: 5,
    name: "Máy phát điện diesel 12KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 20990000,
    oldPrice: 23990000,
    discountPercent: 12,
    description: "Máy phát điện diesel 12KVA bền bỉ, phù hợp công trình.",
  },
  {
    id: 6,
    name: "Máy phát điện chạy xăng 2.5KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 4990000,
    description: "Máy phát điện nhỏ gọn, phù hợp gia đình.",
  },
  {
    id: 7,
    name: "Dịch vụ thay nhớt & lọc",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 290000,
    oldPrice: 350000,
    discountPercent: 17,
    description: "Thay nhớt & lọc định kỳ giúp máy chạy êm và bền hơn.",
  },
  {
    id: 8,
    name: "Sửa chữa đầu phát",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 890000,
    description: "Khắc phục lỗi đầu phát, đo kiểm & thay thế linh kiện.",
  },
  {
    id: 9,
    name: "Máy phát điện công nghiệp 20KVA",
    brand: "KUBOTA",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092334867-1f2f0e0cb21f?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 38990000,
    oldPrice: 42990000,
    discountPercent: 9,
    isHot: true,
    description: "Máy phát điện 20KVA cho nhà xưởng, công suất mạnh.",
  },
  {
    id: 10,
    name: "Máy phát điện inverter 2KVA",
    brand: "HONDA",
    image:
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1622030411594-c282a63aa1bc?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 7990000,
    description: "Inverter tiết kiệm nhiên liệu, chạy êm.",
  },
  {
    id: 11,
    name: "Bảo trì định kỳ theo gói",
    brand: "SERVICE",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 690000,
    oldPrice: 790000,
    discountPercent: 13,
    description: "Gói bảo trì định kỳ cho máy phát điện (theo tháng/quý).",
  },
  {
    id: 12,
    name: "Sửa chữa hệ thống điều khiển",
    brand: "AVR",
    image:
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1581091012184-5c6f1f8d0b0f?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1600&q=80",
    ],
    price: 1250000,
    description: "Sửa lỗi điều khiển, kiểm tra cảm biến, test tải.",
  },
];