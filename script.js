const keyId = "rzp_test_S9x5QAAxXFGWvK"; // Razorpay test key

let selectedProduct = "";
let selectedAmount = 0;

// Open the customer info popup
function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  document.getElementById("customerForm").style.display = "block";
}

// Close the popup
function closeCustomerForm() {
  document.getElementById("customerForm").style.display = "none";
}

// Pay button click inside popup
document.getElementById("payButton").addEventListener("click", () => {
  const customerNumber = document.getElementById("customerNumber").value.trim();
  const customerName = document.getElementById("customerName").value.trim();

  if (!customerNumber || !customerName) {
    alert("Please enter both Name and Phone Number!");
    return;
  }

  closeCustomerForm();
  payNow(selectedAmount, selectedProduct, customerName, customerNumber);
});

// Razorpay + EmailJS payment & email
function payNow(amount, productName, customerName, customerNumber) {
  var options = {
    key: keyId,
    amount: amount * 100,
    currency: "INR",
    name: "AVR Shop",
    description: "Purchase Product",
    handler: function (response) {
      // Send email via EmailJS
      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      })
      .then(function() {
        alert("Payment Successful & Email Sent!");
      }, function(error) {
        alert("Payment Successful, but Email Failed: " + error.text);
      });
    },
    theme: { color: "#ff6f61" }
  };
  var rzp = new Razorpay(options);
  rzp.open();
}
