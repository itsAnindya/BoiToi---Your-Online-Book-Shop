import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
import hashlib

class GoogleBooksFetcher:
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Google Books API fetcher.
        
        Args:
            api_key: Optional Google Books API key for higher rate limits
        """
        self.api_key = api_key
        self.base_url = "https://www.googleapis.com/books/v1/volumes"
        self.current_ids = {
            'book': 200,
            'author': 200,
            'publisher': 200,
            'category': 200
        }
        self.data = {
            'books': [],
            'authors': [],
            'publishers': [],
            'categories': [],
            'book_authors': [],
            'book_categories': []
        }
        self.author_cache = {}  # Cache to avoid duplicate authors
        self.publisher_cache = {}  # Cache to avoid duplicate publishers
        self.category_cache = {}  # Cache to avoid duplicate categories
        
    def fetch_books(self, queries: List[str], max_results_per_query: int = 40) -> Dict[str, Any]:
        """
        Fetch books from Google Books API based on search queries.
        
        Args:
            queries: List of search queries
            max_results_per_query: Maximum results per query (API limit is 40)
            
        Returns:
            Dictionary containing all fetched and processed data
        """
        print(f"Starting to fetch books with {len(queries)} queries...")
        
        for query_idx, query in enumerate(queries):
            print(f"Processing query {query_idx + 1}/{len(queries)}: '{query}'")
            
            # Fetch books for this query
            books_data = self._fetch_books_for_query(query, max_results_per_query)
            
            # Process each book
            for book_data in books_data:
                self._process_book(book_data)
                
            # Rate limiting - respect API limits
            time.sleep(1)
            
        print(f"Finished fetching. Total books: {len(self.data['books'])}")
        return self.data
    
    def _fetch_books_for_query(self, query: str, max_results: int) -> List[Dict]:
        """Fetch books for a single query."""
        books = []
        start_index = 0
        
        while len(books) < max_results:
            # Calculate how many results to fetch in this request
            results_to_fetch = min(40, max_results - len(books))
            
            params = {
                'q': query,
                'startIndex': start_index,
                'maxResults': results_to_fetch,
                'printType': 'books'
            }
            
            if self.api_key:
                params['key'] = self.api_key
                
            try:
                response = requests.get(self.base_url, params=params)
                response.raise_for_status()
                
                data = response.json()
                
                if 'items' not in data:
                    break
                    
                books.extend(data['items'])
                
                # If we got fewer results than requested, we've reached the end
                if len(data['items']) < results_to_fetch:
                    break
                    
                start_index += len(data['items'])
                
            except requests.exceptions.RequestException as e:
                print(f"Error fetching books for query '{query}': {e}")
                break
                
        return books
    
    def _process_book(self, book_data: Dict) -> None:
        """Process a single book and extract all related data."""
        volume_info = book_data.get('volumeInfo', {})
        sale_info = book_data.get('saleInfo', {})
        
        # Extract basic book information
        book_id = self.current_ids['book']
        self.current_ids['book'] += 1
        
        # Parse publication date
        published_date = self._parse_date(volume_info.get('publishedDate', ''))
        
        # Extract ISBN
        isbn = self._extract_isbn(volume_info.get('industryIdentifiers', []))
        
        # Process publisher
        publisher_id = None
        if volume_info.get('publisher'):
            publisher_id = self._process_publisher(volume_info['publisher'])
        
        # Extract price information
        price = None
        if sale_info.get('saleability') == 'FOR_SALE' and sale_info.get('listPrice'):
            price = sale_info['listPrice'].get('amount', 0)
        
        # Create book record
        book = {
            'ID': book_id,
            'TITLE': volume_info.get('title', ''),
            'ISBN': isbn,
            'PUBLISHED_DATE': published_date,
            'PUBLISHER_ID': publisher_id,
            'PAGE_COUNT': volume_info.get('pageCount'),
            'LANGUAGE': volume_info.get('language', 'en'),
            'EDITION': None,  # Not available in Google Books API
            'PRICE': price,
            'STOCK_QUANTITY': 0,  # Default value
            'DESCRIPTION': volume_info.get('description', ''),
            'SHOW_BOOK': True,  # Default value
            'COVER_URL': self._get_cover_url(volume_info.get('imageLinks', {})),
            'ADDED_AT': datetime.now().isoformat(),
            'GENRE': ', '.join(volume_info.get('categories', []))
        }
        
        self.data['books'].append(book)
        
        # Process authors
        if volume_info.get('authors'):
            for author_name in volume_info['authors']:
                author_id = self._process_author(author_name)
                self.data['book_authors'].append({
                    'BOOK_ID': book_id,
                    'AUTHOR_ID': author_id,
                    'CONTRIBUTION': 'Author'
                })
        
        # Process categories
        if volume_info.get('categories'):
            for category_name in volume_info['categories']:
                category_id = self._process_category(category_name)
                self.data['book_categories'].append({
                    'BOOK_ID': book_id,
                    'CATEGORY_ID': category_id
                })
    
    def _process_author(self, author_name: str) -> int:
        """Process an author and return their ID."""
        if author_name in self.author_cache:
            return self.author_cache[author_name]
        
        author_id = self.current_ids['author']
        self.current_ids['author'] += 1
        
        author = {
            'ID': author_id,
            'NAME': author_name,
            'BIO': None,
            'DATE_OF_BIRTH': None,
            'NATIONALITY': None,
            'WEBSITE': None,
            'PHOTO_URL': None
        }
        
        self.data['authors'].append(author)
        self.author_cache[author_name] = author_id
        
        return author_id
    
    def _process_publisher(self, publisher_name: str) -> int:
        """Process a publisher and return their ID."""
        if publisher_name in self.publisher_cache:
            return self.publisher_cache[publisher_name]
        
        publisher_id = self.current_ids['publisher']
        self.current_ids['publisher'] += 1
        
        publisher = {
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
        
        self.data['publishers'].append(publisher)
        self.publisher_cache[publisher_name] = publisher_id
        
        return publisher_id
    
    def _process_category(self, category_name: str) -> int:
        """Process a category and return its ID."""
        if category_name in self.category_cache:
            return self.category_cache[category_name]
        
        category_id = self.current_ids['category']
        self.current_ids['category'] += 1
        
        category = {
            'ID': category_id,
            'NAME': category_name,
            'DESCRIPTION': None,
            'PARENT_ID': None
        }
        
        self.data['categories'].append(category)
        self.category_cache[category_name] = category_id
        
        return category_id
    
    def _extract_isbn(self, identifiers: List[Dict]) -> Optional[str]:
        """Extract ISBN from industry identifiers."""
        for identifier in identifiers:
            if identifier.get('type') in ['ISBN_13', 'ISBN_10']:
                return identifier.get('identifier')
        return None
    
    def _parse_date(self, date_string: str) -> Optional[str]:
        """Parse publication date from various formats."""
        if not date_string:
            return None
            
        # Handle different date formats
        formats = ['%Y-%m-%d', '%Y-%m', '%Y']
        
        for fmt in formats:
            try:
                parsed_date = datetime.strptime(date_string, fmt)
                return parsed_date.strftime('%Y-%m-%d')
            except ValueError:
                continue
                
        return None
    
    def _get_cover_url(self, image_links: Dict) -> Optional[str]:
        """Get the best available cover URL."""
        for size in ['extraLarge', 'large', 'medium', 'small', 'thumbnail']:
            if size in image_links:
                return image_links[size]
        return None
    
    def save_to_json(self, output_dir: str = 'book_data') -> None:
        """Save all data to separate JSON files."""
        os.makedirs(output_dir, exist_ok=True)
        
        files = {
            'books.json': self.data['books'],
            'authors.json': self.data['authors'],
            'publishers.json': self.data['publishers'],
            'categories.json': self.data['categories'],
            'book_authors.json': self.data['book_authors'],
            'book_categories.json': self.data['book_categories']
        }
        
        for filename, data in files.items():
            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"Saved {len(data)} records to {filepath}")
    
    def get_summary(self) -> Dict[str, int]:
        """Get a summary of fetched data."""
        return {
            'books': len(self.data['books']),
            'authors': len(self.data['authors']),
            'publishers': len(self.data['publishers']),
            'categories': len(self.data['categories']),
            'book_authors': len(self.data['book_authors']),
            'book_categories': len(self.data['book_categories'])
        }


def main():
    """Example usage of the GoogleBooksFetcher."""
    # Initialize fetcher (optionally provide API key)
    fetcher = GoogleBooksFetcher(api_key="AIzaSyChuYVvKJd9jZh624RVSr5OzCD058b6j2Y")  # Add your API key here if you have one
    
    # Define search queries
    search_queries = [
        "python programming",
        "data science",
        "machine learning",
        "web development",
        "artificial intelligence",
        "fiction bestsellers",
        "science fiction",
        "mystery novels",
        "biography",
        "history"
    ]
    
    try:
        # Fetch books (adjust max_results_per_query as needed)
        print("Starting book fetching process...")
        data = fetcher.fetch_books(search_queries, max_results_per_query=20)
        
        # Save to JSON files
        print("\nSaving data to JSON files...")
        fetcher.save_to_json()
        
        # Print summary
        print("\n" + "="*50)
        print("FETCHING SUMMARY")
        print("="*50)
        summary = fetcher.get_summary()
        for key, value in summary.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        
        print("\nData saved successfully!")
        
    except Exception as e:
        print(f"Error during fetching: {e}")


if __name__ == "__main__":
    main()