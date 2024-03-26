const express = require('express');
const router = express.Router();

// Simulated database with an array
let books = [];

// Function to generate a valid ISBN
function generateISBN13() {
    let isbn = '';
    for (let i = 0; i < 12; i++) {
        isbn += Math.floor(Math.random() * 10);
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += (i % 2 === 0 ? 1 : 3) * parseInt(isbn[i], 10);
    }
    let checkDigit = (10 - (sum % 10)) % 10;
    return isbn + checkDigit;
}

// POST: Add a new book
router.post('/', (req, res) => {
    const book = req.body;
    if (!book.isbn) book.isbn = generateISBN13();
    books.push(book);
    res.status(201).send({ message: 'Book added to the database', isbn: book.isbn });
});

// GET: Read all books
router.get('/', (req, res) => {
    res.status(200).json(books);
});

// PUT: Update a book by ISBN
router.put('/:isbn', (req, res) => {
    const { isbn } = req.params;
    const bookIndex = books.findIndex(book => book.isbn === isbn);

    if (bookIndex === -1) {
        return res.status(404).send('Book not found.');
    }

    // Update only the fields that are provided in the request body
    books[bookIndex] = { ...books[bookIndex], ...req.body };
    res.status(200).send({ message: `Book with ISBN ${isbn} updated successfully.` });
});


// GET: Read a single book by ISBN
router.get('/:isbn', (req, res) => {
    const { isbn } = req.params; // Extract the ISBN from the URL parameter
    const book = books.find(book => book.isbn === isbn); // Find the book by ISBN

    if (book) {
        res.status(200).json(book); // If the book is found, send it back as JSON
    } else {
        res.status(404).send({ message: 'Book not found.' }); // If not found, send a 404 response
    }
});



// DELETE: Delete a book by ISBN
router.delete('/:isbn', (req, res) => {
    const { isbn } = req.params;
    const initialLength = books.length;
    books = books.filter(book => book.isbn !== isbn);

    if (books.length < initialLength) {
        res.status(200).send({ message: 'Book deleted successfully.' });
    } else {
        res.status(404).send('Book not found.');
    }
});

module.exports = router;
