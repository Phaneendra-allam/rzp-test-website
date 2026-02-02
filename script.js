// Initialize EmailJS
emailjs.init("NEhltHkKsFoRI6gWB"); // Replace with your EmailJS public key
const keyId = "rzp_test_S9x5QAAxXFGWvK"; // Razorpay key

// HAMBURGER MENU
const hamburger = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');
hamburger.addEventListener('click', () => { hamburger.classList.toggle('active'); navMenu.classList.toggle('show'); });
document.addEventListener('click', (e) => { if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) { hamburger.classList.remove('active'); navMenu.classList.remove('show'); } });

// PRODUCTS DATA
const products = [
  {name:"Earphones", price:100, img:"https://www.portronics.com/cdn/shop/files/Portronics_Conch_Theta_A_wired_earphones_with_14.2mm_drivers.jpg?v=1747743140"},
  {name:"Wireless Buds", price:200, img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNJtwIVpK54TZqJYYnspNfzXxKseEerzz3mA&s"},
  {name:"Smartphone", price:500, img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdjxA4-jlECytxXWi100sXAUDAl8RW6aoVpA&s"},
  {name:"AC Cooler", price:1000, img:"https://m.media-amazon.com/images/I/71utBmCdAYL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Smartwatch", price:800, img:"https://m.media-amazon.com/images/I/71XA0QCW5lL._AC_UF1000,1000_QL80_.jpg"},
  {name:"Bluetooth Speaker", price:600, img:"https://europe.yamaha.com/en/files/speaker-top-bnr-1200x480_tcm113-2295062.jpg"},
  {name:"Laptop", price:30000, img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE-t9Ix5P-jFp6ksUffJ8lRS8HxcgbwHvopw&s"},
  {name:"Gaming Console", price:25000, img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdgTv3o0vrUu5yV5-hLEpKSlwIHJltQzNP8A&s"}
];

// RENDER PRODUCTS
const container = document.getElementById('productsContainer');
products.forEach(p => {
  const div = document.createElement('div'); div.className='product'; div.dataset.name=p.name;
  div.innerHTML=`<img src="${p.img}" alt="${p.name}"/><h3>${p.name}</h3><p>Price: ₹${p.price}</p><button onclick="addToCart('${p.name}',${p.price})">Add to Cart</button><button onclick="openCustomerForm(${p.price},'${p.name}')">Buy Now</button>`;
  container.appendChild(div);
});

// SEARCH FILTER
function filterProducts(){ const input=document.getElementById('searchInput').value.toLowerCase(); document.querySelectorAll('.product').forEach(p=>{ p.style.display=p.dataset.name.toLowerCase().includes(input)?'block':'none'; }); }

// CART LOGIC
let cart = [];
function addToCart(name, price){ const item=cart.find(i=>i.name===name); if(item)item.qty++; else cart.push({name, price, qty:1}); updateCart(); toggleCart(true); }
function updateCart(){ const cartItems=document.getElementById('cartItems'); cartItems.innerHTML=''; let total=0; cart.forEach(item=>{ total+=item.price*item.qty; const div=document.createElement('div'); div.className='cart-item'; div.innerHTML=`${item.name} x${item.qty} - ₹${item.price*item.qty} <button onclick="removeItem('${item.name}')">❌</button>`; cartItems.appendChild(div); }); document.getElementById('cartTotal').innerText=total; }
function removeItem(name){ cart=cart.filter(i=>i.name!==name); updateCart(); }
function checkout(){ if(cart.length===0){alert('Cart is empty!'); return;} alert('Checkout successful! Total: ₹'+cart.reduce((a,b)=>a+b.price*b.qty,0)); cart=[]; updateCart();}
function toggleCart(forceOpen=false){ const sidebar=document.getElementById('cartSidebar'); if(forceOpen) sidebar.classList.add('show'); else sidebar.classList.toggle('show'); }

// CUSTOMER POPUP
let selectedProduct="", selectedAmount=0;
function openCustomerForm(amount, product){ selectedAmount=amount; selectedProduct=product; document.getElementById("customerForm").classList.add("show"); }
function closeCustomerForm(){ const popup=document.getElementById("customerForm"); popup.style.opacity="0"; setTimeout(()=>{ popup.classList.remove("show"); popup.style.opacity="1"; document.getElementById("customerName").value=""; document.getElementById("customerNumber").value=""; },300); }

document.addEventListener("DOMContentLoaded", ()=>{
  const popup=document.getElementById("customerForm");
  const payButton=document.getElementById("payButton");
  payButton.addEventListener("click", ()=>{
    const customerName=document.getElementById("customerName").value.trim();
    const customerNumber=document.getElementById("customerNumber").value.trim();
    if(!customerName || !customerNumber){ alert("Enter Name & Phone!"); return;}
    closeCustomerForm(); payNow(selectedAmount, selectedProduct, customerName, customerNumber);
  });
  popup.addEventListener("click",(e)=>{ if(e.target===popup){ closeCustomerForm(); }});
});

function payNow(amount, productName, customerName, customerNumber){
  const options={ key:keyId, amount:amount*100, currency:"INR", name:"AVR Shop", description:productName,
    handler:function(response){
      fetch('/webhook.js',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name:customerName,product:productName,amount,customer_number:customerNumber,payment_id:response.razorpay_payment_id})
      }).then(r=>r.json()).then(()=>alert("Payment & Email Successful!")).catch(e=>alert("Payment successful, email failed"));
    }, theme:{color:"#ff6f61"} };
  const rzp=new Razorpay(options); rzp.open();
}
