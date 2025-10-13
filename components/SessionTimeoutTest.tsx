"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function SessionTimeoutTest() {
  const { data: session, status } = useSession();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      setIsActive(true);
      setTimeLeft(30); // 30 seconds to match the hook
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsActive(false);
      setTimeLeft(0);
    }
  }, [session, status]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not logged in</div>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50">
      <div className="text-sm font-bold">Session Timeout Test (30s)</div>
      <div className="text-xs">
        {isActive ? `Time left: ${formatTime(timeLeft)}` : 'Session inactive'}
      </div>
      <div className="text-xs">
        Status: {status}
      </div>
    </div>
  );
}
