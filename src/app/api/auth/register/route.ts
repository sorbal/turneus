import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  try {
    const body: unknown = await readJsonBody(request);

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "Body JSON invalid." },
        { status: 400 }
      );
    }

    const invalidField = getInvalidField(body);

    if (invalidField) {
      return NextResponse.json(
        { error: `Camp invalid: ${invalidField}.` },
        { status: 400 }
      );
    }

    const { email, username, password, firstName, lastName, phone } = body;

    if (body.termsAccepted !== true) {
      return NextResponse.json(
        { error: "Acceptarea termenilor este obligatorie." },
        { status: 400 }
      );
    }

    if (
      typeof email !== "string" ||
      typeof username !== "string" ||
      typeof password !== "string" ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      !email.trim() ||
      !username.trim() ||
      !password ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      return NextResponse.json(
        { error: "Campurile obligatorii lipsesc." },
        { status: 400 }
      );
    }

    if (phone !== undefined && phone !== null && typeof phone !== "string") {
      return NextResponse.json(
        { error: "Telefon invalid." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Parola trebuie sa aiba minimum 8 caractere." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email.trim() }, { username: username.trim() }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Emailul sau username-ul exista deja." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.trim(),
        username: username.trim(),
        passwordHash,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone?.trim() || null,
        role: "PLAYER",
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Cont creat cu succes.",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return NextResponse.json(
      { error: "Eroare interna la creare cont." },
      { status: 500 }
    );
  }
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getInvalidField(body: Record<string, unknown>) {
  const allowedFields = new Set([
    "email",
    "username",
    "password",
    "firstName",
    "lastName",
    "phone",
    "termsAccepted",
  ]);

  for (const key of Object.keys(body)) {
    if (!allowedFields.has(key)) {
      return key;
    }
  }

  return "";
}
