import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";
<<<<<<< HEAD
import { logger } from "@/lib/logger";
import { measureAsync } from "@/lib/performance";
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
    })).min(1, "At least one item required."),
});

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getUserFromToken();
<<<<<<< HEAD

=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
        const skip = (page - 1) * limit;

        const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

<<<<<<< HEAD
        const { orders, total } = await measureAsync(
            "fetch_orders",
            async () => {
                const [orders, total] = await Promise.all([
                    prisma.order.findMany({
                        where,
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
                        orderBy: { createdAt: "desc" },
                        skip,
                        take: limit,
                    }),
                    prisma.order.count({ where }),
                ]);

                return { orders, total };
            },
            {
                action: "get_orders",
                userId: currentUser.id,
            }
        );
=======
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: { include: { product: { select: { id: true, title: true, price: true } } } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

        return NextResponse.json({
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
<<<<<<< HEAD
        logger.error("Failed to fetch orders", { action: "get_orders" });
        return NextResponse.json(
            { error: "Server error." },
            { status: 500 }
        );
=======
        return NextResponse.json({ error: "Server error." }, { status: 500 });
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
    }
}

export async function POST(req: NextRequest) {
<<<<<<< HEAD
    const currentUser = await getUserFromToken();

    try {

=======
    try {
        const currentUser = await getUserFromToken();
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const body = await req.json();
        const parsed = createOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { items } = parsed.data;

        const products = await Promise.all(
            items.map(item => prisma.product.findUnique({ where: { id: item.productId } }))
        );

        for (let i = 0; i < products.length; i++) {
<<<<<<< HEAD

            const product = products[i];
            
=======
            const product = products[i];
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
            if (!product) {
                return NextResponse.json({ error: `Product not found: ${items[i].productId}` }, { status: 404 });
            }
            if (product.stock < items[i].quantity) {
                return NextResponse.json({ error: `Insufficient stock for: ${product.title}` }, { status: 400 });
            }
        }

        const total = items.reduce((sum, item, i) => {
            return sum + (products[i]!.price * item.quantity);
        }, 0);

<<<<<<< HEAD
        const order = await measureAsync ("create_order_transaction", () => prisma.$transaction(async (tx) => {
=======
        const order = await prisma.$transaction(async (tx) => {
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
            for (let i = 0; i < items.length; i++) {
                await tx.product.update({
                    where: { id: items[i].productId },
                    data: { stock: { decrement: items[i].quantity } },
                });
            }

            return tx.order.create({
                data: {
                    userId: currentUser.id,
                    total,
                    status: "PENDING",
                    items: {
                        create: items.map((item, i) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: products[i]!.price,
                        })),
                    },
                },
                include: {
                    items: { include: { product: { select: { id: true, title: true } } } },
                },
            });
<<<<<<< HEAD
        }));
        logger.info("Order created", { userId: currentUser.id, orderId: order.id, action: "create_order" });
        return NextResponse.json(order, { status: 201 });
    } catch {
        logger.error("Failed to create order", { userId: currentUser?.id, action: "create_order"});
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    };
    
}

=======
        });

        return NextResponse.json(order, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
