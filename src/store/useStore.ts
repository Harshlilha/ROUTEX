import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Theme, Supplier, Decision, Chat } from '../types';

interface AppState {
  user: User | null;
  theme: Theme['mode'];
  suppliers: Supplier[];
  decisions: Decision[];
  chats: Chat[];
  isCommandPaletteOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;

  setUser: (user: User | null) => void;
  toggleTheme: () => void;
  setSuppliers: (suppliers: Supplier[]) => void;
  setDecisions: (decisions: Decision[]) => void;
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  toggleCommandPalette: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      theme: 'dark',
      suppliers: [],
      decisions: [],
      chats: [],
      isCommandPaletteOpen: false,
      toast: null,

      setUser: (user) => set({ user }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      setSuppliers: (suppliers) => set({ suppliers }),

      setDecisions: (decisions) => set({ decisions }),

      setChats: (chats) => set({ chats }),

      addChat: (chat) =>
        set((state) => ({ chats: [...state.chats, chat] })),

      toggleCommandPalette: () =>
        set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),

      showToast: (message, type) => set({ toast: { message, type } }),

      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'supplier-decision-storage',
      partialize: (state) => ({ theme: state.theme, user: state.user }),
    }
  )
);
