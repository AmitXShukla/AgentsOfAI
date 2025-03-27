# More Tool Functions

Before we conclude this discussion about the Tool functions, I’d like to share some additional code examples with you. **This information is supplementary and completely optional**, but it’s something we’ll use frequently later on, so it’s worth learning how to work with it now.

By doing so, you’ll be better prepared to handle more significant tasks when we work on actual production-ready code.
*This is practice code for later use in Pro use cases and advanced tool tasks.*

## Employee Database

Imagine we have an Employee database that tracks employee details and HR processes. A manager is an employee who oversees others. The database also handles processes like PTO (time off), expenses, issues, assignments, and more.

This is an ERD (diagram) showing this sample database.

 ```{mermaid}
 erDiagram
    EMPLOYEE {
        int employee_id PK
        string name
        string address
        string phone
        string email
        int manager_id FK
    }
    ASSIGNMENT {
        int assignment_id PK
        string project
        string task
        string description
        date start_date
        date end_date
        int hours
        int employee_id FK
    }
    EXPENSE {
        int expense_id PK
        string project
        string description
        date start_date
        date end_date
        int amount
        int employee_id FK
    }
    ISSUES {
        int ticket_id PK
        string project
        string description
        date start_date
        date end_date
        string resolution
        int employee_id FK
    }
    PTO {
        int pto_id PK
        string description
        date start_date
        date end_date
        int hours
        int employee_id FK
    }
    EMPLOYEE ||--o{ EMPLOYEE : "manages"
    EMPLOYEE ||--o{ ASSIGNMENT : "has"
    EMPLOYEE ||--o{ EXPENSE : "has"
    EMPLOYEE ||--o{ ISSUES : "has"
    EMPLOYEE ||--o{ PTO : "has"
```

### database script
In this script, we’ll first write a SQLite script to create the database and add sample data.

```python
import sqlite3

# Connect to the SQLite database (creates 'employee.db' if it doesn't exist)
conn = sqlite3.connect('employee.db')
cursor = conn.cursor()

# Enable foreign key support in SQLite
cursor.execute("PRAGMA foreign_keys = ON;")

# Create the EMPLOYEE table
cursor.execute('''
CREATE TABLE IF NOT EXISTS EMPLOYEE (
    employee_id INTEGER PRIMARY KEY,
    name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    manager_id INTEGER,
    FOREIGN KEY (manager_id) REFERENCES EMPLOYEE(employee_id)
)
''')

# Create the ASSIGNMENT table
cursor.execute('''
CREATE TABLE IF NOT EXISTS ASSIGNMENT (
    assignment_id INTEGER PRIMARY KEY,
    project TEXT,
    task TEXT,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    hours INTEGER,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
)
''')

# Create the EXPENSE table
cursor.execute('''
CREATE TABLE IF NOT EXISTS EXPENSE (
    expense_id INTEGER PRIMARY KEY,
    project TEXT,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    amount INTEGER,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
)
''')

# Create the ISSUES table
cursor.execute('''
CREATE TABLE IF NOT EXISTS ISSUES (
    ticket_id INTEGER PRIMARY KEY,
    project TEXT,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    resolution TEXT,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
)
''')

# Create the PTO table
cursor.execute('''
CREATE TABLE IF NOT EXISTS PTO (
    pto_id INTEGER PRIMARY KEY,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    hours INTEGER,
    employee_id INTEGER,
    FOREIGN KEY (employee_id) REFERENCES EMPLOYEE(employee_id)
)
''')

# Insert sample data into EMPLOYEE
# Employee 1: Manager (no manager above them)
cursor.execute("INSERT INTO EMPLOYEE (name, address, phone, email, manager_id) VALUES (?, ?, ?, ?, ?)",
               ('Alice', '123 Main St', '555-1234', 'alice@example.com', None))
alice_id = cursor.lastrowid

# Employee 2: Reports to Alice
cursor.execute("INSERT INTO EMPLOYEE (name, address, phone, email, manager_id) VALUES (?, ?, ?, ?, ?)",
               ('Bob', '456 Elm St', '555-5678', 'bob@example.com', alice_id))
bob_id = cursor.lastrowid

# Employee 3: Reports to Alice
cursor.execute("INSERT INTO EMPLOYEE (name, address, phone, email, manager_id) VALUES (?, ?, ?, ?, ?)",
               ('Charlie', '789 Oak St', '555-9012', 'charlie@example.com', alice_id))
charlie_id = cursor.lastrowid

# Insert sample data into ASSIGNMENT
cursor.execute("INSERT INTO ASSIGNMENT (project, task, description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ('Project A', 'Design', 'Design phase', '2023-01-01', '2023-01-31', 160, bob_id))
cursor.execute("INSERT INTO ASSIGNMENT (project, task, description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ('Project A', 'Implementation', 'Coding', '2023-02-01', '2023-03-31', 320, bob_id))
cursor.execute("INSERT INTO ASSIGNMENT (project, task, description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
               ('Project B', 'Testing', 'Test cases', '2023-01-15', '2023-02-15', 80, charlie_id))

# Insert sample data into EXPENSE
cursor.execute("INSERT INTO EXPENSE (project, description, start_date, end_date, amount, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project A', 'Travel to client site', '2023-01-10', '2023-01-12', 500, alice_id))
cursor.execute("INSERT INTO EXPENSE (project, description, start_date, end_date, amount, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project A', 'Software license', '2023-02-01', '2023-02-01', 1000, bob_id))
cursor.execute("INSERT INTO EXPENSE (project, description, start_date, end_date, amount, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project B', 'Hardware purchase', '2023-01-20', '2023-01-20', 200, charlie_id))

# Insert sample data into ISSUES
cursor.execute("INSERT INTO ISSUES (project, description, start_date, end_date, resolution, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project A', 'Bug in module X', '2023-01-05', '2023-01-10', 'Fixed', bob_id))
cursor.execute("INSERT INTO ISSUES (project, description, start_date, end_date, resolution, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project B', 'Performance issue', '2023-02-01', '2023-02-15', 'Optimized', charlie_id))
cursor.execute("INSERT INTO ISSUES (project, description, start_date, end_date, resolution, employee_id) VALUES (?, ?, ?, ?, ?, ?)",
               ('Project A', 'Feature request', '2023-03-01', None, None, alice_id))

# Insert sample data into PTO
cursor.execute("INSERT INTO PTO (description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?)",
               ('Vacation', '2023-07-01', '2023-07-10', 80, alice_id))
cursor.execute("INSERT INTO PTO (description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?)",
               ('Sick Leave', '2023-03-15', '2023-03-16', 16, bob_id))
cursor.execute("INSERT INTO PTO (description, start_date, end_date, hours, employee_id) VALUES (?, ?, ?, ?, ?)",
               ('Personal Time', '2023-04-01', '2023-04-01', 8, charlie_id))

# Commit the changes to the database
conn.commit()

# Close the database connection
conn.close()
```

