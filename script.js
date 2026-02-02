// Initialize EmailJS
emailjs.init("NEhltHkKsFoRI6gWB"); // Your public key

const keyId = "rzp_test_S9x5QAAxXFGWvK"; // Razorpay test key

let selectedProduct = "";
let selectedAmount = 0;

function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  document.getElementById("customerForm").style.display = "flex";
}

function closeCustomerForm() {
  document.getElementById("customerForm").style.display = "none";
  document.getElementById("customerName").value = "";
  document.getElementById("customerNumber").value = "";
}

// ✅ WAIT until HTML is loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("payButton").addEventListener("click", () => {
    const customerName = document.getElementById("customerName").value.trim();
    const customerNumber = document.getElementById("customerNumber").value.trim();

    if (!customerName || !customerNumber) {
      alert("Please enter both Name and Phone Number!");
      return;
    }

    closeCustomerForm();
    payNow(selectedAmount, selectedProduct, customerName, customerNumber);
  });
});

function payNow(amount, productName, customerName, customerNumber) {
  const options = {
    key: keyId,
    amount: amount * 100,
    currency: "INR",
    name: "AVR Shop",
    description: productName,
    handler: function (response) {
      console.log("Payment ID:", response.razorpay_payment_id);

      emailjs.send("service_2l3l97q", "template_zwe1s48", {
        name: customerName,
        product: productName,
        amount: amount,
        customer_number: customerNumber,
        payment_id: response.razorpay_payment_id
      })
      .then(() => alert("Payment Successful & Email Sent!"))
      .catch((error) => {
        alert("Payment Successful, but Email Failed");
        console.error("EmailJS Error:", error);
      });
    },
    theme: { color: "#ff6f61" }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}
