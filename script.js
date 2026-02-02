// ================= EMAILJS & RAZORPAY =================
emailjs.init("NEhltHkKsFoRI6gWB");
const keyId = "rzp_test_S9x5QAAxXFGWvK";

// ================= PRODUCTS =================
const products = [
  {name:"Earphones",price:100,img:"https://www.portronics.com/cdn/shop/files/Portronics_Conch_Theta_A_wired_earphones_with_14.2mm_drivers.jpg?v=1747743140"},
  {name:"Wireless Buds",price:200,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNJtwIVpK54TZqJYYnspNfzXxKseEerzz3mA&s"},
  {name:"Smartphone",price:500,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdjxA4-jlECytxXWi100sXAUDAl8RW6aoVpA&s"},
  {name:"AC Cooler",price:1000,img:"https://m.media-amazon.com/images/I/71utBmCdAYL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Smartwatch",price:800,img:"https://m.media-amazon.com/images/I/71XA0QCW5lL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Bluetooth Speaker",price:600,img:"https://europe.yamaha.com/en/files/speaker-top-bnr-1200x480_tcm113-2295062.jpg"},
  {name:"Laptop",price:30000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE-t9Ix5P-jFp6ksUffJ8lRS8HxcgbwHvopw&s"},
  {name:"Gaming Console",price:25000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgTv3o0vrUu5yV5-hLEpKSlwIHJltQzNP8A&s"}
];

// ================= RENDER PRODUCTS =================
const container = document.getElementById("productsContainer");
products.forEach(p => {
  container.innerHTML += `
    <div class="product" data-name="${p.name.toLowerCase()}">
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
      <button onclick="openCustomerForm(${p.price},'${p.name}')">Buy Now</button>
    </div>
  `;
});

// ================= SEARCH =================
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  document.querySelectorAll(".product").forEach(p => {
    p.style.display = p.dataset.name.includes(value) ? "block" : "none";
  });
});

// ================= CART =================
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

let cart = [];

function addToCart(name, price) {
  cart.push({name, price});
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} ₹${item.price}</span>
        <div class="cart-actions">
          <button class="cancel-btn" onclick="removeItem(${index})">❌</button>
          <button class="pay-btn" onclick="paySingleItem(${index})">💳 Pay</button>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = total;
  cartCount.innerText = cart.length;
}

function removeItem(i) {
  cart.splice(i, 1);
  updateCart();
}

function toggleCart() {
  cartSidebar.classList.toggle("show");
}

// Close cart button
document.getElementById("closeCartBtn").addEventListener("click", () => {
  cartSidebar.classList.remove("show");
});

function checkout() {
  alert("Please use Buy Now to pay");
}

// ================= POPUP =================
let selectedAmount = 0;
let selectedProduct = "";

const customerForm = document.getElementById("customerForm");
const customerName = document.getElementById("customerName");
const customerNumber = document.getElementById("customerNumber");
const payButton = document.getElementById("payButton");

function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  customerForm.classList.add("show");
}

function closeCustomerForm() {
  customerForm.classList.remove("show");
  customerName.value = "";
  customerNumber.value = "";
}

// ================= PAY =================
payButton.addEventListener("click", () => {
  if (!customerName.value || !customerNumber.value) {
    alert("Please fill all details");
    return;
  }
  closeCustomerForm();
  payNow(selectedAmount, selectedProduct, customerName.value, customerNumber.value);
});

function payNow(amount, productName, customerName, customerNumber) {
  const options = {
    key: keyId,
    amount: amount * 100,
    currency: "INR",
    name: "AVR Shop",
    description: productName,
    handler: function (response) {
      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      })
      .then(() => alert("Payment Successful & Email Sent!"))
      .catch(err => alert("Payment OK, Email Failed"));
    },
    theme: { color: "#ff6f61" }
  };

  new Razorpay(options).open();
}

// ================= PAY SINGLE CART ITEM =================
function paySingleItem(index) {
  const item = cart[index];
  openCustomerForm(item.price, item.name);
}
