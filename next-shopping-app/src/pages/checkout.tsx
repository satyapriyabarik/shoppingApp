
"use client";

import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Table, Spinner } from "react-bootstrap";
import Image from "next/image";
import MainLayout from "@/components/layouts/MainLayout";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
    const cart = useCartStore((state) => state.cart);
    const increment = useCartStore((state) => state.increment);
    const decrement = useCartStore((state) => state.decrement);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const getTotal = useCartStore((state) => state.getTotal);

    const [hydrated, setHydrated] = useState(false);

    // ✅ Hydration check for persisted store
    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        return (
            <MainLayout title="Checkout">
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2 text-muted">Loading cart...</p>
                </div>
            </MainLayout>
        );
    }

    if (cart.length === 0) {
        return (
            <MainLayout title="Checkout">
                <Container className="py-5 text-center">
                    <h3>Your cart is empty 🛒</h3>
                </Container>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Checkout">
            <Container className="py-5">
                <h2 className="mb-4 fw-bold text-success">Checkout</h2>

                <Table bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id}>
                                <td className="d-flex align-items-center">
                                    <Image
                                        src={item.image || "https://via.placeholder.com/60"}
                                        alt={item.name}
                                        width={60}
                                        height={60}
                                        style={{ objectFit: "cover", marginRight: 10 }}
                                    />
                                    {item.name}
                                </td>
                                <td>₹{(item.price ?? 0).toFixed(2)}</td>
                                <td>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => decrement(item.id)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </Button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => increment(item.id)}
                                    >
                                        +
                                    </Button>
                                </td>
                                <td>₹{((item.price ?? 0) * item.quantity).toFixed(2)}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Row className="mt-4 align-items-center">
                    <Col md={6}>
                        <h4>Total: ₹{getTotal().toFixed(2)}</h4>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button
                            variant="outline-danger"
                            className="me-3"
                            onClick={() => {
                                if (confirm("Are you sure you want to clear the cart?")) clearCart();
                            }}
                        >
                            Clear Cart
                        </Button>
                        <Button variant="success">Proceed to Payment</Button>
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    );
}
