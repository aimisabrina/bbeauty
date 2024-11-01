const { app, BrowserWindow } = require('electron');
const path = require('node:path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  mainWindow.loadFile(path.join(__dirname, 'index.html'));


  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
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

