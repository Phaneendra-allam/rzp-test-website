// HAMBURGER
const hamburger=document.getElementById("hamburgerBtn");
const navMenu=document.getElementById("navMenu");
hamburger.onclick=()=>navMenu.classList.toggle("show");

// PRODUCTS DATA
const products=[
  {name:"Earphones",price:100,img:"https://www.portronics.com/cdn/shop/files/Portronics_Conch_Theta_A_wired_earphones_with_14.2mm_drivers.jpg?v=1747743140"},
  {name:"Wireless Buds",price:200,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNJtwIVpK54TZqJYYnspNfzXxKseEerzz3mA&s"},
  {name:"Smartphone",price:500,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdjxA4-jlECytxXWi100sXAUDAl8RW6aoVpA&s"},
  {name:"AC Cooler",price:1000,img:"https://m.media-amazon.com/images/I/71utBmCdAYL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Smartwatch",price:800,img:"https://m.media-amazon.com/images/I/71XA0QCW5lL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Bluetooth Speaker",price:600,img:"https://europe.yamaha.com/en/files/speaker-top-bnr-1200x480_tcm113-2295062.jpg"},
  {name:"Laptop",price:30000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE-t9Ix5P-jFp6ksUffJ8lRS8HxcgbwHvopw&s"},
  {name:"Gaming Console",price:25000,img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgTv3o0vrUu5yV5-hLEpKSlwIHJltQzNP8A&s"}
];

const container=document.getElementById("productsContainer");

products.forEach(p=>{
  const div=document.createElement("div");
  div.className="product";
  div.dataset.name=p.name;
  div.innerHTML=`
    <img src="${p.img}">
    <h3>${p.name}</h3>
    <p>Price: ₹${p.price}</p>
    <button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button>
    <button onclick="buyNow()">Buy Now</button>
  `;
  container.appendChild(div);
});

// SEARCH
function filterProducts(){
  const val=document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll(".product").forEach(p=>{
    p.style.display=p.dataset.name.toLowerCase().includes(val)?"block":"none";
  });
}

// CART
let cart=[];
function addToCart(name,price){
  cart.push({name,price});
  alert(name+" added to cart");
}

function toggleCart(){
  document.getElementById("cartSidebar").classList.toggle("show");
}

function checkout(){
  alert("Checkout successful!");
}

// POPUP
function buyNow(){
  document.getElementById("customerForm").classList.add("show");
}
function closeCustomerForm(){
  document.getElementById("customerForm").classList.remove("show");
}
