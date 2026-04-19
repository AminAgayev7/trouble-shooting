<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

type AnalyticsData = {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    recentOrders: { id: number; total: number; status: string; user: { name: string; email: string } }[];
    lowStockProducts: { id: number; title: string; stock: number }[];
    ordersByStatus: { status: string; _count: { status: number } }[];
};

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-300 border-yellow-700",
    paid: "bg-green-500/20 text-green-300 border-green-700",
    cancelled: "bg-red-500/20 text-red-300 border-red-700",
    shipped: "bg-blue-500/20 text-blue-300 border-blue-700",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
        </div>
    );
}

function MonitoringDashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch("/api/analytics");
            if (!res.ok) {
                throw new Error("Failed to fetch analytics");
            }
            const json = await res.json();
            setData(json);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30_000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                Loading monitoring data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-950/30 border border-red-800/50 text-center">
                <p className="text-red-400 font-bold">Failed to load monitoring data</p>
                <p className="text-red-300 text-sm">{error}</p>
                <button
                    onClick={fetchData}
                    className="mt-3 px-4 py-1 text-sm rounded-lg bg-red-800 hover:bg-red-700 text-white"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) {
        return null;
    }
    return (
        <div className="flex flex-col gap-8">


            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Monitoring Dashboard</h1>
                    <p className="text-gray-500 text-sm">
                        {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : ""}
                        {" · "}Auto-refreshes every 30s
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
                >
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>


            <section>
                <h2 className="text-lg font-semibold mb-4">Platform Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Users" value={data.totalUsers} />
                    <StatCard label="Total Products" value={data.totalProducts} />
                    <StatCard label="Total Orders" value={data.totalOrders} />
                    <StatCard
                        label="Total Revenue"
                        value={`$${data.totalRevenue.toFixed(2)}`}
                        sub="PAID orders only"
                    />
                </div>
            </section>


            <section>
                <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
                <div className="flex flex-wrap gap-3">
                    {data.ordersByStatus.map((s) => (
                        <div
                            key={s.status}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium ${STATUS_COLORS[s.status] ?? "bg-white/5 text-gray-300 border-white/10"}`}
                        >
                            {s.status}: {s._count.status}
                        </div>
                    ))}
                </div>
            </section>


            {data.lowStockProducts.length > 0 && (
                <section>
                    <h2 className="text-lg font-semibold mb-4 text-yellow-400">
                        Low Stock Alerts ({data.lowStockProducts.length})
                    </h2>
                    <div className="flex flex-col gap-2">
                        {data.lowStockProducts.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-yellow-950/30 border border-yellow-800/50"
                            >
                                <span className="text-white text-sm">{p.title}</span>
                                <span className={`text-sm font-bold ${p.stock === 0 ? "text-red-400" : "text-yellow-400"}`}>
                                    {p.stock === 0 ? "OUT OF STOCK" : `${p.stock} left`}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}


            <section>
                <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                <div className="flex flex-col gap-2">
                    {data.recentOrders.map((o) => (
                        <div
                            key={o.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                        >
                            <div>
                                <p className="text-white text-sm font-medium">{o.user.name}</p>
                                <p className="text-gray-500 text-xs">{o.user.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-white text-sm font-bold">${o.total.toFixed(2)}</p>
                                <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_COLORS[o.status] ?? "bg-white/5 text-gray-300 border-white/10"}`}>
                                    {o.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
=======

import ProtectedRoute from "@/components/ProtectedRoute";
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

export default function AdminPage() {
    return (
        <ProtectedRoute requiredRole="ADMIN">
<<<<<<< HEAD
            <div className="p-6 w-full">
                <ErrorBoundary context="monitoring-dashboard">
                    <MonitoringDashboard />
                </ErrorBoundary>
            </div>
=======
            <h1>Admin Page</h1>
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
        </ProtectedRoute>
    );
}