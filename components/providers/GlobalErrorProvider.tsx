import { errorEventBus, ToastPayload } from '@/lib/error-handling/ErrorEventBus';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Toast } from '../ui/Toast';

interface GlobalErrorContextType {
  showToast: (payload: ToastPayload) => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(undefined);

export const GlobalErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubToast = errorEventBus.subscribe('SHOW_TOAST', (payload) => {
      setToast(payload);
    });

    const unsubRedirect = errorEventBus.subscribe('REDIRECT_LOGIN', () => {
      router.replace('/(auth)/login');
    });

    return () => {
      unsubToast();
      unsubRedirect();
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
