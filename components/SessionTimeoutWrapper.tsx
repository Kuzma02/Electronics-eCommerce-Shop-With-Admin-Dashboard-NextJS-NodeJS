"use client";

import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export default function SessionTimeoutWrapper() {
  useSessionTimeout();
  return null;
}
