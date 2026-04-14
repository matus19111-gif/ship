import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Viewport } from "next";
import PlausibleProvider from "next-plausible";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import ScrollReveal from "@/components/ScrollReveal";
import SocialProofWrapper from "@/components/SocialProofWrapper"; // ← ADD
import config from "@/config";
import Script from "next/script";
import "./globals.css";

const font = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={config.colors.theme} className={font.className}>
      {config.domainName && (
        <head>
          <PlausibleProvider domain={config.domainName} />
        </head>
      )}
      <body>
        <SocialProofWrapper>                       {/* ← ADD */}
          <ClientLayout>{children}</ClientLayout>
          <ScrollReveal />
        </SocialProofWrapper>                      {/* ← ADD */}

        <Script id="crisp-chat" strategy="afterInteractive">
          {`
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "0d28d1e8-c5eb-4a30-be51-c992c4f037e3";
            (function() {
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>

        <Script
          src="https://ship-lime.vercel.app/widget.js"
          strategy="afterInteractive"
          data-api-key="pk_4f91892f546747fa83f373d9fa8c3709"
        />
      </body>
    </html>
  );
}
