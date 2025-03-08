// app/api/wallets/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST() {
  return NextResponse.json({});
}
