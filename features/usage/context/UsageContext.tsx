import type { UpgradeFeature } from '@/lib/error-handling/ErrorEventBus';
import React, { createContext, useContext, useMemo } from 'react';
import { useUsage } from '../../users/hooks';
import type { FeatureUsage, UsageResponse } from '../../users/validations';

interface FeatureLimitInfo {
    used: number;
    limit: number;
    unlimited: boolean;
    isAtLimit: boolean;
    remaining: number;
}

interface UsageContextType {
    usage: UsageResponse | null;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
    getFeatureLimit: (feature: UpgradeFeature) => FeatureLimitInfo;
}

const DEFAULT_LIMIT_INFO: FeatureLimitInfo = {
    used: 0,
    limit: 0,
    unlimited: false,
    isAtLimit: true,
    remaining: 0,
};

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, isLoading, isError, refetch } = useUsage();

    const getFeatureLimit = useMemo(() => {
        return (feature: UpgradeFeature): FeatureLimitInfo => {
            if (!data?.usage) {
                console.log('[UsageContext] No usage data available yet');
                return DEFAULT_LIMIT_INFO;
            }

            const featureData: FeatureUsage | undefined = data.usage[feature];
            if (!featureData) {
                console.warn('[UsageContext] Feature not found in usage data:', feature);
                return DEFAULT_LIMIT_INFO;
            }

            const remaining = featureData.unlimited
                ? Infinity
                : Math.max(0, featureData.limit - featureData.used);

            return {
                used: featureData.used,
                limit: featureData.limit,
                unlimited: featureData.unlimited,
                isAtLimit: !featureData.unlimited && featureData.used >= featureData.limit,
                remaining,
            };
        };
    }, [data]);

    const value = useMemo<UsageContextType>(() => ({
        usage: data ?? null,
        isLoading,
        isError,
        refetch,
        getFeatureLimit,
    }), [data, isLoading, isError, refetch, getFeatureLimit]);

    return (
        <UsageContext.Provider value={value}>
            {children}
        </UsageContext.Provider>
    );
};

export const useUsageData = () => {
    const context = useContext(UsageContext);
    if (!context) {
        throw new Error('useUsageData must be used within a UsageProvider');
    }
    return context;
};

export const useFeatureLimit = (feature: UpgradeFeature): FeatureLimitInfo => {
    const { getFeatureLimit } = useUsageData();
    return getFeatureLimit(feature);
};
