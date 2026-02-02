// ================= LOGIN/SIGNUP EMAIL =================
async function sendAuthEmail(name, email, phone, type) {
  try {
    await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, type })
    });
    console.log(type + " email sent");
  } catch(err) { console.error(err); }
}

// ================= CHECK LOGIN =================
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser && window.location.pathname.includes("index.html")) {
  alert("Please login first!");
  window.location.href = "login.html";
} else if(currentUser){
  document.getElementById("welcomeMsg")?.innerText = `Welcome, ${currentUser.name}!`;
}

// ================= LOGOUT =================
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

// ================= SHOW/HIDE FORMS =================
function showSignup() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('signupForm').classList.remove('hidden');
}
function showLogin() {
  document.getElementById('signupForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

// ================= SIGNUP =================
async function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;

  if(!name || !email || !phone || !password){ alert('Fill all fields'); return; }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if(users.find(u => u.email === email)){ alert('Email already registered'); showLogin(); return; }

  users.push({name,email,phone,password});
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify({name,email}));

  await sendAuthEmail(name, email, phone, "Signup");

  alert('Signup successful!');
  window.location.href = 'index.html';
}

// ================= LOGIN =================
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);

  if(user){
    localStorage.setItem('currentUser', JSON.stringify({name:user.name,email:user.email}));
    await sendAuthEmail(user.name, user.email, '', 'Login');
    window.location.href = 'index.html';
  } else { alert('Invalid email or password'); }
}

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
document.getElementById("searchInput").addEventListener("input", () => {
  const value = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".product").forEach(p => {
    p.style.display = p.dataset.name.includes(value) ? "block" : "none";
  });
});

// ================= CART =================
let cart = [];
const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");

function addToCart(name, price){
  if(!currentUser){ alert("Login to add items"); window.location.href="login.html"; return; }
  cart.push({name, price});
  updateCart();
}

function updateCart(){
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach((item, i) => {
    total += item.price;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} ₹${item.price}</span>
        <div class="cart-actions">
          <button class="cancel-btn" onclick="removeItem(${i})">❌</button>
          <button class="pay-btn" onclick="paySingleItem(${i})">💳 Pay</button>
        </div>
      </div>
    `;
  });
  cartTotal.innerText = total;
  cartCount.innerText = cart.length;
}

function removeItem(i){ cart.splice(i,1); updateCart(); }
function toggleCart(){ cartSidebar.classList.toggle("show"); }
document.getElementById("closeCartBtn").addEventListener("click", ()=>cartSidebar.classList.remove("show"));

// ================= CUSTOMER POPUP =================
let selectedAmount=0, selectedProduct="";
const customerForm = document.getElementById("customerForm");
const customerName = document.getElementById("customerName");
const customerNumber = document.getElementById("customerNumber");
const payButton = document.getElementById("payButton");

function openCustomerForm(amount, product){
  selectedAmount=amount; selectedProduct=product;
  customerForm.classList.add("show");
}
function closeCustomerForm(){
  customerForm.classList.remove("show");
  customerName.value=""; customerNumber.value="";
}

// ================= PAY =================
payButton.addEventListener("click", ()=>{
  if(!customerName.value || !customerNumber.value){ alert("Fill all details"); return; }
  closeCustomerForm();
  payNow(selectedAmount, selectedProduct, customerName.value, customerNumber.value);
});

function payNow(amount, productName, customerName, customerNumber){
  const options = {
    key:keyId, amount:amount*100, currency:"INR", name:"AVR Shop",
    description:productName,
    handler: async function(response){
      try {
        await fetch("/api/sendEmail", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            name: customerName,
            product: productName,
            amount,
            customer_number: customerNumber,
            payment_id: response.razorpay_payment_id
          })
        });
        alert("Payment Success & Email Sent");
        cart=[]; updateCart();
      } catch(err){ alert("Payment OK, Email Failed"); cart=[]; updateCart(); }
    },
    theme:{color:"#ff6f61"}
  };
  new Razorpay(options).open();
}

function paySingleItem(i){ const item=cart[i]; openCustomerForm(item.price,item.name); }
function checkout(){ if(cart.length===0){alert("Cart empty"); return;}
  let total = cart.reduce((a,b)=>a+b.price,0);
  let products = cart.map(c=>c.name).join(", ");
  selectedAmount=total; selectedProduct=products;
  customerForm.classList.add("show");
}
