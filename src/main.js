// List of brands to fetch
const brands = ["maybelline", "nyx", "Pacifica", "Dr. Hauschka", "loreal", "revlon", "Almay", "Milani", "smashbox", "covergirl", "marcelle", "clinique"];
const productContainer = document.getElementById("product-container");
const wishlistContainer = document.getElementById("wishlist-container");
const searchBox = document.querySelector(".search-box input");

// Global variable to store all products
let allProducts = [];

// Fetch product data for each brand
async function fetchProducts() {
  allProducts = []; // Reset allProducts array
  try {
    // Fetch products for each brand
    for (const brand of brands) {
      const response = await fetch(`http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`);
      const products = await response.json();
      allProducts = allProducts.concat(products); // Add products to the allProducts array
    }
    displayProducts(allProducts); // Display 60 random products
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display 60 random products on the page
function displayProducts(products) {
  productContainer.innerHTML = ""; // Clear container before displaying products
  
  // Randomly shuffle the products array and select the first 60 items
  const selectedProducts = products.sort(() => 0.6 - Math.random()).slice(0, 60);
  
  selectedProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <a href="productDetail.html?id=${product.id}" style="text-decoration: none; color: inherit;">
        <img src="${product.image_link}" alt="${product.name}">
        <h4>${product.name}</h4>
        <p>Brand: ${product.brand}</p>
        <p>Price: $${product.price}</p>
      </a>
      <button onclick="addToWishlist(${product.id}, '${product.name}', '${product.image_link}', ${product.price})">
        Add to Wishlist
      </button>
    `;
    productContainer.appendChild(productCard);
  });
}

// Filter products based on search input (for both brand and type)
function filterProducts(searchTerm) {
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(filteredProducts);
}

// Event listener for search box
searchBox.addEventListener("input", (event) => {
  const searchTerm = event.target.value;
  filterProducts(searchTerm);
});

// Initialize product display on page load
fetchProducts();


//WISHLIST ON INDEX.HTML
// Wishlist management
window.wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Function to update the wishlist count in the navigation
function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlist-count");
  if (wishlistCount) wishlistCount.textContent = window.wishlist.length;
}

// Show success pop-up message
function showSuccessMessage() {
  const successMessage = document.getElementById("success-message");
  successMessage.classList.add("show");
  setTimeout(() => successMessage.classList.remove("show"), 2000);
}

// Add event to "Add to Wishlist" buttons on index page
function addToWishlist(id, name, image, price) {
  openWishlistPopup(id, name, image, price); // Open the wishlist popup with product details
}

// Function to open wishlist pop-up
function openWishlistPopup(productId, productName, productImage, productPrice) {
  window.selectedProduct = { id: productId, name: productName, image: productImage, price: productPrice };
  document.getElementById("wishlist-popup").style.display = "flex";
}

// Function to close wishlist pop-up
function closeWishlistPopup() {
  document.getElementById("wishlist-popup").style.display = "none";
}

// Function to add product to wishlist with note
function addToWishlistWithNote() {
  const note = document.getElementById("wishlist-note").value;
  const { id, name, image, price } = window.selectedProduct;

  if (!window.wishlist.some((item) => item.id === id)) {
    window.wishlist.push({ id, name, image, price, note });
    localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
    updateWishlistCount();
    showSuccessMessage(); // Show success message
  } else {
    alert("Product is already in your wishlist.");
  }
  
  closeWishlistPopup();
  document.getElementById("wishlist-note").value = ""; // Clear note input
}




// WISHLIST.HTML
// Display wishlist items in wishlist.html
function displayWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container");
  if (!wishlistContainer) return;

  wishlistContainer.innerHTML = ""; 
  window.wishlist.forEach((item, index) => {
    const wishlistItem = document.createElement("div");
    wishlistItem.classList.add("wishlist-item");
    wishlistItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Price: $${item.price}</p>
      <p1>Note: ${item.note}</p1>
      <button onclick="removeFromWishlist(${index})">Remove</button>
      <button onclick="updateWishlist(${index})">Update</button>
    `;
    wishlistContainer.appendChild(wishlistItem);
  });
}

// Load wishlist on page load
function loadWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container");
  wishlistContainer.innerHTML = ""; // Clear current items

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  
  wishlist.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "wishlist-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Price: $${item.price}</p>
      <p1>Note: ${item.note}</p1>
      <button onclick="removeFromWishlist('${item.id}')">Remove</button>
      <button onclick="updateWishlistItem('${item.id}')">Update</button>
    `;
    wishlistContainer.appendChild(itemDiv);
  });
}

// Remove product from wishlist by index
function removeFromWishlist(index) {
  window.wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
  displayWishlist();
  updateWishlistCount();
}

// Update product in wishlist by index
function updateWishlist(index) {
  const updatedName = prompt("Update product name:", window.wishlist[index].name);
  const updatedPrice = prompt("Update product price:", window.wishlist[index].price);
  
  if (updatedName && updatedPrice) {
    window.wishlist[index].name = updatedName;
    window.wishlist[index].price = parseFloat(updatedPrice);
    localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
    displayWishlist();
  }
}

// Load products and wishlist count on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  displayWishlist();
  updateWishlistCount();
});

// UPDATE POPUP FUNCTION
// Open the Update Modal
function updateWishlist(index) {
  // Get the item data
  const item = window.wishlist[index];

  // Set the modal content
  document.getElementById("modal-image").src = item.image;
  document.getElementById("modal-name").textContent = item.name;
  document.getElementById("modal-price").textContent = `Price: $${item.price}`;
  document.getElementById("modal-note").value = item.note;

  // Show the modal
  const modal = document.getElementById("update-modal");
  modal.style.display = "block";

  // Store the index for the save function
  window.currentEditIndex = index;
}

// Save the updated note and close the modal
function saveNote() {
  const updatedNote = document.getElementById("modal-note").value;
  if (updatedNote !== "") {
    // Update the note in the wishlist array
    window.wishlist[window.currentEditIndex].note = updatedNote;
    // Save to localStorage
    localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
    // Refresh the displayed wishlist
    displayWishlist();
    // Close the modal
    closeModal();
  }
}

// Close the modal
function closeModal() {
  document.getElementById("update-modal").style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById("update-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}
