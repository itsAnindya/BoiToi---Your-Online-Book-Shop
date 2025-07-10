import React from 'react';
import { useParams } from 'react-router-dom';
import { BOOK_CONSTANTS } from '../constants/books';
import { DefaultLayout } from '../layouts/DefaultLayout';

export default function BookDetails({ book, rank, onAddToCart }) {
  const { id } = useParams();
  const bookDetails = BOOK_CONSTANTS.find((b) => b.id === parseInt(id));
  if (!bookDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Book not found</h1>
      </div>
    );
  }
  return (
    <DefaultLayout>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Book Detail Page</h1>
        <h2 className="text-xl">{bookDetails.title}</h2>
      </div>
    </DefaultLayout>
  );
}