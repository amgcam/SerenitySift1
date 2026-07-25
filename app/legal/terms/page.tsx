"use client"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function TermsOfService() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-12 prose prose-invert">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <p className="text-sm text-muted-foreground mb-10">
          Effective Date: July 08, 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By creating an account, accessing, or using SerenitySift, you agree
              to these Terms of Service. If you do not agree to these Terms, you
              should not use SerenitySift.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. What SerenitySift Is</h2>
            <p>
              SerenitySift is a wellness reflection and mood-tracking tool. It is
              designed to help users log moods, reflect on emotional patterns,
              review mood history, and receive general AI-supported reflection
              prompts.
            </p>
            <p className="mt-4">
              SerenitySift is intended to support self-reflection and emotional
              awareness. It is not a medical, psychiatric, psychological,
              therapeutic, or crisis-response service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Wellness and AI Disclaimer</h2>
            <p>
              SerenitySift is not therapy, diagnosis, medical advice, mental
              health treatment, crisis support, or a substitute for professional
              care. SerenitySift does not diagnose, treat, prevent, or cure any
              medical or mental health condition.
            </p>

            <p className="mt-4">
              AI features, including SerenitySpark, may generate supportive or
              reflective responses based on user input and mood history. These
              responses are automatically generated and may be incomplete,
              inaccurate, or inappropriate for a user&apos;s specific situation.
              Users should not rely on AI responses as professional advice.
            </p>

            <p className="mt-4">
              If you are in immediate danger, experiencing a crisis, considering
              self-harm, or need urgent help, call emergency services or contact
              a qualified crisis hotline, trusted adult, or licensed professional
              immediately. SerenitySift is not designed for emergencies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Age Requirements</h2>
            <p>
              SerenitySift is intended for users who are 13 years of age or
              older. SerenitySift is not intended for children under 13.
            </p>

            <p className="mt-4">
              If you are under 18, you should use SerenitySift only with
              permission from a parent or legal guardian.
            </p>

            <p className="mt-4">
              If SerenitySift learns that it has collected personal information
              from a child under 13 without appropriate consent, SerenitySift may
              delete the account and associated data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Mood, Journal, Chat, and Wellness Data
            </h2>

            <p>
              SerenitySift may allow users to submit mood entries, emotional
              intensity, notes, activities, chat messages, and other
              wellness-related information. This information may be personal or
              sensitive.
            </p>

            <p className="mt-4">
              Users should only enter information they are comfortable storing in
              SerenitySift. Users should not enter emergency information, urgent
              medical information, or information that requires immediate
              professional attention.
            </p>

            <p className="mt-4">
              Certain features may process user information through third-party
              services used for hosting, authentication, email, payments,
              analytics, database storage, or AI functionality. More details are
              provided in the{" "}
              <a href="/legal/privacy" className="text-soft-cyan hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Professional Mode: Invite-Only Beta
            </h2>

            <p>
              Professional Mode is currently an invite-only beta feature. It is
              not available for general public use. Access to Professional Mode
              may be approved, denied, limited, suspended, or removed by
              SerenitySift at any time.
            </p>

            <p className="mt-4">
              Professional Mode is intended for approved professionals,
              organizations, or beta testers who want to explore client-support
              features such as mood timelines, read-only client dashboards, note
              highlights, streak alerts, and related tools. Professional Mode is
              still under development and may contain bugs, incomplete features,
              changing workflows, or temporary limitations.
            </p>

            <p className="mt-4">
              Professional Mode is not a substitute for professional judgment,
              clinical care, therapy, diagnosis, medical advice, emergency
              response, crisis support, or treatment planning. SerenitySift does
              not provide medical, psychological, psychiatric, therapeutic, or
              clinical services.
            </p>

            <p className="mt-4">
              Professionals who use Professional Mode are solely responsible for
              their own professional obligations, including obtaining proper
              client consent, protecting client privacy, complying with
              applicable laws and professional rules, maintaining appropriate
              records outside of SerenitySift when required, and determining
              whether SerenitySift is appropriate for their use case.
            </p>

            <p className="mt-4">
              Unless SerenitySift enters into a separate written agreement
              stating otherwise, Professional Mode should not be used as a system
              of record for clinical care, protected health information, medical
              records, diagnosis, treatment decisions, crisis intervention, or
              emergency monitoring.
            </p>

            <p className="mt-4">
              Clients must knowingly consent before any professional is allowed
              to view or access their SerenitySift data. Client access-sharing
              features are intended to be consent-based and limited. Clients
              should be able to understand what information may be shared, who
              can view it, and how access may be revoked.
            </p>

            <p className="mt-4">
              SerenitySift may change, limit, pause, or discontinue Professional
              Mode at any time during the beta period. Users should not rely on
              Professional Mode as their only method of communication,
              monitoring, recordkeeping, or support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Accounts and Security</h2>
            <p>
              Users are responsible for maintaining the security of their
              accounts, passwords, and login credentials. Users should not share
              their account access with others.
            </p>

            <p className="mt-4">
              SerenitySift may suspend or remove accounts that violate these
              Terms, misuse the service, attempt to access another user&apos;s
              information, or interfere with the safety or operation of the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Subscriptions and Payments</h2>
            <p>
              SerenitySift may offer free and paid features. Paid features may
              include premium tools, expanded AI access, advanced insights,
              customization, or other features.
            </p>

            <p className="mt-4">
              Some subscription or payment features may still be in development,
              testing, or beta. Pricing, availability, and included features may
              change over time.
            </p>

            <p className="mt-4">
              Payment processing may be handled by third-party providers such as
              Stripe. SerenitySift does not control third-party payment systems
              and is not responsible for their separate terms, policies, or
              technical issues.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Acceptable Use</h2>
            <p>
              Users agree not to misuse SerenitySift, attempt to disrupt the
              service, access accounts or data without permission, reverse
              engineer protected parts of the app, upload harmful code, or use
              the service for unlawful, abusive, harassing, or harmful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. No Guarantees</h2>
            <p>
              SerenitySift is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis. SerenitySift does not guarantee that the
              service will be uninterrupted, error-free, secure, or suitable for
              every user&apos;s needs.
            </p>

            <p className="mt-4">
              Features may change, be limited, be removed, or become unavailable
              at any time, especially during beta testing and active development.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Privacy</h2>
            <p>
              Your privacy is important to us. Please review our{" "}
              <a href="/legal/privacy" className="text-soft-cyan hover:underline">
                Privacy Policy
              </a>{" "}
              to understand how SerenitySift collects, uses, stores, and protects
              information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to These Terms</h2>
            <p>
              SerenitySift may update these Terms from time to time. If changes
              are made, the effective date may be updated. Continued use of
              SerenitySift after changes means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
            <p>
              Questions about these Terms may be sent to{" "}
              <a
                href="mailto:support@serenitysift.com"
                className="text-soft-cyan hover:underline"
              >
                support@serenitysift.com
              </a>
              .
            </p>
          </section>
        </div>

        <p className="text-xs text-muted-foreground mt-16">
          These Terms are provided for general product-use purposes and should be
          reviewed by a qualified legal professional before full public launch.
        </p>
      </div>
    </DashboardLayout>
  )
}