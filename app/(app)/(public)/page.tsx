import type { Metadata } from "next";
import ShelfLanding from "./LandingClient";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.shelf.ng";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shelf",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    "https://x.com/shelfng_",
    "https://www.instagram.com/shelf_ng/",
    "https://www.linkedin.com/company/shelfng/",
  ],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shelf",
  url: siteUrl,
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
      />
      <ShelfLanding />
    </>
  );
}
