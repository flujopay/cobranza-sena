import { create } from "zustand";

export type ToastIconType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  subMessage?: string;
  iconType?: ToastIconType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastState extends ToastProps {
  trigger: boolean;
  lastMessage: string;
  lastMessageTime: number;
  showToast: (data: ToastProps) => void;
  resetToast: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  message: "",
  subMessage: undefined,
  iconType: "success",
  action: undefined,
  trigger: false,
  lastMessage: "",
  lastMessageTime: 0,

  showToast(data) {
    const current = get();
    const key = `${data.message}-${data.iconType ?? "success"}`;
    const now = Date.now();

    // Evita duplicados en menos de 2s
    if (current.lastMessage === key && now - current.lastMessageTime < 2000) return;

    set({
      ...data,
      iconType: data.iconType ?? "success",
      trigger: true,
      lastMessage: key,
      lastMessageTime: now,
    });
  },

  resetToast() {
    set({
      message: "",
      subMessage: undefined,
      iconType: "success",
      action: undefined,
      trigger: false,
      lastMessage: "",
      lastMessageTime: 0,
    });
  },
}));
