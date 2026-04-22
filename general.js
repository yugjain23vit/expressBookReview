const axios = require("axios");

// Base URL (Book API)
const BASE_URL = "http://localhost:5000/books";

/**
 * Get ALL books
 */
async function getAllBooks() {
    try {
        const response = await axios.get(`${BASE_URL}`);
        console.log("All Books:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
}

/**
 * Get book by ISBN
 */
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);

        if (!response.data || response.data === "Book not found") {
            console.log("No book found with ISBN:", isbn);
            return;
        }

        console.log("Book by ISBN:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching book by ISBN:", error.message);
    }
}

/**
 * Get books by Author
 */
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);

        if (!response.data || response.data.length === 0) {
            console.log("No books found for author:", author);
            return;
        }

        console.log("Books by Author:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by author:", error.message);
    }
}

/**
 * Get books by Title
 */
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);

        if (!response.data || response.data.length === 0) {
            console.log("No books found with title:", title);
            return;
        }

        console.log("Books by Title:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching books by title:", error.message);
    }
}

// Export functions (IMPORTANT for grading)
module.exports = {
    getAllBooks,
    getBookByISBN,
    getBooksByAuthor,
    getBooksByTitle
};
