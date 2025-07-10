import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';

const BookDetails = () => {
  const { id } = useParams(); // 👈 get book ID from URL
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));
  }, [id]);

  if (!book) return (<DefaultLayout><p>Loading...</p></DefaultLayout>);

  return (
    <DefaultLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{book.TITLE}</h1>
        <p className="text-gray-600">By {book.AUTHOR}</p>
        <p className="mt-4">{book.DESCRIPTION}</p>
        {/* show more: publisher, price, reviews, etc */}
      </div>
    </DefaultLayout>
  );
};

export default BookDetails;
