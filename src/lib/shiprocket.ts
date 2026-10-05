const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || "";
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || "";
const BASE_URL = "https://apiv2.shiprocket.in/v1/external";

export const isShiprocketLive = !!(SHIPROCKET_EMAIL && SHIPROCKET_PASSWORD);

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: SHIPROCKET_EMAIL,
      password: SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };
  return data.token;
}

export interface ServiceabilityResult {
  available: boolean;
  estimatedDays: number | null;
  courierName: string | null;
}

export async function checkServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  weight: number = 0.5
): Promise<ServiceabilityResult> {
  if (!isShiprocketLive) {
    console.log(`[Shiprocket Stub] Serviceability check: ${deliveryPincode}`);
    return {
      available: true,
      estimatedDays: 4,
      courierName: "Stub Courier",
    };
  }

  try {
    const token = await getToken();
    const params = new URLSearchParams({
      pickup_postcode: pickupPincode,
      delivery_postcode: deliveryPincode,
      weight: weight.toString(),
      cod: "0",
    });

    const res = await fetch(
      `${BASE_URL}/courier/serviceability/?${params}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();

    if (
      data.data?.available_courier_companies &&
      data.data.available_courier_companies.length > 0
    ) {
      const cheapest = data.data.available_courier_companies[0];
      return {
        available: true,
        estimatedDays: cheapest.estimated_delivery_days || 5,
        courierName: cheapest.courier_name || null,
      };
    }

    return { available: false, estimatedDays: null, courierName: null };
  } catch (err) {
    console.error("[Shiprocket] Serviceability check failed:", err);
    return { available: true, estimatedDays: 5, courierName: null };
  }
}

export async function createShipment(orderData: {
  orderId: string;
  orderNumber: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; sku: string; units: number; sellingPrice: number }[];
  totalAmount: number;
}) {
  if (!isShiprocketLive) {
    const awb = `STUB_AWB_${Date.now()}`;
    console.log(`[Shiprocket Stub] Created shipment for ${orderData.orderNumber}, AWB: ${awb}`);
    return { shiprocketOrderId: `SR_${orderData.orderId}`, awb, trackingUrl: null };
  }

  try {
    const token = await getToken();

    const res = await fetch(`${BASE_URL}/orders/create/adhoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderData.orderNumber,
        order_date: new Date().toISOString().split("T")[0],
        pickup_location: "Primary",
        billing_customer_name: orderData.contactName,
        billing_last_name: "",
        billing_address: orderData.address,
        billing_city: orderData.city,
        billing_pincode: orderData.pincode,
        billing_state: orderData.state,
        billing_country: "India",
        billing_email: orderData.contactEmail,
        billing_phone: orderData.contactPhone,
        shipping_is_billing: true,
        order_items: orderData.items.map((item) => ({
          name: item.name,
          sku: item.sku,
          units: item.units,
          selling_price: item.sellingPrice,
        })),
        payment_method: "Prepaid",
        sub_total: orderData.totalAmount,
        length: 30,
        breadth: 25,
        height: 10,
        weight: 0.5,
      }),
    });

    const data = await res.json();
    return {
      shiprocketOrderId: data.order_id?.toString() || null,
      awb: data.awb_code || null,
      trackingUrl: data.awb_code
        ? `https://www.shiprocket.in/shipment-tracking/${data.awb_code}`
        : null,
    };
  } catch (err) {
    console.error("[Shiprocket] Create shipment failed:", err);
    return { shiprocketOrderId: null, awb: null, trackingUrl: null };
  }
}
