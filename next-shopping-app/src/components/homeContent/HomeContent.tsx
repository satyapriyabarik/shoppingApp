import React, { useEffect, useState, Suspense, lazy } from "react";
import MainLayout from "@/components/layouts";
import { Product } from "@/types/Product";
import {
    Container,
    Spinner,
    Alert,
} from "react-bootstrap";
import { useInfiniteQuery } from "@tanstack/react-query";
import BackToTop from "../backToTop/BackToTop";
import FeaturedProducts from "../featured/FeaturedProducts";

// 🔹 Lazy components (named chunks)
const BannerCarousel = lazy(() =>
    import(
    /* webpackChunkName: "banner-carousel" */ "@/components/carousel/BannerCarousel"
    )
);
const SearchSortBar = lazy(() =>
    import(
    /* webpackChunkName: "search-sort-bar" */ "@/components/searchSortBar/SearchSortBar"
    )
);


const PAGE_SIZE = 6;

// 🔹 Fetch paginated products
async function fetchProducts({ pageParam = 1 }): Promise<Product[]> {
    const res = await fetch(
        `https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants?_page=${pageParam}&_limit=${PAGE_SIZE}`);

    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
}

export default function HomeContent() {
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("");

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
        error,
        status,
    } = useInfiniteQuery({
        queryKey: ["infiniteProducts"],
        queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });

    const products = data?.pages.flat() || [];

    const filteredProducts = products
        .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
        .sort((a, b) => {
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "price") return (a.price ?? 0) - (b.price ?? 0);
            return 0;
        });

    // Infinite scroll logic unchanged...
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <MainLayout title="Home">
            {/* 🏞️ Banner */}
            <Suspense
                fallback={
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p>Loading banner...</p>
                    </div>
                }
            >
                <BannerCarousel />
            </Suspense>

            {/* 🔍 Search & Sort */}
            <Suspense
                fallback={
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                        <p>Loading filters...</p>
                    </div>
                }
            >
                <Container fluid className="px-4">
                    <h2 className="text-center fw-bold text-success mb-5">
                        🌱 Featured Products
                    </h2>
                    <SearchSortBar
                        search={search}
                        setSearch={setSearch}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                </Container>
            </Suspense>

            {/* 🛒 Product Grid or Spinner */}
            <Container fluid className="px-4">
                {status === "pending" ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p>Loading featured products...</p>
                    </div>
                ) : isError ? (
                    <Alert variant="danger">Error: {(error as Error).message}</Alert>
                ) : (
                    <Suspense
                        fallback={
                            <div className="text-center py-4">
                                <Spinner animation="border" />
                                <p>Loading products...</p>
                            </div>
                        }
                    >
                        <FeaturedProducts products={filteredProducts} />
                    </Suspense>
                )}
            </Container>

            {/* Infinite Scroll Loader */}
            {isFetchingNextPage && (
                <div className="text-center py-3">
                    <Spinner animation="grow" />
                    <p>Loading more products...</p>
                </div>
            )}

            <BackToTop />
        </MainLayout>
    );
}