import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

// ─── Entitlement & Product Constants ────────────────────────────────────────

/** The entitlement identifier configured on the RevenueCat dashboard */
export const ENTITLEMENT_ID = 'pro' as const;

/** Product identifiers matching RevenueCat dashboard configuration */
export const PRODUCT_IDS = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    THREE_MONTH: 'three_month',
} as const;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SubscriptionState {
    /** Whether the user has an active "pro" entitlement */
    isProUser: boolean;
    /** Full RevenueCat customer info (null until loaded) */
    customerInfo: CustomerInfo | null;
    /** True while the SDK is initialising or fetching customer info */
    isLoading: boolean;
}

export interface SubscriptionActions {
    /** Present the RevenueCat paywall (skips if user is already pro) */
    presentPaywall: () => Promise<boolean>;
    /** Open the RevenueCat Customer Center for subscription management */
    presentCustomerCenter: () => Promise<void>;
    /** Restore previous purchases */
    restorePurchases: () => Promise<void>;
    /** Fetch current offerings from RevenueCat */
    getOfferings: () => Promise<PurchasesOffering | null>;
    /** Purchase a specific package */
    purchasePackage: (pack: PurchasesPackage) => Promise<boolean>;
}
