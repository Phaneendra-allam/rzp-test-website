// Initialize EmailJS
emailjs.init("NEhltHkKsFoRI6gWB");

const keyId = "rzp_test_S9x5QAAxXFGWvK";

let selectedProduct = "";
let selectedAmount = 0;

// OPEN & CLOSE CUSTOMER FORM
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

// THANK YOU POPUP
function showThankYou() {
  const msg = document.getElementById("thankYouMessage");
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 3000);
}

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", () => {

  // PAY BUTTON
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

  // SEARCH FUNCTIONALITY WITH ANIMATION
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".product");

  searchInput.addEventListener("keyup", () => {
    const term = searchInput.value.toLowerCase();
    products.forEach(prod => {
      const name = prod.querySelector("h3").textContent.toLowerCase();
      if (name.includes(term)) {
        prod.classList.remove("hide");
      } else {
        prod.classList.add("hide");
      }
    });
  });
});

// RAZORPAY PAYMENT FUNCTION
function payNow(amount, productName, customerName, customerNumber) {
  const options = {
    key: keyId,
    amount: amount * 100,
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
      }).then(() => showThankYou())
        .catch(() => showThankYou());
    },
    theme: { color: "#ff6f61" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
