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
import DefaultLayout from '../layouts/DefaultLayout';

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

export default function Homepage() {
  return (
    <DefaultLayout>
      <BestsellerSlider />
    </DefaultLayout>
  );
}