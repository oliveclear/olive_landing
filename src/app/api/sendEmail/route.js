import nodemailer from "nodemailer";
// import clientPromise from '';
import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  const { email } = await req.json();

  // Configure the transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure mail options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Thanks for signing up for Olive Clear!",
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
    <h1>Welcome to Olive Clear!</h1>
    <img src="https://i.imgur.com/JN0lJQo.png" alt="Olive Clear Logo" style="height: 90%; width: 90%; margin: 20px 0;">
    <br />
    <footer>
        <p>Best regards,</p>
        <p>Team Olive Clear</p>
        <a href="https://oliveClear.com" style="color: #1a73e8; text-decoration: none;">Visit our website</a>
    </footer>
  </div>
      
    `,
  };

  try {
    // Send the email
    await transporter.sendMail(mailOptions);

    // Connect to the database and insert the email into the `subscribers` collection
    const client = await clientPromise;
    const db = client.db(); // Defaults to the database specified in the URI

    const collection = db.collection("subscribers");
    await collection.insertOne({
      email,
      subscribedAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Email sent successfully and saved to database!",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to send email or save to database",
        details: error.message,
      }),
      {
        status: 500,
      }
    );
  }
}
