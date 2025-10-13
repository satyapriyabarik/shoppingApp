
// "use client";
// import { useInfiniteQuery } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";
// import { Spinner } from "react-bootstrap";
// import { getProducts } from "@/lib/api";
// import ProductGrid from "@/components/productGrid/ProductGrid";
// import { Product } from "@/types/Product";

// const PAGE_SIZE = 6;

// export default function ProductsPageContent() {
//     const {
//         data,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading,
//     } = useInfiniteQuery<Product[], Error>({
//         queryKey: ["products"],
//         queryFn: async ({ pageParam }) => {
//             // 👇 Cast because React Query v5 passes `pageParam` as unknown
//             const page = (pageParam as number | undefined) ?? 1;
//             return getProducts(page, PAGE_SIZE);
//         },
//         getNextPageParam: (lastPage, allPages) =>
//             lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
//         initialPageParam: 1,
//     });

//     const loadMoreRef = useRef<HTMLDivElement | null>(null);

//     // 👇 Intersection Observer for infinite scroll
//     useEffect(() => {
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
//                     fetchNextPage();
//                 }
//             },
//             { threshold: 1.0 }
//         );

//         const ref = loadMoreRef.current;
//         if (ref) observer.observe(ref);
//         return () => {
//             if (ref) observer.unobserve(ref);
//         };
//     }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//     const products = data?.pages.flat() ?? [];

//     if (isLoading)
//         return (
//             <div className="text-center py-5">
//                 <Spinner animation="border" />
//                 <p>Loading products...</p>
//             </div>
//         );

//     return (
//         <section>
//             <h2 className="text-center fw-bold text-success mb-5">
//                 🌱 Our Products
//             </h2>
//             <ProductGrid products={products} />

//             <div ref={loadMoreRef} className="text-center py-4">
//                 {isFetchingNextPage && <Spinner animation="grow" />}
//                 {!hasNextPage && (
//                     <p className="text-muted mt-3">🎉 You have reached the end!</p>
//                 )}
//             </div>
//         </section>
//     );
// }
"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { getProducts, getProductsByCategory } from "@/lib/api";
import ProductGrid from "@/components/productGrid/ProductGrid";
import { Product } from "@/types/Product";

const PAGE_SIZE = 6;

interface Props {
    category?: string;
}

export default function ProductsPageContent({ category }: Props) {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // ✅ If category is provided, use useQuery
    const { data: categoryProducts, isLoading: categoryLoading } = useQuery<Product[], Error>({
        queryKey: ["products", category ?? "all"],
        queryFn: async () => {
            if (category) {
                const products = await getProductsByCategory(category);
                return products ?? [];
            }
            return [];
        },
        enabled: !!category,
    });

    // ✅ For all products, use infinite scroll
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: infiniteLoading,
    } = useInfiniteQuery<Product[], Error>({
        queryKey: ["products", "all"],
        queryFn: async ({ pageParam }) => {
            const page = (pageParam as number | undefined) ?? 1;
            const products = await getProducts(page, PAGE_SIZE);
            return products ?? [];
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage && lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
        enabled: !category,
        initialPageParam: 1,
    });

    // Intersection Observer for infinite scroll (only for all products)
    useEffect(() => {
        if (category) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 1.0 }
        );

        const ref = loadMoreRef.current;
        if (ref) observer.observe(ref);
        return () => {
            if (ref) observer.unobserve(ref);
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, category]);

    const products = category ? categoryProducts ?? [] : infiniteData?.pages.flat() ?? [];

    if (category ? categoryLoading : infiniteLoading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p>Loading products...</p>
            </div>
        );

    return (
        <section>
            <h2 className="text-center fw-bold text-success mb-5">
                {category ? `🌱 ${category} ` : "🌱 Our Products"}
            </h2>
            <ProductGrid products={products} />

            {!category && (
                <div ref={loadMoreRef} className="text-center py-4">
                    {isFetchingNextPage && <Spinner animation="grow" />}
                    {!hasNextPage && (
                        <p className="text-muted mt-3">🎉 You have reached the end!</p>
                    )}
                </div>
            )}
        </section>
    );
}
