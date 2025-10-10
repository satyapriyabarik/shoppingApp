"use client";

import React from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { useCartStore } from "@/store/cartStore";
import MainLayout from "@/components/layouts/MainLayout"; // ✅ ensure path & casing match
import Image from "next/image";

export default function CheckoutPage() {
    // Zustand store
    const cart = useCartStore((state) => state.cart);
    const increment = useCartStore((state) => state.increment);
    const decrement = useCartStore((state) => state.decrement);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);

    // Compute total reactively
    const total = cart.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0);

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
                <h2 className="text-center fw-bold text-success mb-5">
                    🌱 Checkout Products
                </h2>
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
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: 60, height: 60, objectFit: "cover", marginRight: 10 }}
                                    />
                                    {item.name}
                                </td>
                                <td>₹{(item.price ?? 0).toFixed(2)}</td>
                                <td>
                                    <Button variant="outline-secondary" size="sm" onClick={() => decrement(item.id)}>
                                        -
                                    </Button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <Button variant="outline-secondary" size="sm" onClick={() => increment(item.id)}>
                                        +
                                    </Button>
                                </td>
                                <td>₹{((item.price ?? 0) * item.quantity).toFixed(2)}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Row className="mt-4">
                    <Col md={6}>
                        <h4>Total: ₹{total.toFixed(2)}</h4>
                    </Col>
                    <Col md={6} className="text-end">
                        <Button variant="outline-danger" onClick={clearCart} className="me-3">
                            Clear Cart
                        </Button>
                        <Button variant="success">Proceed to Payment</Button>
                    </Col>
                </Row>
            </Container>
        </MainLayout>
    );
}
