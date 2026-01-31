"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCleanupJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Run every day at midnight
const startCleanupJob = () => {
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.info('🧹 Running Application Cleanup Job...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const deleted = await prisma.article.deleteMany({
                where: {
                    createdAt: {
                        lt: thirtyDaysAgo,
                    },
                },
            });
            console.info(`✅ Cleanup Complete: Deleted ${deleted.count} old articles.`);
        }
        catch (error) {
            console.error('❌ Cleanup Job Failed:', error);
        }
    });
};
exports.startCleanupJob = startCleanupJob;
