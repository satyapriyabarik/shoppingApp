
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
