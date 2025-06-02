class RateLimitService {
    constructor() {
        this.requests = new Map();
        this.MAX_REQUESTS = 1000;
        this.WINDOW_MS = 24 * 60 * 60 * 1000;
    }

    checkLimit(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        const recentRequests = userRequests.filter(
            timestamp => now - timestamp < this.WINDOW_MS
        );

        if (recentRequests.length >= this.MAX_REQUESTS) {
            throw new Error('חרגת ממספר הבקשות המותר. נסה שוב מאוחר יותר.');
        }

        recentRequests.push(now);
        this.requests.set(userId, recentRequests);
        return true;
    }

    getRemainingRequests(userId) {
        const now = Date.now();
        const userRequests = this.requests.get(userId) || [];
        const recentRequests = userRequests.filter(
            timestamp => now - timestamp < this.WINDOW_MS
        );
        return this.MAX_REQUESTS - recentRequests.length;
    }

    resetLimit(userId) {
        this.requests.delete(userId);
    }
}

export const rateLimitService = new RateLimitService();