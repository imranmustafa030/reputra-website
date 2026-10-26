"use client";

import { useEffect } from "react";

// Add ?dummy to the URL to outline every element marked data-dummy="Dxx".
export function DummyMode() {
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("dummy")) {
      document.documentElement.classList.add("show-dummy");
    }
  }, []);
  return null;
}
