// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors middleware
const path = require('path'); // For serving static files
const Book = require('./models/Book'); // Import the Book model

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Variable to hold the current database type ('local' or 'cloud')
let currentDbType = 'local'; // Default to local DB

// Function to connect to MongoDB
async function connectDB(dbType = 'local') {
    let dbUri;
    if (dbType === 'cloud') {
        dbUri = process.env.MONGODB_URI_CLOUD;
    } else {
        dbUri = process.env.MONGODB_URI_LOCAL;
    }

    if (!dbUri) {
        console.error(`Error: Connection string for ${dbType} DB is missing in .env`);
        // If connection string is missing, don't try to connect
        return;
    }

    try {
        // Disconnect if already connected to a different database
        if (mongoose.connection.readyState === 1 && currentDbType !== dbType) {
            await mongoose.disconnect();
            console.log('Disconnected from previous MongoDB instance.');
        }

        // Connect only if not already connected to the target DB
        if (mongoose.connection.readyState === 0 || currentDbType !== dbType) {
            await mongoose.connect(dbUri);
            currentDbType = dbType; // Update the current DB type
            console.log(`Successfully connected to MongoDB (${currentDbType})!`);
        } else {
            console.log(`Already connected to ${currentDbType}DB.`);
        }
    } catch (error) {
        console.error(`MongoDB connection error (${dbType}):`, error.message);
        // In case of error, you might want to exit or handle gracefully
        // For now, we'll just log and continue
    }
}

// --- API Endpoints ---

// Root route - serves the client-side HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to add a new book
app.post('/books', async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint to get a single book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Endpoint to delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to search books by title or author
app.get('/books/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ message: 'Please provide a search query.' });
    }
    try {
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { author: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to switch database type (local/cloud)
app.post('/switch-db', async (req, res) => {
    const { dbType } = req.body; // Expects 'local' or 'cloud'
    if (dbType !== 'local' && dbType !== 'cloud') {
        return res.status(400).json({ message: 'Invalid database type. Must be "local" or "cloud".' });
    }

    try {
        await connectDB(dbType);
        res.json({ message: `Successfully switched to ${currentDbType}DB.`, currentDb: currentDbType });
    } catch (error) {
        res.status(500).json({ message: `Error switching to ${dbType}DB: ${error.message}` });
    }
});

// Endpoint to get current database status
app.get('/current-db-status', (req, res) => {
    res.json({ currentDb: currentDbType });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    connectDB(currentDbType); // Connect to the default database on server start
});

// Export the Book model so it can be used by importData.js
module.exports = { app, connectDB, Book };