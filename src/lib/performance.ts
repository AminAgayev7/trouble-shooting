type PerformanceContext = {
    action?: string;
    userId?: number;
    [key: string]: unknown;
};

const slow_thershold_ms = 500; 

export async function measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
    context?: PerformanceContext
): Promise<T> {
    const start = performance.now();
    try {
        const result = await fn();
        const duration = Math.round(performance.now() - start);

        if (duration > slow_thershold_ms) {
            console.warn(`[Performance] SLOW — ${label}: ${duration}ms`, context ?? "");
        } else {
            console.debug(`[Performance] ${label}: ${duration}ms`, context ?? "");
        }

        return result;
    } catch (error) {
        const duration = Math.round(performance.now() - start);
        console.error(`[Performance] FAILED — ${label}: ${duration}ms`, context ?? "", error);
        throw error;
    }
}

export function measureSync<T>(
    label: string,
    fn: () => T,
    context?: PerformanceContext
): T {
    const start = performance.now();
    try {
        const result = fn();
        const duration = Math.round(performance.now() - start);

        if (duration > slow_thershold_ms) {
            console.warn(`[Performance] SLOW — ${label}: ${duration}ms`, context ?? "");
        } else {
            console.debug(`[Performance] ${label}: ${duration}ms`, context ?? "");
        }

        return result;
    } catch (error) {
        const duration = Math.round(performance.now() - start);
        console.error(`[Performance] FAILED — ${label}: ${duration}ms`, context ?? "", error);
        throw error;
    }
}