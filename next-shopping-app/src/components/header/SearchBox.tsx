"use client";

import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, Button, ListGroup, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { getProducts } from "@/lib/api";
import { Product } from "@/types/Product";
import Link from "next/link";

interface SearchBoxProps {
    onSearch: (query: string, category: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("All");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch search results as user types
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        setLoading(true);

        const fetchResults = async () => {
            try {
                const allProducts = await getProducts(1, 50); // fetch first 50 items
                let filtered = allProducts.filter((p: Product) =>
                    p.name.toLowerCase().includes(query.toLowerCase())
                );

                if (category !== "All") {
                    filtered = filtered.filter((p: Product) => p.category === category);
                }

                setResults(filtered.slice(0, 5)); // show top 5 matches
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300); // debounce 300ms
        return () => clearTimeout(timer);
    }, [query, category]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query, category);
        setShowDropdown(false);
    };

    return (
        <div className="position-relative" ref={dropdownRef} style={{ minWidth: "400px" }}>
            <Form onSubmit={handleSubmit}>
                <InputGroup>
                    <Form.Select
                        style={{ maxWidth: "120px" }}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option>All</option>
                        <option>Flower</option>
                        <option>Succulent</option>
                        <option>Herb</option>
                    </Form.Select>

                    <Form.Control
                        type="text"
                        placeholder="Search products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query && results.length > 0 && setShowDropdown(true)}
                    />

                    <Button type="submit" variant="success">
                        <FaSearch />
                    </Button>
                </InputGroup>
            </Form>

            {/* Dropdown */}
            {showDropdown && (
                <ListGroup
                    className="position-absolute w-100 shadow-sm bg-white"
                    style={{ zIndex: 1000 }}
                >
                    {loading && (
                        <ListGroup.Item className="text-center">
                            <Spinner animation="border" size="sm" /> Loading...
                        </ListGroup.Item>
                    )}

                    {!loading && results.length === 0 && (
                        <ListGroup.Item className="text-center text-muted">
                            No results
                        </ListGroup.Item>
                    )}

                    {!loading &&
                        results.map((p) => (
                            <ListGroup.Item
                                key={p.id}
                                action
                                as={Link}
                                href={`/productDetails/${p.id}`} // exact folder name
                            >
                                {p.name} <span className="text-muted small">({p.category})</span>
                            </ListGroup.Item>
                        ))}
                </ListGroup>
            )}
        </div>
    );
}
