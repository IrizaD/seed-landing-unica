"use client";
import { useEffect } from "react";

export function FacebookPixel({ pixelId }: { pixelId: string }) {
  useEffect(() => {
    if (!pixelId) return;

    // Avoid double-loading
    if ((window as unknown as Record<string, unknown>)._fbPixelLoaded) return;
    (window as unknown as Record<string, unknown>)._fbPixelLoaded = true;

    // Init fbq
    const win = window as unknown as Record<string, unknown>;
    if (!win.fbq) {
      const n = function (...args: unknown[]) {
        (n as unknown as Record<string, unknown>).callMethod
          ? ((n as unknown as Record<string, unknown>).callMethod as (...a: unknown[]) => void)(...args)
          : ((n as unknown as Record<string, unknown>).queue as unknown[]).push(args);
      };
      (n as unknown as Record<string, unknown>).push = n;
      (n as unknown as Record<string, unknown>).loaded = true;
      (n as unknown as Record<string, unknown>).version = "2.0";
      (n as unknown as Record<string, unknown>).queue = [];
      win.fbq = n;
      win._fbq = n;
    }

    (win.fbq as (...args: unknown[]) => void)("init", pixelId);
    (win.fbq as (...args: unknown[]) => void)("track", "PageView");

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }, [pixelId]);

  return null;
}
