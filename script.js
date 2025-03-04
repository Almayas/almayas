// Define a basic data set for products
const productsData = {
    "1": {
        name: "Product 1",
        price: 10.00,
        description: "This is a description for Product 1. It is a great product with many features.",
        image: "images/product1.jpg",
        category: "Electronics"
    },
    "2": {
        name: "Product 2",
        price: 15.00,
        description: "This is a description for Product 2. It is another fantastic product that you will love.",
        image: "images/product2.jpg",
        category: "Accessories"
    }
};
// Define valid coupons and their discount percentages
const validCoupons = {
    "DISCOUNT10": 0.10,  // 10% discount
    "DISCOUNT20": 0.20   // 20% discount
};

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsElement = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");

//Recently Viewed Products feature
function updateRecentlyViewed(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    // Remove the product if it already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    // Add the current product at the beginning
    recentlyViewed.unshift(productId);
    // Limit to the 5 most recent items
    recentlyViewed = recentlyViewed.slice(0, 5);
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
}


//---------------------------------------
//Function to Add a Product to the Compare List
//--------------------------------
function addToCompare(event) {
    event.stopPropagation(); // Prevent any unwanted bubbling
    const button = event.target.closest(".add-to-compare");
    const productContainer = button.closest(".product");
    const productId = productContainer.getAttribute("data-id");
  
    // Retrieve the compare list from localStorage (or initialize as empty array)
    let compareList = JSON.parse(localStorage.getItem("compareList")) || [];
  
    // If product is already in compare list, do nothing or show a notification
    if (compareList.includes(productId)) {
      showNotification("Product is already added to compare!");
      return;
    }
  
    // Limit comparison to, say, 3 products
    if (compareList.length >= 3) {
      showNotification("You can only compare up to 3 products.");
      return;
    }
  
    compareList.push(productId);
    localStorage.setItem("compareList", JSON.stringify(compareList));
    showNotification("Product added to compare list!");
}  


// Utility function to update the cart count in the header
function updateCartCount() {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    let totalCount = 0;
    cartItems.forEach(item => {
        totalCount += item.quantity;
    });
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) {
        cartCountElem.textContent = totalCount;
    }
}

function displayRelatedProducts(currentProductId) {
    console.log("displayRelatedProducts called for product ID:", currentProductId);
    const relatedContainer = document.getElementById("related-products-container");
    if (!relatedContainer) {
        console.error("related-products-container not found");
        return;

    }

    let relatedHTML = "";
    // Loop through all products in productsData
    for (let id in productsData) {
        if (id === currentProductId) continue; // Skip current product

        const product = productsData[id];
        relatedHTML += `
        <div class="related-product" data-id="${id}" data-name="${product.name}" data-price="${product.price}">
          <a href="product.html?id=${id}">
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
          </a>
          <p>$${product.price.toFixed(2)}</p>
          <button class="add-to-cart" data-id="${id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        </div>
      `;
    }
    relatedContainer.innerHTML = relatedHTML;

    // Attach add-to-cart listeners for these related products
    const relatedAddButtons = relatedContainer.querySelectorAll(".add-to-cart");
    relatedAddButtons.forEach(button => {
        button.addEventListener("click", addToCart);
    });
}


function showNotification(message) {
    // Create a notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    // Append it to the body (or another container)
    document.body.appendChild(notification);

    // Remove the notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Function to add product to cart
// Function to add product to cart
function addToCart(event) {
    const button = event.target;
    let productId, productName, productPrice;

    // Try to get data from the closest .product container if available 
    const productContainer = button.closest(".product");
    if (productContainer) {
        productId = productContainer.getAttribute("data-id");
        productName = productContainer.getAttribute("data-name");
        productPrice = parseFloat(productContainer.getAttribute("data-price"));
    } else {
        // Otherwise, read data attributes directly from the button (for product details page )
        productId = button.getAttribute("data-id");
        productName = button.getAttribute("data-name");
        productPrice = parseFloat(button.getAttribute("data-price"));
    }

    // Retrieve cart from localStorage (or initialize empty array)
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
    }


    //Save the updated cart

    localStorage.setItem("cart", JSON.stringify(cart));
    // Instead of an alert, update the cart icon count
    updateCartCount();

    //Optionally, Show a notification (or any other feedback)
    showNotification("Product added to cart successfully!");
}

