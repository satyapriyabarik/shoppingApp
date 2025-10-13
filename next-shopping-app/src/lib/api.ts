import { Product } from "@/types/Product";
export async function getProducts(page = 1, limit = 6) {
    try {
        const res = await fetch(
            `https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants?_page=${page}&_limit=${limit}`
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProductById(id: string | number) {
    try {
        const res = await fetch(
            `https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants/${id}`
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch product with id ${id}: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function getProductsByCategory(category: string): Promise<Product[]> {
    const res = await fetch(`https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants/?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Failed to fetch products by category");
    return res.json();
}
