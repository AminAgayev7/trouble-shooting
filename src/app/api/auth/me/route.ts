import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VerifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
<<<<<<< HEAD
import { measureAsync } from "@/lib/performance";

export async function getUserFromToken() {
    return measureAsync(
        "getUserFromToken",
        async () => {
            const cookieStore = await cookies();
            const token = cookieStore.get("token")?.value;

            if (!token) {
                return null;
            }
            try {
                const decoded = await VerifyToken(token);

                return await prisma.user.findUnique({
                    where: { id: decoded.userId as number },
                    select: { id: true, name: true, email: true, role: true },
                });
            } catch {
                return null;
            }
        },
        {
            action: "auth.getUserFromToken",
        }
    );
}

export async function GET() {
    return measureAsync(
        "GET /api/user",
        async () => {
            const user = await getUserFromToken();

            if (!user) {
                return NextResponse.json(
                    { error: "Unauthorized" },
                    { status: 401 }
                );
            }

            return NextResponse.json(user);
        },
        {
            action: "api.user.GET",
        }
    ).catch(() =>
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    );
}
=======

export async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = await VerifyToken(token);
        return prisma.user.findUnique({
            where: { id: decoded.userId as number },
            select: { id: true, name: true, email: true, role: true },
        });
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
