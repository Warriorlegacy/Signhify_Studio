import { useState, useCallback, useEffect } from "react";

export interface TourStep {
  element?: string;
  popover: {
    title: string;
    description: string;
    side?: "top" | "right" | "bottom" | "left" | "over";
    align?: "start" | "center" | "end";
  };
}

export interface TourConfig {
  tourId: string;
  steps: TourStep[];
  autoStart?: boolean;
}

// Global dynamic loader for driver.js
async function loadDriver() {
  if (typeof window === "undefined") return null;

  // Check if driver is already loaded globally
  if ((window as any).driver?.js?.driver) {
    return (window as any).driver.js.driver;
  }

  try {
    // Inject CSS
    const cssId = "driver-js-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css";
      document.head.appendChild(link);

      // Inject custom dark luxury overrides
      const style = document.createElement("style");
      style.textContent = `
        .driver-popover {
          background-color: rgba(9, 9, 11, 0.95) !important;
          color: #f4f4f5 !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          border-radius: 1rem !important;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 106, 0, 0.1) !important;
          backdrop-filter: blur(16px) !important;
          padding: 1.25rem !important;
          max-width: 340px !important;
          font-family: inherit !important;
        }
        .driver-popover-title {
          font-size: 1.05rem !important;
          font-weight: 700 !important;
          color: #ffffff !important;
          margin-bottom: 0.5rem !important;
          letter-spacing: -0.01em !important;
        }
        .driver-popover-description {
          font-size: 0.875rem !important;
          line-height: 1.5 !important;
          color: #a1a1aa !important;
          margin-bottom: 1rem !important;
        }
        .driver-popover-footer {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 0.5rem !important;
        }
        .driver-popover-progress-text {
          font-size: 0.75rem !important;
          color: #71717a !important;
          font-weight: 600 !important;
        }
        .driver-popover-prev-btn, .driver-popover-next-btn, .driver-popover-close-btn {
          border-radius: 9999px !important;
          padding: 0.35rem 0.85rem !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
          cursor: pointer !important;
          text-shadow: none !important;
        }
        .driver-popover-prev-btn {
          background: rgba(255, 255, 255, 0.05) !important;
          color: #d4d4d8 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .driver-popover-next-btn {
          background: #ff6a00 !important;
          color: #000000 !important;
          border: none !important;
        }
        .driver-popover-next-btn:hover {
          background: #ff8533 !important;
          transform: translateY(-1px) !important;
        }
        .driver-popover-arrow-side-top { border-top-color: rgba(9, 9, 11, 0.95) !important; }
        .driver-popover-arrow-side-bottom { border-bottom-color: rgba(9, 9, 11, 0.95) !important; }
        .driver-popover-arrow-side-left { border-left-color: rgba(9, 9, 11, 0.95) !important; }
        .driver-popover-arrow-side-right { border-right-color: rgba(9, 9, 11, 0.95) !important; }
      `;
      document.head.appendChild(style);
    }

    // Dynamic ESM Import from CDN
    const module = (await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.mjs")) as {
      driver: unknown;
    };
    return module.driver;
  } catch (err) {
    console.error("[useTour] Failed to load driver.js", err);
    return null;
  }
}

export function useTour({ tourId, steps, autoStart = false }: TourConfig) {
  const [isRunning, setIsRunning] = useState(false);
  const storageKey = `signhify_tour_completed_${tourId}`;

  const startTour = useCallback(async () => {
    const driverFn = await loadDriver();
    if (!driverFn) return;

    const driverObj = driverFn({
      showProgress: true,
      animate: true,
      allowClose: true,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      stagePadding: 8,
      stageRadius: 12,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "Got it! 🚀",
      steps: steps.map((s) => ({
        element: s.element,
        popover: {
          title: s.popover.title,
          description: s.popover.description,
          side: s.popover.side || "bottom",
          align: s.popover.align || "center",
        },
      })),
      onDestroyStarted: () => {
        try {
          localStorage.setItem(storageKey, "true");
        } catch {
          /* ignore */
        }
        setIsRunning(false);
        driverObj.destroy();
      },
    });

    setIsRunning(true);
    driverObj.drive();
  }, [steps, storageKey]);

  useEffect(() => {
    if (!autoStart) return;
    try {
      const hasCompleted = localStorage.getItem(storageKey);
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          startTour();
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      /* ignore */
    }
  }, [autoStart, startTour, storageKey]);

  return {
    startTour,
    isRunning,
  };
}
