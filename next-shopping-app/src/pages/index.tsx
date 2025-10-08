import MainLayout from "@/components/layouts";
import { Product } from "@/types/Product";
import { useEffect, useState } from "react";
export default function HomePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants?_limit=5");
        if (!res.ok) throw new Error("Failed to fetch featured products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);



  if (loading) {
    return <p>Loading featured products...</p>;
  }
  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  if (!products || products.length === 0) {
    return <p>No featured products.</p>;
  }

  return (
    <MainLayout title="Home">

      <div className="container mx-auto p-4">
        <h2 className="mb-4">Featured Products (CSR)</h2>
        <ul className="row">
          {products.map((p) => (
            <li key={p.id} className="border p-4 rounded shadow card w-25 m-3 col-md-4 col-lg-2">
              <h4 className="font-semibold">{p.name}</h4>
              <p className="text-gray-600">{p.category}</p>
            </li>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
}
