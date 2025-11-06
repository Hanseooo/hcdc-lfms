"use client";

import CreateReportSection from "../sections/CreateReportSection";
import UserProfileSection from "../sections/UserProfileSection";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-100 via-white to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black py-12 px-4 md:px-8 lg:px-16 transition-colors duration-500">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] bg-clip-text text-transparent">
          Lost & Found Management System
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
          Submit or browse reports of lost and found items. Help reunite people
          with their belongings one item at a time.
        </p>
      </header>

      <Separator className="my-8 max-w-5xl mx-auto opacity-60" />

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-10 items-center">
        {/* Profile Sidebar */}
        <aside className="flex justify-center lg:justify-start">
          <UserProfileSection />
        </aside>

        {/* Main Content */}
        <main className="space-y-8">
          <CreateReportSection />
        </main>
      </div>

      {/* Footer Note */}
      <footer className="text-center text-sm px-4 py-6 text-muted-foreground mt-12 opacity-75">
        © {new Date().getFullYear()} HCDC Lost & Found Management System. Built with ❤️ to help
        people reconnect with their belongings in the campus.
      </footer>
    </div>
  );
}
