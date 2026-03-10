/**
 * Feature limits for non-authenticated users.
 */
export const GUEST_LIMITS = {
    MAX_FILE_SIZE_MB: 10,
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024,
    MAX_BATCH_FILES: 2,
    MAX_DAILY_USES: 5
};

export interface UserStatus {
    isLoggedIn: boolean;
    isPremium: boolean;
    usageCount?: number;
}

/**
 * Checks if a specific action is within the limits for the current user.
 */
export function checkLimit(
    status: UserStatus,
    action: 'file_size' | 'batch_count' | 'daily_usage',
    value: number
): { allowed: boolean; reason?: string } {
    if (status.isLoggedIn || status.isPremium) {
        return { allowed: true };
    }

    switch (action) {
        case 'file_size':
            if (value > GUEST_LIMITS.MAX_FILE_SIZE_BYTES) {
                return {
                    allowed: false,
                    reason: `File is too large (${(value / (1024 * 1024)).toFixed(1)}MB). Guests are limited to ${GUEST_LIMITS.MAX_FILE_SIZE_MB}MB.`
                };
            }
            break;
        case 'batch_count':
            if (value > GUEST_LIMITS.MAX_BATCH_FILES) {
                return {
                    allowed: false,
                    reason: `Too many files selected (${value}). Guests can process up to ${GUEST_LIMITS.MAX_BATCH_FILES} files at once.`
                };
            }
            break;
        case 'daily_usage':
            // Usage tracking would need local storage or session-based state
            break;
    }

    return { allowed: true };
}
