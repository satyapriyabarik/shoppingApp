import { Row, Col, Form, InputGroup } from "react-bootstrap";

export default function SearchSortBar({
    search,
    setSearch,
    sortBy,
    setSortBy,
}: {
    search: string;
    setSearch: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
}) {
    return (
        <Row className="mb-4 align-items-center">
            <Col md={6} className="mb-2">
                <InputGroup>
                    <InputGroup.Text>🔍</InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
            </Col>
            <Col md={3} className="mb-2">
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="">Sort by...</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price">Price (Low-High)</option>
                </Form.Select>
            </Col>
        </Row>
    );
}
