//Beautiful homepage for Boitoi--Your Online Bookshop project
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/book_card.css';
import BestsellerSlider from '../components/BestSellerSlider';
import DefaultLayout from '../layouts/DefaultLayout';
import BestsellerBooksSection from "../components/BestSellerBooksSection";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <BestsellerSlider />
        <BestsellerBooksSection/>
      </div>
    </DefaultLayout>
  );
}