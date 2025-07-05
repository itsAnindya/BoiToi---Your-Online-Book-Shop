import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
import re

class GoogleBooksDataFetcher:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://www.googleapis.com/books/v1/volumes"
        self.books_data = []
        self.authors_data = []
        self.publishers_data = []
        
        # ID counters
        self.book_id_counter = 200
        self.author_id_counter = 200
        self.publisher_id_counter = 200
        
        # Tracking dictionaries to avoid duplicates
        self.author_names = {}  # name -> id
        self.publisher_names = {}  # name -> id
        
    def search_books(self, query: str, max_results: int = 40) -> List[Dict]:
        """Search for books using Google Books API"""
        params = {
            'q': query,
            'key': self.api_key,
            'maxResults': min(max_results, 40),  # API limit is 40 per request
            'printType': 'books'
        }
        
        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json().get('items', [])
        except requests.exceptions.RequestException as e:
            print(f"Error fetching books for query '{query}': {e}")
            return []
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing HTML tags and extra whitespace"""
        if not text:
            return ""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        # Remove extra whitespace
        text = ' '.join(text.split())
        return text[:500]  # Limit description length
    
    def parse_date(self, date_str: str) -> Optional[str]:
        """Parse date string and return in YYYY-MM-DD format"""
        if not date_str:
            return None
        
        # Try different date formats
        formats = ['%Y-%m-%d', '%Y-%m', '%Y']
        for fmt in formats:
            try:
                if len(date_str) == 4:  # Just year
                    return f"{date_str}-01-01"
                elif len(date_str) == 7:  # YYYY-MM
                    return f"{date_str}-01"
                else:
                    return datetime.strptime(date_str, fmt).strftime('%Y-%m-%d')
            except ValueError:
                continue
        return None
    
    def get_or_create_author(self, author_name: str) -> int:
        """Get existing author ID or create new author"""
        if author_name in self.author_names:
            return self.author_names[author_name]
        
        author_id = self.author_id_counter
        self.author_names[author_name] = author_id
        
        # Create author record
        author_data = {
            'ID': author_id,
            'NAME': author_name,
            'BIO': f"Author of various published works including books available in our collection.",
            'DATE_OF_BIRTH': None,
            'NATIONALITY': None,
            'WEBSITE': None,
            'PHOTO_URL': None
        }
        
        self.authors_data.append(author_data)
        self.author_id_counter += 1
        return author_id
    
    def get_or_create_publisher(self, publisher_name: str) -> int:
        """Get existing publisher ID or create new publisher"""
        if publisher_name in self.publisher_names:
            return self.publisher_names[publisher_name]
        
        publisher_id = self.publisher_id_counter
        self.publisher_names[publisher_name] = publisher_id
        
        # Create publisher record
        publisher_data = {
            'ID': publisher_id,
            'NAME': publisher_name,
            'ADDRESS': None,
            'CITY': None,
            'STATE': None,
            'COUNTRY': None,
            'EMAIL': None,
            'PHONE': None,
            'WEBSITE': None,
            'PASSWORD_HASH': None,
            'CREATED_AT': datetime.now().isoformat(),
            'STATUS': 'active'
        }
        
        self.publishers_data.append(publisher_data)
        self.publisher_id_counter += 1
        return publisher_id
    
    def process_book_item(self, item: Dict) -> Optional[Dict]:
        """Process a single book item from Google Books API"""
        try:
            volume_info = item.get('volumeInfo', {})
            sale_info = item.get('saleInfo', {})
            
            # Basic book information
            title = volume_info.get('title', 'Unknown Title')
            isbn = None
            
            # Extract ISBN
            industry_identifiers = volume_info.get('industryIdentifiers', [])
            for identifier in industry_identifiers:
                if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                    isbn = identifier.get('identifier')
                    break
            
            # Skip if no ISBN (optional, remove if you want books without ISBN)
            if not isbn:
                isbn = f"TEMP_{self.book_id_counter}"
            
            # Authors
            authors = volume_info.get('authors', ['Unknown Author'])
            main_author_id = self.get_or_create_author(authors[0])
            
            # Publisher
            publisher_name = volume_info.get('publisher', 'Unknown Publisher')
            publisher_id = self.get_or_create_publisher(publisher_name)
            
            # Dates
            published_date = self.parse_date(volume_info.get('publishedDate'))
            
            # Other details
            page_count = volume_info.get('pageCount', 0)
            language = volume_info.get('language', 'en')
            description = self.clean_text(volume_info.get('description', ''))
            
            # Categories (genres)
            categories = volume_info.get('categories', [])
            genre = categories[0] if categories else 'General'
            
            # Cover image
            image_links = volume_info.get('imageLinks', {})
            cover_url = image_links.get('thumbnail') or image_links.get('smallThumbnail')
            
            # Price (from sale info)
            price = None
            if sale_info.get('saleability') == 'FOR_SALE':
                retail_price = sale_info.get('retailPrice', {})
                price = retail_price.get('amount', 9.99)
            else:
                price = 9.99  # Default price
            
            book_data = {
                'ID': self.book_id_counter,
                'TITLE': title,
                'ISBN': isbn,
                'PUBLISHED_DATE': published_date,
                'PUBLISHER_ID': publisher_id,
                'PAGE_COUNT': page_count,
                'LANGUAGE': language,
                'EDITION': '1st',  # Default edition
                'PRICE': price,
                'STOCK_QUANTITY': 10,  # Default stock
                'DESCRIPTION': description,
                'SHOW_BOOK': 1,
                'COVER_URL': cover_url,
                'ADDED_AT': datetime.now().isoformat(),
                'GENRE': genre
            }
            
            self.book_id_counter += 1
            return book_data
            
        except Exception as e:
            print(f"Error processing book item: {e}")
            return None
    
    def fetch_books_by_genres(self, genres: List[str], books_per_genre: int = 20):
        """Fetch books for multiple genres"""
        for genre in genres:
            print(f"Fetching books for genre: {genre}")
            
            # Search for books in this genre
            books = self.search_books(f"subject:{genre}", books_per_genre)
            
            for book_item in books:
                book_data = self.process_book_item(book_item)
                if book_data:
                    self.books_data.append(book_data)
            
            # Rate limiting - be respectful to the API
            time.sleep(1)
    
    def fetch_popular_books(self, queries: List[str], max_per_query: int = 20):
        """Fetch popular books using specific search queries"""
        for query in queries:
            print(f"Fetching books for query: {query}")
            
            books = self.search_books(query, max_per_query)
            
            for book_item in books:
                book_data = self.process_book_item(book_item)
                if book_data:
                    self.books_data.append(book_data)
            
            # Rate limiting
            time.sleep(1)
    
    def save_to_json(self, filename_prefix: str = "bookstore_data"):
        """Save all data to JSON files"""
        # Save books data
        with open(f"{filename_prefix}_books.json", 'w', encoding='utf-8') as f:
            json.dump(self.books_data, f, indent=2, ensure_ascii=False)
        
        # Save authors data
        with open(f"{filename_prefix}_authors.json", 'w', encoding='utf-8') as f:
            json.dump(self.authors_data, f, indent=2, ensure_ascii=False)
        
        # Save publishers data
        with open(f"{filename_prefix}_publishers.json", 'w', encoding='utf-8') as f:
            json.dump(self.publishers_data, f, indent=2, ensure_ascii=False)
        
        print(f"Data saved to JSON files:")
        print(f"- Books: {len(self.books_data)} records")
        print(f"- Authors: {len(self.authors_data)} records")
        print(f"- Publishers: {len(self.publishers_data)} records")
    
    def get_summary(self):
        """Print summary of fetched data"""
        print("\n=== Data Fetching Summary ===")
        print(f"Total Books: {len(self.books_data)}")
        print(f"Total Authors: {len(self.authors_data)}")
        print(f"Total Publishers: {len(self.publishers_data)}")
        
        # Genre distribution
        if self.books_data:
            genres = {}
            for book in self.books_data:
                genre = book.get('GENRE', 'Unknown')
                genres[genre] = genres.get(genre, 0) + 1
            
            print(f"\nGenre Distribution:")
            for genre, count in sorted(genres.items(), key=lambda x: x[1], reverse=True):
                print(f"  {genre}: {count} books")

def main():
    # Replace with your Google Books API key
    API_KEY = "AIzaSyChuYVvKJd9jZh624RVSr5OzCD058b6j2Y"
    
    # Initialize the fetcher
    fetcher = GoogleBooksDataFetcher(API_KEY)
    
    # Define genres to search for
    genres = [
        "fiction", "mystery", "romance", "science fiction", "fantasy",
        "thriller", "biography", "history", "science", "technology",
        "business", "self-help", "health", "cooking", "travel",
        "art", "photography", "music", "sports", "religion"
    ]
    
    # Define popular search queries
    popular_queries = [
        "bestseller", "award winner", "classic literature", 
        "new release", "popular fiction", "non-fiction bestseller"
    ]
    
    print("Starting data fetching...")
    
    # Fetch books by genres (10 books per genre)
    fetcher.fetch_books_by_genres(genres, books_per_genre=10)
    
    # Fetch popular books
    fetcher.fetch_popular_books(popular_queries, max_per_query=15)
    
    # Save data to JSON files
    fetcher.save_to_json()
    
    # Print summary
    fetcher.get_summary()

if __name__ == "__main__":
    main()