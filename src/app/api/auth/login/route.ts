import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";
<<<<<<< HEAD
import { logger } from "@/lib/logger";
import { measureAsync } from "@/lib/performance";
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

const loginSchema = z.object({
    email: z.string().email("Enter valid email address"),
    password: z.string().min(6, "Cipher should contain at least 6 characters."),
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
<<<<<<< HEAD

    if (!rateLimit(`login:${ip}`, 5, 60_000)) {
        logger.warn("Rate limit exceeded", { action: "login", ip });
        return NextResponse.json(
            { error: "Too many requests. Try again in a minute." },
            { status: 429 }
        );
    }

    try {
        const response = await measureAsync(
            "login_flow",
            async () => {
                const body = await req.json();

                const parsed = loginSchema.safeParse(body);
                if (!parsed.success) {
                    return NextResponse.json(
                        { error: parsed.error?.issues[0].message },
                        { status: 400 }
                    );
                }

                const { email, password } = parsed.data;

                const user = await measureAsync(
                    "find_user_by_email",
                    () => prisma.user.findUnique({ where: { email } }),
                    { action: "login", email }
                );

                if (!user) {
                    return NextResponse.json(
                        { error: "Email or Cipher is incorrect." },
                        { status: 401 }
                    );
                }

                const isPasswordValid = await measureAsync(
                    "bcrypt_compare",
                    () => bcrypt.compare(password, user.password),
                    { action: "login", userId: user.id }
                );

                if (!isPasswordValid) {
                    return NextResponse.json(
                        { error: "Email or Cipher is incorrect." },
                        { status: 401 }
                    );
                }

                const token = await measureAsync(
                    "sign_token",
                    () =>
                        SignToken({
                            userId: user.id,
                            role: user.role,
                        }),
                    { action: "login", userId: user.id }
                );

                const cookieStore = await cookies();
                cookieStore.set("token", token, {
                    httpOnly: true,
                    maxAge: 60 * 60 * 24,
                });

                return NextResponse.json({
                    message: "Access is successful.",
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                });
            },
            { action: "login", ip }
        );

        logger.info("User logged in", {
            action: "login",
            ip,
        });

        return response;
    } catch (error) {
        logger.error("Login failed", {
            action: "login",
            error: String(error),
            ip,
        });

        return NextResponse.json(
            { error: "Server error." },
            { status: 500 }
        );
    }
}
=======
    if (!rateLimit(`login:${ip}`, 5, 60_000)) {
        return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    try {
        const body = await req.json();
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error?.issues[0].message }, { status: 400 });
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "Email or Cipher is incorrect." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Email or Cipher is incorrect." }, { status: 401 });
        }

        const token = await SignToken({ userId: user.id, role: user.role });
        const cookieStore = await cookies();
        cookieStore.set("token", token, { httpOnly: true, maxAge: 60 * 60 * 24 });

        return NextResponse.json({
            message: "Access is successful.",
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1
