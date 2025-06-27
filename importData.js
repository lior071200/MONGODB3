// importData.js
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { Book, connectDB } = require('./server'); // Import Book model and connectDB from server.js

async function importBooks() {
    // Decide which DB to connect to for import (e.g., always local for import)
    // You can change this to 'cloud' if you prefer to import directly to Atlas
    const targetDB = 'local';
    await connectDB(targetDB); // Ensure connection is established before attempting import

    try {
        const books = JSON.parse(fs.readFileSync(`${__dirname}/books.json`, 'utf-8'));

        // Clear existing data (optional, for clean import)
        await Book.deleteMany();
        console.log('Existing data cleared.');

        await Book.insertMany(books);
        console.log('Data imported successfully!');
        process.exit(); // Exit the script after successful import
    } catch (error) {
        console.error('Error importing data:', error.message);
        process.exit(1); // Exit with error code
    }
}

importBooks();