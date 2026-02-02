// ===== INIT EMAILJS =====
emailjs.init("NEhltHkKsFoRI6gWB");

// ===== RAZORPAY KEY =====
const keyId = "rzp_test_S9x5QAAxXFGWvK";

// ===== GLOBAL VARIABLES =====
let selectedProduct = "";
let selectedAmount = 0;

// ===== OPEN & CLOSE CUSTOMER FORM =====
function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  document.getElementById("customerForm").classList.add("show");
}

function closeCustomerForm() {
  const form = document.getElementById("customerForm");
  form.classList.remove("show");
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

    if (!name || !number) {
      alert("Please enter both Name and Phone Number!");
      return;
    }

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
      if (name.includes(term)) {
        prod.classList.remove("hide");
        anyVisible = true;
      } else {
        prod.classList.add("hide");
      }
    });

    // Show "No products found" message
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

      // Send order details via EmailJS
      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      }).then(() => showThankYou())
        .catch(() => showThankYou());
    },
    theme: { color: "#ff6f61" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