// Function to remove product from cart
function removeFromCart(event) {
    const productId = event.target.getAttribute("data-id");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCart(); // This updates cart.html view
    updateCartCount(); // And this updates the header icon
}

// Function to update cart display (for cart page)
function updateCart() {
    if (!document.getElementById("cart-items") || !document.getElementById("cart-total")) return;

    const cartItemsElement = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsElement.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price} x ${item.quantity} `;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.setAttribute("data-id", item.id);
        removeButton.addEventListener("click", removeFromCart);

        li.appendChild(removeButton);
        cartItemsElement.appendChild(li);
    });

    cartTotalElement.textContent = total.toFixed(2);
}
// Load cart on cart.html
if (window.location.pathname.includes("cart.html")) {
    updateCart();
}

// Attach event listeners on Home Page
if (window.location.pathname.includes("index.html")) {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });
}

// Checkout form submission
// Check if we are on product.html
/*if (window.location.pathname.includes("product.html")) {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const product = productsData[productId];
    const detailsDiv = document.getElementById("product-details");

    if (product) {
        detailsDiv.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>${product.description}</p>
            <button class="add-to-cart" 
                data-id="${productId}" 
                data-name="${product.name}" 
                data-price="${product.price}">
                    Add to Cart
            </button>
            <!-- Reviews Section -->
            <div id="reviews">
                <h3>Reviews (<span id="review-count">0</span>)</h3>
                <ul id="review-list"></ul>
                <form id="review-form">
                    <input type="text" id="reviewer-name" placeholder="Your name" required>
                    <br>
                    <textarea id="review-text" placeholder="Write your review here..." required></textarea>
                    <br>
                    <button type="submit">Submit Review</button>
                </form>
            </div>
            <!-- Related Products Section -->
            <div id="related-products">
                <h3>Related Products</h3>
                <div id="related-products-container"></div>
            </div>
        `;

        // Attach event listener to the "Add to Cart" button in product details
        const addButton = detailsDiv.querySelector(".add-to-cart");
        if (addButton) {
            addButton.addEventListener("click", addToCart);
        }

        // Load and render reviews for this product
        loadReviews(productId);

        // Attach event listener for review form submission
        const reviewForm = document.getElementById("review-form");
        reviewForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const reviewerNameElem = document.getElementById("reviewer-name");
            const reviewTextElem = document.getElementById("review-text");
            const reviewerName = reviewerNameElem.value.trim();
            const reviewText = reviewTextElem.value.trim();
            if (reviewerName !== "" && reviewText !== "") {
                saveReview(productId, reviewerName, reviewText);
                reviewerNameElem.value = "";
                reviewTextElem.value = "";
                loadReviews(productId); // Reload reviews after submission
                showNotification("Review submitted successfully!");
            }
        });

        // Call function to display related products
        displayRelatedProducts(productId);
    } else {
        detailsDiv.innerHTML = "<p>Product not found.</p>";
    }
}*/
// Wishlist functionality

// Function to update the wishlist count (if you want to show it somewhere)
function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    console.log("Wishlist count updated to:", wishlist.length); // Debug log
    const wishlistCountElem = document.getElementById("wishlist-count");
    if (wishlistCountElem) {
        wishlistCountElem.textContent = wishlist.length;
    }
}

// Function to add a product to the wishlist
function addToWishlist(event) {
    event.stopPropagation(); // Prevent any parent click events
    const button = event.target.closest(".add-to-wishlist");
    // Get product data from the closest .product container
    const productContainer = button.closest(".product");
    const productId = productContainer.getAttribute("data-id");
    const productName = productContainer.getAttribute("data-name");
    const productPrice = parseFloat(productContainer.getAttribute("data-price"));
    const productImage = productContainer.querySelector("img").getAttribute("src");

    // Retrieve wishlist from localStorage (or initialize empty array)
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // Check if product already in wishlist
    const exists = wishlist.some(item => item.id === productId);
    if (!exists) {
        wishlist.push({ id: productId, name: productName, price: productPrice, image: productImage });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        // Optionally, give user feedback
        showNotification("Added to Wishlist!");
    } else {
        showNotification("Already in Wishlist!");
    }

    updateWishlistCount();
}

