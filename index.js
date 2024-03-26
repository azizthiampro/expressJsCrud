const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Import routes for the book API
const bookRoutes = require('./bookapi');
app.use('/api/books', bookRoutes);

// Add a route for the root URL to serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
