/**
 * Feature limits for non-authenticated users.
 */
export const GUEST_LIMITS = {
    MAX_FILE_SIZE_MB: 10,
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
    MAX_BATCH_FILES: 2,
    MAX_DAILY_USES: 5
};

export const FREE_LIMITS = {
    MAX_FILE_SIZE_MB: 25,
    MAX_FILE_SIZE_BYTES: 25 * 1024 * 1024,
    MAX_BATCH_FILES: 10,
    MAX_DAILY_USES: 20
};

export interface UserStatus {
    isLoggedIn: boolean;
    isPremium: boolean;
    usageCount?: number;
    credits?: number;
}

/**
 * Checks if a specific action is within the limits for the current user.
 */
export function checkLimit(
    status: UserStatus,
    action: 'file_size' | 'batch_count' | 'daily_usage' | 'credits',
    value: number
): { allowed: boolean; reason?: string } {
    // Pro users have no limits
    if (status.isPremium) {
        return { allowed: true };
    }

    const limits = status.isLoggedIn ? FREE_LIMITS : GUEST_LIMITS;
    const tierName = status.isLoggedIn ? 'Free' : 'Guest';
    const upgradeSuggestion = status.isLoggedIn
        ? 'Upgrade to Pro for unlimited access.'
        : 'Create a free account to increase your limits!';

    switch (action) {
        case 'file_size':
            if (value > limits.MAX_FILE_SIZE_BYTES) {
                return {
                    allowed: false,
                    reason: `File is too large (${(value / (1024 * 1024)).toFixed(1)}MB). ${tierName} users are limited to ${limits.MAX_FILE_SIZE_MB}MB. ${upgradeSuggestion}`
                };
            }
            break;
        case 'batch_count':
            if (value > limits.MAX_BATCH_FILES) {
                return {
                    allowed: false,
                    reason: `Too many files selected (${value}). ${tierName} users can process up to ${limits.MAX_BATCH_FILES} files at once. ${upgradeSuggestion}`
                };
            }
            break;
        case 'daily_usage':
            if (status.usageCount !== undefined && status.usageCount >= limits.MAX_DAILY_USES) {
                return {
                    allowed: false,
                    reason: `Daily limit reached (${limits.MAX_DAILY_USES} uses). ${tierName} users are limited to ${limits.MAX_DAILY_USES} uses per day. ${upgradeSuggestion}`
                };
            }
            break;
        case 'credits':
            if (!status.isPremium && (status.credits === undefined || status.credits < value)) {
                return {
                    allowed: false,
                    reason: `Insufficient credits. This tool requires ${value} credits. ${upgradeSuggestion}`
                };
            }
            break;
    }

    return { allowed: true };
}
