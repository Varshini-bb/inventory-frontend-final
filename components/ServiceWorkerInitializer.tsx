"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "../app/utils/registerServiceWorker";

export default function ServiceWorkerInitializer() {
  useEffect(() => {
    registerServiceWorker().catch(console.error);
  }, []);

  return null;
}