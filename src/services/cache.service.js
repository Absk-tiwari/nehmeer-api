const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 2
});

redis.on("connect", () => {
    console.log("🟢 Redis connected");
});

redis.on("error", (err) => {
    console.error("🔴 Redis error:", err);
});

exports.redis = redis;

exports.set = async (key, value, ttl) => {
    if (ttl) {
        await redis.set(key, value, "EX", ttl);
    } else {
        await redis.set(key, value);
    }
};

exports.get = async (key) => {
    return redis.get(key);
};

exports.del = async (key) => {
    return redis.del(key);
};