// Attach event listeners for wishlist buttons on the home page (index.html)

// Render wishlist on wishlist.html
if (window.location.pathname.includes("wishlist.html")) {
    const wishlistItemsElement = document.getElementById("wishlist-items");
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistItemsElement.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistItemsElement.innerHTML = "<p>Your wishlist is empty.</p>";
    } else {
        wishlist.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 80px; height: auto; vertical-align: middle; margin-right: 10px;">
          <span>${item.name} - $${item.price.toFixed(2)}</span>
          <button class="remove-from-wishlist" data-id="${item.id}" style="margin-left: 10px;">Remove</button>
        `;
            wishlistItemsElement.appendChild(li);
        });

        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll(".remove-from-wishlist");
        removeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const productId = button.getAttribute("data-id");
                wishlist = wishlist.filter(item => item.id !== productId);
                localStorage.setItem("wishlist", JSON.stringify(wishlist));
                // Re-render the wishlist
                location.reload();
            });
        });
    }
}

//Function to Render Recently Viewed Products

function displayRecentlyViewed() {
    const container = document.getElementById("recently-viewed-container");
    if (!container) return;
    
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    let html = "";
    recentlyViewed.forEach(id => {
      if (productsData[id]) {
        const prod = productsData[id];
        html += `
          <div class="recently-viewed-product">
            <a href="product.html?id=${id}">
              <img src="${prod.image}" alt="${prod.name}">
              <h4>${prod.name}</h4>
            </a>
            <p>$${prod.price.toFixed(2)}</p>
          </div>
        `;
      }
    });
    container.innerHTML = html;
}  


// Function to load reviews for a given product ID
function loadReviews(productId) {
    const reviewListElem = document.getElementById("review-list");
    const reviewCountElem = document.getElementById("review-count");
    // Retrieve reviews object from localStorage; use an empty object if not set
    let reviewsData = JSON.parse(localStorage.getItem("reviews")) || {};
    // Get reviews for this product or default to an empty array
    const reviews = reviewsData[productId] || [];

    // Update the review count
    if (reviewCountElem) {
        reviewCountElem.textContent = reviews.length;
    }

    // Clear the review list before rendering
    reviewListElem.innerHTML = "";
    if (reviews.length === 0) {
        reviewListElem.innerHTML = "<li>No reviews yet. Be the first to review!</li>";
    } else {
        reviews.forEach((review, index) => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${index + 1}. ${review.name}:</strong><br>  ${review.text}`;
            reviewListElem.appendChild(li);
        });
    }
}

// Function to save a review for a given product ID
function saveReview(productId, reviewerName, reviewText) {
    let reviewsData = JSON.parse(localStorage.getItem("reviews")) || {};
    if (!reviewsData[productId]) {
        reviewsData[productId] = [];
    }
    reviewsData[productId].push({ name: reviewerName, text: reviewText });
    localStorage.setItem("reviews", JSON.stringify(reviewsData));
}



//Save a rating and update stored ratings
function saveRating(productId, rating) {
    // Retrieve ratings object from localStorage; initialize if needed
    let ratingsData = JSON.parse(localStorage.getItem("ratings")) || {};
    if (!ratingsData[productId]) {
        ratingsData[productId] = [];
    }
    // Add the new rating
    ratingsData[productId].push(rating);
    localStorage.setItem("ratings", JSON.stringify(ratingsData));
}

function getAverageRating(productId) {
    let ratingsData = JSON.parse(localStorage.getItem("ratings")) || {};
    let ratings = ratingsData[productId] || [];
    if (ratings.length === 0) return "N/A";
    let sum = ratings.reduce((acc, curr) => acc + curr, 0);
    let avg = sum / ratings.length;
    return avg.toFixed(1);
}


