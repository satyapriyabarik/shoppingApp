import React from "react";
import { AiFillStar, AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

interface RatingProps {
    rating: number; // e.g., 3.5
    max?: number;   // default 5
}

export default function Rating({ rating, max = 5 }: RatingProps) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = max - fullStars - (halfStar ? 1 : 0);

    return (
        <div style={{ display: "flex", gap: "2px", color: "#f5c518" }}>
            {Array.from({ length: fullStars }, (_, i) => (
                <AiFillStar key={`full-${i}`} />
            ))}
            {halfStar && <AiTwotoneStar key="half" />}
            {Array.from({ length: emptyStars }, (_, i) => (
                <AiOutlineStar key={`empty-${i}`} />
            ))}
        </div>
    );
}
