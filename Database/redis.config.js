import redis from "express-redis-cache";

const redisCache = redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  prefix: "email-tool",
  expire: 60 * 60,
});

export default redisCache;
