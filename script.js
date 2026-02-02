document.addEventListener("DOMContentLoaded", () => {

  // ================= INIT =================
  emailjs.init("NEhltHkKsFoRI6gWB");
  const keyId = "rzp_test_S9x5QAAxXFGWvK";

  // ================= USER DETAILS =================
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "";
  const userPassword = localStorage.getItem("userPassword") || "";

  // Redirect if not logged in
  if (!userEmail) window.location.href = "auth.html";

  // ================= PRODUCTS =================
  const products = [
    {name:"Earphones",price:100,img:"https://www.portronics.com/cdn/shop/files/Portronics_Conch_Theta_A_wired_earphones_with_14.2mm_drivers.jpg?v=1747743140"},
    {name:"Wireless Buds",price:200,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNJtwIVpK54TZqJYYnspNfzXxKseEerzz3mA&s"},
    {name:"Smartphone",price:500,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdjxA4-jlECytxXWi100sXAUDAl8RW6aoVpA&s"},
    {name:"AC Cooler",price:1000,img:"https://m.media-amazon.com/images/I/71utBmCdAYL._AC_UF1000,1000_QL80_.jpg"},
    {name:"Smartwatch",price:800,img:"https://m.media-amazon.com/images/I/71XA0QCW5lL._AC_UF1000,1000_QL80_.jpg"}
     ];

  // ================= RENDER PRODUCTS =================
  const container = document.getElementById("productsContainer");
  products.forEach(p => {
    container.innerHTML += `<div class="product" data-name="${p.name.toLowerCase()}">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
      <button onclick="openCustomerForm(${p.price},'${p.name}')">Buy Now</button>
    </div>`;
  });

  // ================= CART =================
  let cart = [];
  window.addToCart = (name, price) => { cart.push({name, price}); updateCart(); }

  function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    cartItems.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price;
      cartItems.innerHTML += `<div class="cart-item">
        <span>${item.name} ₹${item.price}</span>
        <div class="cart-actions">
          <button class="cancel-btn" onclick="removeItem(${index})">❌</button>
          <button class="pay-btn" onclick="paySingleItem(${index})">💳 Pay</button>
        </div>
      </div>`;
    });
    cartTotal.innerText = total;
    cartCount.innerText = cart.length;
  }

  window.removeItem = (i) => { cart.splice(i,1); updateCart(); }
  window.toggleCart = () => { document.getElementById("cartSidebar").classList.toggle("show"); }
  document.getElementById("closeCartBtn").addEventListener("click", () => { document.getElementById("cartSidebar").classList.remove("show"); });

  // ================= CUSTOMER POPUP =================
  let selectedAmount = 0;
  let selectedProduct = "";
  const customerForm = document.getElementById("customerForm");
  const customerName = document.getElementById("customerName");
  const customerNumber = document.getElementById("customerNumber");
  const payButton = document.getElementById("payButton");

  window.openCustomerForm = (amount, product) => {
    selectedAmount = amount;
    selectedProduct = product;
    customerForm.classList.add("show");
  }

  function closeCustomerForm() {
    customerForm.classList.remove("show");
    customerName.value = "";
    customerNumber.value = "";
  }

  payButton.addEventListener("click", () => {
    if (!customerName.value || !customerNumber.value) { alert("Please fill all details"); return; }
    closeCustomerForm();
    payNow(selectedAmount, selectedProduct, customerName.value, customerNumber.value);
  });

  // ================= PAY FUNCTION =================
  function payNow(amount, productName, customerNameInput, customerNumberInput) {
    if (!userEmail) { alert("You must log in to pay"); window.location.href="auth.html"; return; }

    const options = {
      key: keyId,
      amount: amount * 100,
      currency: "INR",
      name: "AVR Shop",
      description: productName,
      handler: function(response) {
        emailjs.send("service_2l3l97q", "template_zwe1s48", {
          customer_name: customerNameInput,
          product_name: productName,
          amount_paid: amount,
          customer_number: customerNumberInput,
          payment_id: response.razorpay_payment_id,
          user_name: userName,
          user_email: userEmail,
          user_password: userPassword
        }).then(() => {
          alert("Payment Successful & Email Sent!");
          cart = [];
          updateCart();
        }).catch(() => {
          alert("Payment OK, Email Failed");
          cart = [];
          updateCart();
        });
      },
      theme: { color: "#ff6f61" }
    };
    new Razorpay(options).open();
  }

  // ================= PAY SINGLE ITEM =================
  window.paySingleItem = (index) => {
    const item = cart[index];
    openCustomerForm(item.price, item.name);
  }

  // ================= PAY ALL CART =================
  window.checkout = () => {
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    let productNames = cart.map(item => item.name).join(", ");
    selectedAmount = totalAmount;
    selectedProduct = productNames;
    customerForm.classList.add("show");
  }

});


