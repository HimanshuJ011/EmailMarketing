import { Router } from "express";
import { sendTestEmail, emailStatus } from "../controllers/emailController.js";
import { trackMails } from "../controllers/trackingMails.js";

const router = Router();

router.get("/send-email", sendTestEmail);
router.get("/track/:id", trackMails);
router.get("/email-status/:id", emailStatus);

export default router;
