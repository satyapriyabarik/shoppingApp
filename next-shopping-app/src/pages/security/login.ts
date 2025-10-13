// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import cookie from "cookie";

// In-memory session store (mock). In production replace with DB / redis.
const sessions = new Map<string, { username: string; createdAt: number }>();

// Simple mock user
const MOCK_USER = { username: "user", password: "pass" };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Only POST
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        // CSRF check: header must equal cookie
        const csrfHeader = req.headers["x-csrf-token"];
        const cookies = cookie.parse(req.headers.cookie || "");
        const csrfCookie = cookies.csrfToken;

        if (!csrfHeader || !csrfCookie || String(csrfHeader) !== String(csrfCookie)) {
            return res.status(403).json({ message: "Invalid CSRF token" });
        }

        const { username, password } = req.body ?? {};

        if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create session token
        const sessionId = randomBytes(16).toString("hex");
        sessions.set(sessionId, { username, createdAt: Date.now() });

        // Set httpOnly session cookie
        // HttpOnly, Secure and SameSite are important for security.
        const cookieStr = cookie.serialize("session", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });
        res.setHeader("Set-Cookie", cookieStr);

        res.status(200).json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Login failed" });
    }
}

// export sessions for server-side lookup (only for this mock demo)
export { sessions };
