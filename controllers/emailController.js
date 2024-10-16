import { emailQueue, emailQueueName } from "../jobs/SendEmailQueueJobs.js";
import { v4 as uuid } from "uuid";
import { sendEmail } from "../config/mailer.js";
import db from "../Database/db.config.js";
import logger from "../config/logger.js";

export const sendTestEmail = async (req, res) => {
  try {
    const trackingID = uuid();
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const emailBody = `
    <h1>Hello, this is a testing Email. Thank you!</h1>
    <p>This email is used for tracking purposes.</p>
    <img src="${process.env.BASE_URL}/api/track/${trackingID}" alt="Tracking Pixel" style="display:none;" />
`;

    const payload = [
      {
        toEmail: email,
        subject: `Hey ${trackingID}`,
        body: emailBody,
      },
    ];

    await db.trackings.create({ data: { id: trackingID } });

    await sendEmail(payload[0].toEmail, payload[0].subject, payload[0].body);

    return res
      .status(200)
      .json({ trackingID: trackingID, message: "Email sent Successfully!!!" });
  } catch (error) {
    logger.error({ type: "Email Error", body: error?.message });
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};

export const emailStatus = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "Id not found" });

  try {
    const tracking = await db.trackings.findUnique({ where: { id: id } });
    if (!tracking) {
      return res.status(400).json({ errors: "Tracking ID Not Found" });
    }

    return res.json({ data: tracking });
  } catch (error) {
    logger.error({ type: "Email Error", body: error?.message });
    return res
      .status(500)
      .json({ message: "Something went wrong, please try again later" });
  }
};
