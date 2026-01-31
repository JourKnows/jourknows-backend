"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
const redisClient = (0, redis_1.createClient)({
    url: config_1.config.REDIS_URL,
});
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));
redisClient.on('connect', () => console.log('🔌 Connected to Redis'));
const connectRedis = async () => {
    if (!config_1.config.REDIS_URL) {
        console.warn('⚠️ No REDIS_URL provided, skipping Redis connection.');
        return;
    }
    await redisClient.connect();
};
exports.connectRedis = connectRedis;
exports.default = redisClient;
