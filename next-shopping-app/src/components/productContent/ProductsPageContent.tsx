
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/productGrid/ProductGrid";
import { Product } from "@/types/Product";

const PAGE_SIZE = 6;

export default function ProductsPageContent() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery<Product[], Error>({
        queryKey: ["products"],
        queryFn: async ({ pageParam }) => {
            // 👇 Cast because React Query v5 passes `pageParam` as unknown
            const page = (pageParam as number | undefined) ?? 1;
            return getProducts(page, PAGE_SIZE);
        },
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
        initialPageParam: 1,
    });

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    // 👇 Intersection Observer for infinite scroll
    useEffect(() => {
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
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const products = data?.pages.flat() ?? [];

    if (isLoading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
                <p>Loading products...</p>
            </div>
        );

    return (
        <section>
            <h2 className="text-center fw-bold text-success mb-5">
                🌱 Our Products
            </h2>
            <ProductGrid products={products} />

            <div ref={loadMoreRef} className="text-center py-4">
                {isFetchingNextPage && <Spinner animation="grow" />}
                {!hasNextPage && (
                    <p className="text-muted mt-3">🎉 You have reached the end!</p>
                )}
            </div>
        </section>
    );
}
