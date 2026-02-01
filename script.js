// Razorpay Key ID
const keyId = "rzp_test_S9x5QAAxXFGWvK";

function payNow(amount, productName, phoneId) {

    // Get phone number
    let phone = document.getElementById(phoneId).value;

    if (!phone) {
        alert("7661965757");
        return;
    }

    var options = {
        key: keyId,
        amount: amount * 100, // paise
        currency: "INR",
        name: "AVR Shop",
        description: productName,

        handler: function (response) {

            // Payment success alert
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);

            // Send email to YOU
            window.location.href =
                "mailto:saiphaneendra477@gmail.com" +
                "?subject=New Order - AVR Shop" +
                "&body=" +
                "Product: " + productName +
                "%0APrice: ₹" + amount +
                "%0ACustomer Phone: " + phone +
                "%0APayment ID: " + response.razorpay_payment_id;
        },

        theme: {
            color: "#ff6f61"
        }
    };

    var rzp = new Razorpay(options);
    rzp.open();
}

