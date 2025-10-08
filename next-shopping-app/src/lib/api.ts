export async function getHomeData() {
    return Promise.resolve(['Featured Product A', 'Featured Product B']);
}
export async function getProducts() {
    try {
        const res = await fetch("https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants");

        if (!res.ok) {
            throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();
        return data; // assuming the API returns an array of products
    } catch (error) {
        console.error(error);
        return []; // fallback to empty array
    }
}