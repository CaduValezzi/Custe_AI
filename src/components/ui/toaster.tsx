"use client"

import { Toaster as SonnerToaster } from "sonner"

/**
 * Sonner toast host. The mock renders `<Toaster richColors position="top-center" />`
 * from the sonner package; /frontend is dark-only so we pin `theme="dark"`.
 */
export function Toaster() {
  return <SonnerToaster theme="dark" richColors position="top-center" closeButton />
}
