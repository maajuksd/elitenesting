const express = require("express");
const router = express.Router();

// POST /api/contact
router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    // Basic validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Here you can:
    // 1. Save to database (MongoDB / MySQL)
    // 2. Send email (Nodemailer)
    // 3. Send to CRM

    console.log("📩 New Contact Form Submission:");
    console.log({
      name,
      email,
      phone,
      service,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;