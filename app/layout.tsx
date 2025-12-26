import { NotificationProvider } from "@/contexts/NotificationContext";
import ServiceWorkerInitializer from "@/components/ServiceWorkerInitializer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ServiceWorkerInitializer />
        <NotificationProvider>
          {/* Header with Notification Bell */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            
            </div>
          </header>

          {/* Main Content */}
          <main>{children}</main>
        </NotificationProvider>
      </body>
    </html>
  );
}