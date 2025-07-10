import React from "react";
import Header from "../components/Header/Header";
import HeroSection from "../components/Hero/HeroSection";
import BookCategories from "../components/Books/BookCategories";
import Footer from "../components/Footer/Footer";

// Main Homepage Component
const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* <HeroSection />
      <BookCategories />
      <Footer /> */}
    </div>
  );
};

export default Homepage;