### database tool functions
Let's build Tool Functions to search the database tables using an employee ID and other inputs.

Create functions to:  
1. Use an employee ID to get their manager’s name and email.  
2. Use an employee ID, start date, and end date to find the total PTO hours from the PTO table.  
3. Use an employee ID to get all their tasks from the Assignment table.  
4. Use an employee ID to find the total amount they spent from the Expense table.  
5. Use a project ID to get all issue descriptions and resolutions from the Issues table.  
6. Use a piece of text to search for matching issue descriptions and resolutions in the Issues table.

```python
import sqlite3

def get_manager_info(cursor, employee_id):
    """
    Fetch the manager's name and email for a given employee_id.
    
    Args:
        cursor: SQLite cursor object
        employee_id (int): The ID of the employee
    
    Returns:
        tuple: (manager_name, manager_email) or None if no manager exists
    """
    cursor.execute("""
        SELECT m.name, m.email
        FROM EMPLOYEE e
        JOIN EMPLOYEE m ON e.manager_id = m.employee_id
        WHERE e.employee_id = ?
    """, (employee_id,))
    return cursor.fetchone()

def get_pto_hours(cursor, employee_id, start_date, end_date):
    """
    Fetch the total number of PTO hours for an employee within a date range.
    
    Args:
        cursor: SQLite cursor object
        employee_id (int): The ID of the employee
        start_date (str): Start date in 'YYYY-MM-DD' format
        end_date (str): End date in 'YYYY-MM-DD' format
    
    Returns:
        int: Total PTO hours, or 0 if none
    """
    cursor.execute("""
        SELECT SUM(hours)
        FROM PTO
        WHERE employee_id = ?
        AND start_date >= ?
        AND start_date <= ?
    """, (employee_id, start_date, end_date))
    result = cursor.fetchone()[0]
    return result if result is not None else 0

def get_assignments(cursor, employee_id):
    """
    Fetch all assigned tasks for an employee from the Assignment table.
    
    Args:
        cursor: SQLite cursor object
        employee_id (int): The ID of the employee
    
    Returns:
        list: List of tuples, each representing an assignment row
    """
    cursor.execute("""
        SELECT *
        FROM ASSIGNMENT
        WHERE employee_id = ?
    """, (employee_id,))
    return cursor.fetchall()

def get_total_expenses(cursor, employee_id):
    """
    Fetch the total amount spent by an employee from the Expense table.
    Note: Assuming 'expense' in the requirement refers to total expenses for simplicity.
    
    Args:
        cursor: SQLite cursor object
        employee_id (int): The ID of the employee
    
    Returns:
        int: Total expense amount, or 0 if none
    """
    cursor.execute("""
        SELECT SUM(amount)
        FROM EXPENSE
        WHERE employee_id = ?
    """, (employee_id,))
    result = cursor.fetchone()[0]
    return result if result is not None else 0

def get_issues_by_project(cursor, project):
    """
    Fetch all issue descriptions and resolutions for a given project.
    Note: Assuming 'Project ID' refers to the 'project' field in ISSUES table.
    
    Args:
        cursor: SQLite cursor object
        project (str): The project name or identifier
    
    Returns:
        list: List of tuples (description, resolution)
    """
    cursor.execute("""
        SELECT description, resolution
        FROM ISSUES
        WHERE project = ?
    """, (project,))
    return cursor.fetchall()

def search_issues_by_description(cursor, search_text):
    """
    Fetch all issue descriptions and resolutions where the description contains the search text.
    
    Args:
        cursor: SQLite cursor object
        search_text (str): Text to search within issue descriptions
    
    Returns:
        list: List of tuples (description, resolution)
    """
    cursor.execute("""
        SELECT description, resolution
        FROM ISSUES
        WHERE description LIKE ?
    """, ('%' + search_text + '%',))
    return cursor.fetchall()

# Example usage
if __name__ == "__main__":
    # Establish database connection
    conn = sqlite3.connect('employee.db')
    cursor = conn.cursor()
    cursor.execute("PRAGMA foreign_keys = ON;")  # Enable foreign key support

    # Example calls (uncomment to test with your data)
    # 1. Fetch manager info for employee_id 1
    # print("Manager Info:", get_manager_info(cursor, 1))

    # 2. Fetch PTO hours for employee_id 1 between 2023-01-01 and 2023-12-31
    # print("PTO Hours:", get_pto_hours(cursor, 1, '2023-01-01', '2023-12-31'))

    # 3. Fetch assignments for employee_id 1
    # print("Assignments:", get_assignments(cursor, 1))

    # 4. Fetch total expenses for employee_id 1
    # print("Total Expenses:", get_total_expenses(cursor, 1))

    # 5. Fetch issues for project 'Project A'
    # print("Issues by Project:", get_issues_by_project(cursor, 'Project A'))

    # 6. Search issues with 'bug' in description
    # print("Issues by Description:", search_issues_by_description(cursor, 'bug'))

    # Close the connection
    conn.close()
```

