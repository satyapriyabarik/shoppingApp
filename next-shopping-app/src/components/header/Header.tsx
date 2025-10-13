
import React, { Suspense, lazy } from "react";
import Link from "next/link";
import { Navbar, Nav, Container, Badge } from "react-bootstrap";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import styles from "styles/Header.module.css";

// Lazy-load SearchBox
const SearchBox = lazy(() => import("./SearchBox"));
export default function Header() {
    const pathname = usePathname();
    const cartCount = useCartStore((state) =>
        state.cart.reduce((sum, item) => sum + item.quantity, 0)
    );

    const isActive = (path: string) => pathname === path;


    return (
        <header className={styles.stickyNavbar}>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-2">
                <Container fluid className="px-4 d-flex align-items-center">
                    <Link href="/" className="d-flex align-items-center text-white text-decoration-none me-4">
                        <Image
                            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80"
                            alt="GreenKart Logo"
                            width={40}
                            height={40}
                            className="me-2 rounded-circle bg-white p-1"
                        />
                        <span className="fs-4 fw-bold">GreenKart</span>
                    </Link>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                        <Nav className="gap-3 me-4">
                            <Link
                                href="/"
                                className={`${styles["nav-link"]} fw-semibold ${isActive("/") ? styles.active : ""}`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/products"
                                className={`${styles["nav-link"]} fw-semibold ${isActive("/products") ? styles.active : ""}`}
                            >
                                Products
                            </Link>
                            <Link
                                href="/about"
                                className={`${styles["nav-link"]} fw-semibold ${isActive("/about") ? styles.active : ""}`}
                            >
                                About
                            </Link>
                        </Nav>

                        {/* 🔹 Lazy-loaded SearchBox */}

                        <Suspense fallback={<div className="px-2 text-white">Loading search...</div>}>
                            <div className="gap-2 flex-grow-1 me-2 d-flex justify-content-right">
                                <SearchBox onSearch={(q, cat) => console.log("Search", q, cat)} />
                            </div>
                        </Suspense>

                    </Navbar.Collapse>

                    <div className="d-flex  justify-content-right gap-3 align-items-center">
                        <Link href="/account" className="text-white position-relative">
                            <FaUser size={22} />
                        </Link>

                        <Link href="/checkout" className="text-white position-relative">
                            <FaShoppingCart size={22} />
                            {cartCount > 0 && (
                                <Badge
                                    bg="danger"
                                    pill
                                    className="position-absolute top-0 start-100 translate-middle"
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Link>
                    </div>
                </Container>
            </Navbar>
        </header>
    );
}
