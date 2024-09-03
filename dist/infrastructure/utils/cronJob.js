"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const userSchema_1 = __importDefault(require("../db/userSchema"));
const moment_1 = __importDefault(require("moment"));
const expirationEmail_1 = __importDefault(require("./expirationEmail"));
const propertySchema_1 = __importDefault(require("../db/propertySchema"));
const job = new cron_1.CronJob('0 12 * * *', async function () {
    console.log('Cron job executed at:', new Date().toLocaleString());
    const today = (0, moment_1.default)().startOf('day');
    const tomorrow = (0, moment_1.default)().add(1, 'day').startOf('day');
    try {
        // user premium removing
        const expiringSoon = await userSchema_1.default.find({
            'premiumSubscription.expiryDate': {
                $gte: tomorrow.toDate(),
                $lt: tomorrow.add(1, 'day').toDate()
            }
        });
        expiringSoon.forEach(user => {
            var _a, _b;
            if ((_a = user === null || user === void 0 ? void 0 : user.premiumSubscription) === null || _a === void 0 ? void 0 : _a.expiryDate) {
                (0, expirationEmail_1.default)(user.email, user.name, (_b = user === null || user === void 0 ? void 0 : user.premiumSubscription) === null || _b === void 0 ? void 0 : _b.expiryDate);
            }
        });
        const expiredSubscriptions = await userSchema_1.default.updateMany({
            'premiumSubscription.expiryDate': { $lt: today.toDate() }
        }, {
            $set: {
                isPremium: false,
                premiumSubscription: null
            }
        });
        // property boost removing
        const expiredBoostProperty = await propertySchema_1.default.updateMany({
            'boostDetails.expiryDate': { $lt: today.toDate() }
        }, {
            $set: {
                isBoosted: false,
                boostDetails: null
            }
        });
        console.log(expiredBoostProperty, "boosted property expired");
    }
    catch (error) {
        console.error('Error checking subscriptions:', error);
    }
}, null, true, 'Asia/Kolkata');
exports.default = job;
//# sourceMappingURL=cronJob.js.map