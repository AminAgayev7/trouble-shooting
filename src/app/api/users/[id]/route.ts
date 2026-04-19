import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";
<<<<<<< HEAD
import { measureAsync } from "@/lib/performance";
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

const updateUserSchema = z.object({
    role: z.enum(["USER", "ADMIN"]).optional(),
    name: z.string().min(2).optional(),
});

<<<<<<< HEAD

function parseId(rawId: string) {
    const id = parseInt(rawId, 10);
    return isNaN(id) ? null : id;
}


export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "GET /api/users/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return NextResponse.json(
                    { error: "User not found." },
                    { status: 404 }
                );
            }

            return NextResponse.json(user);
        },
        { action: "users.get" }
    );
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "PUT /api/users/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            const body = await req.json();
            const parsed = updateUserSchema.safeParse(body);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: parsed.error.issues[0].message },
                    { status: 400 }
                );
            }

            const user = await prisma.user.update({
                where: { id },
                data: parsed.data,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            return NextResponse.json(user);
        },
        { action: "users.update" }
    );
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "DELETE /api/users/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            if (currentUser.id === id) {
                return NextResponse.json(
                    { error: "You can't remove yourself." },
                    { status: 400 }
                );
            }

            await prisma.user.delete({ where: { id } });

            return NextResponse.json({ message: "User deleted." });
        },
        { action: "users.delete" }
    );
=======
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        const body = await req.json();
        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: parsed.data,
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        if (currentUser.id === id) {
            return NextResponse.json({ error: "You can't remove it." }, { status: 400 });
        }

        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ message: "User deleted." });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
}