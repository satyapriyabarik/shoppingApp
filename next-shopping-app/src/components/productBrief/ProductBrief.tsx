import React from "react";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types/Product";

export default function ProductBrief({ product }: { product: Product }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div ref={ref} className={inView ? "fade-in" : "opacity-0"}>
            {inView && (
                <>
                    <h4 className="fw-semibold mb-2">Product Details</h4>
                    <p className="text-secondary">{product.description}</p>
                </>
            )}
        </div>
    );
}
