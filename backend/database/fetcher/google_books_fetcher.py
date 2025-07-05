import requests
import json
from datetime import datetime
import time
import random
from typing import Dict, List, Optional

class BooksJSONFetcher:
    def __init__(self, api_key: str, output_file: str = "books_data.json"):
        self.api_key = api_key
        self.output_file = output_file
        self.base_url = "https://www.googleapis.com/books/v1/volumes"
        self.book_id_counter = 200
        self.author_id_counter = 200
        self.publisher_id_counter = 200
        
        # Data storage
        self.books = []
        self.authors = {}  # Use dict to avoid duplicates
        self.publishers = {}  # Use dict to avoid duplicates
        self.book_authors = []  # Junction table data
        
    def search_books(self, query: str, max_results: int = 40) -> List[Dict]:
        """Search for books using Google Books API"""
        params = {
            'q': query,
            'key': self.api_key,
            'maxResults': min(max_results, 40),  # API limit is 40
            'printType': 'books'
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            return data.get('items', [])
        except requests.exceptions.RequestException as e:
            print(f"Error fetching books: {e}")
            return []
    
    def extract_isbn(self, volume_info: Dict) -> Optional[str]:
        """Extract ISBN from volume info"""
        identifiers = volume_info.get('industryIdentifiers', [])
        for identifier in identifiers:
            if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                return identifier.get('identifier')
        return None
    
    def get_or_create_publisher(self, publisher_name: str) -> int:
        """Get existing publisher or create new one"""
        if not publisher_name:
            publisher_name = "Unknown Publisher"
            
        # Check if publisher already exists
        if publisher_name in self.publishers:
            return self.publishers[publisher_name]['ID']
        
        # Create new publisher
        publisher_id = self.publisher_id_counter
        self.publishers[publisher_name] = {
            'ID': publisher_id,
            'NAME': publisher_name,
            'ADDRESS': f"Address for {publisher_name}",
            'CITY': "Unknown City",
            'STATE': "Unknown State",
            'COUNTRY': "Unknown Country",
            'EMAIL': f"contact@{publisher_name.lower().replace(' ', '').replace('.', '')}.com",
            'PHONE': "+1-000-000-0000",
            'WEBSITE': f"https://www.{publisher_name.lower().replace(' ', '').replace('.', '')}.com",
            'PASSWORD_HASH': "hashed_password_placeholder",
            'CREATED_AT': datetime.now().isoformat(),
            'STATUS': "active"
        }
        
        self.publisher_id_counter += 1
        return publisher_id
    
    def get_or_create_author(self, author_name: str) -> int:
        """Get existing author or create new one"""
        if not author_name:
            author_name = "Unknown Author"
            
        # Check if author already exists
        if author_name in self.authors:
            return self.authors[author_name]['ID']
        
        # Create new author
        author_id = self.author_id_counter
        self.authors[author_name] = {
            'ID': author_id,
            'NAME': author_name,
            'BIO': f"Biography for {author_name}",
            'DATE_OF_BIRTH': "Unknown",
            'NATIONALITY': "Unknown",
            'WEBSITE': f"https://www.{author_name.lower().replace(' ', '').replace('.', '')}.com",
            'PHOTO_URL': f"https://via.placeholder.com/150?text={author_name.replace(' ', '+')}"
        }
        
        self.author_id_counter += 1
        return author_id
    
    def process_book(self, book_data: Dict) -> bool:
        """Process a single book from API response"""
        volume_info = book_data.get('volumeInfo', {})
        sale_info = book_data.get('saleInfo', {})
        
        # Extract book information
        title = volume_info.get('title', 'Unknown Title')
        isbn = self.extract_isbn(volume_info)
        published_date = volume_info.get('publishedDate', 'Unknown')
        publisher_name = volume_info.get('publisher', 'Unknown Publisher')
        page_count = volume_info.get('pageCount', 0)
        language = volume_info.get('language', 'en')
        description = volume_info.get('description', 'No description available')
        categories = volume_info.get('categories', ['General'])
        genre = categories[0] if categories else 'General'
        
        # Get cover image
        image_links = volume_info.get('imageLinks', {})
        cover_url = image_links.get('thumbnail', image_links.get('smallThumbnail', ''))
        
        # Get price information
        price = 0.0
        if sale_info.get('saleability') == 'FOR_SALE':
            price_info = sale_info.get('retailPrice', {})
            price = price_info.get('amount', random.uniform(9.99, 29.99))
        else:
            price = random.uniform(9.99, 29.99)
        
        # Get or create publisher
        publisher_id = self.get_or_create_publisher(publisher_name)
        
        # Create book record
        book_id = self.book_id_counter
        book_record = {
            'ID': book_id,
            'TITLE': title,
            'ISBN': isbn,
            'PUBLISHED_DATE': published_date,
            'PUBLISHER_ID': publisher_id,
            'PAGE_COUNT': page_count,
            'LANGUAGE': language,
            'EDITION': "1st Edition",
            'PRICE': round(price, 2),
            'STOCK_QUANTITY': random.randint(0, 50),
            'DESCRIPTION': description,
            'SHOW_BOOK': 1,
            'COVER_URL': cover_url,
            'ADDED_AT': datetime.now().isoformat(),
            'GENRE': genre
        }
        
        self.books.append(book_record)
        
        # Handle authors and book-author relationships
        authors = volume_info.get('authors', ['Unknown Author'])
        for author_name in authors:
            author_id = self.get_or_create_author(author_name)
            self.book_authors.append({
                'book_id': book_id,
                'author_id': author_id
            })
        
        self.book_id_counter += 1
        return True
    
    def fetch_books_by_queries(self, queries: List[str], books_per_query: int = 10):
        """Fetch books using multiple search queries"""
        total_processed = 0
        total_success = 0
        
        for query in queries:
            print(f"\nFetching books for query: '{query}'")
            books = self.search_books(query, books_per_query)
            
            for book in books:
                if self.process_book(book):
                    total_success += 1
                    print(f"✓ Processed book: {book.get('volumeInfo', {}).get('title', 'Unknown')}")
                else:
                    print(f"✗ Failed to process book: {book.get('volumeInfo', {}).get('title', 'Unknown')}")
                
                total_processed += 1
                
                # Rate limiting - be respectful to the API
                time.sleep(0.1)
        
        print(f"\n--- Summary ---")
        print(f"Total books processed: {total_processed}")
        print(f"Successfully processed: {total_success}")
        print(f"Failed to process: {total_processed - total_success}")
        print(f"Total authors: {len(self.authors)}")
        print(f"Total publishers: {len(self.publishers)}")
    
    def fetch_books_by_categories(self, categories: List[str], books_per_category: int = 20):
        """Fetch books by categories"""
        queries = [f"subject:{category}" for category in categories]
        self.fetch_books_by_queries(queries, books_per_category)
    
    def fetch_popular_books(self, count: int = 50):
        """Fetch popular/bestselling books"""
        queries = [
            "bestsellers",
            "popular fiction",
            "classic literature",
            "contemporary fiction",
            "mystery thriller",
            "science fiction",
            "fantasy",
            "romance",
            "biography",
            "history"
        ]
        books_per_query = max(1, count // len(queries))
        self.fetch_books_by_queries(queries, books_per_query)
    
    def save_to_json(self):
        """Save all data to JSON file"""
        data = {
            'books': self.books,
            'authors': list(self.authors.values()),
            'publishers': list(self.publishers.values()),
            'book_authors': self.book_authors,
            'metadata': {
                'total_books': len(self.books),
                'total_authors': len(self.authors),
                'total_publishers': len(self.publishers),
                'generated_at': datetime.now().isoformat(),
                'next_book_id': self.book_id_counter,
                'next_author_id': self.author_id_counter,
                'next_publisher_id': self.publisher_id_counter
            }
        }
        
        with open(self.output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"\nData saved to {self.output_file}")
        print(f"Books: {len(self.books)}")
        print(f"Authors: {len(self.authors)}")
        print(f"Publishers: {len(self.publishers)}")
        print(f"Book-Author relationships: {len(self.book_authors)}")

def main():
    # Configuration
    API_KEY = "AIzaSyChuYVvKJd9jZh624RVSr5OzCD058b6j2Y"  # Replace with your actual API key
    OUTPUT_FILE = "books_data.json"
    
    # Initialize fetcher
    fetcher = BooksJSONFetcher(API_KEY, OUTPUT_FILE)
    
    # Popular book categories
    categories = [
        "fiction",
        "mystery",
        "science fiction",
        "fantasy",
        "romance",
        "biography",
        "history",
        "science",
        "technology",
        "business",
        "self-help",
        "cooking",
        "art",
        "music",
        "sports"
    ]
    
    # Fetch books by categories
    print("Fetching books by categories...")
    fetcher.fetch_books_by_categories(categories, books_per_category=5)
    
    # Fetch some popular books
    print("\nFetching popular books...")
    fetcher.fetch_popular_books(count=30)
    
    # Save everything to JSON
    fetcher.save_to_json()
    
    print("\nJSON generation complete!")

if __name__ == "__main__":
    main()