"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateTransactionId;
function generateTransactionId() {
    // Prefix
    const prefix = 'TXN';
    // Date Component (YYYYMMDD)
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateComponent = `${year}${month}${day}`;
    // Time Component (HHMMSS)
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timeComponent = `${hours}${minutes}${seconds}`;
    // Random Component (6-character alphanumeric string)
    const randomComponent = Math.random().toString(36).substr(2, 6).toUpperCase();
    // Combine to form the transaction ID
    return `${prefix}-${dateComponent}-${timeComponent}-${randomComponent}`;
}
//# sourceMappingURL=generateUniqueId.js.map