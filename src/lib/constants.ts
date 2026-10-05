export const SIZES = {
  top: ["XS", "S", "M", "L", "XL", "XXL"],
  bottom: ["28", "30", "32", "34", "36", "38"],
  accessory: ["One size"],
} as const;

export const ORDER_STATUSES = [
  "pending",
  "placed",
  "accepted",
  "processed",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "return_requested",
  "exchange_requested",
  "return_approved",
  "reverse_pickup_scheduled",
  "return_received",
  "exchange_dispatched",
  "refunded",
  "exchange_complete",
  "payment_failed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CLIENT_STATUSES: OrderStatus[] = [
  "placed",
  "accepted",
  "processed",
  "shipped",
];

export const PROVIDER_STATUSES: OrderStatus[] = [
  "in_transit",
  "out_for_delivery",
  "delivered",
];

export const POLICY_SLUGS = [
  "privacy",
  "terms",
  "shipping",
  "returns",
  "cancellation",
] as const;

export const ITEM_CATEGORIES = ["top", "bottom", "accessory"] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const USER_ROLES = ["customer", "editor", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];
