// Initialize EmailJS
emailjs.init("NEhltHkKsFoRI6gWB"); // Your EmailJS Public Key

const keyId = "rzp_test_S9x5QAAxXFGWvK"; // Razorpay test key

let selectedProduct = "";
let selectedAmount = 0;

// ===== OPEN CUSTOMER POPUP =====
function openCustomerForm(amount, product) {
  selectedAmount = amount;
  selectedProduct = product;
  document.getElementById("customerForm").style.display = "flex";
}

// ===== CLOSE CUSTOMER POPUP =====
function closeCustomerForm() {
  document.getElementById("customerForm").style.display = "none";
  document.getElementById("customerName").value = "";
  document.getElementById("customerNumber").value = "";
}

// ===== HANDLE PAY BUTTON =====
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

// ===== RAZORPAY PAYMENT =====
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
      .then(() => {
        // SHOW THANK YOU MESSAGE
        const thankYou = document.getElementById("thankYouMessage");
        thankYou.style.display = "flex";
        window.scrollTo({ top: 0, behavior: "smooth" });

        setTimeout(() => {
          thankYou.style.display = "none";
        }, 3000);
      })
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
