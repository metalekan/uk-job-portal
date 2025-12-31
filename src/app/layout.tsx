import {
  ClerkProvider,
} from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "UK Job Portal",
  description: "A job portal built with Next.js, MongoDB, and Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'oklch(0.7227 0.1920 149.5793)', // Matches --primary
          colorText: 'oklch(0.3729 0.0306 259.7328)', // Matches --foreground
          colorBackground: 'oklch(0.9751 0.0127 244.2507)', // Matches --background
          colorInputBackground: 'oklch(1.0000 0 0)', // Matches --card/input
          colorInputText: 'oklch(0.3729 0.0306 259.7328)', // Matches --foreground
          borderRadius: '0.5rem', // Matches --radius
        },
        elements: {
          card: "shadow-none",
          navbar: "hidden",
        }
      }}
    >
      <html lang="en">
        <body>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
