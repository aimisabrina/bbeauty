// index.js (continuation)
const { ipcRenderer } = require('electron');

// Function to add product to wishlist with note
function addToWishlistWithNote() {
    const fileName = document.getElementById("fileName").value;
    const note = document.getElementById("wishlist-note").value;
    
    console.log('File Name:', fileName);  // Check if the filename is correct
    console.log('Note:', note);            // Check if the note is correct

    // Send the file name and note to the main process
    ipcRenderer.send('save-wishlist-note', { fileName, note });

    // Listen for the response from the main process
    ipcRenderer.on('save-wishlist-note-response', (event, { success }) => {
        if (success) {
            showSuccessMessage();
            alert(`${fileName}.txt was created with your note.`);
        } else {
            alert('Failed to save the note. Please try again.');
        }
    });

    closeWishlistPopup();
    document.getElementById("wishlist-note").value = ""; // Clear note input
}

