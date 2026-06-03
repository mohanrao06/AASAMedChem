import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  if (user.password !== password) {
    return NextResponse.json(
      { error: "Invalid Password" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    role: user.role,
  });
}