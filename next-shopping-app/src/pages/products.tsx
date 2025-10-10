import { Suspense } from "react";
import {
    QueryClient,
    dehydrate,
    HydrationBoundary,
    DehydratedState,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layouts";
import BackToTop from "@/components/backToTop/BackToTop";
import { getProducts } from "@/lib/api";
import { Product } from "@/types/Product";

// Dynamic import to avoid SSR issues with window/scroll
const ProductsPageContent = dynamic(
    () => import("@/components/productContent/ProductsPageContent"),
    { ssr: false }
);

export async function getServerSideProps() {
    const queryClient = new QueryClient();

    // Pre-fetch first page of products
    await queryClient.prefetchInfiniteQuery({
        queryKey: ["products"],
        queryFn: ({ pageParam = 1 }) => getProducts(pageParam, 6),
        initialPageParam: 1,
        getNextPageParam: (lastPage: Product[], allPages: Product[]) =>
            lastPage.length === 6 ? allPages.length + 1 : undefined,
    });

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default function ProductsPage({
    dehydratedState,
}: {
    dehydratedState: DehydratedState;
}) {
    return (
        <HydrationBoundary state={dehydratedState}>
            <MainLayout title="Products">
                <Suspense
                    fallback={
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                            <p className="mt-2">Loading products...</p>
                        </div>
                    }
                >
                    <ProductsPageContent />
                </Suspense>
            </MainLayout>
            <BackToTop />
        </HydrationBoundary>
    );
}

