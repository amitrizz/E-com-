export type OrderLine = {
  productId: string;
  slug: string;
  name: string;
  priceInr: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
};

export type OrderAddress = {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pin: string;
  phone: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  email: string;
  items: OrderLine[];
  subtotalInr: number;
  shippingInr: number;
  totalInr: number;
  paymentMethod: "cod";
  address: OrderAddress;
  status: "confirmed" | "processing" | "shipped" | "delivered";
  createdAt: string;
};
