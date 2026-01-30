// Replace 'YOUR_KEY_ID' with your Razorpay Key ID
const keyId = "rzp_test_S9x5QAAxXFGWvK";

function payNow(amount) {
    var options = {
        "key": keyId,
        "amount": amount * 100, // Convert to paise
        "currency": "INR",
        "name": "AVR Shop",
        "description": "Purchase Product",
        "handler": function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        },
        "theme": {
            "color": "#ff6f61"
        }
    };
    var rzp = new Razorpay(options);
    rzp.open();
}
