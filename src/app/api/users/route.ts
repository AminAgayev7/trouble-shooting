import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
<<<<<<< HEAD
import { measureAsync } from "@/lib/performance";

export async function GET(req: NextRequest) {
    return measureAsync(
        "GET /api/users",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { searchParams } = new URL(req.url);

            const page = Math.max(
                1,
                parseInt(searchParams.get("page") ?? "1", 10)
            );

            const limit = Math.min(
                50,
                Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
            );

            const skip = (page - 1) * limit;

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                }),

                prisma.user.count(),
            ]);

            return NextResponse.json({
                users,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            });
        },
        {
            action: "users.list",
        }
    );
}
=======

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                select: { id: true, name: true, email: true, role: true, createdAt: true },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.user.count(),
        ]);

        return NextResponse.json({
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
