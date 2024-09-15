import { calculateFiveUnitPercentage } from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const result = await calculateFiveUnitPercentage();
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Error calculating five unit percentage:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
