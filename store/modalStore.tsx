import type { ReactNode } from "react";
import { create } from "zustand";

export type TModal = {
  content: ReactNode;
  title?: string | ReactNode;
  showHeader?: boolean;
  showCloseButton?: boolean;
  width?: string;
  modalClassName?: string;
  contentClassName?: string;
  slideFrom?: "right" | "left" | "top" | "bottom";
  closeOnOutsideClick?: boolean;
  onClosedCallback?: () => void;
  modalId?: string;
};

interface ModalState {
  modals: TModal[];
  showModal: (modal: TModal) => void;
  hideModal: () => void;
  hideAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modals: [],

  showModal: (modal) =>
    set((state) => {
      // Evita duplicar modales del mismo tipo de componente
      const incomingType =
        (modal.content as any)?.type?.name ||
        (modal.content as any)?.type?.displayName;
      if (incomingType) {
        const alreadyOpen = state.modals.some((m) => {
          const t =
            (m.content as any)?.type?.name ||
            (m.content as any)?.type?.displayName;
          return t === incomingType;
        });
        if (alreadyOpen) return state;
      }
      return { modals: [...state.modals, modal] };
    }),

  hideModal: () =>
    set((state) => {
      const next = [...state.modals];
      const last = next.pop();
      if (last?.onClosedCallback) last.onClosedCallback();
      return { modals: next };
    }),

  hideAllModals: () =>
    set((state) => {
      state.modals.forEach((m) => m.onClosedCallback?.());
      return { modals: [] };
    }),
}));
