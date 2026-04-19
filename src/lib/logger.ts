type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = {
    userId?: number;
    orderId?: number;
    productId?: number;
    action?: string;
    [key: string]: unknown;
};

const log_levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const isProd = process.env.NODE_ENV === "production";
const min_level: LogLevel = isProd ? "warn" : "debug";

function shouldLog(level: LogLevel): boolean {
    return log_levels[level] >= log_levels[min_level];
}

function sanitize(context: LogContext): LogContext {
    const sensitive_keys = ["password", "token", "cardNumber", "cvv", "ssn"];
    const cleaned: LogContext = {};
    for (const key in context) {
        cleaned[key] = sensitive_keys.includes(key) ? "[REDACTED]" : context[key];
    }
    return cleaned;
}

function formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`; // time İNFO
    const ctx = context ? ` | ${JSON.stringify(sanitize(context))}` : ""; // 
    return `${prefix} ${message}${ctx}`;
}

export const logger = {
    debug(message: string, context?: LogContext) {
        if (!shouldLog("debug")) {
            return;
        }
        console.debug(formatMessage("debug", message, context));
    },
    info(message: string, context?: LogContext) {
        if (!shouldLog("info")) {
            return;
        }
        console.info(formatMessage("info", message, context));
    },
    warn(message: string, context?: LogContext) {
        if (!shouldLog("warn")) {
            return;
        }
        console.warn(formatMessage("warn", message, context));
    },
    error(message: string, context?: LogContext) {
        if (!shouldLog("error")) {
            return;
        }
        console.error(formatMessage("error", message, context));
    },
};