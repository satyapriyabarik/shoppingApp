import Image from "next/image";
import { Carousel } from "react-bootstrap";
import { motion } from "framer-motion";

export default function BannerCarousel() {
    return (
        <Carousel fade className="mb-4 banner-carousel">
            <Carousel.Item>
                <Image
                    className="d-block w-100"
                    src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=30"
                    alt="Banner 1"
                    width={1600}
                    height={400}
                    style={{ objectFit: "cover" }}
                    priority
                />
                <Carousel.Caption className="middle-caption">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-white fw-bold">Welcome to GreenKart</h3>
                        <p className="text-light">Discover plants that brighten your home</p>
                    </motion.div>
                </Carousel.Caption>
            </Carousel.Item>

            <Carousel.Item>
                <Image
                    className="d-block w-100"
                    src="https://images.unsplash.com/photo-1555037015-1498966bcd7c?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGxhbnR8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.1.0&q=60&w=1600"
                    alt="Banner 2"
                    width={1600}
                    height={400}
                    style={{ objectFit: "cover" }}
                    priority
                />
                <Carousel.Caption className="middle-caption">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="fw-bold text-white">Fresh Arrivals Weekly</h3>
                        <p className="text-light">Grow your green collection</p>
                    </motion.div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}
