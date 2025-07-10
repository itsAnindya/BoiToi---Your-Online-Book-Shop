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
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Cover Image */}
        <div className="w-full">
          <img
            src={book.COVER_URL}
            alt={book.TITLE}
            className="w-full h-auto rounded shadow"
          />
        </div>

        {/* Book Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{book.TITLE}</h1>

          {/* Description */}
          <p className="mb-4 text-gray-800">{book.DESCRIPTION}</p>

          {/* Authors */}
          <div className="mb-2">
            <h2 className="font-semibold">Authors:</h2>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {book.AUTHORS?.split(' · ').map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </div>

          {/* Other Metadata */}
          <p><span className="font-semibold">Language:</span> {book.LANGUAGE}</p>
          <p><span className="font-semibold">Publisher:</span> {book.PUBLISHER_NAME}</p>
          <p><span className="font-semibold">Genre:</span> {book.GENRE}</p>
          <p><span className="font-semibold">ISBN:</span> {book.ISBN}</p>
          <p><span className="font-semibold">Added At:</span> {book.ADDED_AT}</p>
        </div>

      </div>
    </DefaultLayout>
  );

};

export default BookDetails;
