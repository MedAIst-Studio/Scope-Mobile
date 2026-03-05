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
  },
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
  const [activeInterval, setActiveInterval] = useState<SubscriptionInterval>('THREE_MONTH');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1); // Default to the first paid plan (index 1 if Free is index 0)
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

    const basePackages = offering.availablePackages.filter((p) => {
      const id = p.identifier.toLowerCase();

      if (activeInterval === 'ANNUAL') return id.includes('annual');
      if (activeInterval === 'THREE_MONTH') return id.includes('semester');
      if (activeInterval === 'MONTHLY') return id.includes('monthly');

      return false;
    });

    const sortedBase = [...basePackages].sort((a, b) => {
      const idA = a.identifier.toLowerCase();
      const idB = b.identifier.toLowerCase();
      // Order: Pro -> Ultra
      if (idA.includes('pro') && idB.includes('ultra')) return -1;
      if (idA.includes('ultra') && idB.includes('pro')) return 1;
      return 0;
    });

    return [FREE_PACKAGE, ...sortedBase];
  }, [offering, activeInterval]);

  const activePackage = filteredPackages[activeIndex] || filteredPackages[0];

  const getFeaturesForPackage = useCallback(
    (pkg: any) => {
      if (pkg.identifier === FREE_PACKAGE.identifier) return FREE_FEATURES;
      if (!offering?.metadata) return [];

      const featuresMap = (offering.metadata as Record<string, any>).package_features || {};

      // Package identifier is already in the "scope_pro_annual" / "scope_ultra_monthly" format
      // that matches the metadata keys directly.
      const pkgId = pkg.identifier.toLowerCase();

      if (featuresMap[pkgId]) return featuresMap[pkgId];

      // Fallback: derive tier + interval from the identifier and try common key patterns
      const isUltra = pkgId.includes('ultra');
      const tierKey = isUltra ? 'ultra' : 'pro';

      const intervalKey = pkgId.includes('annual')
        ? 'annual'
        : pkgId.includes('semester')
          ? 'semester'
          : pkgId.includes('monthly')
            ? 'monthly'
            : null;

      if (intervalKey) {
        const fallbackKey = `scope_${tierKey}_${intervalKey}`;
        if (featuresMap[fallbackKey]) return featuresMap[fallbackKey];
      }

      return featuresMap[tierKey] || [];
    },
    [offering]
  );

  const getSavings = useCallback(
    (pkg: any) => {
      if (!offering) return undefined;

      const id = pkg.identifier.toLowerCase();
      if (id.includes('free') || id.includes('monthly')) return undefined;

      const isUltra = id.includes('ultra');
      const tierKey = isUltra ? 'ultra' : 'pro';

      const monthlyPkg = offering.availablePackages.find((p) => {
        const pId = p.identifier.toLowerCase();
        return pId.includes(tierKey) && pId.includes('monthly');
      });

      if (!monthlyPkg) return undefined;

      const currentPrice = pkg.product.price;
      const monthlyPrice = monthlyPkg.product.price;

      let months = 1;
      if (id.includes('annual')) months = 12;
      if (id.includes('semester')) months = 3;

      if (months === 1) return undefined;

      const pricePerMonth = currentPrice / months;
      const discount = ((monthlyPrice - pricePerMonth) / monthlyPrice) * 100;

      return Math.round(discount).toString();
    },
    [offering]
  );

  const getTrialDays = useCallback((pkg: any) => {
    const id = pkg.identifier.toLowerCase();
    if (id.includes('free')) return undefined;

    if (id.includes('annual')) return 14;
    if (id.includes('semester') || id.includes('monthly')) return 7;

    return undefined;
  }, []);

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
    getSavings,
    getTrialDays,
    handleAction,
    restorePurchases,
    router,
  };
};
