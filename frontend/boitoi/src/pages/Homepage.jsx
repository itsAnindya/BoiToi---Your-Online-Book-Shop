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
import NavBar from '../components/NavBar';
import BestsellerSlider from '../components/BestSellerSlider';

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
        const response = await fetch(`${API_BASE_URL}/api/books/home`, {
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
      <div className='flex flex-col items-center justify-center'>
        <NavBar />
        <BestsellerSlider books={books} settings={booksettings} />
      </div>
    </>
  );
};

export default Homepage;