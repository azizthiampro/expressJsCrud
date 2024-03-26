document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const book = {};
    formData.forEach((value, key) => book[key] = value);

    fetch('/api/books', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(book),
    }).then(() => {
        // Display success alert
        const alertSuccess = document.createElement('div');
        alertSuccess.className = 'alert alert-success alert-dismissible fade show';
        alertSuccess.role = 'alert';
        alertSuccess.innerHTML = 'Book added successfully!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        document.querySelector('.container').prepend(alertSuccess);

        // Auto close the alert after 1 second
        setTimeout(() => {
            new bootstrap.Alert(alertSuccess).close();
        }, 2000);

        e.target.reset(); // Reset form fields
        fetchBooks(); // Fetch all books again to update the list
    });
});

function fetchBooks() {
    fetch('/api/books')
        .then(response => response.json())
        .then(books => {
            const booksElement = document.getElementById('books');
            booksElement.innerHTML = ''; // Clear current list
            let row = document.createElement('div');
            row.className = 'row';

            books.forEach((book, index) => {
                // Create a column for each book card
                const col = document.createElement('div');
                col.className = 'col-md-6'; // Use 'col-md-6' to make sure two cards fit in one row on medium devices and up
                col.innerHTML = `
                    <div class="card mb-3"> <!-- Added mb-3 for margin bottom -->
                        <div class="card-body" id="book-${book.isbn}">
                            <h5 class="card-title">${book.title}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Author: ${book.author}</h6>
                            <p class="card-text">ISBN: ${book.isbn}</p>
                            <p class="card-text">Published: ${book.publishedDate}</p>
                            <p class="card-text">Publisher: ${book.publisher}</p>
                            <p class="card-text">Number of Pages: ${book.numberOfPages}</p>
                            <button class="btn btn-secondary update-btn" onclick="showUpdateModal('${book.isbn}')">Update <i class="fa fa-pencil"></i></button>

                            <button class="btn btn-danger delete-btn" onclick="deleteBook('${book.isbn}')">Delete <i class="fa fa-trash"></i> </button>
                        </div>
                    </div>
                `;

                row.appendChild(col);

                // If index is odd, or it's the last book, append the row to booksElement and create a new row
                if ((index % 2) === 1 || index === books.length - 1) {
                    booksElement.appendChild(row);
                    row = document.createElement('div'); // Create a new row for the next set of books
                    row.className = 'row';
                }
            });
        });
}
function showUpdateModal(isbn) {
    // Fetch the book's current data
    fetch(`/api/books/${isbn}`)
        .then(response => response.json())
        .then(book => {
            // Pre-fill the form in the modal
            document.getElementById('updateIsbn').value = book.isbn;
            document.getElementById('updateTitle').value = book.title;
            document.getElementById('updateAuthor').value = book.author;
            document.getElementById('updatePublishedDate').value = book.publishedDate;
            document.getElementById('updatePublisher').value = book.publisher;
            document.getElementById('updateNumberOfPages').value = book.numberOfPages;
            // Show the modal
            var updateModal = new bootstrap.Modal(document.getElementById('updateBookModal'), {
                keyboard: false
            });
            updateModal.show();
        })
        .catch(error => console.error('Error fetching book details:', error));
}

document.getElementById('saveBookUpdate').addEventListener('click', function() {
    const isbn = document.getElementById('updateIsbn').value;
    const updatedBook = {
        title: document.getElementById('updateTitle').value,
        author: document.getElementById('updateAuthor').value,
        publishedDate: document.getElementById('updatePublishedDate').value,
        publisher: document.getElementById('updatePublisher').value,
        numberOfPages: parseInt(document.getElementById('updateNumberOfPages').value, 10),
    };

    fetch(`/api/books/${isbn}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
    }).then(response => {
        if (response.ok) {
            // Create and display the success alert
            const alertSuccess = document.createElement('div');
            alertSuccess.className = 'alert alert-secondary alert-dismissible fade show';
            alertSuccess.className = 'alert alert-secondary alert-dismissible fade show';
            alertSuccess.role = 'alert';
            alertSuccess.innerHTML = 'Book updated successfully!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
            document.querySelector('.container').prepend(alertSuccess);

            // Auto-close the alert after a few seconds
            setTimeout(() => {
                new bootstrap.Alert(alertSuccess).close();
            }, 2000);

            // Refresh the book list to show the updated details
            fetchBooks();
            // Close the update modal
            document.getElementById('updateBookModal').querySelector('.btn-close').click();
        } else {
            console.error('Failed to update book');
            // Optionally, display an error message to the user
        }
    }).catch(error => {
        console.error('Error updating book:', error);
        // Optionally, display an error message to the user
    });
});

function deleteBook(isbn) {
    var deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'), {
        keyboard: false
    });
    deleteModal.show();

    document.getElementById('confirmDelete').onclick = function() {
        fetch(`/api/books/${isbn}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    fetchBooks(); // Refresh the book list

                    const alertSuccess = document.createElement('div');
                    alertSuccess.className = 'alert alert-danger alert-dismissible fade show mt-3';
                    alertSuccess.role = 'alert';
                    alertSuccess.innerHTML = 'Book deleted successfully! <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

                    document.querySelector('.container').prepend(alertSuccess);

                    setTimeout(() => {
                        new bootstrap.Alert(alertSuccess).close();
                    }, 2000);
                } else {
                    // Handle failure...
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Error handling code here
            });

        deleteModal.hide();
    };
}

// Fetch books when the page loads
window.onload = fetchBooks;