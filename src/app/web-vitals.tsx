"use client";

<<<<<<< HEAD
import * as Sentry from "@sentry/nextjs";
import { useReportWebVitals } from "next/web-vitals";

const thresholds: Record<string, number> = {
    LCP: 2500, //Largest Contentful Paint — səhifənin əsas hissəsinin yüklənmə sürəti
    FID: 100, //First Input Delay — istifadəçinin ilk klik reaksiyası
    CLS: 0.1, // Cumulative Layout Shift — səhifənin tərpənməsi
    FCP: 1800, //First Contentful Paint — ilk məzmunun görünməsi
    TTFB: 800, // Time to First Byte — server cavab sürəti
    INP: 200, //Interaction to Next Paint — klik, toxunma və ya klaviatura əməliyyatı
};

export function WebVitals() {
    useReportWebVitals((metric) => {
        const limit = thresholds[metric.name];
        const isSlow = limit && metric.value > limit;


    if (process.env.NODE_ENV === "development") {
        console.log(`${metric.name}: ${Math.round(metric.value)} ${isSlow ? "slow" : "ok"}`);
    }


    if (metric.rating === "poor" || isSlow) {
        Sentry.captureMessage(`Web Vital: ${metric.name}`, {
            level: "warning",
            extra: {
                value: Math.round(metric.value),
                rating: metric.rating,
            },
        });
    }
});
=======
import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
    useReportWebVitals((metric) => {
        console.log({
            name: metric.name,
            value: metric.value,
            rating: metric.rating,
        });
    });

>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
    return null;
}