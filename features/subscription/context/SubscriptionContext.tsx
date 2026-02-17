import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SubscriptionTier, SubscriptionState, LIMITS } from '../types';

interface SubscriptionContextType extends SubscriptionState {
    upgrade: () => void;
    downgrade: () => void;
    incrementChatUsage: () => void;
    incrementFileUsage: () => void;
    incrementScanUsage: () => void;
    isFeatureLocked: (feature: keyof SubscriptionState['usage']) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<SubscriptionState>({
        tier: 'FREE',
        usage: {
            chatMessages: 0,
            fileUploads: 0,
            scans: 0,
        },
    });

    const upgrade = useCallback(() => {
        setState((prev) => ({ ...prev, tier: 'PRO' }));
    }, []);

    const downgrade = useCallback(() => {
        setState((prev) => ({ ...prev, tier: 'FREE' }));
    }, []);

    const incrementChatUsage = useCallback(() => {
        setState((prev) => ({
            ...prev,
            usage: { ...prev.usage, chatMessages: prev.usage.chatMessages + 1 },
        }));
    }, []);

    const incrementFileUsage = useCallback(() => {
        setState((prev) => ({
            ...prev,
            usage: { ...prev.usage, fileUploads: prev.usage.fileUploads + 1 },
        }));
    }, []);

    const incrementScanUsage = useCallback(() => {
        setState((prev) => ({
            ...prev,
            usage: { ...prev.usage, scans: prev.usage.scans + 1 },
        }));
    }, []);

    const isFeatureLocked = useCallback(
        (feature: keyof SubscriptionState['usage']) => {
            const currentUsage = state.usage[feature];
            const limit = LIMITS[state.tier][feature];
            return currentUsage >= limit;
        },
        [state]
    );

    return (
        <SubscriptionContext.Provider
            value={{
                ...state,
                upgrade,
                downgrade,
                incrementChatUsage,
                incrementFileUsage,
                incrementScanUsage,
                isFeatureLocked,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
};
