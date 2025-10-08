import MainLayout from "@/components/layouts";
import { getProducts } from "@/lib/api";
import Image from "next/image";
type Product = {
    id: number;
    name: string;
    price: string;
    category: string;
    image: string;
    description: string;
};

export async function getServerSideProps() {
    try {
        const products = await getProducts();
        // Ensure products is an array; fallback to empty array if undefined or null
        console.log("Fetched products:", products);
        return { props: { products: Array.isArray(products) ? products : [] } };
    } catch (error) {
        console.error("Error fetching products:", error);
        return { props: { products: [] } };
    }
}

export default function ProductsPage({ products }: { products: Product[] }) {
    return (
        <MainLayout title="Products">
            <div className="container mt-4">
                <h2 className="mb-4">Products (SSR)</h2>
                {products.length > 0 ? (
                    <div className="row">
                        {products.map((p) => (
                            <div key={p.id} className="col-md-4 mb-3">
                                <div className="card h-100 shadow-sm">
                                    <div className="card-body">
                                        <Image
                                            src={p.image}
                                            alt={p.name}
                                            className="card-img-top mb-3"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <h5 className="card-title">{p.name}</h5>
                                        <p className="card-text text-muted">{p.category}</p>
                                        <p className="card-text text-muted">{p.description}</p>

                                        <p className="card-text font-weight-bold">${p.price}</p>
                                    </div>
                                    <button className="btn btn-primary m-3 w-90">Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-secondary">No products found.</p>
                )}
            </div>
        </MainLayout>
    );
}
