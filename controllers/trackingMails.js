import Tracking from "../model/track_model.js";

export const trackMails = async (req, res) => {
  const recipientIp =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    req.raw?.headers.get("true-client-ip") ||
    req.raw?.headers.get("cf-connecting-ip");

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ errors: "Tracking ID required" });
  }

  try {
    const tracking = await Tracking.findOne({ trackingId: id });
    // console.log(tracking);

    if (!tracking) {
      return res.status(404).json({ errors: "Tracking ID not found" });
    }
    tracking.userIPs.push(recipientIp);

    tracking.opens += 1;

    await tracking.save();

    const pixel = Buffer.from(
      "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", // Base64 encoded 1x1 GIF
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/gif",
      "Content-Length": pixel.length,
    });
    res.end(pixel);
  } catch (error) {
    console.error("Error in tracking:", error);
    return res.status(500).json({
      errors: error.message || "An unexpected error occurred during tracking",
    });
  }
};
