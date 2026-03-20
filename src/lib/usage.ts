'use client';

const RECENT_TOOLS_KEY = 'apexbs_recent_tools';
const MAX_RECENT = 4;

export function getRecentlyUsed(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(RECENT_TOOLS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function recordToolUsage(toolId: string) {
    if (typeof window === 'undefined') return;
    try {
        const recent = getRecentlyUsed();
        const filtered = recent.filter(id => id !== toolId);
        const updated = [toolId, ...filtered].slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(updated));
        // Dispatch event for components to react
        window.dispatchEvent(new Event('apexbs_usage_update'));
    } catch (e) {
        console.error('Failed to record tool usage:', e);
    }
}
