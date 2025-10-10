import { useRouter } from "next/router";
import { useEffect, useState, Suspense } from "react";
import MainLayout from "@/components/layouts";
import Image from "next/image";
import { Spinner, Container, Row, Col, Badge } from "react-bootstrap";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { Product } from "@/types/Product";
import { getProductById } from "@/lib/api";

interface ProductDetailProps {
    initialProduct?: Product | null; // from SSR
}

export default function ProductDetail({ initialProduct }: ProductDetailProps) {
    const router = useRouter();
    const { id } = router.query;

    const [product, setProduct] = useState<Product | null>(initialProduct ?? null);

    // ✅ Client-side fetch if not loaded via SSR
    useEffect(() => {
        // 1️⃣ Wait until router is ready and id exists
        if (!router.isReady || !id) return;

        // 2️⃣ Handle string | string[] case safely
        const numericId = Array.isArray(id) ? id[0] : id;

        async function fetchProduct() {
            const prod = await getProductById(numericId.toString());
            setProduct(prod);
        }

        fetchProduct();
    }, [router.isReady, id]); // 🔑 watch router.isReady

    if (!product)
        return (
            <MainLayout title="Loading...">
                <div className="text-center py-5">
                    <Spinner animation="border" />
                    <p className="mt-2 text-muted">Fetching product details...</p>
                </div>
            </MainLayout>
        );

    return (
        <MainLayout title={product.name}>
            <div className="product-details-bg py-5">
                <Container>
                    <Row className="align-items-center">
                        {/* Left: Image */}
                        <Col md={6} className="text-center mb-4">
                            <Image
                                src={product.image || "https://via.placeholder.com/500x500.png?text=Plant"}
                                alt={product.name}
                                width={450}
                                height={450}
                                unoptimized
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "16px",
                                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                                }}
                                priority
                            />
                        </Col>

                        {/* Right: Info */}
                        <Col md={6}>
                            <h2 className="fw-bold mb-2">{product.name}</h2>
                            <Badge bg="success" className="mb-3">
                                {product.category}
                            </Badge>

                            <p className="fw-bold fs-3 text-success mb-4">
                                ₹{product.price?.toLocaleString() ?? "—"}
                            </p>

                            <AddToCartButton product={product} />

                            <hr className="my-4" />

                            {/* Lazy-load ProductBrief (e.g., care instructions) */}
                            <Suspense
                                fallback={
                                    <div className="text-center py-3">
                                        <Spinner animation="border" role="status" />
                                        <span className="ms-2 text-muted">Loading details...</span>
                                    </div>
                                }
                            >
                                {/* <ProductBrief product={product} /> */}
                            </Suspense>
                        </Col>
                    </Row>
                </Container>
            </div>
        </MainLayout>
    );
}

// ✅ SSR for direct URL visits
export async function getServerSideProps(context: { params: { id: string } }) {
    const { id } = context.params;
    const product = await getProductById(id);

    if (!product) {
        return { notFound: true };
    }

    return {
        props: { initialProduct: product },
    };
}
