import Link from 'next/link';

export default function Header() {
    return (
        <header className='p-4 bg-primary text-white sticky-top'>

            <h1 className="mb-3">NG Shopping App</h1>
            <nav className='mb-3'>
                <Link href="/">Home</Link> |{' '}
                <Link href="/products">Products</Link> |{' '}
                <Link href="/about">About</Link>

            </nav>
        </header>
    );
}
