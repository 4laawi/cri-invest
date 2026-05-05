import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import AuthLayoutWrapper from "@/components/AuthLayoutWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portail de l'Investisseur Intelligent | CRI Laâyoune",
  description: "Plateforme d'accompagnement à l'investissement pour la région de Laâyoune-Sakia El Hamra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex`}>
        <ConvexClientProvider>
          <AuthLayoutWrapper>
            {children}
          </AuthLayoutWrapper>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
