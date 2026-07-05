// Root layout required by Next.js App Router.
// All providers and UI chrome live in the (app) group layout.
// This file must exist at app/layout.tsx for Next.js to function correctly.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
