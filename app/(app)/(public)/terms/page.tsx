export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last Updated: April 26, 2026
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              By accessing and using Shelf, you agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use
              our services.
            </p>
            <p>
              We provide a platform for organizing and sharing academic
              materials and digital books. You are responsible for any content
              you share and for ensuring you have the rights to do so.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            2. User Obligations
          </h2>
          <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              You agree to use Shelf in compliance with all applicable laws and
              regulations. You must not use the platform to share illegal,
              copyright-infringing, or harmful content.
            </p>
            <p>
              Your account is personal to you. You are responsible for
              maintaining the confidentiality of your account credentials.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">
            3. Content & Intellectual Property
          </h2>
          <div className="text-base text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              Shelf allows you to upload, store, and share digital materials.
              While you retain ownership of your content, you grant Shelf a
              non-exclusive license to host and display it on your behalf.
            </p>
            <p>
              Users must respect the intellectual property rights of others. We
              respond to valid DMCA takedown notices and may terminate accounts
              of repeat infringers.
            </p>
          </div>
        </section>

        <section className="pt-8 border-t border-gray-100 dark:border-white/5">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:support@shelf.ng"
              className="text-emerald-600 font-medium hover:underline"
            >
              support@shelf.ng
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
