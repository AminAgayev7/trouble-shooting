import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
<<<<<<< HEAD
import { measureAsync } from '@/lib/performance';
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

export async function GET() {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        const [totalUsers, totalProducts, totalOrders, recentOrders, lowStockProducts, ordersByStatus] = 
        
<<<<<<< HEAD
        await measureAsync("fetch_counts_orders_and_products", () => {
            return Promise.all([
=======
        await Promise.all([
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, email: true } } },
            }),
            prisma.product.findMany({
                where: { stock: { lte: 5 } },
                orderBy: { stock: "asc" },
                take: 5,
            }),
            prisma.order.groupBy({
                by: ["status"],
                _count: { status: true },
            }),
<<<<<<< HEAD
        ])});

        const totalRevenue = await measureAsync("total_revenue", () => {
            return prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "PAID" },
        })
        }) ;
=======
        ]);

        const totalRevenue = await prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "PAID" },
        });
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue._sum.total ?? 0,
            recentOrders,
            lowStockProducts,
            ordersByStatus,
        });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}