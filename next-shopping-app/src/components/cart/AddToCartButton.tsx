
import { Button } from "react-bootstrap";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/Product";
import { FaCartPlus } from "react-icons/fa";

export default function AddToCartButton({ product }: { product: Product }) {
    const addToCart = useCartStore((state) => state.addToCart);

    return (
        <Button
            variant="success"
            size="sm"
            onClick={() => addToCart(product)}
            className="mt-2 fw-semibold"
        >
            <FaCartPlus /> Add to Cart
        </Button>
    );
}
