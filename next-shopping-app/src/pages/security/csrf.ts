// pages/api/csrf.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Create a CSRF token and set it in a non-httpOnly cookie so client JS can read it.
    const csrfToken = randomBytes(16).toString("hex");

    // Cookie options: readable by JS (not httpOnly), short lived
    res.setHeader("Set-Cookie", `csrfToken=${csrfToken}; Path=/; Max-Age=3600; SameSite=Lax; Secure; HttpOnly=false`);

    res.status(200).json({ csrfToken });
}
