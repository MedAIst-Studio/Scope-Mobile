export type SubscriptionTier = 'FREE' | 'PRO';

export interface UsageLimits {
    chatMessages: number;
    fileUploads: number;
    scans: number;
}

export interface SubscriptionState {
    tier: SubscriptionTier;
    usage: {
        chatMessages: number;
        fileUploads: number;
        scans: number;
    };
}

export const LIMITS: Record<SubscriptionTier, UsageLimits> = {
    FREE: {
        chatMessages: 0,
        fileUploads: 0,
        scans: 0,
    },
    PRO: {
        chatMessages: Infinity,
        fileUploads: Infinity,
        scans: Infinity,
    },
};
