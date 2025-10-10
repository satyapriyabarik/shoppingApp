// pages/login.tsx
"use client";

import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout"; // ensure default export and correct path
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

export default function LoginPage() {
    const router = useRouter();
    const [csrf, setCsrf] = useState<string | null>(null);
    const [username, setUsername] = useState("user");
    const [password, setPassword] = useState("pass");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch CSRF token (sets csrf cookie AND returns token)
        fetch("/api/csrf")
            .then((r) => r.json())
            .then((data) => setCsrf(data.csrfToken))
            .catch(() => { });
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrf ?? "",
                },
                body: JSON.stringify({ username, password }),
            });

            if (res.status === 200) {
                // Login succeeded. Redirect to /cart if desired.
                router.push("/cart");
            } else if (res.status === 401) {
                setError("Invalid credentials");
            } else if (res.status === 403) {
                setError("CSRF check failed");
            } else {
                setError("Login failed");
            }
        } catch (err) {
            setError("Network error:" + err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <MainLayout title="Login">
            <Container style={{ maxWidth: 720 }} className="py-5">
                <h2 className="mb-4">Login</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control value={username} onChange={(e) => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>

                    <div className="d-flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? <><Spinner animation="border" size="sm" /> Signing in...</> : "Sign in"}
                        </Button>
                        <Button variant="secondary" onClick={() => { setUsername("user"); setPassword("pass"); }}>
                            Fill demo creds
                        </Button>
                    </div>
                </Form>
            </Container>
        </MainLayout>
    );
}
