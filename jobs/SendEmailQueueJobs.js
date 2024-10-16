import { Queue, Worker } from "bullmq";
import { redisConnection, defaultJobConfig } from "../config/queue.js";
import logger from "../config/logger.js";
import { sendEmail } from "../config/mailer.js";

export const emailQueueName = "email-queue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultJobConfig,
});

// Worker
export const handler = new Worker(
  emailQueueName,
  async (job) => {
    console.log(`Email worker data :` + job.data);
    const data = job.data;
    data?.map(async (item) => {
      await sendEmail(item.toEmail, item.subject, item.htmlBody);
    });
  },
  {
    connection: redisConnection,
  }
);

// Worker Listners (Events)

handler.on("completed", (job) => {
  logger.info({ job: job, message: "Job Completed" });
  console.log("Job is completed !!!");
});
handler.on("failed", (job) => {
  console.log("Job is Failed !!!");
});
