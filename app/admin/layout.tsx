import { ToastProvider } from "@/components/toast"

export default function RootAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}