import logger from "../config/logger.js";
import db from "../Database/db.config.js";

// export const trackMails = async (req, res) => {
//   const recipientIp =
//     req.headers["x-forwarded-for"] ||
//     req.socket.remoteAddress ||
//     req.raw?.headers.get("true-client-ip") ||
//     req.raw?.headers.get("cf-connecting-ip");

//   const { id } = req.params;

//   if (!id) {
//     return res.status(400).json({ errors: "Tracking ID required" });
//   }

//   try {
//     const tracking = await db.trackings.findUnique({ where: { id: id } });

//     if (!tracking) {
//       return res.status(404).json({ errors: "Tracking ID not found" });
//     }
//     const updatedIps = recipientIp;

//     await db.trackings.update({
//       where: { id: id },
//       data: {
//         opens: { increment: 1 },
//         userIps: updatedIps,
//       },
//     });

//     const imagePath = "/image.png";
//     res.redirect(imagePath);
//   } catch (error) {
//     logger.error({
//       type: "Email Tracking Error",
//       message: error.message,
//       stack: error.stack,
//     });

//     return res.status(500).json({
//       errors: error.message || "An unexpected error occurred during tracking",
//     });
//   }
// };

export const trackMails = async (req, res) => {
  const recipientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || // Handles proxies, takes the first IP in the list
    req.socket.remoteAddress ||
    req.raw?.headers.get("true-client-ip") ||
    req.raw?.headers.get("cf-connecting-ip");

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ errors: "Tracking ID required" });
  }

  try {
    const tracking = await db.trackings.findUnique({ where: { id } });

    if (!tracking) {
      return res.status(404).json({ errors: "Tracking ID not found" });
    }

    const updatedIps = tracking.userIps
      ? `${tracking.userIps},${recipientIp}` // Append if userIps is not null
      : recipientIp; // Set new IP if userIps is null

    // Update tracking information
    await db.trackings.update({
      where: { id },
      data: {
        opens: { increment: 1 }, // Increment the number of opens
        userIps: updatedIps, // Store the updated IP list as a comma-separated string
      },
    });

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", 
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  } catch (error) {
    logger.error({
      type: "Email Tracking Error",
      message: error.message,
      stack: error.stack,
    });

    return res.status(500).json({
      errors: error.message || "An unexpected error occurred during tracking",
    });
  }
};
