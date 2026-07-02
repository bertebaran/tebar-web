import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (!action) {
      return NextResponse.json({ status: false, message: "Action is required" }, { status: 400 });
    }

    // Attach the APP_KEY to the payload
    const backendPayload = {
      ...payload,
      _key: process.env.APP_KEY,
    };

    const SUPABASE_FUNCTION_URL = process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_URL;
    
    if (!SUPABASE_FUNCTION_URL) {
      console.error("Missing NEXT_PUBLIC_SUPABASE_FUNCTION_URL");
      return NextResponse.json({ status: false, message: "Server configuration error" }, { status: 500 });
    }

    const response = await fetch(`${SUPABASE_FUNCTION_URL}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(backendPayload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Proxy Error:", error);
    return NextResponse.json({ status: false, message: "Internal Server Error" }, { status: 500 });
  }
}
