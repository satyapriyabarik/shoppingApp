

// "use client";
// import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
// import { useEffect, useRef } from "react";
// import { Spinner } from "react-bootstrap";
// import { getProducts, getProductsByCategory } from "@/lib/api";
// import ProductGrid from "@/components/productGrid/ProductGrid";
// import { Product } from "@/types/Product";

// const PAGE_SIZE = 6;

// interface Props {
//     category?: string;
// }

// export default function ProductsPageContent({ category }: Props) {
//     const loadMoreRef = useRef<HTMLDivElement | null>(null);

//     // ✅ If category is provided, use useQuery
//     const { data: categoryProducts, isLoading: categoryLoading } = useQuery<Product[], Error>({
//         queryKey: ["products", category ?? "all"],
//         queryFn: async () => {
//             if (category) {
//                 const products = await getProductsByCategory(category);
//                 return products ?? [];
//             }
//             return [];
//         },
//         enabled: !!category,
//     });

//     // ✅ For all products, use infinite scroll
//     const {
//         data: infiniteData,
//         fetchNextPage,
//         hasNextPage,
//         isFetchingNextPage,
//         isLoading: infiniteLoading,
//     } = useInfiniteQuery<Product[], Error>({
//         queryKey: ["products", "all"],
//         queryFn: async ({ pageParam }) => {
//             const page = (pageParam as number | undefined) ?? 1;
//             const products = await getProducts(page, PAGE_SIZE);
//             return products ?? [];
//         },
//         getNextPageParam: (lastPage, allPages) =>
//             lastPage && lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
//         enabled: !category,
//         initialPageParam: 1,
//     });

//     // Intersection Observer for infinite scroll (only for all products)
//     useEffect(() => {
//         if (category) return;
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
//     }, [fetchNextPage, hasNextPage, isFetchingNextPage, category]);

//     const products = category ? categoryProducts ?? [] : infiniteData?.pages.flat() ?? [];

//     if (category ? categoryLoading : infiniteLoading)
//         return (
//             <div className="text-center py-5">
//                 <Spinner animation="border" />
//                 <p>Loading products...</p>
//             </div>
//         );

//     return (
//         <section>
//             <h2 className="text-center fw-bold text-success mb-5">
//                 {category ? `🌱 ${category} ` : "🌱 Our Products"}
//             </h2>
//             <ProductGrid products={products} />

//             {!category && (
//                 <div ref={loadMoreRef} className="text-center py-4">
//                     {isFetchingNextPage && <Spinner animation="grow" />}
//                     {!hasNextPage && (
//                         <p className="text-muted mt-3">🎉 You have reached the end!</p>
//                     )}
//                 </div>
//             )}
//         </section>
//     );
// }
"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState, useMemo } from "react";
import { Spinner, Form, Row, Col } from "react-bootstrap";
import { getProducts, getProductsByCategory } from "@/lib/api";
import ProductGrid from "@/components/productGrid/ProductGrid";
import { Product } from "@/types/Product";

const PAGE_SIZE = 6;

interface Props {
    category?: string;
    search?: string;
    sort?: string;
}

export default function ProductsPageContent({
    category,
    search = "",
    sort = "",
}: Props) {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [searchTerm, setSearchTerm] = useState(search);
    const [sortOption, setSortOption] = useState(sort);

    // 🔹 Debounce search (only fetch after 3+ chars & 500ms delay)
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchTerm.length >= 3 || searchTerm.length === 0)
                setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // ✅ Category-based products (no infinite scroll)
    const {
        data: categoryProducts,
        isLoading: categoryLoading,
        refetch: refetchCategory,
    } = useQuery<Product[], Error>({
        queryKey: ["products", category ?? "all", debouncedSearch, sortOption],
        queryFn: async () => {
            if (category) {
                const products = await getProductsByCategory(category, {
                    search: debouncedSearch || undefined,
                    sort: sortOption || undefined,
                });
                return products ?? [];
            }
            return [];
        },
        enabled: !!category,
    });

    // ✅ All products with infinite scroll
    const {
        data: infiniteData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: infiniteLoading,
        refetch: refetchAll,
    } = useInfiniteQuery<Product[], Error>({
        queryKey: ["products", "all", debouncedSearch, sortOption],
        queryFn: async ({ pageParam = 1 }) => {
            const products = await getProducts({
                page: Number(pageParam),
                limit: PAGE_SIZE,
                search: debouncedSearch || undefined,
                sort: sortOption || undefined,
            });
            return products ?? [];
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage && lastPage.length === PAGE_SIZE
                ? allPages.length + 1
                : undefined,
        enabled: !category,
        initialPageParam: 1,
    });

    // ✅ Infinite scroll observer
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

    // ✅ Combine results
    const products = useMemo(
        () => (category ? categoryProducts ?? [] : infiniteData?.pages.flat() ?? []),
        [category, categoryProducts, infiniteData]
    );

    const isLoading = category ? categoryLoading : infiniteLoading;

    // ✅ Re-fetch on filters change
    useEffect(() => {
        if (category) refetchCategory();
        else refetchAll();
    }, [debouncedSearch, sortOption, category, refetchCategory, refetchAll]);

    if (isLoading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p>Loading products...</p>
            </div>
        );

    return (
        <section>
            <h2 className="text-center fw-bold text-success mb-4">
                {category ? `🌱 ${category} Products` : "🌱 Our Products"}
            </h2>

            {/* 🔍 Search + Sort */}
            <Row className="justify-content-center mb-4">
                <Col xs={10} md={8} lg={6} className="d-flex gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shadow-sm"
                    />
                    <Form.Select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">Sort by</option>
                        <option value="priceAsc">Price: Low to High</option>
                        <option value="priceDesc">Price: High to Low</option>
                        <option value="nameAsc">Name: A → Z</option>
                        <option value="nameDesc">Name: Z → A</option>
                    </Form.Select>
                </Col>
            </Row>

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
