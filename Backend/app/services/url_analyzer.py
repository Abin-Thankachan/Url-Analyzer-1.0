import requests
from bs4 import BeautifulSoup
from collections import Counter
from typing import List, Dict
import re
import nltk
from nltk.corpus import stopwords
import ssl
from app.core.errors import ExternalServiceError, ValidationError
from app.core.environment import REQUEST_TIMEOUT, MAX_CONTENT_SIZE, CHUNK_SIZE, USER_AGENT

# Download NLTK data (run once)
try:
    # This ensures that NLTK's downloader doesn't fail due to SSL certificate verification errors. 
    # Especially in strict environments (e.g., macOS, behind proxies).
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

try:
    # Check if stopwords are already downloaded
    nltk.data.find('corpora/stopwords')
except LookupError:
    # Failsafe to ensure stopwords are available
    # Download stopwords if not found
    nltk.download('stopwords')

class UrlAnalyzerService:
    def __init__(self):
        self.stop_words = set(stopwords.words('english'))
        # Add common web-specific stop words
        self.stop_words.update(['com', 'www', 'http', 'https', 'html', 'php', 'asp', 'htm'])
    
    def fetch_url_content(self, url: str) -> str:
        """Fetch content from URL with proper error handling."""
        if not url or not url.strip():
            raise ValidationError("URL cannot be empty")
        
        # Basic URL validation
        if not url.startswith(('http://', 'https://')):
            raise ValidationError("URL must start with http:// or https://")
        
        try:
            headers = {
                'User-Agent': USER_AGENT
            }
            response = requests.get(
                url, 
                headers=headers, 
                timeout=REQUEST_TIMEOUT, 
                allow_redirects=True,
                stream=True  # Use streaming to check content size
            )
            response.raise_for_status()
            
            # Check content size to prevent memory issues
            content_length = response.headers.get('content-length')
            if content_length and int(content_length) > MAX_CONTENT_SIZE:
                raise ValidationError(f"Content size ({content_length} bytes) exceeds maximum allowed size ({MAX_CONTENT_SIZE} bytes)")
            
            # Read content with size limit
            content = ""
            downloaded = 0
            for chunk in response.iter_content(chunk_size=CHUNK_SIZE, decode_unicode=True):
                if chunk:
                    downloaded += len(chunk.encode('utf-8'))
                    if downloaded > MAX_CONTENT_SIZE:
                        raise ValidationError(f"Content size exceeds maximum allowed size ({MAX_CONTENT_SIZE} bytes)")
                    content += chunk
            
            return content
        except requests.exceptions.Timeout:
            raise ExternalServiceError(f"Request timeout while fetching URL: {url}", "TIMEOUT_ERROR")
        except requests.exceptions.ConnectionError:
            raise ExternalServiceError(f"Connection error while fetching URL: {url}", "CONNECTION_ERROR")
        except requests.exceptions.HTTPError as e:
            raise ExternalServiceError(f"HTTP error {response.status_code} while fetching URL: {url}", "HTTP_ERROR")
        except requests.RequestException as e:
            raise ExternalServiceError(f"Failed to fetch URL content: {str(e)}", "REQUEST_ERROR")
    
    def parse_content(self, html_content: str) -> str:
        """Parse HTML content and extract text, ignoring scripts, styles, and meta tags."""
        if not html_content or not html_content.strip():
            raise ValidationError("HTML content cannot be empty")
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script, style, meta, and other non-content tags
            for tag in soup(['script', 'style', 'meta', 'link', 'noscript', 'header', 'footer', 'nav']):
                tag.decompose()
            
            # Extract text
            text = soup.get_text()
            
            # Clean up text
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            if not text.strip():
                raise ValidationError("No readable text content found in the webpage")
            
            return text
        except ValidationError:
            raise  # Re-raise validation errors
        except Exception as e:
            raise ExternalServiceError(f"Failed to parse HTML content: {str(e)}", "PARSING_ERROR")
    
    def get_top_words(self, text: str, top_n: int = 5) -> List[Dict[str, any]]:
        """Extract top N most frequent words, excluding stop words."""
        if not text or not text.strip():
            raise ValidationError("Text content cannot be empty for word analysis")

        if top_n <= 0:
            raise ValidationError("top_n must be a positive integer")
        
        try:
            # Convert to lowercase and extract words
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
            
            # Filter out stop words and short words
            filtered_words = [word for word in words if word not in self.stop_words and len(word) > 2]
            
            if not filtered_words:
                raise ValidationError("No meaningful words found for analysis after filtering")
            
            # Count word frequencies
            word_counts = Counter(filtered_words)
            
            # Get top N words
            top_words = word_counts.most_common(top_n)
            
            return [{"word": word, "count": count} for word, count in top_words]
        except ValidationError:
            raise  # Re-raise validation errors
        except Exception as e:
            raise ExternalServiceError(f"Failed to analyze word frequency: {str(e)}", "ANALYSIS_ERROR")
    
    def analyze_url(self, url: str, top_n: int = 5) -> List[Dict[str, any]]:
        """Complete URL analysis pipeline."""
        try:
            html_content = self.fetch_url_content(url)
            text_content = self.parse_content(html_content)
            top_words = self.get_top_words(text_content, top_n)
            return top_words
        except (ValidationError, ExternalServiceError):
            raise  # Re-raise our custom errors
        except Exception as e:
            raise ExternalServiceError(f"Unexpected error during URL analysis: {str(e)}", "ANALYSIS_PIPELINE_ERROR")
