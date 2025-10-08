import Head from 'next/head';
import styles from './MainLayout.module.css';
import Header from '../header';
import Footer from '../footer';

interface MainLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function MainLayout({ title, children }: MainLayoutProps) {
    return (
        <main className={styles.container}>
            <Head>
                <title>{title}</title>
            </Head>
            <Header />
            <main className={styles.main}>{children}</main>
            <Footer />
        </main>
    );
}
