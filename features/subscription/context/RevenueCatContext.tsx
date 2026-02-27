import { useAuth } from '@/features/auth';
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import Purchases, {
    CustomerInfo
} from 'react-native-purchases';

import { ENTITLEMENT_ID, SubscriptionState } from '../types';

// ─── Context ────────────────────────────────────────────────────────────────

const RevenueCatContext = createContext<SubscriptionState | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

interface RevenueCatProviderProps {
    children: React.ReactNode;
}

export function RevenueCatProvider({ children }: RevenueCatProviderProps) {
    const { user } = useAuth();

    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfigured, setIsConfigured] = useState(false);

    // ── SDK initialisation (runs once) ──────────────────────────────────────

    useEffect(() => {
        const initSDK = async () => {
            try {
                const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_KEY;
                if (!apiKey) {
                    console.error('[RevenueCat] EXPO_PUBLIC_REVENUECAT_KEY is not defined');
                    setIsLoading(false);
                    return;
                }

                Purchases.configure({ apiKey });
                setIsConfigured(true);

                // Fetch initial customer info
                const info = await Purchases.getCustomerInfo();
                setCustomerInfo(info);
            } catch (error) {
                console.error('[RevenueCat] SDK initialisation failed:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initSDK();
    }, []);

    // ── User identification ─────────────────────────────────────────────────

    useEffect(() => {
        const identifyUser = async () => {
            if (!isConfigured || !user?.id) return;

            try {
                const { customerInfo: updatedInfo } = await Purchases.logIn(user.id);
                setCustomerInfo(updatedInfo);
            } catch (error) {
                console.error('[RevenueCat] User identification failed:', error);
            }
        };

        identifyUser();
    }, [isConfigured, user?.id]);

    // ── Real-time customer info listener ────────────────────────────────────

    useEffect(() => {
        if (!isConfigured) return;

        const listener = (info: CustomerInfo) => {
            setCustomerInfo(info);
        };

        Purchases.addCustomerInfoUpdateListener(listener);

        return () => {
            Purchases.removeCustomerInfoUpdateListener(listener);
        };
    }, [isConfigured]);

    // ── Derived state ───────────────────────────────────────────────────────

    const isProUser = useMemo(() => {
        if (!customerInfo) return false;
        return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
    }, [customerInfo]);

    const value = useMemo<SubscriptionState>(
        () => ({
            isProUser,
            customerInfo,
            isLoading,
        }),
        [isProUser, customerInfo, isLoading],
    );

    return (
        <RevenueCatContext.Provider value={value}>
            {children}
        </RevenueCatContext.Provider>
    );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useRevenueCatState(): SubscriptionState {
    const context = useContext(RevenueCatContext);
    if (context === undefined) {
        throw new Error('useRevenueCatState must be used within a RevenueCatProvider');
    }
    return context;
}
