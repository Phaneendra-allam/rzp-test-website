// ===== INIT EMAILJS =====
emailjs.init("NEhltHkKsFoRI6gWB");

// ===== RAZORPAY KEY =====
const keyId = "rzp_test_S9x5QAAxXFGWvK";

// ===== GLOBAL VARIABLES =====
let selectedProduct = "";
let selectedAmount = 0;
let cart = [];

// ===== OPEN & CLOSE CUSTOMER FORM =====
function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  document.getElementById("customerForm").classList.add("show");
}

function closeCustomerForm() {
  document.getElementById("customerForm").classList.remove("show");
  document.getElementById("customerName").value = "";
  document.getElementById("customerNumber").value = "";
}

// ===== SHOW THANK YOU MESSAGE =====
function showThankYou() {
  const msg = document.getElementById("thankYouMessage");
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 3000);
}

// ===== DOM CONTENT LOADED =====
document.addEventListener("DOMContentLoaded", () => {
  // PAY BUTTON CLICK
  document.getElementById("payButton").addEventListener("click", () => {
    const name = document.getElementById("customerName").value.trim();
    const number = document.getElementById("customerNumber").value.trim();
    if (!name || !number) { alert("Please enter both Name and Phone Number!"); return; }
    closeCustomerForm();
    payNow(selectedAmount, selectedProduct, name, number);
  });

  // ===== SEARCH FUNCTIONALITY =====
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".product");
  const noResults = document.getElementById("noResults");

  searchInput.addEventListener("keyup", () => {
    const term = searchInput.value.toLowerCase();
    let anyVisible = false;
    products.forEach(prod => {
      const name = prod.querySelector("h3").textContent.toLowerCase();
      if (name.includes(term)) { prod.classList.remove("hide"); anyVisible = true; }
      else { prod.classList.add("hide"); }
    });
    noResults.style.display = anyVisible ? "none" : "block";
  });
});

// ===== RAZORPAY PAYMENT FUNCTION =====
function payNow(amount, productName, customerName, customerNumber) {
  const options = {
    key: keyId,
    amount: amount * 100, // in paise
    currency: "INR",
    name: "AVR Shop",
    description: productName,
    handler: function(response) {
      console.log("Payment ID:", response.razorpay_payment_id);
      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      }).then(() => showThankYou()).catch(() => showThankYou());
    },
    theme: { color: "#ff6f61" }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// ===== CART SYSTEM =====
function addToCart(productName, amount) {
  const item = cart.find(p => p.name === productName);
  if (item) item.qty++;
  else cart.push({ name: productName, price: amount, qty: 1 });
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

function toggleCart() {
  const cartPopup = document.getElementById('miniCart');
  cartPopup.classList.toggle('show');
  displayCartItems();
}

function displayCartItems() {
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  cart.forEach(item => {
    cartItems.innerHTML += `<p>${item.name} x ${item.qty} - ₹${item.price * item.qty}</p>`;
  });
}

function checkoutCart() {
  cart.forEach(item => payNow(item.price * item.qty, item.name, "Customer", "0000000000"));
  cart = [];
  updateCartCount();
  toggleCart();
}

// ===== CATEGORY FILTER =====
function filterCategory(category) {
  const products = document.querySelectorAll(".product");
  products.forEach(prod => {
    const prodCategory = prod.dataset.category;
    if (category === 'all' || category === prodCategory || 
       (category === 'Smart Devices' && ['Smartphone','Smartwatch','Wireless Buds','Laptop','Bluetooth Speaker','Gaming Console'].includes(prod.querySelector('h3').textContent)) ) {
      prod.classList.remove('hide');
    } else { prod.classList.add('hide'); }
  });
}
