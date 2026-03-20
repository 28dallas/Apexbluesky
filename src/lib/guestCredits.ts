/**
 * Utility to manage and track guest tool usage in localStorage.
 * Every tool starts with a 3-credit trial for unauthenticated users.
 */

const GUEST_USAGE_KEY = 'apex_guest_usage';
const DEFAULT_TRIAL_LIMIT = 3;

interface GuestUsage {
    [toolId: string]: number; // toolId -> credits spent
}

function getUsageMap(): GuestUsage {
    if (typeof window === 'undefined') return {};
    const stored = localStorage.getItem(GUEST_USAGE_KEY);
    if (!stored) return {};
    try {
        return JSON.parse(stored);
    } catch {
        return {};
    }
}

function saveUsageMap(map: GuestUsage) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_USAGE_KEY, JSON.stringify(map));
}

/**
 * Gets the number of credits spent on a specific tool by a guest.
 */
export function getGuestSpent(toolId: string): number {
    const map = getUsageMap();
    return map[toolId] || 0;
}

/**
 * Gets the number of free trial credits remaining for a specific tool.
 */
export function getGuestCreditsRemaining(toolId: string, limit: number = DEFAULT_TRIAL_LIMIT): number {
    const spent = getGuestSpent(toolId);
    return Math.max(0, limit - spent);
}

/**
 * Records credit consumption for a tool by a guest.
 */
export function consumeGuestCredits(toolId: string, amount: number) {
    const map = getUsageMap();
    map[toolId] = (map[toolId] || 0) + amount;
    saveUsageMap(map);
}

/**
 * Checks if a guest has exhausted their trial credits for a tool.
 */
export function isGuestTrialExhausted(toolId: string, limit: number = DEFAULT_TRIAL_LIMIT): boolean {
    return getGuestSpent(toolId) >= limit;
}
