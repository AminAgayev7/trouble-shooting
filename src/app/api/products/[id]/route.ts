import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
<<<<<<< HEAD
import { measureAsync } from "@/lib/performance";

const updateProductSchema = z.object({
    title: z.string().min(1, "Title can't be omitted").optional(),
=======

const updateProductSchema = z.object({
    title: z.string().min(1, "Title can't be ommited").optional(),
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
    description: z.string().optional(),
    price: z.number().positive("Price should be positive").optional(),
    stock: z.number().int().min(0, "Stock can't be negative").optional(),
});

<<<<<<< HEAD

function parseId(rawId: string) {
    const id = parseInt(rawId, 10);
    return isNaN(id) ? null : id;
}


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "GET /api/products/:id",
        async () => {
            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid Id format." },
                    { status: 400 }
                );
            }

            const product = await prisma.product.findUnique({
                where: { id },
            });

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found." },
                    { status: 404 }
                );
            }

            return NextResponse.json(product);
        },
        { action: "product.get" }
    );
}


export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "PUT /api/products/:id",
        async () => {
            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid Id format." },
                    { status: 400 }
                );
            }

            const body = await request.json();
            const parsed = updateProductSchema.safeParse(body);

            if (!parsed.success) {
                return NextResponse.json(
                    { error: parsed.error.issues[0].message },
                    { status: 400 }
                );
            }

            const updated = await prisma.product.update({
                where: { id },
                data: parsed.data,
            });

            return NextResponse.json(updated);
        },
        { action: "product.update" }
    );
}


export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    return measureAsync(
        "DELETE /api/products/:id",
        async () => {
            const { id: rawId } = await params;
            const id = parseId(rawId);

            if (!id) {
                return NextResponse.json(
                    { error: "Invalid Id format." },
                    { status: 400 }
                );
            }

            await prisma.product.delete({
                where: { id },
            });

            return NextResponse.json({ message: "Product deleted." });
        },
        { action: "product.delete" }
    );
=======
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid Id format." }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid Id format." }, { status: 400 });
        }

        const body = await request.json();

        const parsed = updateProductSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        const updated = await prisma.product.update({
            where: { id },
            data: parsed.data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server error." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    
    try {
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid Id format." }, { status: 400 });
        }

        const existing = await prisma.product.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ error: "Product not found." }, { status: 404 });
        }

        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ message: "Product deleted." });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server error." }, { status: 500 });
    }
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
}