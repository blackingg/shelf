import { AppHeader } from "@/app/components/Layout/AppHeader";
import { PageContainer } from "@/app/components/Layout/PageContainer";

export default function PrivacyPage() {
  return (
    <>
      <AppHeader />
      <PageContainer centered={false}>
        <div className="max-w-3xl mx-auto py-16 px-6">
          <div className="mb-12">
            <h1 className="text-4xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last Updated: April 26, 2026
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                1. Information We Collect
              </h2>
              <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We collect information you provide directly to us when you
                  create an account, such as your name and email address. We
                  also store the materials you upload and organize within Shelf.
                </p>
                <p>
                  We may automatically collect technical information about your
                  device and how you interact with our platform to improve our
                  services and user experience.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                2. How We Use Information
              </h2>
              <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We use your information to provide, maintain, and improve
                  Shelf. This includes personalizing your experience,
                  facilitating sharing between users, and communicating with you
                  about updates or support.
                </p>
                <p>
                  We do not sell your personal information to third parties. We
                  only share information as necessary to provide our services or
                  when required by law.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                3. Data Security
              </h2>
              <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  We take reasonable measures to protect your information from
                  unauthorized access, loss, or misuse. However, no
                  internet-based service is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-100 dark:border-white/5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you have any questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:privacy@shelf.ng"
                  className="text-emerald-600 font-medium hover:underline"
                >
                  privacy@shelf.ng
                </a>
              </p>
            </section>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
