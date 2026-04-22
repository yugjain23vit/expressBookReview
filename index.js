const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

// 🔴 PASTE AUTH FUNCTION HERE 👇
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.send("Token required");

    jwt.verify(token, "mysecretkey", (err, user) => {
        if (err) return res.send("Invalid token");

        req.user = user;
        next();
    });
}


// ---------------- BOOK DATA ----------------
let books = {
    "1": { title: "Book One", author: "Author A", reviews: {} },
    "2": { title: "Book Two", author: "Author B", reviews: {} }
};

// ================= BOOK APIs =================

// Get all books
app.get('/books', (req, res) => {
    res.json(books);
});

// Get by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    res.json(books[req.params.isbn] || "Book not found");
});

// Get by author
app.get('/books/author/:author', (req, res) => {
    const result = Object.values(books).filter(
        b => b.author === req.params.author
    );
    res.json(result);
});

// Get by title
app.get('/books/title/:title', (req, res) => {
    const result = Object.values(books).filter(
        b => b.title === req.params.title
    );
    res.json(result);
});

// Get reviews
app.get('/books/review/:isbn', (req, res) => {
    res.json(books[req.params.isbn]?.reviews || {});
});

// Add/Update review (protected later)
app.post('/books/review/:isbn', (req, res) => {
    const { review } = req.body;
    const isbn = req.params.isbn;

    if (!books[isbn]) return res.send("Book not found");

    books[isbn].reviews["user"] = review;
    res.send("Review added/updated");
});

// Delete review
app.delete('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        books[isbn].reviews = {};
        res.send("Review deleted");
    } else {
        res.send("Book not found");
    }
});

// ================= AUTH APIs =================

// REGISTER API
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (users[username]) {
        return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[username] = { password: hashedPassword };

    res.send("User registered successfully");
});

// LOGIN API
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users[username];
    if (!user) return res.send("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.send("Invalid credentials");

    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

    res.json({ token });
});

// ================= SERVER =================
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
