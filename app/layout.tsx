import { CloudflareAnalytics } from "@/app/components/Shared/CloudflareAnalytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CloudflareAnalytics />
    </>
  );
}
