"use client";
import { Row, Col, Card, Container } from "react-bootstrap";
import { Product } from "@/types/Product";
import Link from "next/link";

interface ProductGridProps {
    products: Product[];
}

export default function FeaturedProducts({ products }: ProductGridProps) {
    if (!products.length)
        return <p className="text-center text-muted">No featured products found.</p>;

    return (
        <div className="featured-bg py-5">
            <Container>
                <Row className="g-4 justify-content-center">
                    {products.map((p) => (
                        <Col
                            key={p.id}
                            xs={12}
                            sm={6}
                            md={4}
                            lg={3}
                            className="mb-4 d-flex align-items-stretch"
                        >
                            <Card className="h-100 shadow-lg border-0 hover-zoom product-card">
                                {/* Redirect to category page instead of product detail */}
                                <Link href={`/products?category=${encodeURIComponent(p.category)}`}>
                                    <Card.Img
                                        variant="top"
                                        src={p.image || "https://via.placeholder.com/500x500.png?text=Plant"}
                                        alt={p.name}
                                        className="p-2 rounded-top"
                                        style={{ height: "250px", objectFit: "cover", cursor: "pointer" }}
                                        width={'auto'}
                                        height={250}
                                    />
                                </Link>

                                <Card.Body className="text-center">
                                    <Card.Title className="fs-5 text-dark">{p.name}</Card.Title>
                                    <Card.Text className="fw-bold text-success fs-6 mb-2">
                                        ₹{p.price ?? "—"}
                                    </Card.Text>
                                    <Card.Text className="text-secondary small mb-3">
                                        {p.description.length > 60
                                            ? p.description.slice(0, 57) + "..."
                                            : p.description}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}
