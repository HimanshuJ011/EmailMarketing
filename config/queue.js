export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
};

export const defaultJobConfig = {
  delay: 2000,
  removeOnComplete: {
    count: 100,
    age: 60 * 60,
  },
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 1000,
  },
};
