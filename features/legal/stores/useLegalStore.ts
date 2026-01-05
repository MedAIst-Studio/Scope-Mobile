import { create } from 'zustand';

interface LegalState {
  isTermsRead: boolean;
  isPrivacyRead: boolean;
  markTermsRead: () => void;
  markPrivacyRead: () => void;
  reset: () => void;
}

export const useLegalStore = create<LegalState>((set) => ({
  isTermsRead: false,
  isPrivacyRead: false,
  markTermsRead: () => set({ isTermsRead: true }),
  markPrivacyRead: () => set({ isPrivacyRead: true }),
  reset: () => set({ isTermsRead: false, isPrivacyRead: false }),
}));
