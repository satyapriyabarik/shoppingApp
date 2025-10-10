// pages/api/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { sessions } from "./login";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sid = cookies.session;
    if (sid) sessions.delete(sid);

    // Expire cookie
    res.setHeader("Set-Cookie", cookie.serialize("session", "", { path: "/", maxAge: 0 }));
    res.status(200).json({ ok: true });
}
