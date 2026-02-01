// Razorpay test key
const keyId = "rzp_test_S9QAAxXFGWvK"; 

// Store selected product and amount
let selectedProduct = "";
let selectedAmount = 0;

// Open the customer info popup
function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  const form = document.getElementById("customerForm");
  form.style.display = "flex";  // Show popup
}

// Close the popup
function closeCustomerForm() {
  const form = document.getElementById("customerForm");
  form.style.display = "none";  // Hide popup
  document.getElementById("customerName").value = "";
  document.getElementById("customerNumber").value = "";
}

// Pay button click inside popup
document.getElementById("payButton").addEventListener("click", () => {
  const customerName = document.getElementById("customerName").value.trim();
  const customerNumber = document.getElementById("customerNumber").value.trim();

  if (!customerName || !customerNumber) {
    alert("Please enter both Name and Phone Number!");
    return;
  }

  closeCustomerForm();  // Hide popup
  payNow(selectedAmount, selectedProduct, customerName, customerNumber);
});

// Razorpay + EmailJS payment & email
function payNow(amount, productName, customerName, customerNumber) {
  const options = {
    key: keyId,
    amount: amount * 100,  // Convert to paise
    currency: "INR",
    name: "AVR Shop",
    description: productName,
    handler: function(response) {
      // Send email via EmailJS
      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      })
      .then(() => {
        alert("Payment Successful & Email Sent!");
      })
      .catch((error) => {
        alert("Payment Successful, but Email Failed: " + error.text);
        console.error("EmailJS Error:", error);
      });
    },
    theme: {
      color: "#ff6f61"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
