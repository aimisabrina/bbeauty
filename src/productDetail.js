const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function fetchProductDetail() {
  const response = await fetch(`http://makeup-api.herokuapp.com/api/v1/products/${productId}.json`);
  const product = await response.json();
  displayProductDetail(product);
}

function displayProductDetail(product) {
  const productDetailContainer = document.getElementById("product-detail");
  productDetailContainer.innerHTML = `
    <div class="product-images">
      <img src="${product.image_link}" alt="${product.name}" class="main-image">
    </div>
    <div class="product-details">
      <h2>${product.name}</h2>
      <p>Brand: ${product.brand}</p>
      <p>Type: ${product.product_type}</p>
      <p class="description">${product.description || "No description available."}</p>
      <p class="price">$${product.price}</p>
      <p>Rating: ${product.rating || "N/A"}</p>
      <a href="${product.product_link}" target="_blank">View on website</a>
    </div>
  `;
  //<div class="add-to-cart">
        //<label for="quantity">Quantity:</label>
        //<input type="number" id="quantity" name="quantity" value="1" min="1">
        //<button onclick="addToCart(${product.id})">Add to Cart</button>
      //</div>
}

fetchProductDetail();
