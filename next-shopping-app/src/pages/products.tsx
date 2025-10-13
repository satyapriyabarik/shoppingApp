
// import { Suspense } from "react";
// import {
//     QueryClient,
//     dehydrate,
//     HydrationBoundary,
//     DehydratedState,
// } from "@tanstack/react-query";
// import dynamic from "next/dynamic";
// import { useRouter } from "next/router";
// import MainLayout from "@/components/layouts";
// import BackToTop from "@/components/backToTop/BackToTop";
// import { getProducts, getProductsByCategory } from "@/lib/api";
// import { Product } from "@/types/Product";

// // Dynamic import for client-only rendering
// const ProductsPageContent = dynamic(
//     () => import("@/components/productContent/ProductsPageContent"),
//     { ssr: false }
// );

// export async function getServerSideProps(context: { query: { category?: string } }) {
//     const queryClient = new QueryClient();
//     const category = context.query.category;

//     if (category) {
//         // Prefetch products filtered by category
//         await queryClient.prefetchQuery({
//             queryKey: ["products", category],
//             queryFn: () => getProductsByCategory(category),
//         });
//     } else {
//         // Prefetch first page of all products
//         await queryClient.prefetchInfiniteQuery({
//             queryKey: ["products"],
//             queryFn: ({ pageParam = 1 }) => getProducts(pageParam, 6),
//             initialPageParam: 1,
//             getNextPageParam: (lastPage: Product[], allPages: Product[]) =>
//                 lastPage.length === 6 ? allPages.length + 1 : undefined,
//         });
//     }

//     return {
//         props: {
//             dehydratedState: dehydrate(queryClient),
//             category: category || null,
//         },
//     };
// }

// export default function ProductsPage({
//     dehydratedState,
//     category,
// }: {
//     dehydratedState: DehydratedState;
//     category: string | null;
// }) {
//     const router = useRouter();

//     return (
//         <HydrationBoundary state={dehydratedState}>
//             <MainLayout title={category ? `${category} Products` : "Products"}>
//                 <Suspense
//                     fallback={
//                         <div className="text-center py-5">
//                             <div className="spinner-border text-success" role="status" />
//                             <p className="mt-2">Loading products...</p>
//                         </div>
//                     }
//                 >
//                     <ProductsPageContent category={router.query.category as string | undefined} />
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
import MainLayout from "@/components/layouts";
import BackToTop from "@/components/backToTop/BackToTop";
import { getProducts, getProductsByCategory } from "@/lib/api";
import { Product } from "@/types/Product";

const ProductsPageContent = dynamic(
    () => import("@/components/productContent/ProductsPageContent"),
    { ssr: false }
);

interface ProductsPageProps {
    dehydratedState: DehydratedState;
    category?: string; // 👈 now uses optional instead of null
    search?: string;
    sort?: string;
}

export async function getServerSideProps(context: {
    query: { category?: string; search?: string; sort?: string };
}) {
    const queryClient = new QueryClient();
    const { category, search, sort } = context.query;

    // ✅ Replace undefined → null before sending to client (for Next.js serialization)
    const safeCategory = category ?? null;
    const safeSearch = search ?? null;
    const safeSort = sort ?? null;

    if (safeCategory) {
        await queryClient.prefetchQuery({
            queryKey: ["products", { category: safeCategory, search: safeSearch, sort: safeSort }],
            queryFn: () =>
                getProductsByCategory(safeCategory, {
                    search: safeSearch ?? undefined,
                    sort: safeSort ?? undefined,
                }),
        });
    } else {
        await queryClient.prefetchInfiniteQuery({
            queryKey: ["products", { category: "all", search: safeSearch, sort: safeSort }],
            queryFn: ({ pageParam = 1 }) =>
                getProducts({
                    page: pageParam,
                    limit: 6,
                    search: safeSearch ?? undefined,
                    sort: safeSort ?? undefined,
                }),
            initialPageParam: 1,
            getNextPageParam: (lastPage: Product[], allPages: Product[]) =>
                lastPage.length === 6 ? allPages.length + 1 : undefined,
        });
    }

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            // ✅ still serializable
            category: safeCategory,
            search: safeSearch,
            sort: safeSort,
        },
    };
}

export default function ProductsPage({
    dehydratedState,
    category,
    search,
    sort,
}: ProductsPageProps) {
    // ✅ convert back null → undefined before passing to components
    const normalizedCategory = category ?? undefined;
    const normalizedSearch = search ?? undefined;
    const normalizedSort = sort ?? undefined;

    return (
        <HydrationBoundary state={dehydratedState}>
            <MainLayout title={normalizedCategory ? `${normalizedCategory} Products` : "Products"}>
                <Suspense
                    fallback={
                        <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status" />
                            <p className="mt-2">Loading products...</p>
                        </div>
                    }
                >
                    <ProductsPageContent
                        category={normalizedCategory}
                        search={normalizedSearch}
                        sort={normalizedSort}
                    />
                </Suspense>
            </MainLayout>
            <BackToTop />
        </HydrationBoundary>
    );
}