If you're following along, the main point of creating this script is that we now have a Tool Function ready. This function can call the database script functions in your AI Agentic Design pattern to retrieve the information we need.

Here is one sample use

```{seealso} sample: Tool Function call
    ## Fetch PTO hours for employee_id 1 between 2023-01-01 and 2023-12-31
    # print("PTO Hours:", get_pto_hours(cursor, 1, '2023-01-01', '2023-12-31'))
```

## Website Crawlers

**building a web crawler**

```{warning}
Many modern websites block web crawlers. To bypass this, tools like Microsoft Omniparser or OpenAI Operator use screenshots to extract information from static sites. Before using these methods, ensure you have the right code and proper approval. Crawling company documents without permission can lead to legal issues.
```

### scrape text
This script scrapes all text from a given URL.

```python
import requests
from bs4 import BeautifulSoup

def scrape_text_from_url(url):
    """
    Scrape all visible text from a given URL.
    
    Args:
        url (str): The URL of the webpage to scrape
        
    Returns:
        str: The extracted text, or an error message if the request fails
    """
    try:
        # Send a GET request to the URL
        response = requests.get(url, timeout=10)
        # Raise an exception if the request was unsuccessful
        response.raise_for_status()
        
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements (non-visible content)
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get all text from the page
        text = soup.get_text()
        
        # Clean up the text: remove extra whitespace and newlines
        lines = (line.strip() for line in text.splitlines())
        cleaned_text = " ".join(line for line in lines if line)
        
        return cleaned_text
    
    except requests.exceptions.RequestException as e:
        return f"Error: Unable to fetch the URL - {str(e)}"

# Example usage
if __name__ == "__main__":
    # Example URL to scrape
    url = "https://github.com/AmitXShukla/AgentsOfAI"  # Replace with your desired URL
    result = scrape_text_from_url(url)
    print(result)
```

### scrape URLs
This script scrapes all URLs from a given text.

```python
import re

def scrape_urls_from_text(text):
    """
    Extract all URLs from a given text string.
    
    Args:
        text (str): The text to search for URLs
        
    Returns:
        list: A list of URLs found in the text
    """
    # Regular expression pattern for matching URLs
    url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+[^\s]*'
    
    # Find all URLs in the text
    urls = re.findall(url_pattern, text)
    
    return urls

# Example usage
if __name__ == "__main__":
    # Sample text containing URLs
    sample_text = """
    Check out the previous script
    which download all text from a given URL
    (https://github.com/AmitXShukla/AgentsOfAI) 
    and this text has many links/urls to other files !
    """
    
    # Scrape URLs from the text
    found_urls = scrape_urls_from_text(sample_text)
    
    # Print the results
    if found_urls:
        print("Found URLs:")
        for url in found_urls:
            print(url)
    else:
        print("No URLs found in the text.")
```

