import { cookies } from "next/headers";

import { NextResponse } from "next/server";
<<<<<<< HEAD
import { measureAsync } from '@/lib/performance';
=======
>>>>>>> 9a66f23ce32326d297b2c0181d24d8b2d8b274b1

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("token")

    return NextResponse.json({ message: "Logged out" })
}