//Initialize the Rating Section

function initRating(productId) {
    const stars = document.querySelectorAll("#star-rating .star");
    const averageRatingElem = document.getElementById("average-rating");

    // Update the average rating display initially
    averageRatingElem.textContent = "Average Rating: " + getAverageRating(productId);

    // For each star, add a click event listener
    stars.forEach(star => {
        star.addEventListener("click", function () {
            const rating = parseInt(star.getAttribute("data-value"));
            // Save the rating
            saveRating(productId, rating);
            // Update the average rating display
            averageRatingElem.textContent = "Average Rating: " + getAverageRating(productId);
            showNotification("Thanks for rating!");
            // Optionally, you can also update star colors to reflect the rating
            updateStarColors(rating);
        });
    });
}

function updateStarColors(rating) {
    const stars = document.querySelectorAll("#star-rating .star");
    stars.forEach(star => {
        const starValue = parseInt(star.getAttribute("data-value"));
        if (starValue <= rating) {
            star.style.color = "gold";
        } else {
            star.style.color = "#ccc";
        }
    });
}

//------------------------------
//Social Sharing Functionality
//------------------------------
function initSocialSharing(productId) {
    // Get the current product details from productsData
    const product = productsData[productId];
    if (!product) return;
    
    // Construct the current page URL (you might adjust if hosted on a domain)
    const pageUrl = encodeURIComponent(window.location.href);
    const productName = encodeURIComponent(product.name);
    const productImage = encodeURIComponent(product.image);
    
    // Facebook sharing URL
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    
    // Twitter sharing URL (with product name as text)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${productName}&url=${pageUrl}`;
    
    // Pinterest sharing URL (with image)
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${productImage}&description=${productName}`;
    
    // Set href attributes for the share links
    const fbLink = document.getElementById("share-facebook");
    const twitterLink = document.getElementById("share-twitter");
    const pinterestLink = document.getElementById("share-pinterest");
    
    if (fbLink) {
      fbLink.href = facebookUrl;
      fbLink.target = "_blank";
    }
    if (twitterLink) {
      twitterLink.href = twitterUrl;
      twitterLink.target = "_blank";
    }
    if (pinterestLink) {
      pinterestLink.href = pinterestUrl;
      pinterestLink.target = "_blank";
    }
}  







//Listners

document.addEventListener("DOMContentLoaded", function () {
    // -----------------------------------
    // 1. Product Filtering / Search
    // -----------------------------------
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const filter = searchInput.value.toLowerCase();
            const products = document.querySelectorAll(".product");
            products.forEach(product => {
                const productName = product.getAttribute("data-name").toLowerCase();
                product.style.display = productName.includes(filter) ? "inline-block" : "none";
            });
        });
    }

    // -----------------------------------
    // 2. Home Page: Attach Add-to-Cart Listeners
    // -----------------------------------
    if (window.location.pathname.includes("index.html")) {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", addToCart);
        });
        displayRecentlyViewed();
    }

    // -----------------------------------
    // 3. Checkout Form Submission and Order Summary
    // -----------------------------------
    const checkoutForm = document.getElementById("checkout-form");
    const summaryList = document.getElementById("summary-list");
    const totalPriceElement = document.getElementById("total-price");
    function loadOrderSummary() {
        let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        summaryList.innerHTML = ""; // Clear previous items
        let total = 0;
        cartItems.forEach(item => {
            let listItem = document.createElement("li");
            listItem.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
            summaryList.appendChild(listItem);
            total += item.price * item.quantity;
        });
        totalPriceElement.textContent = total.toFixed(2);
    }
    if (summaryList && totalPriceElement) {
        loadOrderSummary();
    }
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent page reload
            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let address = document.getElementById("address").value.trim();
            let payment = document.getElementById("payment").value;
            let couponCode = document.getElementById("coupon").value.trim().toUpperCase();
            if (name && email && address) {
                // Retrieve the cart items (using "cart" as stored in localStorage)
                let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
                if (cartItems.length === 0) {
                    alert("Your cart is empty. Please add some products first.");
                    return;
                }

                // Calculate total price
                let total = 0;
                cartItems.forEach(item => {
                    total += item.price * item.quantity;
                });

                // Apply coupon code if valid
                let discount = 0;
                if (couponCode && validCoupons[couponCode]) {
                    discount = validCoupons[couponCode];
                    total = total - total * discount;
                }

                // Create the order object
                const order = {
                    customerName: name,
                    email: email,
                    address: address,
                    payment: payment,
                    coupon: couponCode && validCoupons[couponCode] ? couponCode : null,
                    discount: discount,
                    items: cartItems,
                    total: total,
                    date: new Date().toLocaleString()
                };

                // Retrieve any existing orders and add this order
                let orders = JSON.parse(localStorage.getItem("orders")) || [];
                orders.push(order);
                localStorage.setItem("orders", JSON.stringify(orders));

                //Alert user with discount info if coupon was applied
                if (discount >0){
                    alert(`Thank you, ${name}! Your order has been placed with a ${discount * 100}% discount. Your new total is $${total.toFixed(2)}.`);
                } else {
                    alert(`Thank you, ${name}! Your order has been placed. Your total is $${total.toFixed(2)}.`);
                }

                // Clear cart after checkout (if needed)
                localStorage.removeItem("cart");
                // Redirect to home page
                window.location.href = "index.html";
            } else {
                alert("Please fill in all required fields.");
            }
        });
    }
    updateCartCount();

    // -----------------------------------
    // 4. Product Details Page
    // -----------------------------------
    if (window.location.pathname.includes("product.html")) {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        const product = productsData[productId];
        const detailsDiv = document.getElementById("product-details");
    
        if (product) {
            detailsDiv.innerHTML = `
                <h2>${product.name}</h2>
                <img src="${product.image}" alt="${product.name}">
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>${product.description}</p>
                <button class="add-to-cart" 
                    data-id="${productId}" 
                    data-name="${product.name}" 
                    data-price="${product.price}">
                        Add to Cart
                </button>
                <!-- Social Sharing Section -->
                <div id="social-sharing">
                    <h3>Share this product:</h3>
                    <div class="share-buttons">
                        <a href="#" id="share-facebook" title="Share on Facebook"><i class="fab fa-facebook-square"></i></a>
                        <a href="#" id="share-twitter" title="Share on Twitter"><i class="fab fa-twitter-square"></i></a>
                        <a href="#" id="share-pinterest" title="Share on Pinterest"><i class="fab fa-pinterest-square"></i></a>
                    </div>
                </div>

                <!-- Rating Section -->
                <div id="rating-section">
                    <h3>Rate this Product: </h3>
                    <div id="star-rating">
                        <span data-value="1" class="star">&#9733;</span>
                        <span data-value="2" class="star">&#9733;</span>
                        <span data-value="3" class="star">&#9733;</span>
                        <span data-value="4" class="star">&#9733;</span>
                        <span data-value="5" class="star">&#9733;</span>
                    </div>
                    <p id="average-rating">Average Rating: N/A</p>
                </div>
                <!-- Reviews Section -->
                <div id="reviews">
                    <h3>Reviews (<span id="review-count">0</span>)</h3>
                    <ul id="review-list"></ul>
                    <form id="review-form">
                        <input type="text" id="reviewer-name" placeholder="Your name" required>
                        <br>
                        <textarea id="review-text" placeholder="Write your review here..." required></textarea>
                        <br>
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
                <!-- Related Products Section -->
                <div id="related-products">
                    <h3>Related Products</h3>
                    <div id="related-products-container"></div>
                </div>
            `;
    
            // Attach event listener to the "Add to Cart" button in product details
            const addButton = detailsDiv.querySelector(".add-to-cart");
            if (addButton) {
                addButton.addEventListener("click", addToCart);
            }
    
            // Load and render reviews for this product
            loadReviews(productId);
    
            // Attach event listener for review form submission
            const reviewForm = document.getElementById("review-form");
            reviewForm.addEventListener("submit", function (event) {
                event.preventDefault();
                const reviewerNameElem = document.getElementById("reviewer-name");
                const reviewTextElem = document.getElementById("review-text");
                const reviewerName = reviewerNameElem.value.trim();
                const reviewText = reviewTextElem.value.trim();
                if (reviewerName !== "" && reviewText !== "") {
                    saveReview(productId, reviewerName, reviewText);
                    reviewerNameElem.value = "";
                    reviewTextElem.value = "";
                    loadReviews(productId); // Reload reviews after submission
                    showNotification("Review submitted successfully!");
                }
            });

            // Initialize the rating section
            initRating(productId);
    
            // **Call function to display related products**
            displayRelatedProducts(productId);
            updateRecentlyViewed(productId);
            initSocialSharing(productId);
            
        } else {
            detailsDiv.innerHTML = "<p>Product not found.</p>";
        }
    }    

    // -----------------------------------
    // 5. Product Sorting Functionality
    // -----------------------------------
    const sortOptions = document.getElementById("sort-options");
    if (sortOptions) {
        sortOptions.addEventListener("change", function () {
            const selected = sortOptions.value;
            const productsContainer = document.getElementById("products");
            // Convert NodeList to Array for sorting
            const productElements = Array.from(productsContainer.querySelectorAll(".product"));
            if (selected === "price-asc") {
                productElements.sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute("data-price"));
                    const priceB = parseFloat(b.getAttribute("data-price"));
                    return priceA - priceB;
                });
            } else if (selected === "price-desc") {
                productElements.sort((a, b) => {
                    const priceA = parseFloat(a.getAttribute("data-price"));
                    const priceB = parseFloat(b.getAttribute("data-price"));
                    return priceB - priceA;
                });
            }
            // Append sorted elements back into the container
            productElements.forEach(el => productsContainer.appendChild(el));
        });
    }

   

    // -----------------------------------
    // 6. Wishlist Functionality
    // -----------------------------------
    const wishlistButtons = document.querySelectorAll(".add-to-wishlist");
    wishlistButtons.forEach(button => {
        button.addEventListener("click", addToWishlist);
    });
    updateWishlistCount();


    // ------------------------------------ 
    // 7.  Implement the Category Filtering
    // ------------------------------------
    // Category Filtering Functionality
    const categorySelect = document.getElementById("category-select");
    if (categorySelect) {
        categorySelect.addEventListener("change", function () {
        const selectedCategory = categorySelect.value;
        const products = document.querySelectorAll(".product");
        products.forEach(product => {
            const productCategory = product.getAttribute("data-category");
            // If "All Categories" is selected (empty value), show all products.
            if (!selectedCategory || productCategory === selectedCategory) {
            product.style.display = "inline-block";
            } else {
            product.style.display = "none";
            }
        });
        });
    }
    // -----------------------------------
    // 8. Price Range Filter Functionality
    // -----------------------------------
    // Price Range Filter functionality
    const applyPriceFilterBtn = document.getElementById("apply-price-filter");
    if (applyPriceFilterBtn) {
        applyPriceFilterBtn.addEventListener("click", function () {
        const minPriceInput = document.getElementById("min-price").value;
        const maxPriceInput = document.getElementById("max-price").value;
        const minPrice = parseFloat(minPriceInput) || 0;
        const maxPrice = parseFloat(maxPriceInput) || Infinity;

        // Loop through all products
        const products = document.querySelectorAll(".product");
        products.forEach(product => {
            const price = parseFloat(product.getAttribute("data-price"));
            // Show product if price is within the range, hide otherwise
            if (price >= minPrice && price <= maxPrice) {
            product.style.display = "inline-block";
            } else {
            product.style.display = "none";
            }
        });
        });
    }

    //----------------------------------------
    // 9. Compare Products Functionality
    //----------------------------------------
    // Attach event listeners to compare buttons on product cards
    const compareButtons = document.querySelectorAll(".add-to-compare");
    compareButtons.forEach(button => {
        button.addEventListener("click", addToCompare);
    });

});