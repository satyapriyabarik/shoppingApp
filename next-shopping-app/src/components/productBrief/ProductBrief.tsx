"use client";
import React from "react";
// import { useInView } from "react-intersection-observer";
import { Product } from "@/types/Product";
import Rating from "../rating/Rating";

export default function ProductBrief({ product }: { product: Product }) {
    // const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        // <div ref={ref} className={inView ? "fade-in" : "opacity-0"}>
        //     {inView && (
        <>
            <h5 className="fw-semibold mb-2">Product Details</h5>
            <p className="text-secondary">{product.description}</p>
            <hr />
            <h5 className="fw-semibold mb-2">Care Tips</h5>
            <p className="text-secondary">{product.care}</p>
            <hr />
            <h5 className="fw-semibold mb-2">Reviews</h5>
            <p className="text-secondary">Verified user: {product.reviews[0].userName}</p>
            <p className="text-secondary">Comments: <strong>{product.reviews[0].title}</strong><br />{product.reviews[0].comment}</p>
            <div className="text-secondary">Ratings: <Rating rating={product.reviews[0].rating} max={5} /></div>
        </>
        //     )}
        // </div>
    );
}