### list of PDF links
This script scrapes all PDF links from a given list of URLs.

```python
import requests
from bs4 import BeautifulSoup

def scrape_pdf_links(urls):
    """
    Scrape all PDF links from a given list of URLs.
    
    Args:
        urls (list): A list of URLs (strings) to scrape for PDF links
        
    Returns:
        list: A list of unique PDF URLs found across all pages
    """
    pdf_links = set()  # Use a set to avoid duplicates
    
    # Headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for url in urls:
        try:
            # Fetch the webpage content
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Parse the HTML content
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all <a> tags with href attributes
            for link in soup.find_all('a', href=True):
                href = link['href']
                # Check if the link ends with '.pdf' (case-insensitive)
                if href.lower().endswith('.pdf'):
                    # Handle relative URLs by converting to absolute URLs
                    if href.startswith('/'):
                        href = url.rstrip('/') + href
                    elif not href.startswith('http'):
                        href = url.rstrip('/') + '/' + href.lstrip('/')
                    pdf_links.add(href)
                    
        except requests.exceptions.RequestException as e:
            print(f"Error fetching {url}: {str(e)}")
            continue
    
    return list(pdf_links)

# Example usage
if __name__ == "__main__":
    # Sample list of URLs to scrape
    url_list = [
        "https://www.example.com",  # Replace with real URLs
        "https://www.python.org/doc/",
        "https://www.w3.org/TR/"
    ]
    
    # Scrape PDF links from the URLs
    pdf_urls = scrape_pdf_links(url_list)
    
    # Print the results
    if pdf_urls:
        print("Found PDF links:")
        for pdf in pdf_urls:
            print(pdf)
    else:
        print("No PDF links found in the provided URLs.")
```

### auto download PDFs
This script download all PDFs from a given list of PDF URLs.

```python
import requests
import os
from urllib.parse import urlparse

def download_pdfs(pdf_urls, download_dir="downloaded_pdfs"):
    """
    Download all PDFs from a given list of PDF URLs.
    
    Args:
        pdf_urls (list): A list of PDF URLs (strings) to download
        download_dir (str): Directory where PDFs will be saved (default: 'downloaded_pdfs')
    
    Returns:
        None: Downloads files to the specified directory
    """
    # Create the download directory if it doesn't exist
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
    
    # Headers to mimic a browser request
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for url in pdf_urls:
        try:
            # Send a GET request to fetch the PDF
            response = requests.get(url, headers=headers, timeout=10, stream=True)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Extract the filename from the URL
            parsed_url = urlparse(url)
            filename = os.path.basename(parsed_url.path)
            if not filename.lower().endswith('.pdf'):
                filename += '.pdf'  # Ensure the file has a .pdf extension
            
            # Define the full path for saving the file
            file_path = os.path.join(download_dir, filename)
            
            # Check if file already exists; append a number if it does
            base_name, ext = os.path.splitext(filename)
            counter = 1
            while os.path.exists(file_path):
                file_path = os.path.join(download_dir, f"{base_name}_{counter}{ext}")
                counter += 1
            
            # Download and save the PDF in chunks
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:  # Filter out keep-alive chunks
                        f.write(chunk)
            
            print(f"Downloaded: {file_path}")
            
        except requests.exceptions.RequestException as e:
            print(f"Error downloading {url}: {str(e)}")
            continue

# Example usage
if __name__ == "__main__":
    # Sample list of PDF URLs to download
    pdf_urls = [
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        "https://www.example.com/sample.pdf",  # Replace with real PDF URLs
        "https://www.irs.gov/pub/irs-pdf/fw4.pdf"
    ]
    
    # Download all PDFs
    download_pdfs(pdf_urls)
```
### reading PDFs
In this script, we’ll first code to read text from a given PDF. we can create loops to automate and read all PDFs from a given repository.
```python
from pypdf import PdfReader

reader = PdfReader("./downloads/AgentsOfAI.pdf")
number_of_pages = len(reader.pages)
text = ''.join([page.extract_text() for page in reader.pages])
print(text[:2155])
```
### crawl as screenshots

Although previous steps works fine for static content website, it often fails to scrape data from dynamic and single page app (SPAs) webpages. In this case, we will convert these pages to screenshot.

> This method is like what some well-known AI agents, such as `Open AI Operator` Agent or `Microsoft OmniParser`, do. They take live screenshots of webpages by clicking around and analyze the images to read the text. But this needs strong computing power and a fast internet connection.

