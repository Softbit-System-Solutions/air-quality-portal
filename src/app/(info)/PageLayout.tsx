"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // optional if you have shadcn utils

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function PageLayout({ title, children, className }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-green-700 text-white py-36">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-5xl mx-auto">
          {title}
        </h1>
      </header>

      {/* Body */}
      <main className={cn("flex-1 w-full max-w-6xl mx-auto py-10 px-4", className)}>
        {children}
      </main>
    </div>
  );
}
