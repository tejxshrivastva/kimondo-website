import { NextResponse } from "next/server";
import { checkServiceability } from "@/lib/shiprocket";

const PICKUP_PINCODE = "226012";

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    if (!pincode || typeof pincode !== "string" || pincode.length !== 6) {
      return NextResponse.json({ error: "Valid 6-digit pincode required" }, { status: 400 });
    }

    const result = await checkServiceability(PICKUP_PINCODE, pincode);

    return NextResponse.json({
      available: result.available,
      estimatedDays: result.estimatedDays,
      courierName: result.courierName,
    });
  } catch {
    return NextResponse.json({ error: "Failed to check serviceability" }, { status: 500 });
  }
}
