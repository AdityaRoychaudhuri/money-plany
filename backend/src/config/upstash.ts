import { redis } from "./redis.js";
import { Ratelimit } from "@upstash/ratelimit";

const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "90 s")
});

export default rateLimit;