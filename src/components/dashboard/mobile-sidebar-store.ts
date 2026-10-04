"use client";

import { useSyncExternalStore } from "react";

type Listener = () => void;

let isOpen = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function toggleMobileSidebar() {
  isOpen = !isOpen;
  emit();
}

export function closeMobileSidebar() {
  isOpen = false;
  emit();
}

export function useMobileSidebarOpen() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => isOpen,
    () => false
  );
}