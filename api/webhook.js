export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const body = req.body;
    const payment = body.payload.payment.entity;

    const name = payment.notes.customer_name || "No Name";
    const number = payment.notes.customer_number || "No Number";
    const product = payment.notes.product || "Unknown Product";
    const amount = payment.amount / 100;
    const payment_id = payment.id;

    // Send email via EmailJS
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: "service_2l3l97q",
        template_id: "template_zwe1s48",
        user_id: "6kzXl7gIg1dHjWpEt", // Replace with your EmailJS user ID
        template_params: { name, customer_number: number, product, amount, payment_id },
      }),
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
