import MainLayout from "@/components/layouts";

export async function getStaticProps() {
    return {
        props: {
            content: 'Welcome to NG Shopping App, your one-stop destination for smart, secure, and seamless online shopping.We bring you a wide range of quality products from trusted brands — all at your fingertips.At NG Shopping, we believe shopping should be easy, enjoyable, and affordable.Whether you’re looking for the latest electronics, trendy fashion, home essentials, or unique gifts, we have got something special for everyone.'
        }
    };
}

export default function AboutPage({ content }: { content: string }) {
    return (
        <MainLayout title="About">
            <h2>About Us</h2>
            <p>{content}</p>
            <p>Founded with a passion for innovation and customer satisfaction,
                NG Shopping App started as a small idea to simplify how people shop online.
                What began as a small local project has now grown into a trusted online marketplace
                that connects customers with the best products and sellers across India.

                Our journey has been powered by technology, transparency, and trust —
                the three pillars that define everything we do.</p>
            <p>To create a shopping experience that's personal, fast, and reliable.
                We aim to make every customer feel confident, informed, and delighted — every time they shop.</p>
        </MainLayout>
    );
}
