
const BASE_URL = "https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants";

export async function getProducts({
    page = 1,
    limit = 12,
    search = "",
    sort = "",
}: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
}) {
    const params = new URLSearchParams();

    // ✅ Pagination
    params.append("_page", page.toString());
    params.append("_limit", limit.toString());

    // ✅ Search (JSON Server uses `q`)
    if (search) params.append("q", search);

    // ✅ Sort (JSON Server uses `_sort` + `_order`)
    if (sort) {
        switch (sort) {
            case "priceAsc":
                params.append("_sort", "price");
                params.append("_order", "asc");
                break;
            case "priceDesc":
                params.append("_sort", "price");
                params.append("_order", "desc");
                break;
            case "nameAsc":
                params.append("_sort", "name");
                params.append("_order", "asc");
                break;
            case "nameDesc":
                params.append("_sort", "name");
                params.append("_order", "desc");
                break;
        }
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    return data;
}

// ✅ Fetch single product by ID
export async function getProductById(id: string | number) {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch product with id ${id}`);
    return res.json();
}

// ✅ Fetch products by category with search/sort support
export async function getProductsByCategory(
    category: string,
    { search = "", sort = "" }: { search?: string; sort?: string } = {}
) {
    const params = new URLSearchParams();

    // ✅ Category filter
    params.append("category", category);

    // ✅ Search
    if (search) params.append("q", search);

    // ✅ Sort
    if (sort) {
        switch (sort) {
            case "priceAsc":
                params.append("_sort", "price");
                params.append("_order", "asc");
                break;
            case "priceDesc":
                params.append("_sort", "price");
                params.append("_order", "desc");
                break;
            case "nameAsc":
                params.append("_sort", "name");
                params.append("_order", "asc");
                break;
            case "nameDesc":
                params.append("_sort", "name");
                params.append("_order", "desc");
                break;
        }
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch products by category");

    return res.json();
}
