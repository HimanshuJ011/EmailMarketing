import { v4 as uuid } from "uuid"; // Ensure you're using the correct uuid package
import Tracking from "../model/track_model.js";
import {sendEmail} from "../config/mailer.js";

export const sendTestEmail = async (req, res) => {
  try {
    const trackingID = uuid(); // Generate unique tracking ID
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

     const trackingUrl = `${process.env.BASE_URL}/api/track/${trackingID}`;
    // Construct the email body with a tracking pixel
    const emailBody = `
      <h1>Hello, this is a testing Email. Thank you!</h1>
      <p>This email is used for tracking purposes.</p>
      <img src="${trackingUrl}" alt="Tracking Pixel" style="display:none;" />
    `;


    const payload = {
      toEmail: email,
      subject: `Hey ${trackingID}`,
      body: emailBody,
    };

    // Create a tracking document in MongoDB
    const tracking = new Tracking({
      trackingId: trackingID,
      opens: 0,
      userIPs: [],
    });

    await tracking.save(); // Save the tracking document

    // Send the email using the sendEmail function
    await sendEmail(payload.toEmail, payload.subject, payload.body);

    return res.status(200).json({
      trackingID: trackingID,
      message: "Email sent successfully!",
    });
  } catch (error) {
    logger.error({ type: "Email Error", body: error.message });
    return res.status(500).json({
      message: "Something went wrong, please try again later",
    });
  }
};

export const emailStatus = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Tracking ID is required" });
  }

  try {
    // Find the tracking document using Mongoose
    const tracking = await Tracking.findOne({ trackingId: id });

    if (!tracking) {
      return res.status(404).json({ message: "Tracking ID not found" });
    }

    return res.json({ data: tracking });
  } catch (error) {
    logger.error({ type: "Email Status Error", body: error.message });
    return res.status(500).json({
      message: "Something went wrong, please try again later",
    });
  }
};
