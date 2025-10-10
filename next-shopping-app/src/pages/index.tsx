// import MainLayout from "@/components/layouts";
// import { Product } from "@/types/Product";
// import React, { lazy, useEffect } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Spinner,
//   Alert,
//   Carousel,
//   Form,
//   InputGroup,
// } from "react-bootstrap";
// import {
//   useInfiniteQuery,
//   QueryClient,
//   QueryClientProvider,
// } from "@tanstack/react-query";
// import { Suspense, useState } from "react";
// import { FaArrowCircleUp } from "react-icons/fa";

// // 🧠 Query client for caching
// const queryClient = new QueryClient();

// // --- Fetch paginated data ---
// async function fetchProducts({ pageParam = 1 }): Promise<Product[]> {
//   const res = await fetch(
//     `https://my-json-server.typicode.com/satyapriyabarik/nurseryData/initialPlants?_page=${pageParam}&_limit=6`
//   );
//   if (!res.ok) throw new Error("Failed to fetch products");
//   return res.json();
// }

// //Lazy load ProductGrid (for Suspense)
// const ProductGrid = lazy(() => import("./productGrid"));

// export default function HomePage() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <Suspense
//         fallback={
//           <div className="text-center py-5">
//             <Spinner animation="border" />
//             <p>Loading page...</p>
//           </div>
//         }
//       >
//         <HomeContent />
//       </Suspense>
//     </QueryClientProvider>
//   );
// }

// // -------------------------------
// // Actual content component
// // -------------------------------
// function HomeContent() {
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState("");

//   // Infinite scroll query
//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isError,
//     error,
//     status,
//   } = useInfiniteQuery({
//     queryKey: ["infiniteProducts"],
//     queryFn: ({ pageParam = 1 }) => fetchProducts({ pageParam }), // Pass correctly
//     getNextPageParam: (lastPage, allPages) =>
//       lastPage.length === 6 ? allPages.length + 1 : undefined,
//     initialPageParam: 1,
//     staleTime: 1000 * 60 * 5,
//   });


//   const products = data?.pages.flat() || [];

//   // Filter + Sort
//   const filteredProducts = products
//     .filter((p) => p.name.toLowerCase().includes(search.trim().toLowerCase()))
//     .sort((a, b) => {
//       if (sortBy === "name") return a.name.localeCompare(b.name);
//       if (sortBy === "price") return (a.price ?? 0) - (b.price ?? 0);
//       return 0;
//     });

//   // Infinite scroll event
//   useEffect(() => {
//     const handleScroll = () => {
//       if (
//         window.innerHeight + window.scrollY >=
//         document.body.offsetHeight - 200 &&
//         hasNextPage &&
//         !isFetchingNextPage
//       ) {
//         fetchNextPage();
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

//   if (status === "pending")
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//         <p>Loading featured products...</p>
//       </div>
//     );

//   if (isError)
//     return (
//       <Container className="py-5">
//         <Alert variant="danger">Error: {(error as Error).message}</Alert>
//       </Container>
//     );

//   return (
//     <MainLayout title="Home">
//       {/* Banner */}
//       <Carousel fade className="mb-4">
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=30"
//             alt="Banner 1"
//             style={{ maxHeight: "400px", objectFit: "cover" }}
//           />
//           <Carousel.Caption>
//             <h3 className="text-success align-right">Welcome to GreenKart</h3>
//             <p>Discover plants that brighten your home</p>
//           </Carousel.Caption>
//         </Carousel.Item>
//         <Carousel.Item>
//           <img
//             className="d-block w-100"
//             src="https://images.unsplash.com/photo-1555037015-1498966bcd7c?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxhbnR8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=1600"
//             alt="Banner 2"
//             style={{ maxHeight: "400px", objectFit: "cover" }}
//           />
//           <Carousel.Caption>
//             <h3 >Fresh Arrivals Weekly</h3>
//             <p>Grow your green collection</p>
//           </Carousel.Caption>
//         </Carousel.Item>
//       </Carousel>

//       {/* Search + Sort */}
//       <Container fluid className="px-4">
//         <h2 className="mb-4 text-dark fw-bold">Featured Products</h2>

//         <Row className="mb-4 align-items-center">
//           <Col md={6} className="mb-2">
//             <InputGroup>
//               <InputGroup.Text>🔍</InputGroup.Text>
//               <Form.Control
//                 type="text"
//                 placeholder="Search by name..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//             </InputGroup>
//           </Col>
//           <Col md={3} className="mb-2">
//             <Form.Select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="">Sort by...</option>
//               <option value="name">Name (A-Z)</option>
//               <option value="price">Price (Low-High)</option>
//             </Form.Select>
//           </Col>
//         </Row>

//         {/* Lazy Loaded ProductGrid */}
//         <Suspense fallback={<Spinner animation="border" />}>
//           <ProductGrid products={filteredProducts} />
//         </Suspense>

//         {/* Infinite scroll loader */}
//         {isFetchingNextPage && (
//           <div className="text-center py-3">
//             <Spinner animation="grow" />
//             <p>Loading more...</p>
//           </div>
//         )}
//       </Container>

//       {/* Footer */}
//       <div
//         className="position-fixed rounded-circle shadow d-flex align-items-center justify-content-center back-to-top-btn"
//         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         style={{ cursor: 'pointer', bottom: 30, right: 30, zIndex: 999 }}
//         aria-label="Back to top"
//         data-scroll-behavior="smooth"
//       >
//         <p className="mb-0 small p-2"><FaArrowCircleUp /> Back to top</p>
//       </div>
//     </MainLayout>
//   );
// }
"use client";

import React, { Suspense, lazy } from "react";
import { Spinner } from "react-bootstrap";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// 🧠 React Query client (for caching)
const queryClient = new QueryClient();

// 🧩 Lazy-load main HomeContent chunk
const HomeContent = lazy(() =>
  import(
    /* webpackChunkName: "home-content" */ "@/components/homeContent/HomeContent"
  )
);

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense
        fallback={
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p>Loading Home Page...</p>
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </QueryClientProvider>
  );
}
