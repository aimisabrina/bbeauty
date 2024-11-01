// List of brands to fetch
const brands = ["maybelline", "nyx", "Pacifica", "Dr. Hauschka", "loreal", "revlon","Almay","Milani", "smashbox", "covergirl", "marcelle", "clinique"];
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
    displayProducts(allProducts); // Display all fetched products
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products on the page
function displayProducts(products) {
  productContainer.innerHTML = ""; // Clear container before displaying products
  products.forEach((product) => {
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

// Wishlist management
let wishlist = [];

// Add product to wishlist
function addToWishlist(id, name) {
  if (!wishlist.some((item) => item.id === id)) {
    wishlist.push({ id, name });
    displayWishlist();
  }
}

// Display wishlist
function displayWishlist() {
  wishlistContainer.innerHTML = "";
  wishlist.forEach((item, index) => {
    const wishlistItem = document.createElement("div");
    wishlistItem.classList.add("wishlist-item");
    wishlistItem.innerHTML = `
      <p>${item.name}</p>
      <button onclick="removeFromWishlist(${index})">Remove</button>
    `;
    wishlistContainer.appendChild(wishlistItem);
  });
}

// Remove product from wishlist
function removeFromWishlist(index) {
  wishlist.splice(index, 1);
  displayWishlist();
}

// Initialize product display on page load
fetchProducts();

// Avoid redeclaration by checking if wishlist is already defined
if (!window.wishlist) {
  window.wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
}

// Function to update the wishlist count in the navigation
function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlist-count");
  if (wishlistCount) wishlistCount.textContent = window.wishlist.length;
}

// Function to show the pop-up message
function showPopupMessage() {
  const popup = document.getElementById("popup-message");
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000); // Show for 2 seconds
}

// Add product to wishlist with success pop-up and update icon
function addToWishlist(id, name, image, price) {
  if (!window.wishlist.some((item) => item.id === id)) {
    window.wishlist.push({ id, name, image, price });
    localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
    displayWishlist();
    updateWishlistCount();
    showPopupMessage(); // Show the pop-up message
  } else {
    alert("Product is already in your wishlist.");
  }
}

function addToWishlist(id, name, image, price) {
  // Check if the wishlist already contains the item
  if (!window.wishlist.some((item) => item.id === id)) {
    // Add item to wishlist
    window.wishlist.push({ id, name, image, price });
    // Save wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(window.wishlist));
    // Update the count display
    updateWishlistCount();
    // Show a success message if needed
    showPopupMessage();
  } else {
    alert("Product is already in your wishlist.");
  }
}

// Display wishlist items in wishlist.html
function displayWishlist() {
  const wishlistContainer = document.getElementById("wishlist-container");
  if (!wishlistContainer) return;

  wishlistContainer.innerHTML = ""; // Clear container
  window.wishlist.forEach((item, index) => {
    const wishlistItem = document.createElement("div");
    wishlistItem.classList.add("wishlist-item");
    wishlistItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Price: $${item.price}</p>
      <button onclick="removeFromWishlist(${index})">Remove</button>
      <button onclick="updateWishlist(${index})">Update</button>
    `;
    wishlistContainer.appendChild(wishlistItem);
  });
}
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
      <p>Note: ${item.note}</p>
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
function updateWishlistCount() {
  const wishlistCount = document.getElementById("wishlist-count");
  if (wishlistCount) wishlistCount.textContent = window.wishlist.length;
}

// Load products and wishlist count on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  displayWishlist();
  updateWishlistCount();
});



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
    showSuccessMessage();
  } else {
    alert("Product is already in your wishlist.");
  }
  
  closeWishlistPopup();
  document.getElementById("wishlist-note").value = ""; // Clear note input
}

// Show success pop-up message
function showSuccessMessage() {
  const successMessage = document.getElementById("success-message");
  successMessage.classList.add("show");
  setTimeout(() => successMessage.classList.remove("show"), 2000);
}

// Add event to "Add to Wishlist" buttons on index page
function addToWishlist(id, name, image, price) {
  openWishlistPopup(id, name, image, price);
}
