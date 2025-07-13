import { useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { validateSession } from "../utils/authUtils";

/**
 * Custom hook untuk monitoring session
 * Menangani validasi token dan auto-logout ketika session expired
 */
export const useSessionMonitor = () => {
  const { currentUser } = useAuth();

  const checkSession = useCallback(() => {
    if (!currentUser) return true;

    // Validate current session
    if (!validateSession(currentUser)) {
      console.warn("Session validation failed - token expired");

      // Dispatch session expired event
      window.dispatchEvent(
        new CustomEvent("sessionExpired", {
          detail: { reason: "Token validation failed" },
        })
      );

      return false;
    }

    return true;
  }, [currentUser]);

  // Check session only when explicitly called or on user interaction
  // No automatic intervals to avoid server load
  useEffect(() => {
    if (!currentUser) return;

    // Only check on user interaction events that might need fresh token
    const handleUserInteraction = () => {
      // Check if token is close to expiry before important user actions
      const token = currentUser.access_token;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const currentTime = Date.now() / 1000;
          const timeUntilExpiry = payload.exp - currentTime;

          // Warn user if token expires within 10 minutes
          if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
            // 10 minutes
            console.warn(
              "Token will expire soon:",
              new Date(payload.exp * 1000)
            );
          } else if (timeUntilExpiry <= 0) {
            checkSession();
          }
        } catch (error) {
          console.error("Error checking token expiry:", error);
        }
      }
    };

    // Listen for clicks on important UI elements
    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [currentUser, checkSession]);

  // Check session on tab focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && currentUser) {
        checkSession();
      }
    };

    const handleFocus = () => {
      if (currentUser) {
        checkSession();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [currentUser, checkSession]);

  return {
    checkSession,
    isSessionValid: currentUser ? validateSession(currentUser) : false,
  };
};
