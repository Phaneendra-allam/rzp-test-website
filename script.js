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

// ===== SHOW THANK YOU =====
function showThankYou() {
  alert("Thank you for your purchase!");
}

// ===== PAY =====
document.addEventListener("DOMContentLoaded", () => {
  const payBtn = document.getElementById("payButton");
  if(payBtn){
    payBtn.addEventListener("click", () => {
      const name = document.getElementById("customerName").value.trim();
      const number = document.getElementById("customerNumber").value.trim();
      if(!name || !number){ alert("Enter name and phone!"); return; }
      closeCustomerForm();
      payNow(selectedAmount, selectedProduct, name, number);
    });
  }

  // SEARCH FILTER
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".product");
  const noResults = document.getElementById("noResults");
  if(searchInput){
    searchInput.addEventListener("keyup", () => {
      const term = searchInput.value.toLowerCase();
      let anyVisible = false;
      products.forEach(prod => {
        const name = prod.querySelector("h3").textContent.toLowerCase();
        if(name.includes(term)){ prod.classList.remove("hide"); anyVisible = true; }
        else { prod.classList.add("hide"); }
      });
      noResults.style.display = anyVisible ? "none":"block";
    });
  }
});

// ===== RAZORPAY PAY =====
function payNow(amount, productName, customerName, customerNumber){
  const options = {
    key: keyId,
    amount: amount*100,
    currency:"INR",
    name:"AVR Shop",
    description: productName,
    handler:function(response){
      emailjs.send("service_2l3l97q","template_zwe1s48",{
        name:customerName,
        product:productName,
        amount:amount,
        customer_number:customerNumber,
        payment_id: response.razorpay_payment_id
      }).then(()=>showThankYou())
        .catch(()=>showThankYou());
    },
    theme:{color:"#ff6f61"}
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

// ===== CART SYSTEM =====
function addToCart(productName, amount){
  const item = cart.find(p=>p.name===productName);
  if(item) item.qty++;
  else cart.push({name:productName, price:amount, qty:1});
  updateCartCount();
}

function updateCartCount(){
  const countElem = document.getElementById('cartCount');
  if(countElem) countElem.textContent = cart.reduce((sum,i)=>sum+i.qty,0);
}

function toggleCart(){
  const mini = document.getElementById('miniCart');
  if(mini) mini.classList.toggle('show');
  displayCartItems();
}

function displayCartItems(){
  const cartItems = document.getElementById('cartItems');
  if(!cartItems) return;
  cartItems.innerHTML = '';
  cart.forEach(item=>{
    cartItems.innerHTML += `<p>${item.name} x ${item.qty} - ₹${item.price*item.qty}</p>`;
  });
}

function checkoutCart(){
  cart.forEach(item => payNow(item.price*item.qty, item.name, "Customer","0000000000"));
  cart = [];
  updateCartCount();
  toggleCart();
}

// ===== CATEGORY FILTER =====
function filterCategory(category){
  const products = document.querySelectorAll(".product");
  products.forEach(prod=>{
    const cat = prod.dataset.category || "";
    const name = prod.querySelector("h3").textContent;
    if(category==='all' || category===cat ||
       (category==='Smart Devices' && ['Earphones','Wireless Buds','Smartphone','Smartwatch','Laptop','Bluetooth Speaker','Gaming Console'].includes(name))){
      prod.classList.remove('hide');
    }else prod.classList.add('hide');
  });
}

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click',()=>{
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
});
document.addEventListener('click',(e)=>{
  if(!navMenu.contains(e.target) && !hamburger.contains(e.target)){
    hamburger.classList.remove('active');
    navMenu.classList.remove('show');
  }
});
