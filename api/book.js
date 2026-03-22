export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  // Send email via Brevo
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: {
        email: "book@lowset.media",
        name: "LØWSET Media"
      },
      to: [
        { email: "lowsetmedia@gmail.com" }
      ],
      subject: "New Booking Request",
      htmlContent: `
        <h2>New Booking</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Shoot:</strong> ${data.shoot_type}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
      `
    })
  });

  return res.status(200).json({ success: true });
}