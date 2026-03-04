import { errorEventBus, ToastPayload, type UpgradeFeature } from '@/lib/error-handling/ErrorEventBus';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Toast } from '../ui/Toast';
import { UpgradeModal } from '../upgrade-modal';

interface GlobalErrorContextType {
  showToast: (payload: ToastPayload) => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

export const GlobalErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [upgradeFeature, setUpgradeFeature] = useState<UpgradeFeature | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubToast = errorEventBus.subscribe('SHOW_TOAST', (payload) => {
      setToast(payload);
    });

    const unsubRedirect = errorEventBus.subscribe('REDIRECT_LOGIN', () => {
      router.replace('/(auth)/login');
    });

    const unsubUpgrade = errorEventBus.subscribe('SHOW_UPGRADE_MODAL', (payload) => {
      setUpgradeFeature(payload?.feature ?? null);
    });

    return () => {
      unsubToast();
      unsubRedirect();
      unsubUpgrade();
    };
  }, [router]);

  const showToast = (payload: ToastPayload) => {
    setToast(payload);
  };

  return (
    <GlobalErrorContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          key={Date.now()}
          message={toast.message}
          type={toast.type}
          title={toast.title}
          duration={toast.duration}
          onHide={() => setToast(null)}
        />
      )}
      <UpgradeModal
        feature={upgradeFeature}
        onClose={() => setUpgradeFeature(null)}
      />
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};

