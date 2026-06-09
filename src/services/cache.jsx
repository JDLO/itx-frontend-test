const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export const cacheManager = {
    set: (key, data) => {
        const cacheObject = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheObject));
    },

    get: (key) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > ONE_HOUR_IN_MS;

        if (isExpired) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    }
};
