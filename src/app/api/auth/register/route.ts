import { NextResponse } from "next-auth/next"; // wait, usually we use next/server
// let me fix it to next/server
import { NextResponse as Response } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return Response.json({ message: "User created successfully", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    console.error("REGISTRATION_ERROR", error);
    return Response.json({ error: "Internal Error" }, { status: 500 });
  }
}
