//Beautiful homepage for Boitoi--Your Online Bookshop project
import React from 'react';

import { useEffect, useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Col, Container, Row } from 'react-bootstrap'
import AiExplain from '../images/ai-explained.png'
import LangChain from '../images/langchain-llm.jpg'
import LangGraph from '../images/mastering-langgraph.jpg'
import GenerativeAi from '../images/generative-ai.jpg'
import HackedAgain from '../images/hacked-again.jpg'
import OreallyAi from '../images/oreally-ai.png'
import CyberSecurity from '../images/cyber-security.jpg'
import AiForBussiness from '../images/ai-for-bussiness.jpg'
import GenerativeAi2 from '../images/generative-ai-2.jpg'



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
  return (
    <>
      <div>
        <Container>
          <Row>
            <Col lg={6} md={6} className="mx-auto">
              <div style={{minWidth: 320}}>
                <Slider {...booksettings}>
                  <div className='book-slider-img'>
                    <img src={AiExplain} alt='Book Image 1' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={LangChain} alt='Book Image  2' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={LangGraph} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={GenerativeAi} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={HackedAgain} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={OreallyAi} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={CyberSecurity} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={AiForBussiness} alt='Book Image 3' />
                  </div>
                  <div className='book-slider-img'>
                    <img src={GenerativeAi2} alt='Book Image 3' />
                  </div>
                </Slider>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Homepage;