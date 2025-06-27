# Book Management System - MongoDB Project

This project demonstrates a basic book management system with a Node.js/Express.js backend connected to MongoDB (local and cloud), and a simple HTML/JavaScript frontend.

---

## Features

* Add, view, edit, and delete books (Backend)
* Option to switch between a local MongoDB database (MongoDB Compass) and a cloud database (MongoDB Atlas)
* Simple web-based user interface for managing and displaying books
* Import initial book data from a JSON file
* Search books by title or author

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js and npm** (version 14 or higher recommended)
    * Download from: [https://nodejs.org/](https://nodejs.org/)
* **MongoDB Community Server** (for LocalDB connection)
    * Download from: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
* **MongoDB Compass** (GUI tool for managing LocalDB, highly recommended)
    * Download from: [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
* **MongoDB Atlas Account** (for CloudDB connection)
    * Sign up at: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

---

## Project Setup (Server and Client)

Follow these steps to get the project up and running:

1.  **Clone the Repository or Download Project Files:**
    If using Git:
    ```bash
    git clone <YOUR_REPOSITORY_LINK>
    cd my-book-project
    ```
    If you downloaded a ZIP, extract it to a folder named `my-book-project`.

2.  **Install Dependencies:**
    Navigate to your project directory in the terminal (e.g., using VS Code's integrated terminal) and run:
    ```bash
    npm install
    ```

3.  **Configure Environment Variables (.env):**
    Create a file named `.env` in the root of your project directory (next to `package.json`).
    Add the following content, replacing `YOUR_MONGODB_ATLAS_CONNECTION_STRING` with your actual connection string from MongoDB Atlas:

    ```env
    PORT=3000
    MONGODB_URI_LOCAL=mongodb://localhost:27017/mybooks
    MONGODB_URI_CLOUD=YOUR_MONGODB_ATLAS_CONNECTION_STRING
    ```
    * **Note:** Ensure you replace `<password>` in the Atlas connection string with your actual database user password, and `<dbname>` with your desired database name.
    * **Tip:** When setting up your database user in Atlas, ensure it has network access from `0.0.0.0/0` (for testing) or your specific IP address.

4.  **Import Initial Book Data (Optional but Recommended):**
    To populate your database with some initial data, run the import script. Ensure the `books.json` file is in your project root.
    **Make sure your local MongoDB server (Compass) is running before executing this step.**
    ```bash
    node importData.js
    ```
    * This script will connect to your `MONGODB_URI_LOCAL` by default, clear existing data in the `books` collection, and insert the data from `books.json`.

5.  **Start the Server:**
    After completing the above steps, start the Node.js server:
    ```bash
    node server.js
    ```
    You should see messages in your terminal indicating that the server is running on port 3000 and has successfully connected to the default database (local).

6.  **Access the Application (Client-Side):**
    Open your web browser (Chrome, Firefox, etc.) and navigate to:
    ```
    http://localhost:3000
    ```
    You should see the book management system's user interface, displaying the list of books and options to add new books, search, and switch between database types.

---

## How to Use the Application

* **View Books:** The list of books will be displayed automatically upon page load.
* **Add a Book:** Use the "Add New Book" form to add new books to the database.
* **Edit/Delete Books:** Use the "Edit" and "Delete" buttons next to each book item in the list.
* **Search Books:** Use the search bar to find books by title or author.
* **Switch Database (Local/Cloud):** Use the "Select Database" dropdown and "Switch DB" button to toggle between your local and cloud MongoDB instances. Observe the server console for connection status updates.

---

## Project Structure