First step is to [download chrome web-driver](https://chromedriver.chromium.org/downloads). Please make sure, web-driver version matches with your chrome version.

(Open Chrome -> Help -> About chrome -> check version).

download appropriate version depending on machine OS and unzip/extract to a local folder.

```python
# ! pip install Pillow selenium
```

```python
from selenium import webdriver
from PIL import Image

# Define the URL of the web page we want to screenshot

url = 'https://finance.yahoo.com/quote/AAPL?p=AAPL&.tsrc=fin-srch'

# Define the path to the webdriver executable (e.g., chromedriver.exe)

# webdriver_path = '/path/to/webdriver/executable'
webdriver_path = r'<<path to >>\chromedriver.exe'

# Set up the webdriver

options = webdriver.ChromeOptions()
options.headless = True # type: ignore # Run the browser in headless mode to prevent a window from popping up
driver = webdriver.Chrome(options=options) # type: ignore

# Load the web page

driver.get(url)

# Take a screenshot of the entire page

# screenshot = driver.find_element_by_tag_name('body').screenshot_as_png
screenshot = driver.save_screenshot('../downloads/screenshot.png')

# Close the webdriver

driver.quit()

# Save the screenshot to a file

# with open('../SampleData/screenshot.png', 'wb') as file:
#     file.write(screenshot)

# Open the screenshot with Pillow to display it (optional)

img = Image.open('../downloads/screenshot.png')
img.show()
```

```python
import os
urls = {
        "AAPL.png": "https://finance.yahoo.com/quote/AAPL?p=AAPL&.tsrc=fin-srch",
        "ORCL.png": "https://finance.yahoo.com/quote/ORCL?p=ORCL&.tsrc=fin-srch",
        "TSLA.png": "https://finance.yahoo.com/quote/TSLA?p=TSLA&.tsrc=fin-srch",
        "GOOG.png": "https://finance.yahoo.com/quote/GOOG?p=GOOG&.tsrc=fin-srch",
        "MSFT.png": "https://finance.yahoo.com/quote/MSFT?p=MSFT&.tsrc=fin-srch"
    }
```

```python
def takeScreenshots(outputFileName, url):
    driver.get(url)
    driver.save_screenshot(os.path.join('../downloads/',outputFileName))
```

```python
# take multiple screen shots
# automate this script to autodownload data

for key,value in urls.items():
    takeScreenshots(key, value)
```

### reading images

In this step, we will finally learn to read data from images and build our knowledge base.

To read text from images using Tesseract OCR in Python, we can use the `pytesseract` library, which is a Python wrapper for the Tesseract OCR engine. Here's an example code snippet:

[download tesseract here](https://tesseract-ocr.github.io/tessdoc/#binaries)

```{warning}
Tesseract OCR is not perfect and may not be able to extract text accurately from all images.
```

```python
from PIL import Image
img = Image.open('../downloads/AAPL.png')
img.show()

# make sure, you have tesseract included in your environment path

import os
os.getenv("tesseract")
```

```python
# py -m pip install pytesseract PIL
```

```python
import pytesseract
from PIL import Image

##############################################################################
# in case if tesseract is not included in PATH
pytesseract.pytesseract.tesseract_cmd = r'<<path to >>\tesseract.exe'
##############################################################################

def read_image_text(image_path):
    """
    Reads text from an image file using Tesseract OCR.

    Args:
        image_path (str): The file path to the input image.

    Returns:
        str: The extracted text from the image.
    """
    # Load the image file
    image = Image.open(image_path)

    # Use Tesseract OCR to extract the text from the image
    text = pytesseract.image_to_string(image)

    return text

# Example usage
image_path = "../downloads/APPL.png"
text = read_image_text(image_path)
print(text)

## automate reading all images
images = {
        "AAPL": "../downloads/AAPL.png",
        "ORCL": "../downloads/ORCL.png",
        "TSLA": "../downloads/TSLA.png",
        "GOOG": "../downloads/GOOG.png",
        "MSFT": "../downloads/MSFT.png"
    }

# automate reading images and creating text from these images
# you can further store these texts into a database

for key,value in images.items():
    # print(key, value)
    text = read_image_text(value)
    print(text)
```

### get audio text
Below is a Python function that converts speech from an audio file to text using the speech_recognition library, which leverages Google's Speech Recognition API. The function takes an audio file as input, processes it, and returns the transcribed text. I'll include error handling and comments for clarity.

```python
## ! pip install SpeechRecognition

import speech_recognition as sr

def audio_to_text(audio_file_path):
    """
    Convert speech from an audio file to text using speech recognition.
    
    Args:
        audio_file_path (str): Path to the audio file (e.g., 'audio.wav')
        
    Returns:
        str: Transcribed text from the audio, or an error message if conversion fails
    """
    # Initialize the recognizer
    recognizer = sr.Recognizer()
    
    try:
        # Load the audio file
        with sr.AudioFile(audio_file_path) as source:
            # Adjust for ambient noise (optional, improves accuracy)
            recognizer.adjust_for_ambient_noise(source, duration=1)
            # Record the audio data
            audio_data = recognizer.record(source)
        
        # Convert audio to text using Google's Speech Recognition
        text = recognizer.recognize_google(audio_data)
        return text
    
    except sr.UnknownValueError:
        return "Error: Could not understand the audio"
    except sr.RequestError as e:
        return f"Error: Could not request results; {str(e)}"
    except FileNotFoundError:
        return "Error: Audio file not found"
    except Exception as e:
        return f"Error: An unexpected issue occurred; {str(e)}"

# Example usage
if __name__ == "__main__":
    # Path to your audio file (must be WAV format for this example)
    audio_path = "sample.wav"  # Replace with your audio file path
    
    # Convert audio to text
    result = audio_to_text(audio_path)
    print("Transcribed Text:", result)
```

### get video text

Below is a Python function that extracts audio from a video file and converts the speech to text using a combination of `moviepy` (to extract audio) and speech_recognition (to transcribe the audio). This approach first converts the video’s audio track to a temporary WAV file, then processes it for speech recognition using Google's Speech Recognition API.

```python
import speech_recognition as sr
from moviepy.editor import VideoFileClip
import os

def video_to_text(video_file_path):
    """
    Convert speech from a video file to text by extracting audio and using speech recognition.
    
    Args:
        video_file_path (str): Path to the video file (e.g., 'video.mp4')
        
    Returns:
        str: Transcribed text from the video's audio, or an error message if conversion fails
    """
    # Temporary audio file path
    temp_audio_path = "temp_audio.wav"
    
    try:
        # Extract audio from the video
        video = VideoFileClip(video_file_path)
        audio = video.audio
        if audio is None:
            return "Error: No audio track found in the video"
        
        # Save audio as a WAV file
        audio.write_audiofile(temp_audio_path, codec='pcm_s16le', verbose=False)
        video.close()  # Close the video file to free resources
        
        # Initialize the recognizer
        recognizer = sr.Recognizer()
        
        # Load the temporary audio file
        with sr.AudioFile(temp_audio_path) as source:
            # Adjust for ambient noise (optional, improves accuracy)
            recognizer.adjust_for_ambient_noise(source, duration=1)
            # Record the audio data
            audio_data = recognizer.record(source)
        
        # Convert audio to text using Google's Speech Recognition
        text = recognizer.recognize_google(audio_data)
        
        # Clean up temporary file
        os.remove(temp_audio_path)
        
        return text
    
    except sr.UnknownValueError:
        os.remove(temp_audio_path) if os.path.exists(temp_audio_path) else None
        return "Error: Could not understand the audio"
    except sr.RequestError as e:
        os.remove(temp_audio_path) if os.path.exists(temp_audio_path) else None
        return f"Error: Could not request results; {str(e)}"
    except FileNotFoundError:
        return "Error: Video file not found"
    except Exception as e:
        os.remove(temp_audio_path) if os.path.exists(temp_audio_path) else None
        return f"Error: An unexpected issue occurred; {str(e)}"

# Example usage
if __name__ == "__main__":
    # Path to your video file
    video_path = "sample.mp4"  # Replace with your video file path
    
    # Convert video audio to text
    result = video_to_text(video_path)
    print("Transcribed Text:", result)
```

## Knowledge Vector Database

```{mermaid}
flowchart LR
    HR[HR Policy] --> VectorDB[(VectorDB)]
    JA[Job Aids] --> VectorDB
    IL[Issue Log] --> VectorDB
    FAQ[FAQ] --> VectorDB
    PD[Project Documentation] --> VectorDB
    NL[Newsletter] --> VectorDB
    MN[Meeting Notes] --> VectorDB
    FS[Finance Statements] --> VectorDB
    MB[Media Briefing] --> VectorDB
    VD[Videos] --> VectorDB
    AU[Audios] --> VectorDB
    PDF[PDFs] --> VectorDB

    style HR fill:#AEC6CF,stroke:#333,stroke-width:2px
    style JA fill:#77DD77,stroke:#333,stroke-width:2px
    style IL fill:#FDFD96,stroke:#333,stroke-width:2px
    style FAQ fill:#FFB347,stroke:#333,stroke-width:2px
    style PD fill:#B39EB5,stroke:#333,stroke-width:2px
    style NL fill:#FFD1DC,stroke:#333,stroke-width:2px
    style MN fill:#AFEEEE,stroke:#333,stroke-width:2px
    style FS fill:#D3D3D3,stroke:#333,stroke-width:2px
    style MB fill:#DEB887,stroke:#333,stroke-width:2px
    style VD fill:#FF6961,stroke:#333,stroke-width:2px
    style AU fill:#B2F2BB,stroke:#333,stroke-width:2px
    style PDF fill:#C5CBE3,stroke:#333,stroke-width:2px
    style VectorDB fill:#E0E0E0,stroke:#333,stroke-width:2px
```

### text token embeddings

**creating tokens from text**

```python
# !pip install tiktoken
```

```python
########################
# visualize text tokens
########################
import pandas as pd
import tiktoken

# Load the cl100k_base tokenizer which is designed to work with the ada-002 model
tokenizer = tiktoken.get_encoding("cl100k_base")

df = pd.read_csv('../downloads/scraped.csv', index_col=0)
df.columns = ['title', 'text']

# Tokenize the text and save the number of tokens to a new column
df['n_tokens'] = df.text.apply(lambda x: len(tokenizer.encode(x)))

print(df)
# Visualize the distribution of the number of tokens per row using a histogram
df.n_tokens.hist()

# as you can see in below results
# Chapter 3, 4 & 5 has appx 4.2, 8 and 5.7k tokens
# this is expectecd, as Chapter as longest text

# now, we will need to further split these rows based on number of tokens
# because most of the vector databases have upper limits of # of tokens that can be stored
```

### normalizing tokens

Documents often come in different sizes, so each row can have a different number of tokens. Storing varying token counts in a vector database index isn’t ideal. Instead, it’s better to normalize—meaning, make each row have the same number of tokens—for easier and more efficient indexing in the vector database.

Below script, split text into equal number of tokens.

```python
#####################################################################
# let's say we want to split csv into chunks of 500 tokens
#####################################################################

max_tokens = 500

# Function to split the text into chunks of a maximum number of tokens
def split_into_many(text, max_tokens = max_tokens):

    # Split the text into sentences
    sentences = text.split('. ')

    # Get the number of tokens for each sentence
    n_tokens = [len(tokenizer.encode(" " + sentence)) for sentence in sentences]

    chunks = []
    tokens_so_far = 0
    chunk = []

    # Loop through the sentences and tokens joined together in a tuple
    for sentence, token in zip(sentences, n_tokens):

        # If the number of tokens so far plus the number of tokens in the current sentence is greater
        # than the max number of tokens, then add the chunk to the list of chunks and reset
        # the chunk and tokens so far
        if tokens_so_far + token > max_tokens:
            chunks.append(". ".join(chunk) + ".")
            chunk = []
            tokens_so_far = 0

        # If the number of tokens in the current sentence is greater than the max number of
        # tokens, go to the next sentence
        if token > max_tokens:
            continue

        # Otherwise, add the sentence to the chunk and add the number of tokens to the total
        chunk.append(sentence)
        tokens_so_far += token + 1

    return chunks

shortened = []

# Loop through the dataframe
for row in df.iterrows():

    # If the text is None, go to the next row
    if row[1]['text'] is None:
        continue

    # If the number of tokens is greater than the max number of tokens, split the text into chunks
    if row[1]['n_tokens'] > max_tokens:
        shortened += split_into_many(row[1]['text'])

    # Otherwise, add the text to the list of shortened texts
    else:
        shortened.append( row[1]['text'] )
```

```python
#####################################################################
# Visualizing the updated histogram again can help to confirm
# if the rows were successfully split into shortened sections.
#####################################################################

df = pd.DataFrame(shortened, columns = ['text'])
df['n_tokens'] = df.text.apply(lambda x: len(tokenizer.encode(x)))
print(df.head())
print(df.shape) # we had appx 18k tokens earlier, so we should expect ~35+ distributions of 500 each
df.n_tokens.hist()

#####################################################################
# as you can see from histogram
# most of rows have about 450-500 tokens each
```

### storing tokens in Vector DB

We’ll look at two vector databases, Chroma DB and SQLite. Both are open-source and can run on your local system.

#### Chroma VectorDB
Creating ChromaDB `trychroma` vector DB

```python
! pip install pysqlite3-binary
! pip show chromadb
# version 0.3.29
# there might be issues due to sqlite library, if so,
# replace sqlite with pysqlite3-binary
```

```python
# if you wish to just experiment without have chromadb as persistent DB, 
# run this code and ignore next cell

# store sample documents in chromadb

# import ollama
# __import__('pysqlite3')
# import sys
# sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
# import chromadb
# client = chromadb.Client() # will create only a temp, non-persistent db
```

```python
# running prod chromadb as persistent db
# store tokens|docs in a persisten db so that you don't need to store vectors everytime

# first make sure chromadb in installed, if not
# !pip install chromadb

# do not run this here, instead run this command on terminal
# !chroma run --host localhost --port 8080 --path ./OLVectorDB

# if you see errors, add below code to your ___init__.py file
# import ollama
# __import__('pysqlite3')
# import sys
# sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
```

```python
# store sample documents in chromadb

import ollama
__import__('pysqlite3')
import sys
sys.modules['sqlite3'] = sys.modules.pop('pysqlite3')
import chromadb
# use this client version to start a non-persistent experimental chromadb instance
# client = chromadb.Client() # will create only a temp, non-persistent db

# use this client version to start persistent chromadb instance
# from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
# client = chromadb.PersistentClient(
#     path="./vectordb",
#     settings=Settings(),
#     tenant=DEFAULT_TENANT,
#     database="OL",
# )

client = chromadb.PersistentClient(path="./OLVectorDB")

# use this client version to start chromadb http instance
# client = chromadb.HttpClient(
#     host="localhost",
#     port=8080,
#     ssl=False,
#     headers=None,
#     # settings=Settings(),
#     # tenant=DEFAULT_TENANT,
#     database="./vectordb",
# )
```

```python
client.list_collections()
```

```python
# uncomment this code,
# if collection is already created, do not create it over and over again

documents = df["text"].to_list()

# collection = client.create_collection(name="docs")
# # store each document in a vector embedding database
# for i, d in enumerate(documents):
#   response = ollama.embeddings(model="mxbai-embed-large", prompt=d)
#   embedding = response["embedding"]
#   collection.add(
#     ids=[str(i)],
#     embeddings=[embedding],
#     documents=[d]
#   )
```

#### SQLite VectorDB

```python
! pip install sqlite_vec
```

```python
# this code is copied form sqlite-vec GitRepo
import sqlite3
import sqlite_vec

from typing import List
import struct

def serialize_f32(vector: List[float]) -> bytes:
    """serializes a list of floats into a compact "raw bytes" format"""
    return struct.pack("%sf" % len(vector), *vector)

db = sqlite3.connect(":memory:")
db.enable_load_extension(True)
sqlite_vec.load(db)
db.enable_load_extension(False)

sqlite_version, vec_version = db.execute(
    "select sqlite_version(), vec_version()"
).fetchone()
print(f"sqlite_version={sqlite_version}, vec_version={vec_version}")

items = [
    (1, [0.1, 0.1, 0.1, 0.1]),
    (2, [0.2, 0.2, 0.2, 0.2]),
    (3, [0.3, 0.3, 0.3, 0.3]),
    (4, [0.4, 0.4, 0.4, 0.4]),
    (5, [0.5, 0.5, 0.5, 0.5]),
]
query = [0.3, 0.3, 0.3, 0.3]

db.execute("CREATE VIRTUAL TABLE vec_items USING vec0(embedding float[4])")

with db:
    for item in items:
        db.execute(
            "INSERT INTO vec_items(rowid, embedding) VALUES (?, ?)",
            [item[0], serialize_f32(item[1])],
        )

rows = db.execute(
    """
      SELECT
        rowid,
        distance
      FROM vec_items
      WHERE embedding MATCH ?
      and k=3
      ORDER BY distance
    """,
    [serialize_f32(query)],
).fetchall()

print(rows)
```

## Face Recognition : FAISS Vector Datastore

- FAISS Vector Index - Employee Image database
```{warning}
Saving employee pictures, addresses, and other biometric information is sensitive. Ensure you comply with all legal requirements before using and storing this data.
```

```python
## FAISS installation

## Please note that the following command is for CPU-only installations.
## For GPU-accelerated performance, refer to the specific GPU installation
##  instructions provided in the Faiss documentation.

! pip install faiss-cpu

# for GPU machines
! pip install faiss-gpu
```

```python
# import packages

import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
import faiss
```

```python
# getting started with basic of FAISS

d = 2                       # dimension
nb = 5                      # database size
nq = 1                       # nb of queries

xb1 = np.array([[0.1, 0.1],
       [0.2, 0.2],
       [0.3, 0.3],
       [0.4, 0.4],
       [0.5, 0.5],
       [0.9, 0.9]
       ]).astype('float32')

xq1 = np.array([[0.91, 0.91]]).astype('float32')
```

```python
index = faiss.IndexFlatL2(d)   # build the index
print(index.is_trained)
index.add(xb1)                  # add vectors to the index
print(index.ntotal)
```

```python
k = 2                          # we want to see 4 nearest neighbors
D, I = index.search(xq1, k) # sanity check
print(I)
print(D)
# D, I = index.search(xq, k)     # actual search
# print(I[:5])                   # neighbors of the 5 first queries
# print(I[-5:])                  # neighbors of the 5 last queries

# when xq = 0.75
# [[5 4]]
# [[0.0288     0.15679997]]
```

## Multiple Tools
API access to gather live information like weather, news etc..
