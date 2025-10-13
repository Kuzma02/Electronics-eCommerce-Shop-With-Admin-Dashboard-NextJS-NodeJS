"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef } from "react";

// Use 30 seconds for testing
const SESSION_TIMEOUT = 30 * 1000; // 30 seconds for testing

export function useSessionTimeoutTest() {
  const { data: session, status } = useSession();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (status === "authenticated" && session) {
      console.log('🕐 Session timeout test started - 30 seconds');
      
      const startTimeout = () => {
        // Clear existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        timeoutRef.current = setTimeout(() => {
          console.log('🚪 Session expired - signing out');
          signOut({ 
            callbackUrl: "/login?expired=true",
            redirect: true 
          });
        }, SESSION_TIMEOUT);
      };

      // Start the initial timeout
      startTimeout();

      // Reset timeout on user activity
      const resetTimeout = () => {
        console.log('🔄 User activity detected - resetting timeout');
        startTimeout();
      };

      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      events.forEach(event => {
        document.addEventListener(event, resetTimeout, true);
      });

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        events.forEach(event => {
          document.removeEventListener(event, resetTimeout, true);
        });
      };
    }
  }, [session, status]);
}
