// import { Suspense } from "react";
// import {
//     QueryClient,
//     dehydrate,
//     HydrationBoundary,
//     DehydratedState,
// } from "@tanstack/react-query";
// import dynamic from "next/dynamic";
// import MainLayout from "@/components/layouts";
// import BackToTop from "@/components/backToTop/BackToTop";
// import { getProducts } from "@/lib/api";
// import { Product } from "@/types/Product";

// // Dynamic import to avoid SSR issues with window/scroll
// const ProductsPageContent = dynamic(
//     () => import("@/components/productContent/ProductsPageContent"),
//     { ssr: false }
// );

// export async function getServerSideProps() {
//     const queryClient = new QueryClient();

//     // Pre-fetch first page of products
//     await queryClient.prefetchInfiniteQuery({
//         queryKey: ["products"],
//         queryFn: ({ pageParam = 1 }) => getProducts(pageParam, 6),
//         initialPageParam: 1,
//         getNextPageParam: (lastPage: Product[], allPages: Product[]) =>
//             lastPage.length === 6 ? allPages.length + 1 : undefined,
//     });

//     return {
//         props: {
//             dehydratedState: dehydrate(queryClient),
//         },
//     };
// }

// export default function ProductsPage({
//     dehydratedState,
// }: {
//     dehydratedState: DehydratedState;
// }) {
//     return (
//         <HydrationBoundary state={dehydratedState}>
//             <MainLayout title="Products">
//                 <Suspense
//                     fallback={
//                         <div className="text-center py-5">
//                             <div className="spinner-border text-success" role="status" />
//                             <p className="mt-2">Loading products...</p>
//                         </div>
//                     }
//                 >
//                     <ProductsPageContent />
//                 </Suspense>
//             </MainLayout>
//             <BackToTop />
//         </HydrationBoundary>
//     );
// }

import { Suspense } from "react";
import {
    QueryClient,
    dehydrate,
    HydrationBoundary,
    DehydratedState,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import MainLayout from "@/components/layouts";
import BackToTop from "@/components/backToTop/BackToTop";
import { getProducts, getProductsByCategory } from "@/lib/api";
import { Product } from "@/types/Product";

// Dynamic import for client-only rendering
const ProductsPageContent = dynamic(
    () => import("@/components/productContent/ProductsPageContent"),
    { ssr: false }
);

export async function getServerSideProps(context: { query: { category?: string } }) {
    const queryClient = new QueryClient();
    const category = context.query.category;

    if (category) {
        // Prefetch products filtered by category
        await queryClient.prefetchQuery({
            queryKey: ["products", category],
            queryFn: () => getProductsByCategory(category),
        });
    } else {
        // Prefetch first page of all products
        await queryClient.prefetchInfiniteQuery({
            queryKey: ["products"],
            queryFn: ({ pageParam = 1 }) => getProducts(pageParam, 6),
            initialPageParam: 1,
            getNextPageParam: (lastPage: Product[], allPages: Product[]) =>
                lastPage.length === 6 ? allPages.length + 1 : undefined,
        });
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            category: category || null,
        },
    };
}

export default function ProductsPage({
    dehydratedState,
    category,
}: {
    dehydratedState: DehydratedState;
    category: string | null;
}) {
    const router = useRouter();

    return (
        <HydrationBoundary state={dehydratedState}>
            <MainLayout title={category ? `${category} Products` : "Products"}>
                <Suspense
                    fallback={
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                            <p className="mt-2">Loading products...</p>
                        </div>
                    }
                >
                    <ProductsPageContent category={router.query.category as string | undefined} />
                </Suspense>
            </MainLayout>
            <BackToTop />
        </HydrationBoundary>
    );
}
