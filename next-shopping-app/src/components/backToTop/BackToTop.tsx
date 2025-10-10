import { FaArrowCircleUp } from "react-icons/fa";
import { useState, useEffect } from "react";
export default function BackToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    return (
        // ⬆️ Back to top
        // Show button when page is scrolled down
        <>
            {visible ?
                <div
                    className="position-fixed rounded-circle shadow d-flex align-items-center justify-content-center back-to-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    style={{
                        cursor: "pointer",
                        bottom: 30,
                        right: 30,
                        zIndex: 999,
                        background: "white",
                        padding: "8px 12px",
                    }}
                    aria-label="Back to top"
                    data-scroll-behavior="smooth"
                >
                    <p className="mb-0 small p-2 text-success fw-bold">
                        <FaArrowCircleUp /> Back to top
                    </p>
                </div>
                : <></>
            }
        </>
    );
}
