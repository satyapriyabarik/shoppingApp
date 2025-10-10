// pages/cart.tsx
import type { GetServerSideProps } from "next";
import cookie from "cookie";
import MainLayout from "@/components/layouts/MainLayout";
import { sessions } from "./api/login";
import CheckoutPage from "@/components/checkout/Checkout";

export default function CartPage() {
    // If we reached here, getServerSideProps allowed access.
    return <MainLayout title="Cart"><CheckoutPage /></MainLayout>;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const cookies = cookie.parse(req.headers.cookie || "");
    const sid = cookies.session;
    if (!sid) {
        return {
            redirect: { destination: "/login", permanent: false },
        };
    }

    // validate session exists in server memory
    const sess = sessions.get(sid);
    if (!sess) {
        return {
            redirect: { destination: "/login", permanent: false },
        };
    }

    // Optionally set CSP header (Next supports setting headers in next.config or with middleware).
    return { props: {} };
};
