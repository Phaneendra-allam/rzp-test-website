import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, product, amount, customer_number, payment_id } = req.body;

    try {
      const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: "service_2l3l97q",
          template_id: "template_zwe1s48",
          user_id: "NEhltHkKsFoRI6gWB",
          template_params: {
            name,
            product,
            amount,
            customer_number,
            payment_id
          }
        })
      });

      if (!emailResponse.ok) throw new Error("EmailJS API failed");

      res.status(200).json({ message: "Email sent successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
