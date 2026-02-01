const keyId = "rzp_test_S9x5QAAxXFGWvK"; // Your Razorpay Key ID

function payNow(amount, productName) {
    var options = {
        "key": keyId,
        "amount": amount * 100, // in paise
        "currency": "INR",
        "name": "AVR Shop",
        "description": "Purchase Product",
        "handler": function (response) {
            // Ask customer number
            const customerNumber = prompt("7661965757:");

            // Send email via EmailJS
            emailjs.send("service_2l3l97q", "YOUR_TEMPLATE_ID", {
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
        "theme": { "color": "#ff6f61" }
    };
    var rzp = new Razorpay(options);
    rzp.open();
}
