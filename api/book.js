import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const data = req.body;

  try {
    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from("requests")
      .insert([
        {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,

          shoot_type: data.shoot_type,
          package_id: data.package_id || null,

          location_line1: data.location_line1,
          location_line2: data.location_line2,
          location_city: data.location_city,
          location_state: data.location_state,
          location_zip: data.location_zip,

          start_at: new Date(`${data.date}T${data.time}`),
          end_at: null,

          details: data.details
        }
      ]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return res.status(500).json({ error: "Database insert failed" });
    }

    // 2. Send email to YOU (notification)
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
        to: [{ email: "lowsetmedia@gmail.com" }],
        subject: "New Booking Request",
        htmlContent: `
          <h2>New Booking</h2>
          <p><strong>Name:</strong> ${data.first_name} ${data.last_name || ""}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Shoot:</strong> ${data.shoot_type}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
        `
      })
    });

    // 3. Send confirmation to CLIENT
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          email: "contact@lowset.media",
          name: "LØWSET Media"
        },
        to: [{ email: data.email }],
        subject: "Booking Received",
        htmlContent: `
          <h2>Thanks for booking with LØWSET Media</h2>
          <p>We’ve received your request and will get back to you soon.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Shoot: ${data.shoot_type}</li>
            <li>Date: ${data.date}</li>
            <li>Time: ${data.time}</li>
          </ul>
        `
      })
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}