import CategorySection from "./CategorySelection";

// Book Categories Section
const BookCategories = () => {
  const categories = [
    {
      title: "Fiction",
      books: [
        { id: 1, title: "The Midnight Library", author: "Matt Haig", price: "$13.99", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop", rating: 4.6 },
        { id: 2, title: "Klara and the Sun", author: "Kazuo Ishiguro", price: "$15.99", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop", rating: 4.4 },
        { id: 3, title: "The Guest List", author: "Lucy Foley", price: "$14.99", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop", rating: 4.5 },
        { id: 4, title: "Where the Crawdads Sing", author: "Delia Owens", price: "$16.99", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop", rating: 4.8 }
      ]
    },
    {
      title: "Non-Fiction",
      books: [
        { id: 5, title: "Educated", author: "Tara Westover", price: "$17.99", image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&h=400&fit=crop", rating: 4.7 },
        { id: 6, title: "Becoming", author: "Michelle Obama", price: "$18.99", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop", rating: 4.9 },
        { id: 7, title: "The Body Keeps the Score", author: "Bessel van der Kolk", price: "$19.99", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop", rating: 4.6 },
        { id: 8, title: "Sapiens", author: "Yuval Noah Harari", price: "$20.99", image: "https://images.unsplash.com/photo-1533327325824-76bc4e62d560?w=300&h=400&fit=crop", rating: 4.8 }
      ]
    },
    {
      title: "Mystery & Thriller",
      books: [
        { id: 9, title: "Gone Girl", author: "Gillian Flynn", price: "$14.99", image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop", rating: 4.3 },
        { id: 10, title: "The Silent Patient", author: "Alex Michaelides", price: "$15.99", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=400&fit=crop", rating: 4.5 },
        { id: 11, title: "Big Little Lies", author: "Liane Moriarty", price: "$13.99", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=400&fit=crop", rating: 4.4 },
        { id: 12, title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", price: "$16.99", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop", rating: 4.6 }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {categories.map((category, index) => (
          <CategorySection key={category.title} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

export default BookCategories;