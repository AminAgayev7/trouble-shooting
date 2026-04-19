import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
<<<<<<< HEAD
import { logger } from "@/lib/logger";
import { measureAsync } from "@/lib/performance";
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

const createProductSchema = z.object({
    title: z.string().min(1, "Title can't be omitted"),
    description: z.string().optional(),
    price: z.number().positive("Price should be positive"),
    stock: z.number().int().min(0, "Stock can't be negative"),
});

<<<<<<< HEAD

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const page = Math.max(1,parseInt(searchParams.get("page") ?? "1", 10));

        const limit = Math.min(
            50,
            Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10))
        );

        const skip = (page - 1) * limit;

        const { products, total } = await measureAsync(
            "fetch_products",
            async () => {
                const productsPromise = prisma.product.findMany({
                    orderBy: { createdAt: "desc" },
                    skip,
                    take: limit,
                });

                const countPromise = prisma.product.count();

                const [products, total] = await Promise.all([
                    productsPromise,
                    countPromise,
                ]);

                return { products, total };
            },
            {
                action: "get_products",
            }
        );
=======
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count(),
        ]);
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

        return NextResponse.json({
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
<<<<<<< HEAD
        logger.error("Failed to fetch products", {
            action: "get_products",
        });

        return NextResponse.json(
            { error: "Server error." },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = createProductSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const product = await measureAsync(
            "create_product",
            async () => {
                return prisma.product.create({
                    data: parsed.data,
                });
            },
            {
                action: "create_product",
            }
        );

        logger.info("Product created", {
            productId: product.id,
            action: "create_product",
        });

        return NextResponse.json(product, { status: 201 });
    } catch {
        logger.error("Failed to create product", {
            action: "create_product",
        });

        return NextResponse.json(
            { error: "Server error." },
            { status: 500 }
        );
    }
}
=======
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = createProductSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }
        const product = await prisma.product.create({ data: parsed.data });
        return NextResponse.json(product, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
