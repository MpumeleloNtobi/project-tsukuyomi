export type OrderStatus =
  | "Seller Received"
  | "In progress"
  | "Out for Delivery"
  | "Delivered"
  | "Ready for Pickup"
  | "Picked Up"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Paid" | "Refunded";

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  storeId: string;
  phoneNumber: string;
  deliveryMethod: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  created_at: string;
  city: string;
  town: string;
  streetName: string;
  streetNumber: string;
  postalCode: string;
  buyerName: string;
  paymentId: string | null;
  total_price: number;
  last_updated: string;
  items?: OrderItem[];
  shipping?: number;
  tax?: number;
  email?: string;
}
