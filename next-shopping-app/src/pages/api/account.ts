import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { sessions } from "./login";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sid = cookies.session;
    if (!sid) return res.status(401).json({ authenticated: false });

    const sess = sessions.get(sid);
    if (!sess) return res.status(401).json({ authenticated: false });

    res.status(200).json({ authenticated: true, username: sess.username });
}
