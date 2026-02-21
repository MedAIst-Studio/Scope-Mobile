import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import RevenueCatUI from 'react-native-purchases-ui';

import { useRevenueCatState } from '../context/RevenueCatContext';
import { ENTITLEMENT_ID, SubscriptionActions, SubscriptionState } from '../types';

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Composable hook that combines subscription state with high-level actions.
 * Follows the Open/Closed principle — extend with new actions without modifying context.
 */
export function useSubscription(): SubscriptionState & SubscriptionActions {
    const state = useRevenueCatState();
    const router = useRouter();

    // ── Navigation ──────────────────────────────────────────────────────────

    const presentPaywall = useCallback(async (): Promise<boolean> => {
        if (state.isProUser) return true;
        router.push('/(app)/subscription/paywall' as any);
        return false;
    }, [state.isProUser, router]);

    // ── Purchase Logic ──────────────────────────────────────────────────────

    const getOfferings = useCallback(async (): Promise<PurchasesOffering | null> => {
        try {
            const offerings = await Purchases.getOfferings();
            return offerings.current;
        } catch (error) {
            console.error('[RevenueCat] Failed to fetch offerings:', error);
            return null;
        }
    }, []);

    const purchasePackage = useCallback(async (pack: PurchasesPackage): Promise<boolean> => {
        try {
            const { customerInfo } = await Purchases.purchasePackage(pack);
            return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
        } catch (error: any) {
            if (!error.userCancelled) {
                console.error('[RevenueCat] Purchase error:', error);
                Alert.alert('Hata', 'Satın alma işlemi sırasında bir sorun oluştu.');
            }
            return false;
        }
    }, []);

    // ── Present Customer Center ─────────────────────────────────────────────

    const presentCustomerCenter = useCallback(async (): Promise<void> => {
        try {
            await RevenueCatUI.presentCustomerCenter({
                callbacks: {
                    onRestoreCompleted: ({ customerInfo }) => {
                        if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
                            Alert.alert('Başarılı', 'Satın alımlarınız geri yüklendi!');
                        }
                    },
                    onRestoreFailed: ({ error }) => {
                        console.error('[RevenueCat] Restore in Customer Center failed:', error);
                    },
                },
            });
        } catch (error) {
            console.error('[RevenueCat] Customer Center error:', error);
            Alert.alert(
                'Hata',
                'Abonelik yönetim ekranı açılırken bir sorun oluştu.',
            );
        }
    }, []);

    // ── Restore Purchases ───────────────────────────────────────────────────

    const restorePurchases = useCallback(async (): Promise<void> => {
        try {
            const customerInfo = await Purchases.restorePurchases();

            if (typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined') {
                Alert.alert('Başarılı', 'Pro aboneliğiniz geri yüklendi!');
            } else {
                Alert.alert(
                    'Bilgi',
                    'Geri yüklenecek aktif bir abonelik bulunamadı.',
                );
            }
        } catch (error) {
            console.error('[RevenueCat] Restore purchases error:', error);
            Alert.alert(
                'Hata',
                'Satın alımlar geri yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
            );
        }
    }, []);

    return {
        ...state,
        presentPaywall,
        presentCustomerCenter,
        restorePurchases,
        getOfferings,
        purchasePackage,
    };
}
