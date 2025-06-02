import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../ProductCard';
import './styles.css';

const ProductGrid = ({ 
    products, 
    loading, 
    error, 
    onAddToCart, 
    onToggleFavorite,
    favorites = []
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (loading && !isMounted) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">טוען מוצרים...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="my-4">
                <Alert.Heading>אירעה שגיאה בטעינת המוצרים</Alert.Heading>
                <p>{error.message || 'נסה לרענן את הדף או לחזור מאוחר יותר'}</p>
            </Alert>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-5">
                <h4 className="text-muted">לא נמצאו מוצרים</h4>
                <p className="text-muted">נסה לשנות את סינון החיפוש שלך</p>
            </div>
        );
    }

    return (
        <Container fluid className="product-grid-container">
            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
                {products.map((product) => (
                    <Col key={product._id} className="d-flex">
                        <ProductCard
                            product={product}
                            onAddToCart={onAddToCart}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={favorites.some(fav => fav._id === product._id)}
                        />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

ProductGrid.propTypes = {
    products: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            brand: PropTypes.string.isRequired,
            price: PropTypes.number.isRequired,
            images: PropTypes.arrayOf(PropTypes.string),
            discount: PropTypes.number,
            isNew: PropTypes.bool,
            rating: PropTypes.number,
            sizes: PropTypes.arrayOf(
                PropTypes.shape({
                    name: PropTypes.string.isRequired,
                    inStock: PropTypes.bool.isRequired
                })
            )
        })
    ),
    loading: PropTypes.bool,
    error: PropTypes.object,
    onAddToCart: PropTypes.func,
    onToggleFavorite: PropTypes.func,
    favorites: PropTypes.array
};

ProductGrid.defaultProps = {
    products: [],
    loading: false,
    favorites: []
};

export default ProductGrid;