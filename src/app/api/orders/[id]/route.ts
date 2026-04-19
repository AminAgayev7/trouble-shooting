import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";
<<<<<<< HEAD
import { measureAsync } from "@/lib/performance";
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

const updateOrderSchema = z.object({
    status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});

<<<<<<< HEAD

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "GET /api/orders/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser) {
                return NextResponse.json(
                    { error: "Unauthorized." },
                    { status: 401 }
                );
            }

            const { id: rawId } = await params;
            const id = parseInt(rawId, 10);

            if (isNaN(id)) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                    items: {
                        include: {
                            product: {
                                select: { id: true, title: true, price: true },
                            },
                        },
                    },
                },
            });

            if (!order) {
                return NextResponse.json(
                    { error: "Order not found." },
                    { status: 404 }
                );
            }

            if (
                currentUser.role !== "ADMIN" &&
                order.userId !== currentUser.id
            ) {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            return NextResponse.json(order);
        },
        {
            action: "orders.get",
        }
    );
}


export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "PUT /api/orders/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { id: rawId } = await params;
            const id = parseInt(rawId, 10);

            if (isNaN(id)) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            const body = await req.json();
            const parsed = updateOrderSchema.safeParse(body);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: parsed.error.issues[0].message },
                    { status: 400 }
                );
            }

            const order = await prisma.order.update({
                where: { id },
                data: { status: parsed.data.status },
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                    items: {
                        include: {
                            product: {
                                select: { id: true, title: true },
                            },
                        },
                    },
                },
            });

            return NextResponse.json(order);
        },
        {
            action: "orders.update",
        }
    );
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "DELETE /api/orders/:id",
        async () => {
            const currentUser = await getUserFromToken();

            if (!currentUser || currentUser.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Not authorized." },
                    { status: 403 }
                );
            }

            const { id: rawId } = await params;
            const id = parseInt(rawId, 10);

            if (isNaN(id)) {
                return NextResponse.json(
                    { error: "Invalid ID." },
                    { status: 400 }
                );
            }

            await prisma.order.delete({ where: { id } });

            return NextResponse.json({ message: "Order deleted." });
        },
        {
            action: "orders.delete",
        }
    );
}
=======
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: { include: { product: { select: { id: true, title: true, price: true } } } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found." }, { status: 404 });
        }
        if (currentUser.role !== "ADMIN" && order.userId !== currentUser.id) {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        return NextResponse.json(order);
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
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

        const body = await req.json();
        const parsed = updateOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: parsed.data.status },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: { include: { product: { select: { id: true, title: true } } } },
            },
        });

        return NextResponse.json(order);
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
        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ message: "Order deleted." });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
