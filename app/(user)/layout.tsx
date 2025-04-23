// import Header from "@/components/Header";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lurnex_LMS",
  description: "Lurnex is an Interactive Learning Management System.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>

      <SanityLive />
    </ClerkProvider>
  );
}
