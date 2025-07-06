//Beautiful homepage for Boitoi--Your Online Bookshop project
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col, Container, Row } from 'react-bootstrap';
import '../styles/book_card.css';
import { API_BASE_URL } from '../config';
import BookShowcase from '../components/BookShowcase';
import BestsellerBooksSection from '../components/BestSellerBooksSection';

const booksettings = {
  dots: true,
  arrows: true,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  speed: 2000,
  autoplaySpeed: 2000,
  cssEase: "ease-in-out",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

const Homepage = () => {
  console.log('Homepage component rendered');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching best sellers...');
    const fetchBestSellers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/home`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching best sellers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading best sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger" role="alert">
          Error loading books: {error}
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-5">
        <p>No books available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <Container>
          <Row>
            <Col lg={12} md={12} className="mx-auto">
              <div className="text-center mb-4">
                <h2>Best Sellers</h2>
                <p>Discover our top-rated books based on customer reviews</p>
              </div>
              <div style={{ minWidth: 320 }}>
                <Slider {...booksettings}>
                  {books.map((book) => (
                    <div key={book.id} className='book-slider-img'>
                      <div className="book-card p-3">
                        <img
                          src={book.cover_url || '/images/default-book-cover.jpg'}
                          alt={book.title || 'Book Cover'}
                          style={{
                            width: '100%',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '15px'
                          }}
                        />
                        <div className="book-info">
                          <h5 className="book-title" style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginBottom: '10px',
                            height: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {book.title}
                          </h5>
                          <p className="book-genre" style={{
                            color: '#666',
                            fontSize: '0.9rem',
                            marginBottom: '5px'
                          }}>
                            {book.genre}
                          </p>
                          <p className="book-price" style={{
                            color: '#007bff',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                          }}>
                            ${book.price}
                          </p>
                          <p className="book-description" style={{
                            fontSize: '0.85rem',
                            color: '#555',
                            height: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {book.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div><BestsellerBooksSection /></div>
    </>
  );
};

export default Homepage;