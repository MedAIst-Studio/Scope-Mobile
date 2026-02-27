import { useUsage } from '@/features/users/hooks';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { SubscriptionInterval } from '../components/IntervalSwitcher';
import { useSubscription } from './useSubscription';
// ─── Free Tier Configuration ────────────────────────────────────────────────

export const FREE_PACKAGE = {
    identifier: 'scope_free_tier',
    packageType: 'CUSTOM',
    product: {
        identifier: 'scope_free_tier',
        title: 'Ücretsiz Paket',
        priceString: 'Ücretsiz',
        subscriptionPeriod: 'FREE',
    }
};

export const FREE_FEATURES = [
    'Günde 3 Soru Tarama (Isınma Turu)',
    'Yapay Zeka ile Net Çözümler',
    '2 PDF Dosya Analizi',
    'Sınırlı Asistan Desteği',
];

export const usePaywall = () => {
    const router = useRouter();
    const { getOfferings, purchasePackage, isLoading, restorePurchases } = useSubscription();
    const [offering, setOffering] = useState<PurchasesOffering | null>(null);
    const [activeInterval, setActiveInterval] = useState<SubscriptionInterval>('ANNUAL');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const { refetch } = useUsage();

    useEffect(() => {
        if (isLoading) return;

        const load = async () => {
            const data = await getOfferings();
            if (data) {
                setOffering(data);
            }
            setIsInitialLoading(false);
        };
        load();
    }, [getOfferings, isLoading]);

    const filteredPackages = useMemo(() => {
        if (!offering) return [FREE_PACKAGE];

        const basePackages = offering.availablePackages.filter(p => {
            const period = p.product.subscriptionPeriod;
            const id = p.identifier.toLowerCase();

            if (activeInterval === 'ANNUAL') return period === 'P1Y' || id.includes('annual');
            if (activeInterval === 'THREE_MONTH') return period === 'P3M' || id.includes('three_months') || id.includes('semester');
            if (activeInterval === 'MONTHLY') return period === 'P1M' || id.includes('monthly');
            return false;
        });

        const sortedBase = [...basePackages].sort((a, b) => {
            const idA = a.identifier.toLowerCase();
            const idB = b.identifier.toLowerCase();
            if (idA.includes('pro') && idB.includes('ultra')) return -1;
            if (idA.includes('ultra') && idB.includes('pro')) return 1;
            return 0;
        });

        return [FREE_PACKAGE, ...sortedBase];
    }, [offering, activeInterval]);

    const activePackage = filteredPackages[activeIndex] || filteredPackages[0];

    const getFeaturesForPackage = useCallback((pkg: any) => {
        if (pkg.identifier === FREE_PACKAGE.identifier) return FREE_FEATURES;
        if (!offering?.metadata) return [];

        const featuresMap = (offering.metadata as Record<string, any>).package_features || {};
        const productId = pkg.product.identifier;
        let metadataKey = productId;

        if (productId.endsWith('_annual')) metadataKey = productId.replace('_annual', '_yearly');

        return featuresMap[metadataKey] || featuresMap[metadataKey.toLowerCase()] || [];
    }, [offering]);

    const handleAction = async () => {
        if (!activePackage) return;

        if (activePackage.identifier === FREE_PACKAGE.identifier) {
            router.back();
            return;
        }

        setIsPurchasing(true);
        try {
            const success = await purchasePackage(activePackage as PurchasesPackage);
            if (success) {
                router.back();
                refetch();
            }
        } finally {
            setIsPurchasing(false);
        }
    };

    return {
        activeInterval,
        setActiveInterval,
        isPurchasing,
        isInitialLoading,
        activeIndex,
        setActiveIndex,
        filteredPackages,
        activePackage,
        getFeaturesForPackage,
        handleAction,
        restorePurchases,
        router
    };
};
