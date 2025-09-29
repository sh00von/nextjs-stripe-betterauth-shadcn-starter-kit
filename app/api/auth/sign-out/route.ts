import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const response = await auth.api.signOut({
      headers: await headers(),
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Error signing out:", error);
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
