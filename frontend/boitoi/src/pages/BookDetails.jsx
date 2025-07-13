import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import DefaultLayout from '../layouts/DefaultLayout';

const BookDetails = ({ username }) => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(false);

  const [comment, setComment] = useState('');
  const [commentConfirmed, setCommentConfirmed] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBook(data))
      .catch(err => console.error('Error fetching book:', err));
  }, [id]);

  const handleRatingClick = (value) => {
    setRating(value);
    setConfirmedRating(false);
  };

  const submitRating = () => {
    axios.post(`${API_BASE_URL}/api/ratings`, {
      bookId: book.ID,
      rating,
      username,
    }).then(() => setConfirmedRating(true));
  };

  const submitComment = () => {
    axios.post(`${API_BASE_URL}/api/comments`, {
      bookId: book.ID,
      comment,
      username,
    }).then(() => setCommentConfirmed(true));
  };

  if (!book) return (<DefaultLayout><p>Loading...</p></DefaultLayout>);

  return (
    <DefaultLayout>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left: Cover + Rating + Comment */}
        <div className="w-full">
          <img
            src={book.COVER_URL}
            alt={book.TITLE}
            className="max-w-[300px] w-full h-auto rounded shadow mb-4"
          />

          {/* Rating */}
          <div className="mb-6">
            <h2 className="font-semibold mb-1 ml-[-192px]">Rating:</h2>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <span
                  key={val}
                  className={`cursor-pointer text-2xl ${
                    (hovered || rating) >= val ? 'text-yellow-400' : 'text-gray-400'
                  }`}
                  onClick={() => handleRatingClick(val)}
                  onMouseEnter={() => setHovered(val)}
                  onMouseLeave={() => setHovered(0)}
                >
                  ★
                </span>
              ))}
            </div>
            {!confirmedRating && rating > 0 && (
              <button
                onClick={submitRating}
                className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Confirm Rating
              </button>
            )}
            {confirmedRating && (
              <p className="text-green-600 mt-1">Rating submitted!</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <h2 className="font-semibold mb-1">Leave a Comment:</h2>
            <textarea
              className="w-full border rounded p-2 mb-2"
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentConfirmed(false);
              }}
            />
            {!commentConfirmed && comment.trim() && (
              <button
                onClick={submitComment}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Submit Comment
              </button>
            )}
            {commentConfirmed && (
              <p className="text-green-600 mt-1">Comment submitted!</p>
            )}
          </div>
        </div>

        {/* Right: Book Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{book.TITLE}</h1>
          <p className="mb-4 text-gray-800">{book.DESCRIPTION}</p>

          <div className="mb-2">
            <h2 className="font-semibold">Authors:</h2>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {book.AUTHORS?.split(' · ').map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </div>

          <p><strong>Language:</strong> {book.LANGUAGE}</p>
          <p><strong>Publisher:</strong> {book.PUBLISHER_NAME}</p>
          <p><strong>Genre:</strong> {book.GENRE}</p>
          <p><strong>ISBN:</strong> {book.ISBN}</p>
          <p><strong>Added At:</strong> {book.ADDED_AT}</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default BookDetails;